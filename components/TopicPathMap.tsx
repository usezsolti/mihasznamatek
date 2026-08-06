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
            const uid = (window as any).firebase?.auth?.()?.currentUser?.uid || null;
            // localStorage is működik vendégként — a következő lecke így is feloldódik
            setProgress(await loadUserPracticeProgress(uid));
        } catch (e) {
            console.error('Path progress load:', e);
            setProgress(await loadUserPracticeProgress(null));
        }
    }, []);

    useEffect(() => {
        reload();
    }, [reload, topicId]);

    const showToast = (msg: string) => {
        setToast(msg);
        window.setTimeout(() => setToast(null), 2800);
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
        if (node.kind === 'lesson') {
            const done = lessonsCompleted.includes(node.lesson);
            const unlocked = isLessonUnlocked(node.lesson, highestUnlocked, lessonsCompleted);
            const current = node.lesson === continueLesson && !done;
            return (
                <div
                    key={`L${node.lesson}`}
                    className={`path-row ${zigLeft ? 'path-left' : 'path-right'}`}
                >
                    <button
                        type="button"
                        className={`path-node lesson ${done ? 'done' : ''} ${unlocked ? 'unlocked' : 'locked'} ${current ? 'current' : ''}`}
                        style={{
                            borderColor: current || done ? topicColor : undefined,
                            boxShadow: current ? `0 0 24px ${topicColor}66` : undefined,
                        }}
                        disabled={!unlocked}
                        onClick={() => startLesson(node.lesson)}
                        aria-label={node.label}
                    >
                        <span className="path-node-icon">
                            {done ? '✓' : unlocked ? node.lesson : '🔒'}
                        </span>
                        <span className="path-node-label">{node.label}</span>
                        {!unlocked && (
                            <span className="path-cta locked-hint">
                                Előbb Lecke {node.lesson - 1}
                            </span>
                        )}
                        {current && <span className="path-cta">Folytatás</span>}
                        {done && <span className="path-stars">★★★</span>}
                    </button>
                </div>
            );
        }

        const unlocked = isChestUnlockable(node.chest, lessonsCompleted);
        const claimed = chestsClaimed.includes(node.chest);
        return (
            <div
                key={`C${node.chest}`}
                className={`path-row ${zigLeft ? 'path-left' : 'path-right'}`}
            >
                <button
                    type="button"
                    className={`path-node chest ${claimed ? 'claimed' : ''} ${unlocked ? 'unlocked' : 'locked'}`}
                    disabled={!unlocked || claimed || claiming}
                    onClick={() => onChestClick(node.chest)}
                    aria-label={node.label}
                >
                    <span className="path-node-icon">{claimed ? '📦' : unlocked ? '🎁' : '🔒'}</span>
                    <span className="path-node-label">
                        {node.label} · +{node.xp} XP
                    </span>
                    {unlocked && !claimed && <span className="path-cta">Begyűjtés</span>}
                    {claimed && <span className="path-cta">Kész</span>}
                </button>
            </div>
        );
    };

    return (
        <div className="topic-path">
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
                <button
                    type="button"
                    className="path-continue-main"
                    style={{ background: topicColor }}
                    onClick={() => startLesson(continueLesson)}
                >
                    {doneCount >= PATH_LESSON_COUNT ? 'Újra a mester lecke' : `Folytatás · Lecke ${continueLesson}`}
                </button>
            </div>

            <div className="path-track">
                <div className="path-line" aria-hidden />
                {nodes.map((n, i) => renderNode(n, i))}
            </div>

            {toast && <div className="path-toast">{toast}</div>}

            <style jsx>{`
                .topic-path {
                    max-width: 520px;
                    margin: 0 auto;
                    padding: 0.5rem 1rem 3rem;
                    position: relative;
                }
                .path-top {
                    margin-bottom: 1.5rem;
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
                    margin-bottom: 1rem;
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
                .path-continue-main {
                    width: 100%;
                    border: none;
                    color: #111;
                    font-weight: 800;
                    font-size: 1.05rem;
                    padding: 0.85rem 1rem;
                    border-radius: 16px;
                    cursor: pointer;
                    margin-top: 0.25rem;
                }
                .path-track {
                    position: relative;
                    padding: 1rem 0 2rem;
                }
                .path-line {
                    position: absolute;
                    left: 50%;
                    top: 0;
                    bottom: 0;
                    width: 4px;
                    margin-left: -2px;
                    background: linear-gradient(
                        180deg,
                        rgba(57, 255, 20, 0.15),
                        rgba(255, 215, 0, 0.35),
                        rgba(255, 105, 180, 0.25)
                    );
                    border-radius: 4px;
                    z-index: 0;
                }
                .path-row {
                    position: relative;
                    z-index: 1;
                    display: flex;
                    margin: 1.1rem 0;
                }
                .path-left {
                    justify-content: flex-start;
                    padding-right: 18%;
                }
                .path-right {
                    justify-content: flex-end;
                    padding-left: 18%;
                }
                .path-node {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.35rem;
                    min-width: 140px;
                    max-width: 180px;
                    padding: 0.85rem 0.75rem;
                    border-radius: 22px;
                    border: 2px solid rgba(255, 255, 255, 0.2);
                    background: rgba(0, 0, 0, 0.45);
                    color: #fff;
                    cursor: pointer;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .path-node:disabled {
                    cursor: not-allowed;
                    opacity: 0.55;
                }
                .path-node.unlocked:not(:disabled):hover {
                    transform: translateY(-3px);
                }
                .path-node.current {
                    background: rgba(57, 255, 20, 0.12);
                }
                .path-node.done {
                    background: rgba(255, 215, 0, 0.12);
                }
                .path-node.chest.unlocked:not(.claimed) {
                    background: rgba(255, 105, 180, 0.15);
                    border-color: rgba(255, 105, 180, 0.7);
                }
                .path-node-icon {
                    font-size: 1.6rem;
                    font-weight: 800;
                    width: 52px;
                    height: 52px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255, 255, 255, 0.08);
                }
                .path-node-label {
                    font-size: 0.82rem;
                    text-align: center;
                    line-height: 1.25;
                    color: #eee;
                }
                .path-cta {
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: #39ff14;
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                }
                .path-cta.locked-hint {
                    color: #aaa;
                    text-transform: none;
                    font-weight: 600;
                }
                .path-stars {
                    color: #ffd700;
                    font-size: 0.85rem;
                    letter-spacing: 0.1em;
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
                    animation: pathToastIn 0.25s ease;
                }
                @keyframes pathToastIn {
                    from {
                        opacity: 0;
                        transform: translate(-50%, 12px);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, 0);
                    }
                }
            `}</style>
        </div>
    );
}
