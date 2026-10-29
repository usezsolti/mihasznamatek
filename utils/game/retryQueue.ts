/** Stable id: a retry copy must credit the original question, not a new one. */
export function questionOriginId(id: string | undefined, index = 0): string {
    const raw = String(id || `idx_${index}`);
    return raw.replace(/_r[a-z0-9]+$/i, '');
}

/** Every original question has been answered correctly at least once. */
export function allOriginsSolved(
    bank: { id?: string }[],
    correctIds: string[],
): boolean {
    if (!bank.length) return false;
    const done = new Set(correctIds.map((id) => questionOriginId(id)));
    for (let i = 0; i < bank.length; i++) {
        if (!done.has(questionOriginId(bank[i].id, i))) return false;
    }
    return true;
}

/**
 * Put the missed question back later. If a later copy is already waiting,
 * keep that one so the same task is not stacked.
 */
export function enqueueRetry<T extends { id?: string }>(
    bank: T[],
    currentIndex: number,
    current: T,
    gap: number,
): T[] {
    const origin = questionOriginId(current.id, currentIndex);
    const alreadyWaiting = bank.slice(currentIndex + 1).some((q, offset) =>
        questionOriginId(q.id, currentIndex + 1 + offset) === origin
    );
    if (alreadyWaiting) return bank;
    const retry = { ...current, id: origin };
    const insertAt = Math.min(
        bank.length,
        Math.max(currentIndex + 1, currentIndex + 1 + Math.max(0, gap)),
    );
    const next = bank.slice();
    next.splice(insertAt, 0, retry);
    return next;
}

/** After a correct answer, later copies of that question must not appear again. */
export function dropLaterCopies<T extends { id?: string }>(
    bank: T[],
    currentIndex: number,
    origin: string,
): T[] {
    return bank.filter((q, i) => i <= currentIndex || questionOriginId(q.id, i) !== origin);
}
