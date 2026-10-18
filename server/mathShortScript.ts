import { FALLBACK_MATH_SHORTS } from '../utils/mathShortFallbacks';
import { sanitizeText } from '../utils/apiSecurity';

export type MathShortScript = {
    topic: string;
    title: string;
    hook: string;
    body: string;
    tip: string;
    difficulty: string;
    createdAtMs: number;
    source: 'ai' | 'fallback';
};

export function fallbackMathShortScript(topic: string | undefined, difficulty: string): MathShortScript {
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
        difficulty: difficulty || base.difficulty,
        createdAtMs: Date.now(),
        source: 'fallback',
    };
}

export async function composeMathShortScript(topicRaw: string, difficultyRaw: string): Promise<MathShortScript> {
    const topic = sanitizeText(topicRaw, 80) || 'matek trükk';
    const difficulty = sanitizeText(difficultyRaw || 'közepes', 20) || 'közepes';
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) return fallbackMathShortScript(topic, difficulty);

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
        if (!response.ok) return fallbackMathShortScript(topic, difficulty);
        const data = await response.json();
        const raw = data?.choices?.[0]?.message?.content || '';
        const jsonMatch = String(raw).match(/\{[\s\S]*\}/);
        if (!jsonMatch) return fallbackMathShortScript(topic, difficulty);
        const parsed = JSON.parse(jsonMatch[0]);
        return {
            topic: sanitizeText(parsed.topic || topic, 60) || topic,
            title: sanitizeText(parsed.title, 80) || 'Matek short',
            hook: sanitizeText(parsed.hook, 160) || '',
            body: sanitizeText(parsed.body, 600) || '',
            tip: sanitizeText(parsed.tip, 200) || '',
            difficulty,
            createdAtMs: Date.now(),
            source: 'ai',
        };
    } catch (e) {
        console.error('composeMathShortScript', e);
        return fallbackMathShortScript(topic, difficulty);
    }
}
