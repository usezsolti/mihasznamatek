import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react';
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
    buildWindingLayout,
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
    const winding = useMemo(() => buildWindingLayout(nodes.length), [nodes.length]);

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
    const allDone = lessonsCompleted.length >= PATH_LESSON_COUNT;

    const renderPlacedNode = (node: PathNode, index: number) => {
        const pt = winding.points[index];
        if (!pt) return null;

        // Inline absolute — must sit ON the curve even if CSS classes fail
        const placeStyle: CSSProperties = {
            position: 'absolute',
            left: `${pt.x}%`,
            top: `${pt.y}%`,
            zIndex: 2,
        };

        if (node.kind === 'lesson') {
            const done = lessonsCompleted.includes(node.lesson);
            const unlocked = isLessonUnlocked(node.lesson, highestUnlocked, lessonsCompleted);
            const current = node.lesson === continueLesson && !done;
            const showMascot = current || (allDone && node.lesson === PATH_LESSON_COUNT);
            const starCount = topicProg?.lessonStars?.[node.lesson] || 0;

            return (
                <div key={`L${node.lesson}`} className="mm-path-node" style={placeStyle}>
                    <div className="mm-path-cluster">
                        {current && (
                            <button
                                type="button"
                                className="mm-path-bubble"
                                onClick={() => startLesson(node.lesson)}
                            >
                                KEZDÉS
                            </button>
                        )}
                        <button
                            type="button"
                            className={`mm-path-btn ${done ? 'done' : ''} ${unlocked ? 'unlocked' : 'locked'} ${current ? 'current' : ''}`}
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
                            <span className="mm-path-glyph">
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
                        <span className={`mm-path-caption ${unlocked ? '' : 'muted'}`}>
                            {done ? `Lecke ${node.lesson} · Kész` : node.label}
                        </span>
                        {(done || starCount > 0) && (
                            <span className="mm-path-stars" aria-label={`${starCount} csillag`}>
                                {'★'.repeat(starCount)}
                                {'☆'.repeat(Math.max(0, 3 - starCount))}
                            </span>
                        )}

                        {showMascot && (
                            <div
                                className={`mm-path-mascot ${pt.side === 'left' ? 'on-right' : 'on-left'}`}
                            >
                                <MathHexMascot
                                    size={108}
                                    color={accent}
                                    mood={done && allDone ? 'happy' : 'idle'}
                                />
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        const unlocked = isChestUnlockable(node.chest, lessonsCompleted);
        const claimed = chestsClaimed.includes(node.chest);
        return (
            <div key={`C${node.chest}`} className="mm-path-node" style={placeStyle}>
                <div className="mm-path-cluster">
                    <button
                        type="button"
                        className={`mm-path-chest ${claimed ? 'claimed' : ''} ${unlocked ? 'unlocked' : 'locked'}`}
                        disabled={!unlocked || claimed || claiming}
                        onClick={() => onChestClick(node.chest)}
                        aria-label={node.label}
                    >
                        <span className="mm-path-chest-icon">{claimed ? '✓' : '🎁'}</span>
                        <span className="mm-path-chest-label">
                            {claimed ? 'Kész' : unlocked ? `+${node.xp}` : 'Zárva'}
                        </span>
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="mm-path">
            <div className="mm-path-bar" style={{ background: accent }}>
                <button type="button" className="mm-path-back" onClick={onBack} aria-label="Vissza">
                    ←
                </button>
                <div className="mm-path-bar-text">
                    <div className="mm-path-kicker">
                        {topicIcon} · {doneCount}/{PATH_LESSON_COUNT} LECKE · {PATH_TOTAL_QUESTIONS} FELADAT
                    </div>
                    <div className="mm-path-title">{topicTitle}</div>
                </div>
                <label className={`mm-path-sprint ${sprintMode ? 'is-on' : ''}`}>
                    <input
                        type="checkbox"
                        checked={sprintMode}
                        onChange={(e) => setSprintMode(e.target.checked)}
                    />
                    <span>⏱ SPRINT</span>
                </label>
            </div>

            <div className="mm-path-xp">
                <div className="mm-path-xp-labels">
                    <span>
                        {getRankEmoji(progress?.rankLevel || 1)} {progress?.rank || 'BEGINNER'} ·{' '}
                        {progress?.xp || 0} XP
                    </span>
                    <span>Következő: {rankInfo.next} XP</span>
                </div>
                <div className="mm-path-xp-bar">
                    <div
                        className="mm-path-xp-fill"
                        style={{ width: `${xpPct}%`, background: accent }}
                    />
                </div>
            </div>

            {!loggedInEmail ? (
                <div className="mm-path-login">
                    <p>Haladás mentéséhez: egy kattintásos teszt fiók ({TEST_LOGIN_EMAIL})</p>
                    <div className="mm-path-login-actions">
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
                <p className="mm-path-logged">Bejelentkezve: {loggedInEmail}</p>
            )}

            <div className="mm-path-track">
                <svg
                    className="mm-path-svg"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    aria-hidden
                >
                    {/* Vastag út a háttérben */}
                    <path
                        d={winding.svgPath}
                        fill="none"
                        stroke="#1f1f23"
                        strokeWidth="7"
                        strokeLinecap="round"
                    />
                    <path
                        d={winding.svgPath}
                        fill="none"
                        stroke={accent}
                        strokeOpacity="0.85"
                        strokeWidth="4.5"
                        strokeLinecap="round"
                    />
                    <path
                        d={winding.svgPath}
                        fill="none"
                        stroke="#0a0a0a"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeDasharray="1.2 2"
                        opacity="0.45"
                    />
                </svg>
                {nodes.map((n, i) => renderPlacedNode(n, i))}
            </div>

            {toast && <div className="mm-path-toast">{toast}</div>}
        </div>
    );
}
