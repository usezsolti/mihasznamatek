type SuccessSpeedometerProps = {
    percent: number;
    color?: string;
    label?: string;
    sublabel?: string;
    compact?: boolean;
};

export default function SuccessSpeedometer({
    percent,
    color = '#39ff14',
    label,
    sublabel,
    compact = false,
}: SuccessSpeedometerProps) {
    const pct = Math.max(0, Math.min(100, Number.isFinite(percent) ? percent : 0));
    const arc = Math.PI * 80;

    return (
        <div className={`speedometer-container${compact ? ' speedometer-container--compact' : ''}`}>
            <div className="performance-header" style={{ color }}>
                {Math.round(pct)}%
            </div>
            <div className="speedometer">
                <svg className="speedometer-gauge" viewBox="0 0 200 120">
                    <path
                        className="gauge-background"
                        d="M 20 100 A 80 80 0 0 1 180 100"
                        fill="none"
                        stroke="#e0e0e0"
                        strokeWidth="12"
                    />
                    <path
                        className="gauge-progress"
                        d="M 20 100 A 80 80 0 0 1 180 100"
                        fill="none"
                        stroke={color}
                        strokeWidth="12"
                        strokeLinecap="round"
                        style={{
                            strokeDasharray: `${arc}`,
                            strokeDashoffset: `${arc * (1 - pct / 100)}`,
                            filter: `drop-shadow(0 0 8px ${color})`,
                        }}
                    />
                    {[0, 25, 50, 75, 100].map((value) => {
                        const angle = (value / 100) * Math.PI - Math.PI;
                        const x1 = 100 + 70 * Math.cos(angle);
                        const y1 = 100 + 70 * Math.sin(angle);
                        const x2 = 100 + 80 * Math.cos(angle);
                        const y2 = 100 + 80 * Math.sin(angle);
                        return (
                            <g key={value}>
                                <line
                                    className="gauge-tick"
                                    x1={x1}
                                    y1={y1}
                                    x2={x2}
                                    y2={y2}
                                    stroke="#666"
                                    strokeWidth="2"
                                />
                                <text
                                    className="gauge-label"
                                    x={100 + 60 * Math.cos(angle)}
                                    y={100 + 60 * Math.sin(angle) + 5}
                                    textAnchor="middle"
                                    fontSize="10"
                                    fill="#666"
                                >
                                    {value}
                                </text>
                            </g>
                        );
                    })}
                    <g className="gauge-needle">
                        <line
                            x1="100"
                            y1="100"
                            x2="100"
                            y2="35"
                            stroke={color}
                            strokeWidth="4"
                            strokeLinecap="round"
                            style={{
                                transform: `rotate(${(pct / 100) * 180 - 90}deg)`,
                                transformOrigin: '100px 100px',
                                filter: `drop-shadow(0 0 6px ${color})`,
                            }}
                        />
                        <circle
                            cx="100"
                            cy="100"
                            r="6"
                            fill={color}
                            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
                        />
                    </g>
                </svg>
                {(label || sublabel) && (
                    <div className="speedometer-display">
                        {label ? <div className="progress-percentage">{label}</div> : null}
                        {sublabel ? (
                            <div className="progress-percentage" style={{ marginTop: '0.25rem', fontSize: '0.82rem' }}>
                                {sublabel}
                            </div>
                        ) : null}
                    </div>
                )}
            </div>
        </div>
    );
}

export function speedometerColor(percent: number): string {
    if (percent >= 80) return '#39ff14';
    if (percent >= 50) return '#ffd700';
    return '#ff69b4';
}
