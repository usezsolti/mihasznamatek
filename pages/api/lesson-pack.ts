import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk } from '../../server/http';
import { getClientIp, isAllowedOrigin, rateLimit, sanitizeText } from '../../utils/apiSecurity';
import {
    fallbackLessonPackContent,
    packSummary,
    type LessonPackContent,
} from '../../utils/lessonPack';
import { agentDebugLog } from '../../utils/agentDebugLog';

function modelList(): string[] {
    return [
        process.env.GEMINI_CHAT_MODEL,
        'gemini-2.0-flash',
        'gemini-flash-latest',
        'gemini-1.5-flash',
    ].filter((m, i, arr): m is string => !!m && arr.indexOf(m) === i);
}

function parseContent(raw: string): LessonPackContent | null {
    const trimmed = raw.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '');
    try {
        const json = JSON.parse(trimmed);
        if (!json || typeof json !== 'object') return null;
        return {
            title: sanitizeText(json.title, 120) || 'Óraanyag',
            goal: sanitizeText(json.goal, 160),
            intro: sanitizeText(json.intro, 800),
            sections: Array.isArray(json.sections)
                ? json.sections.slice(0, 5).map((s: any) => ({
                      heading: sanitizeText(s?.heading, 80) || 'Rész',
                      body: sanitizeText(s?.body, 1200),
                  }))
                : [],
            examples: Array.isArray(json.examples)
                ? json.examples.slice(0, 3).map((s: any) => ({
                      title: sanitizeText(s?.title, 80) || 'Példa',
                      problem: sanitizeText(s?.problem, 500),
                      steps: sanitizeText(s?.steps, 800),
                      answer: sanitizeText(s?.answer, 240),
                  }))
                : [],
            practice: Array.isArray(json.practice)
                ? json.practice.slice(0, 4).map((s: any) => ({
                      problem: sanitizeText(s?.problem, 500),
                      hint: sanitizeText(s?.hint, 240),
                      answer: sanitizeText(s?.answer, 240),
                  }))
                : [],
            teacherNotes: sanitizeText(json.teacherNotes, 800),
        };
    } catch {
        return null;
    }
}

const SYSTEM = `Te a Mihaszna Matek tanári óraanyag-írója vagy. Magyarul írj.
Adj vissza CSAK érvényes JSON-t, markdown keret nélkül.
Séma:
{
  "title": string,
  "goal": string,
  "intro": string,
  "sections": [{"heading": string, "body": string}],
  "examples": [{"title": string, "problem": string, "steps": string, "answer": string}],
  "practice": [{"problem": string, "hint": string, "answer": string}],
  "teacherNotes": string
}
Szabályok:
- 2-4 rövid szakasz, 2 példa lépésekkel, 3 gyakorló feladat megoldással.
- Középiskolás / érettségi szinthez igazíts. Ne találj ki diáknevet, címet, e-mailt.
- A megoldások legyenek rövidek és ellenőrizhetők. Ha bizonytalan vagy, írd oda.`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return sendErr(res, 'Method not allowed', 405);
    if (!isAllowedOrigin(req)) return sendErr(res, 'Nem engedélyezett origin.', 403);

    const ip = getClientIp(req);
    const rl = rateLimit(`lesson-pack:${ip}`, 10, 60 * 60 * 1000);
    if (!rl.ok) return sendErr(res, 'Túl sok óraanyag-kérés. Próbáld később.', 429);

    const topicTitle = sanitizeText(req.body?.topicTitle, 120);
    const preparingForLabel = sanitizeText(req.body?.preparingForLabel, 80);
    const selectedSubject = sanitizeText(req.body?.selectedSubject, 80);
    const topicNote = sanitizeText(req.body?.topicNote, 400);
    const topicId = sanitizeText(req.body?.topicId, 80);
    const preparingFor = sanitizeText(req.body?.preparingFor, 40);

    if (!topicTitle) return sendErr(res, 'A témakör kell az óraanyaghoz.', 400);

    const fallback = fallbackLessonPackContent({
        topicTitle,
        preparingForLabel,
        selectedSubject,
        topicNote,
    });

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || '';
    if (!apiKey) {
        return sendOk(res, {
            content: fallback,
            summary: packSummary(fallback),
            source: 'fallback' as const,
            hasKey: false,
        });
    }

    const userPrompt = [
        `Témakör: ${topicTitle}`,
        topicId ? `Téma azonosító: ${topicId}` : '',
        selectedSubject ? `Szint: ${selectedSubject}` : '',
        preparingForLabel ? `Mire készül: ${preparingForLabel}` : '',
        preparingFor ? `Cél kód: ${preparingFor}` : '',
        topicNote ? `Diák megjegyzése: ${topicNote}` : '',
        'Készíts óraanyagot a JSON-sémában.',
    ]
        .filter(Boolean)
        .join('\n');

    try {
        let raw = '';
        let usedModel = '';
        for (const model of modelList()) {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 28000);
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    signal: controller.signal,
                    body: JSON.stringify({
                        systemInstruction: { parts: [{ text: SYSTEM }] },
                        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
                        generationConfig: {
                            temperature: 0.4,
                            maxOutputTokens: 4096,
                            responseMimeType: 'application/json',
                        },
                    }),
                });
                if (!response.ok) {
                    const lastErr = (await response.text().catch(() => '')).slice(0, 160);
                    console.error('lesson-pack gemini', model, response.status, lastErr);
                    continue;
                }
                const data = await response.json();
                raw = (data?.candidates?.[0]?.content?.parts || [])
                    .map((p: any) => (typeof p?.text === 'string' ? p.text : ''))
                    .join('')
                    .trim();
                usedModel = model;
                if (raw) break;
            } catch (err: any) {
                console.error('lesson-pack timeout', model, err?.name || err?.message);
            } finally {
                clearTimeout(timer);
            }
        }

        const parsed = parseContent(raw);
        const content = parsed || fallback;
        const source = parsed ? 'gemini' : 'fallback';
        // #region agent log
        agentDebugLog({
            hypothesisId: 'H10',
            location: 'api/lesson-pack.ts',
            message: 'lesson pack generated',
            data: {
                source,
                model: usedModel || null,
                topicLen: topicTitle.length,
                hasNote: Boolean(topicNote),
            },
            runId: 'lesson-pack',
        });
        // #endregion
        return sendOk(res, {
            content,
            summary: packSummary(content),
            source,
            hasKey: true,
            model: usedModel || undefined,
        });
    } catch (err: any) {
        console.error('lesson-pack', err);
        return sendOk(res, {
            content: fallback,
            summary: packSummary(fallback),
            source: 'fallback' as const,
            hasKey: true,
        });
    }
}
