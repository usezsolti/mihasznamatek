import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk } from '../../server/http';
import { getClientIp, isAllowedOrigin, rateLimit, sanitizeText } from '../../utils/apiSecurity';

const SYSTEM = `Te vagy MihaAI, a Mihaszna Matek (mihasznamatek.hu) segédasszisztense.
Magyarul válaszolj, röviden, barátságosan, matektanár-stílusban.
Segítesz: óradíj, kiket vállalunk, online/személyes óra, időpontfoglalás, érettségi/egyetem, közösség.
Tények (ha releváns):
- Óradíj: 11 000 Ft / 60 perc (több diák esetén kedvezmény lehetséges).
- Általános iskola, középiskola, egyetem.
- Online: Zoom / Google Meet / Teams.
- Foglalás: a honlapon Időpontfoglalás.
Ne találj ki más árakat. Ha nem tudod, tereld a Kapcsolatok / foglalás felé.
Max ~120 szó.`;

function localReply(msg: string): string {
    const m = msg
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    if (/ar|dij|mennyibe|fizet|kerul|koltseg/.test(m)) {
        return 'Az óradíj 11 000 Ft / 60 perc. Több diák ugyanazon az órán → kedvezmény. Foglaláshoz használd az Időpontfoglalás menüt.';
    }
    if (/kiket|diak|vallal|szint|erettsegi|egyetem/.test(m)) {
        return 'Általános iskolástól egyetemig vállalok: korrepetálás, érettségi (közép/emelt), uni vizsgafelkészítés.';
    }
    if (/online|zoom|meet|teams|tav/.test(m)) {
        return 'Igen, tartok online órákat Zoomon, Google Meeten és Teamsen — digitális táblával, mint személyesen.';
    }
    if (/idopont|foglal|mikor|ora/.test(m)) {
        return 'Az Időpontfoglalás menüpontban tudsz órát választani és megerősíteni. Ha elakadsz, írj a Kapcsolatoknál.';
    }
    if (/kozosseg|community|short/.test(m)) {
        return 'A Közösség menüben matek feed, shorts, csoportok és üzenetek vannak — érdemes belépni a dashboardról.';
    }
    return 'Szia! Matek órákról, árról, online/személyes oktatásról és foglalásról tudok segíteni. Írd meg röviden, miben segíthetek — vagy nyisd az Időpontfoglalást a menüben.';
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

    const message = sanitizeText(req.body?.message, 800);
    if (!message) {
        return sendErr(res, 'Üres üzenet.', 400);
    }

    const historyRaw = Array.isArray(req.body?.history) ? req.body.history.slice(-8) : [];
    const history = historyRaw
        .map((h: any) => ({
            role: h?.role === 'model' || h?.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: sanitizeText(h?.text ?? h?.content, 800) }],
        }))
        .filter((h: { parts: { text: string }[] }) => h.parts[0].text);

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || '';
    if (!apiKey) {
        return sendOk(res, { reply: localReply(message), source: 'local', hasKey: false });
    }

    try {
        const models = [
            process.env.GEMINI_CHAT_MODEL,
            'gemini-3.5-flash',
            'gemini-3.6-flash',
            'gemini-2.5-flash',
            'gemini-flash-latest',
            'gemini-3.1-flash-lite',
            'gemini-1.5-flash',
        ].filter((m, i, arr): m is string => !!m && arr.indexOf(m) === i);

        let lastStatus = 0;
        let data: any = null;
        let usedModel = '';

        for (const model of models) {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    systemInstruction: { parts: [{ text: SYSTEM }] },
                    contents: [...history, { role: 'user', parts: [{ text: message }] }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 512,
                    },
                }),
            });
            lastStatus = response.status;
            if (!response.ok) {
                const lastErr = (await response.text().catch(() => '')).slice(0, 200);
                console.error('gemini chat', model, response.status, lastErr.slice(0, 180));
                continue;
            }
            data = await response.json();
            usedModel = model;
            break;
        }

        if (!data) {
            return sendOk(res, {
                reply: localReply(message),
                source: 'local-fallback',
                hasKey: true,
                warning: `Gemini ${lastStatus}`,
            });
        }

        const reply =
            data?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text || '').join('')?.trim() ||
            localReply(message);

        return sendOk(res, { reply, source: 'gemini', hasKey: true, model: usedModel });
    } catch (e: any) {
        console.error('chat-gemini', e);
        return sendOk(res, { reply: localReply(message), source: 'local-fallback', hasKey: true });
    }
}
