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

interface Props {
    topicId: string;
    topicTitle: string;
    topicIcon: string;
    topicColor: string;
    level: 'kozep' | 'emelt';
    onBack: () => void;
}

export default function TopicPathMap({
    topicId,
    topicTitle,
    topicIcon,
    topicColor,
    level,
    onBack,
}: Props) {
    const router = useRouter();
    const [progress, setProgress] = useState<UserPracticeProgress | null>(null);
    const [toast, setToast] = useState<string | null>(null);
    const [claiming, setClaiming] = useState(false);
    const [loggedInEmail, setLoggedInEmail] = useState<string | null>(null);
    const [testLoading, setTestLoading] = useState(false);
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
            router.push('/dashboard?tab=profil');
        } catch (e: any) {
            console.error(e);
            showToast(formatAuthError(e));
        } finally {
            setTestLoading(false);
        }
    };

    const startLesson = (lesson: number) => {
        if (!isLessonUnlocked(lesson, highestUnlocked, lessonsCompleted)) return;
        router.push(
            `/game?erettsegi=true&topic=${encodeURIComponent(topicId)}&level=${level}&node=${lesson}&path=1`
        );
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

    const renderNode = (node: PathNode, index: number) => {
        const zigLeft = index % 2 === 0;
        const side = zigLeft ? 'left' : 'right';

        if (node.kind === 'lesson') {
            const done = lessonsCompleted.includes(node.lesson);
            const unlocked = isLessonUnlocked(node.lesson, highestUnlocked, lessonsCompleted);
            const current = node.lesson === continueLesson && !done;
            const allDone = lessonsCompleted.length >= PATH_LESSON_COUNT;
            const showMascot = current || (allDone && node.lesson === PATH_LESSON_COUNT);

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
                                              ? 'linear-gradient(180deg,#ffd700,#e6a800)'
                                              : `linear-gradient(180deg, ${topicColor}, #1f9a0d)`,
                                          boxShadow: current
                                              ? `0 8px 0 #14660a, 0 0 28px ${topicColor}88`
                                              : '0 8px 0 #a67c00',
                                      }
                                    : undefined
                            }
                            disabled={!unlocked}
                            onClick={() => startLesson(node.lesson)}
                            aria-label={node.label}
                        >
                            <span className="duo-glyph">
                                {done ? '★' : unlocked ? (current ? '★' : String(node.lesson)) : '★'}
                            </span>
                        </button>
                        <span className={`duo-caption ${unlocked ? '' : 'muted'}`}>
                            {done ? `Lecke ${node.lesson} · Kész` : node.label}
                        </span>
                    </div>

                    {showMascot && (
                        <div className={`duo-mascot ${side === 'left' ? 'mascot-right' : 'mascot-left'}`}>
                            <img
                                src="/mihaszna-mascot.png"
                                alt="Mihaszna"
                                width={120}
                                height={120}
                                onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src = '/mihaszna-mascot.svg';
                                }}
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
                    <span className="chest-icon">{claimed ? '📦' : '🎁'}</span>
                    <span className="chest-label">
                        {claimed ? 'Begyűjtve' : unlocked ? `+${node.xp} XP` : 'Zárva'}
                    </span>
                </button>
            </div>
        );
    };

    return (
        <div className="topic-path duo-path">
            <div className="path-top">
                <button type="button" className="path-back" onClick={onBack}>
                    ← Témakörök
                </button>
                <div className="path-heading">
                    <span className="path-topic-icon" style={{ color: topicColor }}>
                        {topicIcon}
                    </span>
                    <div>
                        <h2>{topicTitle}</h2>
                        <p>
                            {doneCount}/{PATH_LESSON_COUNT} lecke · {PATH_TOTAL_QUESTIONS} feladat az úton
                        </p>
                    </div>
                </div>
                <div className="path-xp">
                    <div className="path-xp-labels">
                        <span>
                            {getRankEmoji(progress?.rankLevel || 1)} {progress?.rank || 'BEGINNER'} ·{' '}
                            {progress?.xp || 0} XP
                        </span>
                        <span>Következő: {rankInfo.next} XP</span>
                    </div>
                    <div className="path-xp-bar">
                        <div className="path-xp-fill" style={{ width: `${xpPct}%`, background: topicColor }} />
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
            </div>

            <div className="duo-track">
                <div className="duo-rail" aria-hidden />
                {nodes.map((n, i) => renderNode(n, i))}
            </div>

            {toast && <div className="path-toast">{toast}</div>}

            <style jsx>{`
                .duo-path {
                    max-width: 420px;
                    margin: 0 auto;
                    padding: 0.5rem 0.75rem 3.5rem;
                }
                .path-back {
                    background: transparent;
                    border: 1px solid rgba(255, 255, 255, 0.25);
                    color: #ccc;
                    border-radius: 999px;
                    padding: 0.4rem 0.9rem;
                    cursor: pointer;
                    margin-bottom: 1rem;
                }
                .path-heading {
                    display: flex;
                    gap: 0.85rem;
                    align-items: center;
                    margin-bottom: 1rem;
                }
                .path-topic-icon {
                    font-size: 2.2rem;
                }
                .path-heading h2 {
                    margin: 0;
                    color: #fff;
                    font-size: 1.45rem;
                }
                .path-heading p {
                    margin: 0.25rem 0 0;
                    color: #9f9;
                    font-size: 0.9rem;
                }
                .path-xp {
                    margin-bottom: 0.75rem;
                }
                .path-xp-labels {
                    display: flex;
                    justify-content: space-between;
                    color: #ddd;
                    font-size: 0.85rem;
                    margin-bottom: 0.35rem;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                }
                .path-xp-bar {
                    height: 10px;
                    background: rgba(255, 255, 255, 0.12);
                    border-radius: 999px;
                    overflow: hidden;
                }
                .path-xp-fill {
                    height: 100%;
                    border-radius: 999px;
                    transition: width 0.35s ease;
                }
                .path-test-login {
                    margin-top: 0.75rem;
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
                    margin: 0.75rem 0 0;
                    color: #9f9;
                    font-size: 0.85rem;
                    text-align: center;
                }

                .duo-track {
                    position: relative;
                    margin-top: 1.25rem;
                    padding: 1.5rem 0 2rem;
                    min-height: 640px;
                }
                .duo-rail {
                    position: absolute;
                    left: 50%;
                    top: 24px;
                    bottom: 24px;
                    width: 18px;
                    margin-left: -9px;
                    border-radius: 999px;
                    background: linear-gradient(
                        180deg,
                        rgba(57, 255, 20, 0.35),
                        rgba(80, 80, 90, 0.55) 40%,
                        rgba(60, 60, 70, 0.65)
                    );
                    box-shadow: inset 0 0 0 3px rgba(0, 0, 0, 0.35);
                    z-index: 0;
                }
                .duo-row {
                    position: relative;
                    z-index: 1;
                    display: flex;
                    align-items: center;
                    min-height: 118px;
                    margin: 0.35rem 0;
                }
                .duo-left {
                    justify-content: flex-start;
                    padding-left: 12%;
                }
                .duo-right {
                    justify-content: flex-end;
                    padding-right: 12%;
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
                    top: -42px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #1c1c1e;
                    color: #39ff14;
                    border: none;
                    border-radius: 14px;
                    padding: 0.45rem 0.9rem;
                    font-weight: 900;
                    font-size: 0.85rem;
                    letter-spacing: 0.06em;
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
                    filter: grayscale(0.35);
                    opacity: 0.85;
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
                        filter: brightness(1.12);
                    }
                }
                .duo-glyph {
                    font-size: 2rem;
                    color: rgba(255, 255, 255, 0.92);
                    font-weight: 900;
                    text-shadow: 0 2px 0 rgba(0, 0, 0, 0.25);
                }
                .duo-node.locked .duo-glyph {
                    color: rgba(255, 255, 255, 0.28);
                }
                .duo-caption {
                    margin-top: 0.45rem;
                    font-size: 0.78rem;
                    color: #ddd;
                    text-align: center;
                    max-width: 120px;
                    line-height: 1.2;
                }
                .duo-caption.muted {
                    color: #777;
                }
                .duo-chest {
                    width: 72px;
                    height: 72px;
                    border-radius: 18px;
                    border: 3px solid rgba(255, 255, 255, 0.12);
                    background: #2a2a32;
                    color: #fff;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 0.15rem;
                    cursor: pointer;
                    box-shadow: 0 6px 0 #15151a;
                }
                .duo-chest.locked {
                    opacity: 0.55;
                    cursor: not-allowed;
                    filter: grayscale(0.6);
                }
                .duo-chest.unlocked:not(.claimed) {
                    border-color: #4da3ff;
                    background: linear-gradient(180deg, #3d6ea8, #2a4f7a);
                }
                .duo-chest.claimed {
                    border-color: #ffd700;
                    background: linear-gradient(180deg, #5a4a12, #3a2f0a);
                }
                .chest-icon {
                    font-size: 1.6rem;
                }
                .chest-label {
                    font-size: 0.65rem;
                    font-weight: 700;
                    letter-spacing: 0.02em;
                }
                .duo-mascot {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-42%);
                    width: 112px;
                    pointer-events: none;
                    filter: drop-shadow(0 10px 16px rgba(0, 0, 0, 0.45));
                    animation: mascotBob 2.4s ease-in-out infinite;
                }
                .mascot-right {
                    left: calc(50% + 56px);
                }
                .mascot-left {
                    right: calc(50% + 56px);
                }
                .duo-mascot img {
                    width: 112px;
                    height: auto;
                    display: block;
                }
                @keyframes mascotBob {
                    0%,
                    100% {
                        transform: translateY(-42%);
                    }
                    50% {
                        transform: translateY(calc(-42% - 8px));
                    }
                }
                .path-toast {
                    position: fixed;
                    left: 50%;
                    bottom: 1.5rem;
                    transform: translateX(-50%);
                    background: rgba(20, 20, 20, 0.95);
                    border: 2px solid #ffd700;
                    color: #fff;
                    padding: 0.85rem 1.25rem;
                    border-radius: 16px;
                    z-index: 50;
                    font-weight: 600;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45);
                }
                @media (max-width: 420px) {
                    .duo-mascot {
                        width: 88px;
                    }
                    .duo-mascot img {
                        width: 88px;
                    }
                    .mascot-right {
                        left: calc(50% + 40px);
                    }
                    .mascot-left {
                        right: calc(50% + 40px);
                    }
                    .duo-node {
                        width: 70px;
                        height: 70px;
                    }
                }
            `}</style>
        </div>
    );
}
