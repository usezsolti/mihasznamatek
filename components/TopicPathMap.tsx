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
import { gearFromRank } from '../utils/gameJuice';
import {
    PATH_LESSON_COUNT,
    PATH_TOTAL_QUESTIONS,
    buildPathNodes,
    buildWindingLayout,
    isChestUnlockable,
    isLessonUnlocked,
    lessonMathSymbol,
    type PathNode,
} from '../utils/topicPath';
import { agentDebugLog } from '../utils/agentDebugLog';
import { textbookGradeFromTopicId, hsTextbookRunId } from '../utils/hsTextbook';
import { formatAuthError, isTestLoginAllowed, signInAsTestUser, TEST_LOGIN_EMAIL } from '../utils/testLogin';
import MathHexMascot from './MathHexMascot';
import MathNodeIcon from './MathNodeIcon';
import MathRewardIcon from './MathRewardIcon';

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
    const nodes = useMemo(() => buildPathNodes(topicId), [topicId]);
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
        if (!isTestLoginAllowed()) {
            showToast('A teszt belépés ebben a környezetben nem elérhető.');
            return;
        }
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
            else if (educationLevel === 'highschool') params.set('grade', String(textbookGradeFromTopicId(topicId) ?? 10));
        }
        // #region agent log
        agentDebugLog({
            hypothesisId: 'H4',
            location: 'TopicPathMap.tsx:startLesson',
            message: 'start path lesson',
            data: {
                topicId,
                lesson,
                educationLevel,
                grade: grade ?? null,
                hrefGrade: params.get('grade'),
                isHsTextbook: /^hs\d{2}-/.test(topicId),
                textbookGrade: textbookGradeFromTopicId(topicId),
            },
            runId: hsTextbookRunId(topicId),
        });
        // #endregion
        router.push(`/game?${params.toString()}`);
    };

    const startTopicMix = () => {
        if (lessonsCompleted.length < PATH_LESSON_COUNT) {
            showToast('Előbb fejezd be a 6 leckét!');
            return;
        }
        const params = new URLSearchParams({
            topic: topicId,
            topicMix: '1',
        });
        if (sprintMode) params.set('sprint', '1');
        if (educationLevel === 'erettsegi') {
            params.set('erettsegi', 'true');
            params.set('level', erettsegiLevel);
        } else {
            params.set('educationLevel', educationLevel);
            if (grade != null) params.set('grade', String(grade));
            else if (educationLevel === 'elementary') params.set('grade', '5');
            else if (educationLevel === 'highschool') params.set('grade', String(textbookGradeFromTopicId(topicId) ?? 10));
        }
        // #region agent log
        agentDebugLog({
            hypothesisId: 'B',
            location: 'TopicPathMap.tsx:startTopicMix',
            message: 'topic mix navigation',
            data: {
                topicId,
                topicMix: params.get('topicMix'),
                mixed: params.get('mixed'),
                educationLevel,
                query: params.toString(),
            },
            runId: 'topic-mix',
        });
        // #endregion
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
                    `★ +${result.xpGained} XP` + (badgeBits ? ` · ${badgeBits}` : '')
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

    useEffect(() => {
        const root = document.querySelector('.mm-path-track');
        if (!root) return;
        const els = Array.from(
            root.querySelectorAll<HTMLElement>(
                '.mm-path-btn, .mm-path-caption, .mm-path-mascot, .mm-path-bubble, .mm-path-chest'
            )
        );
        const boxes = els.map((el) => {
            const r = el.getBoundingClientRect();
            return {
                cls: el.className.replace(/\s+/g, ' ').slice(0, 48),
                t: Math.round(r.top),
                l: Math.round(r.left),
                r: Math.round(r.right),
                b: Math.round(r.bottom),
            };
        });
        const overlaps: Array<{ a: string; b: string }> = [];
        for (let i = 0; i < boxes.length; i++) {
            for (let j = i + 1; j < boxes.length; j++) {
                const a = boxes[i];
                const b = boxes[j];
                const hit = a.l < b.r - 4 && b.l < a.r - 4 && a.t < b.b - 4 && b.t < a.b - 4;
                if (!hit) continue;
                if (els[i].contains(els[j]) || els[j].contains(els[i])) continue;
                overlaps.push({ a: a.cls, b: b.cls });
            }
        }
        // #region agent log
        agentDebugLog({
            hypothesisId: 'A',
            location: 'TopicPathMap.tsx:overlapCheck',
            message: 'path node overlap measure',
            data: {
                boxN: boxes.length,
                overlapN: overlaps.length,
                overlaps: overlaps.slice(0, 10),
                trackH: Math.round(root.getBoundingClientRect().height),
            },
            runId: 'path-overlap',
        });
        // #endregion
    }, [nodes.length, winding.points.length, allDone, continueLesson, doneCount]);

    const renderPlacedNode = (node: PathNode, index: number) => {
        const pt = winding.points[index];
        if (!pt) return null;

        // Inline absolute — must sit ON the curve even if CSS classes fail
        const placeStyle: CSSProperties = {
            position: 'absolute',
            left: `${pt.x}%`,
            top: `${pt.y}%`,
            zIndex: 5,
        };

        if (node.kind === 'mixed') {
            const unlocked = allDone;
            // #region agent log
            agentDebugLog({
                hypothesisId: 'E',
                location: 'TopicPathMap.tsx:renderMixed',
                message: 'mixed node placed',
                data: {
                    topicId,
                    index,
                    nodesN: nodes.length,
                    pointsN: winding.points.length,
                    hasPoint: Boolean(pt),
                    unlocked,
                    lessonsDone: lessonsCompleted.length,
                },
                runId: 'topic-mix',
            });
            // #endregion
            return (
                <div key="mixed" className="mm-path-node" style={placeStyle}>
                    <div className="mm-path-cluster">
                        {unlocked && (
                            <button type="button" className="mm-path-bubble" onClick={startTopicMix}>
                                VEGYES
                            </button>
                        )}
                        <div className="mm-path-btn-wrap">
                            <button
                                type="button"
                                className={`mm-path-btn mixed ${unlocked ? 'unlocked' : 'locked'}`}
                                disabled={!unlocked}
                                onClick={startTopicMix}
                                aria-label={node.label}
                            >
                                <span className="mm-path-glyph">Σ</span>
                            </button>
                        </div>
                        <span className={`mm-path-caption ${unlocked ? '' : 'muted'}`}>
                            {unlocked ? 'Vegyes gyakorlás' : 'Vegyes · 6 lecke után'}
                        </span>
                    </div>
                </div>
            );
        }

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
                        <div className="mm-path-btn-wrap">
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
                                    <MathNodeIcon
                                        lesson={node.lesson}
                                        locked={!unlocked}
                                        done={done}
                                        current={current}
                                        size={current || done ? 36 : 32}
                                    />
                                </span>
                            </button>
                            {showMascot && (
                                <div
                                    className={`mm-path-mascot ${pt.side === 'left' ? 'on-left' : 'on-right'}`}
                                >
                                    <MathHexMascot
                                        size={72}
                                        color={accent}
                                        mood={done && allDone ? 'happy' : 'idle'}
                                        gear={gearFromRank(progress?.rankLevel || 1)}
                                    />
                                </div>
                            )}
                        </div>
                        <span className={`mm-path-caption ${unlocked ? '' : 'muted'}`}>
                            {done ? `Lecke ${node.lesson} · Kész` : node.label}
                        </span>
                        {(done || starCount > 0) && (
                            <span className="mm-path-stars" aria-label={`${starCount} alakzat`}>
                                {Array.from({ length: 3 }, (_, i) => (
                                    <span
                                        key={i}
                                        style={{ opacity: i < starCount ? 1 : 0.25 }}
                                    >
                                        {lessonMathSymbol(node.lesson)}
                                    </span>
                                ))}
                            </span>
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
                        <span className="mm-path-chest-icon">
                            <MathRewardIcon
                                chest={node.chest}
                                claimed={claimed}
                                locked={!unlocked}
                                size={claimed || unlocked ? 36 : 32}
                            />
                        </span>
                        <span className="mm-path-chest-label">
                            {claimed ? 'Kész' : unlocked ? `+${node.xp} XP` : 'Zárva'}
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
                    {isTestLoginAllowed() ? (
                        <p>Haladás mentéséhez: egy kattintásos teszt fiók ({TEST_LOGIN_EMAIL})</p>
                    ) : (
                        <p>Haladás mentéséhez jelentkezz be.</p>
                    )}
                    <div className="mm-path-login-actions">
                        {isTestLoginAllowed() && (
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
                        )}
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
                    <defs>
                        <linearGradient id="mmHelixA" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={accent} stopOpacity="0.95" />
                            <stop offset="100%" stopColor="#9dff3a" stopOpacity="0.85" />
                        </linearGradient>
                        <linearGradient id="mmHelixB" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3aa0ff" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#1a6fd0" stopOpacity="0.85" />
                        </linearGradient>
                    </defs>
                    {/* Double helix tubes */}
                    <path d={winding.helix.tubeB} fill="url(#mmHelixB)" opacity="0.88" />
                    <path d={winding.helix.tubeA} fill="url(#mmHelixA)" opacity="0.92" />
                    <path
                        d={winding.helix.strandB}
                        fill="none"
                        stroke="#0a2a55"
                        strokeWidth="0.55"
                        strokeLinecap="round"
                        opacity="0.7"
                    />
                    <path
                        d={winding.helix.strandA}
                        fill="none"
                        stroke="#143800"
                        strokeWidth="0.55"
                        strokeLinecap="round"
                        opacity="0.7"
                    />
                    <path
                        d={winding.helix.strandB}
                        fill="none"
                        stroke="#dff0ff"
                        strokeWidth="0.35"
                        strokeLinecap="round"
                        strokeDasharray="1.1 1.6"
                        opacity="0.45"
                    />
                    <path
                        d={winding.helix.strandA}
                        fill="none"
                        stroke="#f0ffe0"
                        strokeWidth="0.35"
                        strokeLinecap="round"
                        strokeDasharray="1.1 1.6"
                        opacity="0.45"
                    />
                </svg>
                {nodes.map((n, i) => renderPlacedNode(n, i))}
            </div>

            {allDone && (
                <div style={{ textAlign: 'center', padding: '0 1rem 1.5rem' }}>
                    <button
                        type="button"
                        className="mm-path-bubble"
                        onClick={startTopicMix}
                        style={{ position: 'static', display: 'inline-block' }}
                    >
                        Vegyes feladatmegoldás
                    </button>
                </div>
            )}

            {toast && <div className="mm-path-toast">{toast}</div>}
        </div>
    );
}
