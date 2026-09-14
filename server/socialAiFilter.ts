/**
 * MihaSocial AI szűrő — Gemini a szerveren (szöveg + kép).
 * A kulcs soha nem megy a böngészőbe.
 */

export class SocialAiFilterError extends Error {
    status: number;
    constructor(message: string, status = 400) {
        super(message);
        this.name = 'SocialAiFilterError';
        this.status = status;
    }
}

export type SocialAiKind = 'post' | 'comment';

export type SocialAiDecision = {
    allow: boolean;
    reason: string;
    category: string;
};

const DENY_DEFAULT = 'Az AI szűrő nem engedte ki: nem matekos vagy nem megfelelő tartalom.';
const IMAGE_UNAVAILABLE = 'A kép AI-ellenőrzése most nem elérhető. Próbáld később, vagy posztolj szöveget.';
const CHECK_FAILED = 'Az AI szűrő most nem tudta ellenőrizni. Próbáld újra.';

const POST_PROMPT = `Te a MihaSocial AI-szűrője vagy (magyar matektanuló közösség, ~10–20 éves diákok).
Döntsd el, kimehet-e a poszt.

ENGEDD: matekfeladat, kérdés, megoldás, képlet, érettségi/felvételi, házi feladat képe, jegyzet, számolás.
TILOS: nem matek, szexuális tartalom, erőszak, gyűlölet, zaklatás, drogos tartalom, spam, reklám, személyes adat, off-topic mém/szelfi, csalás-szolgáltatás.

Csak JSON:
{"allow":true|false,"reason":"ha tiltás: rövid magyar indok a felhasználónak, különben üres","category":"math|off_topic|unsafe|spam"}`;

const COMMENT_PROMPT = `Te a MihaSocial AI-szűrője vagy. Ez egy hozzászólás egy matekos poszthoz.
ENGEDD: udvarias, segítő, rövid reakció, matekos kérdés/magyarázat, „köszi”, „nem értem a 2. lépést”.
TILOS: sértés, zaklatás, szexuális/erőszakos tartalom, spam, reklám, teljesen off-topic.

Csak JSON:
{"allow":true|false,"reason":"ha tiltás: rövid magyar indok, különben üres","category":"math|off_topic|unsafe|spam"}`;

function geminiKey(): string {
    return String(process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || '').trim();
}

export function isSocialAiFilterEnabled(): boolean {
    return String(process.env.SOCIAL_AI_FILTER || '1') !== '0';
}

export function parseSocialAiDecision(raw: string): SocialAiDecision | null {
    const text = String(raw || '').trim();
    const jsonSlice = text.match(/\{[\s\S]*\}/)?.[0];
    if (!jsonSlice) return null;
    try {
        const o = JSON.parse(jsonSlice) as Record<string, unknown>;
        if (typeof o.allow !== 'boolean') return null;
        return {
            allow: o.allow,
            reason: String(o.reason || '').trim(),
            category: String(o.category || '').trim(),
        };
    } catch {
        return null;
    }
}

function modelList(): string[] {
    const preferred = [
        process.env.GEMINI_CHAT_MODEL,
        'gemini-2.0-flash',
        'gemini-flash-latest',
        'gemini-1.5-flash',
        'gemini-2.5-flash-lite',
    ].filter((m, i, arr): m is string => !!m && arr.indexOf(m) === i);
    return preferred.slice(0, 3);
}

function denyMessage(decision: SocialAiDecision | null): string {
    const reason = String(decision?.reason || '').trim();
    if (reason && reason.length <= 220) return reason;
    return DENY_DEFAULT;
}

async function imagePartFromUrl(
    imageUrl: string
): Promise<{ inlineData: { mimeType: string; data: string } } | null> {
    const raw = String(imageUrl || '').trim();
    if (!raw) return null;

    const dataMatch = raw.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=\s]+)$/);
    if (dataMatch) {
        const data = dataMatch[2].replace(/\s+/g, '');
        if (data.length > 3_500_000) return null;
        return { inlineData: { mimeType: dataMatch[1], data } };
    }

    if (!/^https:\/\//i.test(raw)) return null;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    try {
        const res = await fetch(raw, { signal: controller.signal });
        if (!res.ok) return null;
        const mime = String(res.headers.get('content-type') || '').split(';')[0].trim();
        if (!mime.startsWith('image/')) return null;
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.length < 32 || buf.length > 2_500_000) return null;
        return { inlineData: { mimeType: mime, data: buf.toString('base64') } };
    } catch {
        return null;
    } finally {
        clearTimeout(timer);
    }
}

async function askGemini(parts: unknown[], system: string): Promise<SocialAiDecision | null> {
    const apiKey = geminiKey();
    if (!apiKey) return null;

    for (const model of modelList()) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 9000);
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal,
                body: JSON.stringify({
                    systemInstruction: { parts: [{ text: system }] },
                    contents: [{ role: 'user', parts }],
                    generationConfig: {
                        temperature: 0,
                        maxOutputTokens: 256,
                        responseMimeType: 'application/json',
                    },
                }),
            });
            if (!response.ok) continue;
            const data = await response.json();
            const text = (data?.candidates?.[0]?.content?.parts || [])
                .map((p: { text?: string }) => (typeof p?.text === 'string' ? p.text : ''))
                .join('')
                .trim();
            const decision = parseSocialAiDecision(text);
            if (decision) return decision;
        } catch (err: any) {
            console.error('social-ai-filter', model, err?.name || err?.message || err);
        } finally {
            clearTimeout(timer);
        }
    }
    return null;
}

export async function assertSocialContentAllowed(input: {
    kind: SocialAiKind;
    text: string;
    imageUrl?: string | null;
}): Promise<void> {
    if (!isSocialAiFilterEnabled()) return;

    const text = String(input.text || '').trim();
    const imageUrl = String(input.imageUrl || '').trim();
    const hasImage = !!imageUrl;
    const key = geminiKey();

    if (!key) {
        if (hasImage) throw new SocialAiFilterError(IMAGE_UNAVAILABLE, 503);
        return;
    }

    const parts: unknown[] = [
        {
            text:
                input.kind === 'post'
                    ? `Poszt szövege:\n${text || '(nincs szöveg, csak kép)'}`
                    : `Hozzászólás:\n${text}`,
        },
    ];

    if (hasImage) {
        const imagePart = await imagePartFromUrl(imageUrl);
        if (!imagePart) throw new SocialAiFilterError(IMAGE_UNAVAILABLE, 503);
        parts.push(imagePart);
    }

    const decision = await askGemini(parts, input.kind === 'post' ? POST_PROMPT : COMMENT_PROMPT);
    if (!decision) {
        if (hasImage) throw new SocialAiFilterError(CHECK_FAILED, 503);
        return;
    }
    if (!decision.allow) {
        throw new SocialAiFilterError(denyMessage(decision), 400);
    }
}
