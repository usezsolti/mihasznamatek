import type { ReactNode } from 'react';

/** Lecke-node matematikai alakzat ikon (csillag helyett). */

type Props = {
    lesson: number;
    locked?: boolean;
    done?: boolean;
    current?: boolean;
    size?: number;
};

export default function MathNodeIcon({
    lesson,
    locked = false,
    done = false,
    current = false,
    size = 34,
}: Props) {
    const stroke = locked
        ? 'rgba(255,255,255,0.28)'
        : done
          ? '#1a1200'
          : current
            ? '#ffffff'
            : 'rgba(255,255,255,0.88)';
    const fill = done
        ? 'rgba(26,18,0,0.35)'
        : current
          ? 'rgba(255,255,255,0.22)'
          : 'none';
    const sw = locked ? 2 : 2.6;

    const common = {
        fill,
        stroke,
        strokeWidth: sw,
        strokeLinejoin: 'round' as const,
        strokeLinecap: 'round' as const,
    };

    let shape: ReactNode;
    switch (lesson) {
        case 1:
            shape = <polygon points="18,4 32,30 4,30" {...common} />;
            break;
        case 2:
            shape = <rect x="6" y="6" width="24" height="24" rx="2" {...common} />;
            break;
        case 3:
            shape = <circle cx="18" cy="18" r="12" {...common} />;
            break;
        case 4:
            shape = <polygon points="18,3 33,18 18,33 3,18" {...common} />;
            break;
        case 5:
            shape = <polygon points="18,3 30,10 30,26 18,33 6,26 6,10" {...common} />;
            break;
        case 6:
            shape = (
                <text
                    x="18"
                    y="24"
                    textAnchor="middle"
                    fontSize="22"
                    fontWeight="800"
                    fill={stroke}
                    fontFamily="Montserrat, Georgia, serif"
                >
                    Σ
                </text>
            );
            break;
        default:
            shape = (
                <text
                    x="18"
                    y="24"
                    textAnchor="middle"
                    fontSize="20"
                    fontWeight="800"
                    fill={stroke}
                    fontFamily="Montserrat, Georgia, serif"
                >
                    π
                </text>
            );
    }

    return (
        <svg width={size} height={size} viewBox="0 0 36 36" aria-hidden>
            {shape}
        </svg>
    );
}
