import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk } from '../../server/http';
import { getClientIp, isAllowedOrigin, rateLimit, sanitizeText } from '../../utils/apiSecurity';
import {
    formatAvailabilityReply,
    getBudapestDateKeyOffset,
    getDayAvailability,
    isAvailabilityIntent,
    parseRequestedDateKey,
} from '../../utils/bookingAvailability';

const SITE = 'https://mihasznamatek.hu';

const SYSTEM = `You are MihAIy, the AI assistant of Mihaszna Matek (${SITE}).

Behavior:
- Introduce yourself ONLY if the user asks who you are. The chat already greets them as MihAIy — never say “I am MihAIy…” again in normal answers.
- Answer the user's LATEST request directly. No filler, no repeating old topics unless asked.
- Reply in the user's language (HU or EN). Friendly and clear.
- Prefer 40–140 words, unless a math solution needs more steps.

When linking pages, paste a site path (works on this site). Prefer these exact paths:
- Appointment booking: /booking — say “appointment booking page” / HU: “időpontfoglaló oldal”. Do NOT say “booking page”.
- Contact: /#contact
- Pricing: /#pricing
- About: /#about
- Courses: /#courses
- MihaSocial: /community
- Home: /
- Privacy: /adatkezelesi-tajekoztato

Site facts when relevant: 11,000 HUF / 60 min; primary–uni; online Zoom/Meet/Teams; teacher Zsolti.
Never invent live free hours — if they want exact free slots, give /booking (server may also inject live availability).
Don't invent other prices. If unsure, say so and link /#contact.`;

/** Remember last working model so we don't pay failed-model latency every request. */
let lastGoodModel = '';

function looksEnglish(msg: string): boolean {
    const hu = (msg.match(/[áéíóöőúüűÁÉÍÓÖŐÚÜŰ]/g) || []).length;
    return hu === 0;
}

function modelList(): string[] {
    const preferred = [
        process.env.GEMINI_CHAT_MODEL,
        lastGoodModel,
        'gemini-2.0-flash',
        'gemini-flash-latest',
        'gemini-1.5-flash',
        'gemini-2.5-flash-lite',
        'gemini-2.0-flash-lite',
        'gemini-2.5-flash',
        'gemini-1.5-flash-8b',
    ].filter((m, i, arr): m is string => !!m && arr.indexOf(m) === i);
    return preferred.slice(0, 4);
}

/**
 * POST /api/chat-gemini
 * Body: { message: string, history?: { role: 'user'|'model', text: string }[] }
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return sendErr(res, 'Method not allowed', 405);
    }
    if (!isAllowedOrigin(req)) {
        return sendErr(res, 'Nem engedélyezett origin.', 403);
    }

    const ip = getClientIp(req);
    const rl = rateLimit(`chat-gemini:${ip}`, 40, 60 * 60 * 1000);
    if (!rl.ok) {
        return sendErr(res, 'Túl sok üzenet. Próbáld később.', 429);
    }

    const message = sanitizeText(req.body?.message, 2000);
    if (!message) {
        return sendErr(res, 'Üres üzenet.', 400);
    }

    const started = Date.now();

    // Live Zsolti free hours (before FAQ / Gemini — never invent slots)
    const availIntent = isAvailabilityIntent(message);
    // #region agent log
    try {
        const fs = await import('fs');
        const path = await import('path');
        fs.appendFileSync(
            path.join(process.cwd(), 'debug-c04d6a.log'),
            JSON.stringify({
                sessionId: 'c04d6a',
                runId: 'avail-pre',
                hypothesisId: 'A_INTENT',
                location: 'pages/api/chat-gemini.ts:avail-check',
                message: 'availability intent check',
                data: {
                    availIntent,
                    msgLen: message.length,
                    parsedDate: parseRequestedDateKey(message),
                    en: looksEnglish(message),
                },
                timestamp: Date.now(),
            }) + '\n'
        );
    } catch {
        /* ignore */
    }
    // #endregion

    if (availIntent) {
        const dateKey = parseRequestedDateKey(message) || getBudapestDateKeyOffset(0);
        try {
            const avail = await getDayAvailability(dateKey);
            const lang = looksEnglish(message) ? 'en' : 'hu';
            const reply = formatAvailabilityReply(avail, lang);
            // #region agent log
            try {
                const fs = await import('fs');
                const path = await import('path');
                fs.appendFileSync(
                    path.join(process.cwd(), 'debug-c04d6a.log'),
                    JSON.stringify({
                        sessionId: 'c04d6a',
                        runId: 'avail-ok',
                        hypothesisId: 'B_SLOTS',
                        location: 'pages/api/chat-gemini.ts:avail-reply',
                        message: 'availability reply ready',
                        data: {
                            dateKey,
                            freeCount: avail.freeSlots.length,
                            workingCount: avail.workingSlots.length,
                            source: avail.source,
                            ms: Date.now() - started,
                            replyLen: reply.length,
                            sampleFree: avail.freeSlots.slice(0, 4),
                        },
                        timestamp: Date.now(),
                    }) + '\n'
                );
            } catch {
                /* ignore */
            }
            // #endregion
            return sendOk(res, {
                reply,
                source: 'booking-availability',
                hasKey: Boolean(process.env.GEMINI_API_KEY),
                dateKey,
                freeSlots: avail.freeSlots,
            });
        } catch (err: any) {
            // #region agent log
            try {
                const fs = await import('fs');
                const path = await import('path');
                fs.appendFileSync(
                    path.join(process.cwd(), 'debug-c04d6a.log'),
                    JSON.stringify({
                        sessionId: 'c04d6a',
                        runId: 'avail-err',
                        hypothesisId: 'C_LOAD_FAIL',
                        location: 'pages/api/chat-gemini.ts:avail-error',
                        message: 'availability load failed',
                        data: {
                            dateKey,
                            err: String(err?.message || err).slice(0, 120),
                            ms: Date.now() - started,
                        },
                        timestamp: Date.now(),
                    }) + '\n'
                );
            } catch {
                /* ignore */
            }
            // #endregion
            const en = looksEnglish(message);
            return sendOk(res, {
                reply: en
                    ? `I could not load free hours right now. Please visit the appointment booking page: /booking`
                    : `Most nem tudom betölteni a szabad órákat. Látogasd meg az időpontfoglaló oldalt: /booking`,
                source: 'booking-availability-fallback',
                hasKey: Boolean(process.env.GEMINI_API_KEY),
            });
        }
    }

    const historyRaw = Array.isArray(req.body?.history) ? req.body.history.slice(-6) : [];
    const history = historyRaw
        .map((h: any) => ({
            role: h?.role === 'model' || h?.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: sanitizeText(h?.text ?? h?.content, 1200) }],
        }))
        .filter((h: { parts: { text: string }[] }) => h.parts[0].text);

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || '';
    if (!apiKey) {
        const fallback =
            looksEnglish(message)
                ? 'Hi! Ask me anything — math help, lessons, appointments, or general questions. Appointment booking: /booking'
                : 'Szia! Kérdezz bármit — matek, órák, időpont, vagy más. Időpontfoglaló: /booking';
        return sendOk(res, { reply: fallback, source: 'local', hasKey: false });
    }

    try {
        const models = modelList();
        let lastStatus = 0;
        let data: any = null;
        let usedModel = '';

        for (const model of models) {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 9000);
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    signal: controller.signal,
                    body: JSON.stringify({
                        systemInstruction: { parts: [{ text: SYSTEM }] },
                        contents: [...history, { role: 'user', parts: [{ text: message }] }],
                        generationConfig: {
                            temperature: 0.55,
                            maxOutputTokens: 1024,
                        },
                    }),
                });
                lastStatus = response.status;
                if (!response.ok) {
                    const lastErr = (await response.text().catch(() => '')).slice(0, 160);
                    console.error('gemini chat', model, response.status, lastErr);
                    continue;
                }
                data = await response.json();
                usedModel = model;
                lastGoodModel = model;
                break;
            } catch (err: any) {
                console.error('gemini chat timeout/error', model, err?.name || err?.message || err);
                continue;
            } finally {
                clearTimeout(timer);
            }
        }

        if (!data) {
            const fallback =
                looksEnglish(message)
                    ? 'Sorry — I could not answer right now. Please try again, or visit the appointment booking page: /booking'
                    : 'Bocsi, most nem tudok válaszolni. Próbáld újra, vagy látogasd meg az időpontfoglaló oldalt: /booking';
            return sendOk(res, {
                reply: fallback,
                source: 'local-fallback',
                hasKey: true,
                warning: `Gemini ${lastStatus}`,
            });
        }

        const parts = data?.candidates?.[0]?.content?.parts || [];
        const reply =
            parts
                .map((p: any) => (typeof p?.text === 'string' ? p.text : ''))
                .join('')
                .trim() ||
            (looksEnglish(message)
                ? 'Could you rephrase that? I am happy to help with math, lessons, or anything else.'
                : 'Átfogalmaznád? Szívesen segítek matekban, órákban, vagy bármiben.');
        const finishReason = String(data?.candidates?.[0]?.finishReason || '');

        // #region agent log
        try {
            const fs = await import('fs');
            const path = await import('path');
            fs.appendFileSync(
                path.join(process.cwd(), 'debug-c04d6a.log'),
                JSON.stringify({
                    sessionId: 'c04d6a',
                    runId: 'chat-speed',
                    hypothesisId: 'FAST_GEMINI',
                    location: 'pages/api/chat-gemini.ts',
                    message: 'gemini reply timing',
                    data: {
                        model: usedModel,
                        ms: Date.now() - started,
                        replyLen: reply.length,
                        finishReason,
                        maxOut: 1024,
                    },
                    timestamp: Date.now(),
                }) + '\n'
            );
        } catch {
            /* ignore */
        }
        // #endregion

        return sendOk(res, { reply, source: 'gemini', hasKey: true, model: usedModel, finishReason });
    } catch (e: any) {
        console.error('chat-gemini', e);
        const fallback =
            looksEnglish(message)
                ? 'Sorry — something went wrong. Please try again in a moment.'
                : 'Bocsi, hiba történt. Próbáld újra egy pillanat múlva.';
        return sendOk(res, { reply: fallback, source: 'local-fallback', hasKey: true });
    }
}
