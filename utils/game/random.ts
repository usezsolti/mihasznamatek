/** Közös random helper-ek a játék domain generátoraihoz. */

export function randBelow(n: number): number {
    return Math.floor(Math.random() * n);
}

export function randInt(minInclusive: number, maxInclusive: number): number {
    const lo = Math.ceil(minInclusive);
    const hi = Math.floor(maxInclusive);
    return lo + randBelow(hi - lo + 1);
}

export function pick<T>(list: T[]): T {
    return list[randBelow(list.length)];
}
