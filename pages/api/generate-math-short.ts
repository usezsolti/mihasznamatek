import { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk } from '../../server/http';
import {
    getClientIp,
    isAllowedOrigin,
    rateLimit,
    requireAuth,
    sanitizeText,
} from '../../utils/apiSecurity';
import { FALLBACK_MATH_SHORTS } from '../../utils/mathShortFallbacks';

function pickFallback(topic?: string) {
    const t = (topic || '').toLowerCase();
    const match = FALLBACK_MATH_SHORTS.find(
        (s) => s.topic.toLowerCase().includes(t) || t.includes(s.topic.toLowerCase())
    );
    const base = match || FALLBACK_MATH_SHORTS[Math.floor(Math.random() * FALLBACK_MATH_SHORTS.length)];
    return {
        topic: base.topic,
        title: base.title,
        hook: base.hook,
        body: base.body,
        tip: base.tip,
        difficulty: base.difficulty,
        createdAtMs: Date.now(),
        source: 'fallback' as const,
    };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return sendErr(res, 'Method not allowed', 405);
    }
    if (!isAllowedOrigin(req)) {
        return sendErr(res, 'Nem engedélyezett origin.', 403);
    }
    const user = await requireAuth(req, res);
    if (!user) return;

    const ip = getClientIp(req);
    const rlIp = rateLimit(`math-short:${ip}`, 30, 60 * 60 * 1000);
    const rlUser = rateLimit(`math-short:uid:${user.uid}`, 15, 60 * 60 * 1000);
    if (!rlIp.ok || !rlUser.ok) {
        return sendErr(res, 'Túl sok short-generálás. Próbáld később.', 429);
    }

    const topic = sanitizeText(req.body?.topic, 80) || 'matek trükk';
    const difficulty = sanitizeText(req.body?.difficulty || 'közepes', 20) || 'közepes';
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!openaiApiKey) {
        return sendOk(res, pickFallback(topic));
    }

    try {
        const prompt = `Írj egy rövid, Instagram/TikTok stílusú magyar matek "short" oktatókártyát.
Téma: ${topic}
Nehézség: ${difficulty}
Válaszolj CSAK érvényes JSON-nel, kulcsok: title, hook, body, tip, topic.
- title: max 6 szó, ütős
- hook: 1 rövid mondat
- body: 2-3 mondat magyarázat, közérthető
- tip: 1 gyakorlati tipp
- topic: rövid témakör név
Ne használj markdownot.`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${openaiApiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                temperature: 0.8,
                messages: [
                    { role: 'system', content: 'Te egy magyar matektanár vagy. Csak JSON-t adsz vissza.' },
                    { role: 'user', content: prompt },
                ],
            }),
        });

        if (!response.ok) {
            return sendOk(res, pickFallback(topic));
        }

        const data = await response.json();
        const raw = data?.choices?.[0]?.message?.content || '';
        const jsonMatch = String(raw).match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return sendOk(res, pickFallback(topic));
        }
        const parsed = JSON.parse(jsonMatch[0]);
        return sendOk(res, {
            topic: sanitizeText(parsed.topic || topic, 60) || topic,
            title: sanitizeText(parsed.title, 80) || 'Matek short',
            hook: sanitizeText(parsed.hook, 160) || '',
            body: sanitizeText(parsed.body, 600) || '',
            tip: sanitizeText(parsed.tip, 200) || '',
            difficulty,
            createdAtMs: Date.now(),
            source: 'ai' as const,
        });
    } catch (e) {
        console.error('generate-math-short', e);
        return sendOk(res, pickFallback(topic));
    }
}
