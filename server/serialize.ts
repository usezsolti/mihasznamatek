/** Prisma BigInt → JSON-safe number (or string if too large). */
export function msToJson(value: bigint | number | null | undefined): number {
    if (value == null) return 0;
    const n = typeof value === 'bigint' ? value : BigInt(Math.trunc(Number(value)));
    const asNum = Number(n);
    if (Number.isSafeInteger(asNum)) return asNum;
    return Number(String(n));
}

export function msToJsonOptional(
    value: bigint | number | null | undefined
): number | null {
    if (value == null) return null;
    return msToJson(value);
}
