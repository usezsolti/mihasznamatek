/** Matekos hexagon mascot — Duolingo-szerű út mellé, bagoly helyett. */

type Props = {
    size?: number;
    color?: string;
    mood?: 'idle' | 'happy' | 'sad';
    className?: string;
    gear?: 'none' | 'glasses' | 'hat' | 'cape' | 'crown';
};

export default function MathHexMascot({
    size = 112,
    color = '#58cc02',
    mood = 'idle',
    className = '',
    gear = 'none',
}: Props) {
    const eyeY = mood === 'sad' ? 46 : 42;
    const mouth =
        mood === 'happy'
            ? 'M 38 58 Q 50 70 62 58'
            : mood === 'sad'
              ? 'M 38 64 Q 50 56 62 64'
              : 'M 40 60 Q 50 66 60 60';

    return (
        <div className={`math-hex-wrap mood-${mood} ${className}`.trim()} style={{ width: size, height: size }}>
            <svg
                width={size}
                height={size}
                viewBox="0 0 100 110"
                role="img"
                aria-label="Matek hexagon"
            >
                <ellipse cx="50" cy="102" rx="28" ry="6" fill="rgba(0,0,0,0.35)" />
                {(gear === 'cape' || gear === 'crown') && (
                    <polygon
                        points="18,38 8,88 50,78 92,88 82,38"
                        fill={gear === 'crown' ? '#7c3aed' : '#c41e3a'}
                        opacity="0.92"
                    />
                )}
                <polygon
                    points="50,8 88,30 88,70 50,92 12,70 12,30"
                    fill={color}
                    stroke="#2f6f00"
                    strokeWidth="3"
                />
                <polygon
                    points="50,14 80,32 80,66 50,84 20,66 20,32"
                    fill="rgba(255,255,255,0.18)"
                />
                <circle cx="38" cy={eyeY} r="7" fill="#111" />
                <circle cx="62" cy={eyeY} r="7" fill="#111" />
                <circle cx="40" cy={eyeY - 2} r="2.2" fill="#fff" />
                <circle cx="64" cy={eyeY - 2} r="2.2" fill="#fff" />
                <path d={mouth} fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round" />
                <text
                    x="50"
                    y="82"
                    textAnchor="middle"
                    fontSize="16"
                    fontWeight="800"
                    fill="#0a0a0a"
                    fontFamily="Montserrat, Arial, sans-serif"
                >
                    Σ
                </text>
                {(gear === 'glasses' || gear === 'hat' || gear === 'cape' || gear === 'crown') && (
                    <g>
                        <ellipse cx="38" cy={eyeY} rx="10" ry="7" fill="none" stroke="#111" strokeWidth="2.2" />
                        <ellipse cx="62" cy={eyeY} rx="10" ry="7" fill="none" stroke="#111" strokeWidth="2.2" />
                        <path d={`M 48 ${eyeY} H 52`} stroke="#111" strokeWidth="2.2" />
                    </g>
                )}
                {(gear === 'hat' || gear === 'cape' || gear === 'crown') && (
                    <g>
                        <rect x="22" y="10" width="56" height="8" rx="2" fill="#1e3a8a" />
                        <path d="M 30 10 L 50 0 L 70 10 Z" fill="#2563eb" />
                    </g>
                )}
                {gear === 'crown' && (
                    <g>
                        <polygon points="24,14 32,2 40,14 50,4 60,14 68,2 76,14 24,14" fill="#ffd400" stroke="#b45309" strokeWidth="1.2" />
                        <circle cx="32" cy="5" r="2" fill="#ef4444" />
                        <circle cx="50" cy="6" r="2" fill="#3b82f6" />
                        <circle cx="68" cy="5" r="2" fill="#22c55e" />
                    </g>
                )}
            </svg>
            <style jsx>{`
                .math-hex-wrap {
                    display: inline-block;
                    line-height: 0;
                    transform-origin: 50% 90%;
                }
                .math-hex-wrap.mood-idle {
                    animation: hexBob 2.4s ease-in-out infinite;
                }
                .math-hex-wrap.mood-happy {
                    animation: hexPop 0.45s ease;
                }
                .math-hex-wrap.mood-sad {
                    transform: rotate(-4deg) scale(0.96);
                }
                @keyframes hexBob {
                    0%,
                    100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-6px);
                    }
                }
                @keyframes hexPop {
                    0% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.08);
                    }
                    100% {
                        transform: scale(1);
                    }
                }
            `}</style>
        </div>
    );
}
