/** Beépített AI-shorts tartalék (API + kliens). */
import type { MathShort } from './socialTypes';

export const FALLBACK_MATH_SHORTS: Omit<MathShort, 'id'>[] = [
    {
        topic: 'Százalékszámítás',
        title: '20% kedvezmény trükk',
        hook: 'Gyors fejszámolás vásárláskor',
        body: 'Ha 20% kedvezményt kapsz, szorozd az árat 0,8-cal. 5000 Ft → 4000 Ft. 15%-nál szorozz 0,85-tel.',
        tip: '10% = tized, 5% = fele a 10%-nak — így összeadhatod.',
        difficulty: 'könnyű',
        createdAtMs: Date.now() - 1000,
    },
    {
        topic: 'Egyenletek',
        title: 'Mindkét oldal ugyanaz',
        hook: 'Az egyenlet mérleg',
        body: 'Amit az egyik oldalon csinálsz, a másikon is. +3 balra → +3 jobbra. Így az egyenlőség megmarad.',
        tip: 'Ellenőrizd a megoldást behelyettesítéssel!',
        difficulty: 'könnyű',
        createdAtMs: Date.now() - 2000,
    },
    {
        topic: 'Pitagorasz',
        title: 'a² + b² = c²',
        hook: 'Derékszögű háromszög hipotenúza',
        body: 'A két befogó négyzetösszege a átfogó négyzete. 3-4-5 klasszikus: 9+16=25.',
        tip: 'Ha csak két oldalt tudsz, a harmadik kiszámolható.',
        difficulty: 'közepes',
        createdAtMs: Date.now() - 3000,
    },
    {
        topic: 'Deriválás',
        title: 'Hatványszabály 3 mp-ben',
        hook: 'xⁿ deriváltja',
        body: '(xⁿ)′ = n·xⁿ⁻¹. Példa: (x³)′ = 3x². Konstans szorzó kijön: (5x²)′ = 10x.',
        tip: 'Összeg deriváltja = deriváltak összege.',
        difficulty: 'közepes',
        createdAtMs: Date.now() - 4000,
    },
    {
        topic: 'Valószínűség',
        title: 'Kedvező / összes',
        hook: 'Klasszikus formula',
        body: 'P = kedvező esetek / összes eset. Kocka páros: 3/6 = 1/2.',
        tip: 'Egymást kizáró eseményeknél az esélyek összeadódnak.',
        difficulty: 'könnyű',
        createdAtMs: Date.now() - 5000,
    },
    {
        topic: 'Logaritmus',
        title: 'log_b(bᵏ) = k',
        hook: 'A log „visszacsinálja” a hatványt',
        body: 'log₂(8) = 3, mert 2³ = 8. Ez a definíció lényege.',
        tip: 'log(a·b) = log a + log b — szorzatból összeg.',
        difficulty: 'közepes',
        createdAtMs: Date.now() - 6000,
    },
];
