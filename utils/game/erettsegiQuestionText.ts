import type { Question } from './types';

/** (pl. 1/6) és ≈ mintaválasz — gyakran maga a megoldás. */
export function stripAnswerExamples(text: string): string {
    return text
        .replace(/\s*\((?:pl\.|például)[^)]*\)/gi, '')
        .replace(/\s*,?\s*≈\s*[\d]+(?:[.,]\d+)?/g, '')
        .replace(/[ \t]{2,}/g, ' ')
        .replace(/\s+([.?!])/g, '$1')
        .replace(/\.{2,}/g, '.')
        .trim();
}

function itemKey(question: string): string {
    const m = question.match(/^(\d{4}\/\d+)/);
    return m ? m[1] : '';
}

function body(question: string): string {
    return question.replace(/^\d{4}\/\d+\.?(?:[a-z]\)?)?\s*/i, '').trim();
}

function dataSentence(question: string): string {
    const b = body(question);
    const firstLine = b.split('\n')[0] || '';
    const sentence = firstLine.split(/(?<=\.)\s+/)[0] || '';
    return /\d/.test(sentence) ? sentence.replace(/\s+$/, '') : '';
}

function numbersIn(text: string): string[] {
    return body(text).match(/\d+(?:[.,]\d+)?/g) || [];
}

function sharesSetup(later: string, data: string, source: string): boolean {
    if (!data) return false;
    if (later.includes(data.slice(0, Math.min(24, data.length)))) return true;
    const laterNums = numbersIn(later);
    const sourceNums = new Set(numbersIn(source));
    if (laterNums.some((n) => !sourceNums.has(n))) return false;
    return true;
}

/** b), c) … megkapja az a) rész számszerű adatait, ha különben nem lenne meg. */
export function attachSharedData(list: Question[]): Question[] {
    const firstByItem = new Map<string, Question>();
    for (const q of list) {
        const key = itemKey(q.question);
        if (key && !firstByItem.has(key)) firstByItem.set(key, q);
    }
    return list.map((q) => {
        const key = itemKey(q.question);
        const first = key ? firstByItem.get(key) : undefined;
        if (!first || first === q) return q;
        const data = dataSentence(first.question);
        if (!data) return q;
        let text = q.question;
        if (/ugyanaz/i.test(body(text))) {
            text = text.replace(/ugyanaz(?:ok)?[^.]{0,40}\.?/i, data);
            return { ...q, question: text.replace(/[ \t]{2,}/g, ' ').trim() };
        }
        if (!sharesSetup(text, data, first.question)) return q;
        const labeled = text.match(/^(\d{4}\/\d+\.?(?:[a-z]\)?)?\s*)/i);
        const prefix = labeled ? labeled[1] : '';
        const rest = text.slice(prefix.length);
        if (rest.includes(data.slice(0, 18))) return q;
        return { ...q, question: `${prefix}${data} ${rest}`.replace(/[ \t]{2,}/g, ' ').trim() };
    });
}

export function polishErettsegiQuestions(list: Question[]): Question[] {
    const cleaned = list.map((q) => ({
        ...q,
        question: stripAnswerExamples(q.question),
    }));
    return attachSharedData(cleaned);
}
