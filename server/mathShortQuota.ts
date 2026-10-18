export const DAILY_SHORT_LIMIT = 5;
export const DEFAULT_VIDEO_MODEL = 'bytedance/seedance-2.0-fast';

export function budapestDayKey(now = new Date()): string {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Europe/Budapest',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(now);
}

export function topicKey(topic: string): string {
    return topic
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();
}

export function videoModel(envValue = process.env.POLLINATIONS_VIDEO_MODEL): string {
    const raw = String(envValue || '').trim();
    return raw || DEFAULT_VIDEO_MODEL;
}

export function quotaDecision(
    usedTopicKeys: string[],
    topic: string,
    limit = DAILY_SHORT_LIMIT
): { ok: true } | { ok: false; reason: 'duplicate' | 'full' } {
    const key = topicKey(topic);
    if (!key) return { ok: false, reason: 'duplicate' };
    if (usedTopicKeys.includes(key)) return { ok: false, reason: 'duplicate' };
    if (usedTopicKeys.length >= limit) return { ok: false, reason: 'full' };
    return { ok: true };
}

export function pollinationsVideoUrl(prompt: string, model: string): string {
    const params = new URLSearchParams({
        model,
        duration: '4',
        aspectRatio: '9:16',
    });
    return `https://gen.pollinations.ai/video/${encodeURIComponent(prompt)}?${params.toString()}`;
}

export function videoPromptFromScript(script: {
    topic: string;
    title: string;
    hook: string;
    body: string;
    tip: string;
}): string {
    const text = [
        'Vertical 9:16 classroom clip, 4 seconds.',
        'A teacher at a chalkboard explains this Hungarian high-school math idea, writing the formula clearly.',
        `Topic: ${script.topic}.`,
        `Title: ${script.title}.`,
        script.hook,
        script.body,
        script.tip ? `Tip: ${script.tip}.` : '',
        'No logo, no violence.',
    ]
        .filter(Boolean)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
    return text.slice(0, 700);
}
