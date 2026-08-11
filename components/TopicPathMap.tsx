import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import {
    claimPathChest,
    getBadgeDef,
    getRankEmoji,
    loadUserPracticeProgress,
    resolveProgressStorageKey,
    xpForNextRank,
    type TopicProgress,
    type UserPracticeProgress,
} from '../utils/practiceProgress';
import {
    PATH_LESSON_COUNT,
    PATH_TOTAL_QUESTIONS,
    buildPathNodes,
    isChestUnlockable,
    isLessonUnlocked,
    type PathNode,
} from '../utils/topicPath';
import { formatAuthError, signInAsTestUser, TEST_LOGIN_EMAIL } from '../utils/testLogin';
import MathHexMascot from './MathHexMascot';

interface Props {
    topicId: string;
    topicTitle: string;
    topicIcon: string;
    topicColor: string;
    /** @deprecated use educationLevel + erettsegiLevel */
    level?: 'kozep' | 'emelt';
    educationLevel?: 'elementary' | 'highschool' | 'university' | 'erettsegi';
    erettsegiLevel?: 'kozep' | 'emelt';
    grade?: number;
    onBack: () => void;
}

export default function TopicPathMap({
    topicId,
    topicTitle,
    topicIcon,
    topicColor,
    level,
    educationLevel: educationLevelProp,
    erettsegiLevel: erettsegiLevelProp,
    grade,
    onBack,
}: Props) {
    const router = useRouter();
    const educationLevel = educationLevelProp || 'erettsegi';
    const erettsegiLevel = erettsegiLevelProp || level || 'emelt';
    const [progress, setProgress] = useState<UserPracticeProgress | null>(null);
    const [toast, setToast] = useState<string | null>(null);
    const [claiming, setClaiming] = useState(false);
    const [loggedInEmail, setLoggedInEmail] = useState<string | null>(null);
    const [testLoading, setTestLoading] = useState(false);
    const [sprintMode, setSprintMode] = useState(false);
    const nodes = useMemo(() => buildPathNodes(), []);

    const storageKey = resolveProgressStorageKey(topicId);
    const topicProg: TopicProgress | undefined = progress?.topics?.[storageKey];

    const lessonsCompleted = topicProg?.lessonsCompleted || [];
    const highestUnlocked = topicProg?.highestUnlocked || 1;
    const chestsClaimed = topicProg?.chestsClaimed || [];
    const doneCount = lessonsCompleted.length;

    const reload = useCallback(async () => {
        try {
            let attempts = 0;
            while (!(window as any).firebase?.auth && attempts < 20) {
                await new Promise((r) => setTimeout(r, 100));
                attempts++;
            }
            const user = (window as any).firebase?.auth?.()?.currentUser || null;
            const label = user
                ? (user.email || user.displayName || (user.isAnonymous ? 'Teszt vendég (anonim)' : 'Bejelentkezve'))
                : null;
            setLoggedInEmail(label);
            setProgress(await loadUserPracticeProgress(user?.uid || null));
        } catch (e) {
            console.error('Path progress load:', e);
            setLoggedInEmail(null);
            setProgress(await loadUserPracticeProgress(null));
        }
    }, []);

    useEffect(() => {
        reload();
        const auth = (window as any).firebase?.auth?.();
        if (!auth) return;
        const unsub = auth.onAuthStateChanged((user: any) => {
            const label = user
                ? (user.email || user.displayName || (user.isAnonymous ? 'Teszt vendég (anonim)' : 'Bejelentkezve'))
                : null;
            setLoggedInEmail(label);
            void reload();
        });
        return () => unsub?.();
    }, [reload, topicId]);

    const showToast = (msg: string) => {
        setToast(msg);
        window.setTimeout(() => setToast(null), 2800);
    };

    const handleTestLogin = async () => {
        setTestLoading(true);
        try {
            const result = await signInAsTestUser();
            showToast(`Bejelentkezve: ${result.email}`);
            await reload();
            router.push('/dashboard');
        } catch (e: any) {
            console.error(e);
            showToast(formatAuthError(e));
        } finally {
            setTestLoading(false);
        }
    };

    const startLesson = (lesson: number) => {
        if (!isLessonUnlocked(lesson, highestUnlocked, lessonsCompleted)) return;
        const params = new URLSearchParams({
            topic: topicId,
            node: String(lesson),
            path: '1',
        });
        if (sprintMode) params.set('sprint', '1');

        if (educationLevel === 'erettsegi') {
            params.set('erettsegi', 'true');
            params.set('level', erettsegiLevel);
        } else {
            params.set('educationLevel', educationLevel);
            if (grade != null) params.set('grade', String(grade));
            else if (educationLevel === 'elementary') params.set('grade', '5');
            else if (educationLevel === 'highschool') params.set('grade', '10');
        }
        router.push(`/game?${params.toString()}`);
    };

    const onChestClick = async (chest: 1 | 2 | 3) => {
        if (claiming) return;
        if (!isChestUnlockable(chest, lessonsCompleted)) {
            showToast('Előbb teljesítsd az előző leckéket!');
            return;
        }
        if (chestsClaimed.includes(chest)) {
            showToast('Ezt a kincset már begyűjtötted.');
            return;
        }
        const uid = (window as any).firebase?.auth?.()?.currentUser?.uid || null;
        setClaiming(true);
        try {
            const result = await claimPathChest(uid, topicId, chest);
            setProgress(result.next);
            if (result.alreadyClaimed) {
                showToast('Ezt a kincset már begyűjtötted.');
            } else {
                const badgeBits = result.newBadges
                    .map((b) => getBadgeDef(b)?.title)
                    .filter(Boolean)
                    .join(', ');
                showToast(
                    `🎁 +${result.xpGained} XP` + (badgeBits ? ` · ${badgeBits}` : '')
                );
            }
        } catch (e) {
            console.error(e);
            showToast('Nem sikerült a kincs begyűjtése.');
        } finally {
            setClaiming(false);
        }
    };

    const continueLesson = (() => {
        for (let i = 1; i <= PATH_LESSON_COUNT; i++) {
            if (!lessonsCompleted.includes(i) && isLessonUnlocked(i, highestUnlocked, lessonsCompleted)) {
                return i;
            }
        }
        return lessonsCompleted.includes(PATH_LESSON_COUNT) ? PATH_LESSON_COUNT : 1;
    })();

    const rankInfo = xpForNextRank(progress?.xp || 0);
    const xpPct = (() => {
        const span = Math.max(1, rankInfo.next - rankInfo.current);
        return Math.min(100, Math.round((((progress?.xp || 0) - rankInfo.current) / span) * 100));
    })();

    const accent = topicColor || '#58cc02';

    const renderNode = (node: PathNode, index: number) => {
        const zigLeft = index % 2 === 0;
        const side = zigLeft ? 'left' : 'right';

        if (node.kind === 'lesson') {
            const done = lessonsCompleted.includes(node.lesson);
            const unlocked = isLessonUnlocked(node.lesson, highestUnlocked, lessonsCompleted);
            const current = node.lesson === continueLesson && !done;
            const allDone = lessonsCompleted.length >= PATH_LESSON_COUNT;
            const showMascot = current || (allDone && node.lesson === PATH_LESSON_COUNT);
            const starCount = topicProg?.lessonStars?.[node.lesson] || 0;

            return (
                <div key={`L${node.lesson}`} className={`duo-row duo-${side}`}>
                    <div className={`duo-cluster ${current ? 'is-current' : ''}`}>
                        {current && (
                            <button
                                type="button"
                                className="duo-bubble"
                                onClick={() => startLesson(node.lesson)}
                            >
                                KEZDÉS
                            </button>
                        )}
                        <button
                            type="button"
                            className={`duo-node lesson ${done ? 'done' : ''} ${unlocked ? 'unlocked' : 'locked'} ${current ? 'current' : ''}`}
                            style={
                                current || done
                                    ? {
                                          background: done
                                              ? 'linear-gradient(180deg,#ffc800,#e0a800)'
                                              : `linear-gradient(180deg, ${accent}, #3d9e00)`,
                                          boxShadow: current
                                              ? `0 8px 0 #2f6f00, 0 0 0 5px #1f1f23`
                                              : '0 8px 0 #a67c00',
                                      }
                                    : undefined
                            }
                            disabled={!unlocked}
                            onClick={() => startLesson(node.lesson)}
                            aria-label={node.label}
                        >
                            <span className="duo-glyph">
                                {done
                                    ? '★'
                                    : unlocked
                                      ? current
                                          ? '★'
                                          : node.lesson === PATH_LESSON_COUNT
                                            ? '🏆'
                                            : String(node.lesson)
                                      : '★'}
                            </span>
                        </button>
                        <span className={`duo-caption ${unlocked ? '' : 'muted'}`}>
                            {done ? `Lecke ${node.lesson} · Kész` : node.label}
                        </span>
                        {(done || starCount > 0) && (
                            <span className="duo-lesson-stars" aria-label={`${starCount} csillag`}>
                                {'★'.repeat(starCount)}
                                {'☆'.repeat(Math.max(0, 3 - starCount))}
                            </span>
                        )}
                    </div>

                    {showMascot && (
                        <div className={`duo-mascot ${side === 'left' ? 'mascot-right' : 'mascot-left'}`}>
                            <MathHexMascot
                                size={120}
                                color={accent}
                                mood={done && allDone ? 'happy' : 'idle'}
                            />
                        </div>
                    )}
                </div>
            );
        }

        const unlocked = isChestUnlockable(node.chest, lessonsCompleted);
        const claimed = chestsClaimed.includes(node.chest);
        return (
            <div key={`C${node.chest}`} className={`duo-row duo-${side}`}>
                <button
                    type="button"
                    className={`duo-chest ${claimed ? 'claimed' : ''} ${unlocked ? 'unlocked' : 'locked'}`}
                    disabled={!unlocked || claimed || claiming}
                    onClick={() => onChestClick(node.chest)}
                    aria-label={node.label}
                >
                    <span className="chest-icon">{claimed ? '✓' : '🎁'}</span>
                    <span className="chest-label">
                        {claimed ? 'Kész' : unlocked ? `+${node.xp}` : 'Zárva'}
                    </span>
                </button>
            </div>
        );
    };

    return (
        <div className="topic-path duo-path">
            <div className="duo-module-bar" style={{ background: accent }}>
                <button type="button" className="duo-module-back" onClick={onBack} aria-label="Vissza">
                    ←
                </button>
                <div className="duo-module-text">
                    <div className="duo-module-kicker">
                        {topicIcon} · {doneCount}/{PATH_LESSON_COUNT} LECKE · {PATH_TOTAL_QUESTIONS} FELADAT
                    </div>
                    <div className="duo-module-title">{topicTitle}</div>
                </div>
                <label className={`duo-guide-btn ${sprintMode ? 'is-on' : ''}`}>
                    <input
                        type="checkbox"
                        checked={sprintMode}
                        onChange={(e) => setSprintMode(e.target.checked)}
                    />
                    <span>⏱ SPRINT</span>
                </label>
            </div>

            <div className="duo-xp-row">
                <div className="path-xp-labels">
                    <span>
                        {getRankEmoji(progress?.rankLevel || 1)} {progress?.rank || 'BEGINNER'} ·{' '}
                        {progress?.xp || 0} XP
                    </span>
                    <span>Következő: {rankInfo.next} XP</span>
                </div>
                <div className="path-xp-bar">
                    <div className="path-xp-fill" style={{ width: `${xpPct}%`, background: accent }} />
                </div>
            </div>

            {!loggedInEmail ? (
                <div className="path-test-login">
                    <p>Haladás mentéséhez: egy kattintásos teszt fiók ({TEST_LOGIN_EMAIL})</p>
                    <div className="path-test-actions">
                        <button
                            type="button"
                            disabled={testLoading}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                void handleTestLogin();
                            }}
                        >
                            {testLoading ? 'Belépés…' : 'Teszt belépés'}
                        </button>
                        <button
                            type="button"
                            className="secondary"
                            onClick={() => {
                                try {
                                    window.dispatchEvent(
                                        new CustomEvent('mihaszna:open-auth-modal', {
                                            detail: { mode: 'login', redirectTo: false },
                                        })
                                    );
                                } catch {
                                    /* ignore */
                                }
                            }}
                        >
                            Normál belépés
                        </button>
                    </div>
                </div>
            ) : (
                <p className="path-logged-in">Bejelentkezve: {loggedInEmail}</p>
            )}

            <div className="duo-track">
                <div className="duo-rail" aria-hidden />
                {nodes.map((n, i) => renderNode(n, i))}
            </div>

            {toast && <div className="path-toast">{toast}</div>}

            <style jsx>{`
                .duo-path {
                    max-width: 440px;
                    margin: 0 auto;
                    padding: 0.35rem 0.5rem 3.5rem;
                }
                .duo-module-bar {
                    display: flex;
                    align-items: center;
                    gap: 0.65rem;
                    border-radius: 18px;
                    padding: 0.85rem 0.9rem;
                    color: #fff;
                    box-shadow: 0 6px 0 rgba(0, 0, 0, 0.28);
                    margin-bottom: 1rem;
                }
                .duo-module-back {
                    width: 40px;
                    height: 40px;
                    border-radius: 12px;
                    border: none;
                    background: rgba(0, 0, 0, 0.18);
                    color: #fff;
                    font-size: 1.25rem;
                    font-weight: 800;
                    cursor: pointer;
                    flex-shrink: 0;
                }
                .duo-module-text {
                    flex: 1;
                    min-width: 0;
                }
                .duo-module-kicker {
                    font-size: 0.7rem;
                    font-weight: 800;
                    letter-spacing: 0.04em;
                    opacity: 0.95;
                    text-transform: uppercase;
                }
                .duo-module-title {
                    font-size: 1.15rem;
                    font-weight: 800;
                    line-height: 1.2;
                    margin-top: 0.15rem;
                }
                .duo-guide-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.35rem;
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 14px;
                    padding: 0.55rem 0.7rem;
                    font-size: 0.72rem;
                    font-weight: 900;
                    letter-spacing: 0.04em;
                    cursor: pointer;
                    flex-shrink: 0;
                    user-select: none;
                }
                .duo-guide-btn input {
                    display: none;
                }
                .duo-guide-btn.is-on {
                    background: #111;
                    color: #58cc02;
                    box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.2);
                }
                .duo-xp-row {
                    margin-bottom: 0.65rem;
                    padding: 0 0.15rem;
                }
                .path-xp-labels {
                    display: flex;
                    justify-content: space-between;
                    color: #bdbdbd;
                    font-size: 0.82rem;
                    margin-bottom: 0.35rem;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                }
                .path-xp-bar {
                    height: 10px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 999px;
                    overflow: hidden;
                }
                .path-xp-fill {
                    height: 100%;
                    border-radius: 999px;
                    transition: width 0.35s ease;
                }
                .path-test-login {
                    margin: 0.5rem 0 0.75rem;
                    padding: 0.85rem 1rem;
                    border-radius: 14px;
                    border: 1px dashed rgba(255, 215, 0, 0.55);
                    background: rgba(255, 215, 0, 0.08);
                }
                .path-test-login p {
                    margin: 0 0 0.65rem;
                    color: #eee;
                    font-size: 0.88rem;
                }
                .path-test-actions {
                    display: flex;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                }
                .path-test-login button {
                    flex: 1;
                    min-width: 120px;
                    border: none;
                    border-radius: 12px;
                    padding: 0.65rem 0.75rem;
                    font-weight: 700;
                    cursor: pointer;
                    background: #ffd700;
                    color: #111;
                }
                .path-test-login button.secondary {
                    background: transparent;
                    border: 1px solid rgba(255, 255, 255, 0.35);
                    color: #fff;
                }
                .path-logged-in {
                    margin: 0.35rem 0 0.5rem;
                    color: #8f8;
                    font-size: 0.8rem;
                    text-align: center;
                }
                .duo-track {
                    position: relative;
                    margin-top: 0.75rem;
                    padding: 1.25rem 0 2rem;
                    min-height: 640px;
                    background: radial-gradient(ellipse at 50% 0%, rgba(88, 204, 2, 0.08), transparent 55%);
                }
                .duo-rail {
                    position: absolute;
                    left: 50%;
                    top: 28px;
                    bottom: 28px;
                    width: 14px;
                    margin-left: -7px;
                    border-radius: 999px;
                    background: #2b2b2f;
                    box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.45);
                    z-index: 0;
                }
                .duo-row {
                    position: relative;
                    z-index: 1;
                    display: flex;
                    align-items: center;
                    min-height: 118px;
                    margin: 0.2rem 0;
                }
                .duo-left {
                    justify-content: flex-start;
                    padding-left: 14%;
                }
                .duo-right {
                    justify-content: flex-end;
                    padding-right: 14%;
                }
                .duo-cluster {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 110px;
                }
                .duo-bubble {
                    position: absolute;
                    top: -44px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #1c1c1e;
                    color: #58cc02;
                    border: none;
                    border-radius: 14px;
                    padding: 0.5rem 1rem;
                    font-weight: 900;
                    font-size: 0.9rem;
                    letter-spacing: 0.08em;
                    cursor: pointer;
                    box-shadow: 0 6px 0 #0a0a0a;
                    animation: duoPulse 1.6s ease-in-out infinite;
                    z-index: 3;
                }
                .duo-bubble::after {
                    content: '';
                    position: absolute;
                    left: 50%;
                    bottom: -8px;
                    margin-left: -7px;
                    border: 7px solid transparent;
                    border-top-color: #1c1c1e;
                }
                @keyframes duoPulse {
                    0%,
                    100% {
                        transform: translateX(-50%) translateY(0);
                    }
                    50% {
                        transform: translateX(-50%) translateY(-4px);
                    }
                }
                .duo-node {
                    width: 78px;
                    height: 78px;
                    border-radius: 50%;
                    border: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    background: linear-gradient(180deg, #4a4a52, #2e2e34);
                    box-shadow: 0 8px 0 #1a1a1e;
                    transition: transform 0.15s ease;
                }
                .duo-node.locked {
                    cursor: not-allowed;
                    background: linear-gradient(180deg, #3a3a40, #26262c);
                    box-shadow: 0 8px 0 #151518;
                }
                .duo-node.unlocked:not(:disabled):active {
                    transform: translateY(4px);
                    box-shadow: 0 4px 0 #14660a;
                }
                .duo-node.current {
                    animation: duoGlow 2s ease-in-out infinite;
                }
                @keyframes duoGlow {
                    0%,
                    100% {
                        filter: brightness(1);
                    }
                    50% {
                        filter: brightness(1.1);
                    }
                }
                .duo-glyph {
                    font-size: 2rem;
                    color: rgba(255, 255, 255, 0.92);
                    font-weight: 900;
                    text-shadow: 0 2px 0 rgba(0, 0, 0, 0.25);
                }
                .duo-node.locked .duo-glyph {
                    color: rgba(255, 255, 255, 0.22);
                }
                .duo-caption {
                    margin-top: 0.45rem;
                    font-size: 0.78rem;
                    color: #cfcfcf;
                    text-align: center;
                    max-width: 120px;
                    line-height: 1.2;
                }
                .duo-caption.muted {
                    color: #666;
                }
                .duo-lesson-stars {
                    display: block;
                    margin-top: 0.2rem;
                    font-size: 0.85rem;
                    letter-spacing: 0.08em;
                    color: #ffc800;
                }
                .duo-chest {
                    width: 72px;
                    height: 72px;
                    border-radius: 50%;
                    border: 0;
                    background: linear-gradient(180deg, #4a4a52, #2e2e34);
                    color: #fff;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 0.1rem;
                    cursor: pointer;
                    box-shadow: 0 8px 0 #1a1a1e;
                }
                .duo-chest.locked {
                    opacity: 0.75;
                    cursor: not-allowed;
                }
                .duo-chest.unlocked:not(.claimed) {
                    background: linear-gradient(180deg, #4da3ff, #2a6fb8);
                    box-shadow: 0 8px 0 #1a4a7a;
                }
                .duo-chest.claimed {
                    background: linear-gradient(180deg, #ffc800, #d4a000);
                    box-shadow: 0 8px 0 #8a6a00;
                    color: #111;
                }
                .chest-icon {
                    font-size: 1.55rem;
                    line-height: 1;
                }
                .chest-label {
                    font-size: 0.62rem;
                    font-weight: 800;
                }
                .duo-mascot {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-42%);
                    width: 120px;
                    pointer-events: none;
                    filter: drop-shadow(0 12px 14px rgba(0, 0, 0, 0.45));
                }
                .mascot-right {
                    left: calc(50% + 52px);
                }
                .mascot-left {
                    right: calc(50% + 52px);
                }
                .path-toast {
                    position: fixed;
                    left: 50%;
                    bottom: 1.5rem;
                    transform: translateX(-50%);
                    background: rgba(20, 20, 20, 0.95);
                    border: 2px solid #58cc02;
                    color: #fff;
                    padding: 0.85rem 1.25rem;
                    border-radius: 16px;
                    z-index: 50;
                    font-weight: 600;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45);
                }
                @media (max-width: 420px) {
                    .duo-mascot {
                        width: 92px;
                    }
                    .mascot-right {
                        left: calc(50% + 36px);
                    }
                    .mascot-left {
                        right: calc(50% + 36px);
                    }
                    .duo-node {
                        width: 70px;
                        height: 70px;
                    }
                    .duo-module-title {
                        font-size: 1rem;
                    }
                }
            `}</style>
        </div>
    );
}
