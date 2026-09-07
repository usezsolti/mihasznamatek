import { useMemo } from 'react';
import MathHexMascot from '../MathHexMascot';
import { agentDebugLog } from '../../utils/agentDebugLog';

const COLORS = ['#58cc02', '#ffd400', '#ff4d9a', '#3aa0ff', '#fff', '#ff8a00'];

const TITLES = ['HELYES!', 'SZÉP MUNKA!', 'ÜGYES!', 'BRÁVÓ!', 'MEGVAN!'];

type Props = {
    open: boolean;
    streak: number;
    levelUp?: boolean;
    multiplier?: number;
    xpGained?: number;
    isBoss?: boolean;
    broken?: boolean;
    gear?: 'none' | 'glasses' | 'hat' | 'cape' | 'crown';
    onContinue: () => void;
};

export default function GameCelebrate({
    open,
    streak,
    levelUp,
    multiplier = 1,
    xpGained = 10,
    isBoss,
    broken,
    gear = 'none',
    onContinue,
}: Props) {
    const bits = useMemo(() => {
        if (!open) return [];
        return Array.from({ length: 46 }, (_, i) => ({
            left: `${(i * 19 + 7) % 100}%`,
            delay: `${(i % 14) * 0.04}s`,
            color: COLORS[i % COLORS.length],
            rot: (i * 41) % 360,
            dur: `${1.55 + (i % 6) * 0.12}s`,
            w: 8 + (i % 5) * 2,
        }));
    }, [open]);

    if (!open) return null;

    const title = broken
        ? 'SOROZAT TÖRVE'
        : levelUp
          ? 'SZINT FEL!'
          : isBoss
            ? 'FŐNÖK LEVERVE!'
          : streak >= 5
            ? `${streak}-ES SOROZAT!`
            : TITLES[streak % TITLES.length];

    // #region agent log
    agentDebugLog({
        hypothesisId: 'C',
        location: 'GameCelebrate.tsx:render',
        message: 'celebrate overlay shown',
        data: { streak, levelUp: !!levelUp, title, multiplier, isBoss: !!isBoss, broken: !!broken },
        runId: 'celebrate',
    });
    // #endregion

    return (
        <button type="button" className={`mm-celebrate ${broken ? 'broken' : ''} ${isBoss ? 'boss' : ''} ${multiplier >= 3 ? 'hot' : ''}`} onClick={onContinue}>
            <div className="mm-celebrate-burst" aria-hidden />
            {bits.map((p, i) => (
                <span
                    key={i}
                    className="mm-celebrate-piece"
                    style={{
                        left: p.left,
                        animationDelay: p.delay,
                        animationDuration: p.dur,
                        background: p.color,
                        width: p.w,
                        height: p.w * 0.55,
                        transform: `rotate(${p.rot}deg)`,
                    }}
                />
            ))}
            <div className="mm-celebrate-card">
                <MathHexMascot size={120} color={broken ? '#ff4d6d' : '#58cc02'} mood={broken ? 'sad' : 'happy'} gear={gear} />
                <div className="mm-celebrate-title">{title}</div>
                {!broken && (
                    <div className="mm-celebrate-xp">+{xpGained} XP{multiplier > 1 ? ` · ×${multiplier}` : ''}</div>
                )}
                {!broken && streak > 1 && (
                    <div className="mm-celebrate-streak">🔥 {streak} egymás után{multiplier > 1 ? ` · ×${multiplier}` : ''}</div>
                )}
                {broken && (
                    <div className="mm-celebrate-streak">A combo nullázódott</div>
                )}
                <div className="mm-celebrate-hint">Koppints a folytatáshoz</div>
            </div>
        </button>
    );
}
