import MathHexMascot from '../MathHexMascot';
import {
    getAvatarColor,
    getRankEmoji,
    getRankTitle,
    STAGE_LABELS,
    xpForNextRank,
} from '../../utils/practiceProgress';
import {
    BOOSTER_LABEL,
    BOOSTER_XP_COST,
    comboMultiplier,
    gearFromRank,
    getFlavorTitle,
    type BoosterKind,
    type JuiceBoosters,
} from '../../utils/gameJuice';
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
    isTopicMix?: boolean;
    isBlitzMode?: boolean;
    isBoss?: boolean;
    isErettsegiMode: boolean;
    isWorksheetMode: boolean;
    pathLesson: number | null | undefined;
    sessionXp: number;
    mascotMood: MascotMood;
    badgeToast: string | null | undefined;
    avatarLevel: number;
    currentStage: Question['stage'] | undefined;
    juiceBoosters?: JuiceBoosters;
    secondChanceArmed?: boolean;
    onUseBooster?: (kind: BoosterKind) => void;
    comboEarlier?: boolean;
    extraLives?: number;
    hideTaskIndex?: boolean;
    challengeTitle?: string;
    hideBoosters?: boolean;
    maxLives?: number;
    pathStageLabel?: string | null;
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
    isTopicMix,
    isBlitzMode,
    isBoss,
    isErettsegiMode,
    isWorksheetMode,
    pathLesson,
    sessionXp,
    mascotMood,
    badgeToast,
    avatarLevel,
    currentStage,
    juiceBoosters,
    secondChanceArmed,
    onUseBooster,
    comboEarlier,
    extraLives = 0,
    hideTaskIndex,
    challengeTitle,
    hideBoosters,
    maxLives,
    pathStageLabel,
}: GamePlayHudProps) {
    const mult = comboMultiplier(correctStreak, comboEarlier);
    const heartMax = maxLives || ((isSprintMode ? 2 : 3) + extraLives);
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
                {!hideTaskIndex && (
                    <div className="hud-item">
                        <span className="hud-label">Feladat:</span>
                        <span className="hud-value">{currentQuestion + 1}/{questionsLength}</span>
                    </div>
                )}
                {(isPathMode || isSprintMode || isDailyMode || isBlitzMode) && (
                    <div className="hud-item">
                        <span className="hud-label">Élet:</span>
                        <span className="hud-value" style={{ letterSpacing: '0.08em' }}>
                            {'❤️'.repeat(Math.max(0, lives))}
                            {'🖤'.repeat(Math.max(0, heartMax - lives))}
                        </span>
                    </div>
                )}
                {correctStreak > 0 && (
                    <div className={`hud-item hud-combo ${mult > 1 ? 'hot' : ''}`}>
                        <span className="hud-label">Combo:</span>
                        <span className="hud-value">🔥 {correctStreak} ×{mult}</span>
                    </div>
                )}
                {isBoss && (
                    <div className="hud-item hud-boss">
                        <span className="hud-label">Mód:</span>
                        <span className="hud-value">👹 Főnök</span>
                    </div>
                )}
                {(isSprintMode || isBlitzMode) && (
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
                        <span className="hud-value">Ismétlés</span>
                    </div>
                )}
                {isTopicMix && (
                    <div className="hud-item">
                        <span className="hud-label">Mód:</span>
                        <span className="hud-value">Vegyes</span>
                    </div>
                )}
                {isBlitzMode && (
                    <div className="hud-item">
                        <span className="hud-label">Mód:</span>
                        <span className="hud-value">Villám</span>
                    </div>
                )}
                {challengeTitle && (
                    <div className="hud-item hud-boss">
                        <span className="hud-label">Kihívás:</span>
                        <span className="hud-value">{challengeTitle}</span>
                    </div>
                )}
            </div>

            {onUseBooster && juiceBoosters && !hideBoosters && (
                <div className="hud-boosters">
                    {(['fiftyFifty', 'secondChance', 'freeze'] as BoosterKind[]).map((kind) => (
                        <button
                            key={kind}
                            type="button"
                            className={`hud-booster ${kind === 'secondChance' && secondChanceArmed ? 'armed' : ''}`}
                            onClick={() => onUseBooster(kind)}
                        >
                            <span>{BOOSTER_LABEL[kind]}</span>
                            <small>
                                {juiceBoosters[kind] > 0
                                    ? `×${juiceBoosters[kind]}`
                                    : `${BOOSTER_XP_COST[kind]} XP`}
                            </small>
                        </button>
                    ))}
                </div>
            )}

            <div className={`game-mascot-react mood-${mascotMood}`} aria-hidden="true">
                <MathHexMascot
                    size={72}
                    color="#58cc02"
                    mood={mascotMood}
                    gear={gearFromRank(avatarLevel)}
                />
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
                        ? `Lecke ${pathLesson}/6 · ${pathStageLabel || STAGE_LABELS[currentStage]}`
                        : isTopicMix
                          ? `Vegyes gyakorlás · ${STAGE_LABELS[currentStage]}`
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
                    <div className="legend-text">{getFlavorTitle(avatarLevel)}</div>
                    <div className="legend-badge">
                        {(() => {
                            const r = xpForNextRank(totalXp);
                            const span = Math.max(1, r.next - r.current);
                            const pct = Math.min(100, Math.round(((totalXp - r.current) / span) * 100));
                            return `${getRankTitle(avatarLevel)} · ${getFlavorTitle(avatarLevel)} · ${totalXp} XP (${pct}%)`;
                        })()}
                    </div>
                </div>
            </div>
        </>
    );
}
