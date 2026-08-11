/** Útvonal-kincs ikon: matekos medál (ajándék emoji helyett). */

type Props = {
    chest: 1 | 2 | 3;
    claimed?: boolean;
    locked?: boolean;
    size?: number;
};

const SYMBOL: Record<1 | 2 | 3, string> = {
    1: 'π',
    2: '∞',
    3: 'Σ',
};

export default function MathRewardIcon({
    chest,
    claimed = false,
    locked = false,
    size = 34,
}: Props) {
    const symbol = SYMBOL[chest];
    const gid = `mmReward${chest}${claimed ? 'D' : locked ? 'L' : 'U'}`;
    const rim = claimed ? '#8a6a00' : locked ? 'rgba(255,255,255,0.22)' : '#c9a000';
    const face = claimed || !locked ? `url(#${gid})` : 'rgba(255,255,255,0.08)';
    const glyph = claimed ? '#1a1200' : locked ? 'rgba(255,255,255,0.28)' : '#1a1200';

    return (
        <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden>
            <defs>
                <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={claimed ? '#ffd84a' : '#ffe566'} />
                    <stop offset="55%" stopColor="#ffc800" />
                    <stop offset="100%" stopColor={claimed ? '#c99200' : '#e0a800'} />
                </linearGradient>
            </defs>
            {/* szalag / medál füle */}
            <path
                d="M14 6 L20 12 L26 6"
                fill="none"
                stroke={rim}
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={locked ? 0.55 : 1}
            />
            {/* külső gyűrű */}
            <circle cx="20" cy="23" r="13.5" fill={face} stroke={rim} strokeWidth="2.2" />
            {/* belső karika — „jutalom” jel */}
            <circle
                cx="20"
                cy="23"
                r="10"
                fill="none"
                stroke={claimed || !locked ? 'rgba(26,18,0,0.28)' : 'rgba(255,255,255,0.12)'}
                strokeWidth="1.4"
            />
            {claimed ? (
                <path
                    d="M14.5 23.2 L18.2 26.8 L26 17.5"
                    fill="none"
                    stroke={glyph}
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            ) : (
                <text
                    x="20"
                    y={chest === 2 ? 28 : 27.5}
                    textAnchor="middle"
                    fontSize={chest === 2 ? 16 : 15}
                    fontWeight="800"
                    fill={glyph}
                    fontFamily="Montserrat, Georgia, serif"
                >
                    {symbol}
                </text>
            )}
        </svg>
    );
}
