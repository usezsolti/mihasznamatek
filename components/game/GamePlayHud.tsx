import MathHexMascot from '../MathHexMascot';
import {
    getAvatarColor,
    getRankEmoji,
    getRankTitle,
    STAGE_LABELS,
    xpForNextRank,
} from '../../utils/practiceProgress';
import type { MascotMood } from '../../utils/gameFeedback';
import type { Question } from '../../utils/game';

export type GamePlayHudProps = {
    score: number;
    totalXp: number;
    currentQuestion: number;
    questionsLength: number;
    lives: number;
    correctStreak: number;
    sprintLeft: number;
    isPathMode: boolean;
    isSprintMode: boolean;
    isDailyMode: boolean;
    isErettsegiMode: boolean;
    isWorksheetMode: boolean;
    pathLesson: number | null | undefined;
    sessionXp: number;
    mascotMood: MascotMood;
    badgeToast: string | null | undefined;
    avatarLevel: number;
    currentStage: Question['stage'] | undefined;
};

export default function GamePlayHud({
    score,
    totalXp,
    currentQuestion,
    questionsLength,
    lives,
    correctStreak,
    sprintLeft,
    isPathMode,
    isSprintMode,
    isDailyMode,
    isErettsegiMode,
    isWorksheetMode,
    pathLesson,
    sessionXp,
    mascotMood,
    badgeToast,
    avatarLevel,
    currentStage,
}: GamePlayHudProps) {
    return (
        <>
            {isErettsegiMode && (
                <div style={{
                    textAlign: 'center',
                    marginBottom: '1rem',
                    color: '#39ff14',
                    fontSize: '1.2rem',
                    fontWeight: '600'
                }}>
                    📚 Érettségi Felkészülés
                </div>
            )}
            <div className="hud">
                <div className="hud-item">
                    <span className="hud-label">Pontszám:</span>
                    <span className="hud-value">{score}</span>
                </div>
                <div className="hud-item">
                    <span className="hud-label">XP:</span>
                    <span className="hud-value">{totalXp}</span>
                </div>
                <div className="hud-item">
                    <span className="hud-label">Feladat:</span>
                    <span className="hud-value">{currentQuestion + 1}/{questionsLength}</span>
                </div>
                {(isPathMode || isSprintMode || isDailyMode) && (
                    <div className="hud-item">
                        <span className="hud-label">Élet:</span>
                        <span className="hud-value" style={{ letterSpacing: '0.08em' }}>
                            {'❤️'.repeat(Math.max(0, lives))}
                            {'🖤'.repeat(Math.max(0, (isSprintMode ? 2 : 3) - lives))}
                        </span>
                    </div>
                )}
                {correctStreak > 0 && (
                    <div className="hud-item">
                        <span className="hud-label">Streak:</span>
                        <span className="hud-value">🔥 {correctStreak}</span>
                    </div>
                )}
                {isSprintMode && (
                    <div className="hud-item">
                        <span className="hud-label">Idő:</span>
                        <span
                            className="hud-value"
                            style={{ color: sprintLeft <= 15 ? '#ff6b6b' : '#39ff14' }}
                        >
                            {sprintLeft}s
                        </span>
                    </div>
                )}
                {isDailyMode && (
                    <div className="hud-item">
                        <span className="hud-label">Mód:</span>
                        <span className="hud-value">Napi</span>
                    </div>
                )}
            </div>

            <div className={`game-mascot-react mood-${mascotMood}`} aria-hidden="true">
                <MathHexMascot size={72} color="#58cc02" mood={mascotMood} />
            </div>

            {isWorksheetMode && currentStage && (
                <div style={{
                    textAlign: 'center',
                    marginBottom: '0.75rem',
                    color: '#ffd700',
                    fontSize: '1rem',
                    fontWeight: 600
                }}>
                    {isPathMode && pathLesson
                        ? `Lecke ${pathLesson}/6 · ${STAGE_LABELS[currentStage]}`
                        : `Szint ${currentStage}/6 · ${STAGE_LABELS[currentStage]}`}
                    {sessionXp > 0 ? ` · +${sessionXp} XP ebben a futásban` : ''}
                </div>
            )}

            {badgeToast && (
                <div style={{
                    textAlign: 'center',
                    marginBottom: '0.75rem',
                    padding: '0.6rem 1rem',
                    background: 'rgba(255, 215, 0, 0.15)',
                    border: '1px solid #ffd700',
                    borderRadius: '12px',
                    color: '#ffd700',
                    fontWeight: 700
                }}>
                    {badgeToast}
                </div>
            )}

            <div className="avatar-container">
                <div
                    className="avatar"
                    style={{ background: getAvatarColor(avatarLevel) }}
                >
                    {getRankEmoji(avatarLevel)}
                </div>
                <div className="avatar-info">
                    <div className="legend-text">{getRankTitle(avatarLevel)}</div>
                    <div className="legend-badge">
                        {(() => {
                            const r = xpForNextRank(totalXp);
                            const span = Math.max(1, r.next - r.current);
                            const pct = Math.min(100, Math.round(((totalXp - r.current) / span) * 100));
                            return `${getRankTitle(avatarLevel)} · ${totalXp} XP (${pct}%)`;
                        })()}
                    </div>
                </div>
            </div>
        </>
    );
}
