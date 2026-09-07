import { useEffect, useMemo, useState } from 'react';
import {
    BRANCH_META,
    SKILL_NODES,
    skillEdges,
    skillNodeById,
    type SkillNodeId,
} from '../utils/skillTree';
import type { GameJuiceState } from '../utils/gameJuice';
import { agentDebugLog } from '../utils/agentDebugLog';

type Props = {
    juice: GameJuiceState;
    xp: number;
    onStart: (id: SkillNodeId) => void;
};

const VW = 1100;
const VH = 880;

export default function SkillTreePanel({ juice, xp, onStart }: Props) {
    const [selected, setSelected] = useState<SkillNodeId>(SKILL_NODES[0].id);
    const unlocked = juice.unlockedSkills || [];
    const points = xp || 0;
    const openN = unlocked.length;

    const byId = useMemo(() => new Map(SKILL_NODES.map((n) => [n.id, n])), []);
    const edges = useMemo(() => skillEdges(), []);
    const node = skillNodeById(selected) || SKILL_NODES[0];
    const isOpen = unlocked.includes(node.id);
    const prereqOk = node.requires.every((req) => unlocked.includes(req));
    const xpLeft = Math.max(0, node.cost - points);

    const xy = (id: string) => {
        const n = byId.get(id as SkillNodeId);
        if (!n) return { x: 0, y: 0 };
        return { x: (n.x / 100) * VW, y: (n.y / 100) * VH };
    };

    useEffect(() => {
        // #region agent log
        agentDebugLog({
            hypothesisId: 'C',
            location: 'SkillTreePanel.tsx:mount',
            message: 'challenge tree render',
            data: {
                hasHexMag: SKILL_NODES.some((n) => String(n.id) === 'root' || n.title.toLowerCase().includes('hex')),
                firstId: SKILL_NODES[0].id,
                firstKind: SKILL_NODES[0].rules.timerMode,
                qCount: SKILL_NODES[0].rules.questionCount,
                unlockedN: unlocked.length,
                xp: points,
            },
            runId: 'challenge-tree',
        });
        // #endregion
    }, [unlocked.length, points]);

    return (
        <section className="dash-skill" aria-label="Kihívásfa">
            <div className="dash-skill-head">
                <div>
                    <h3>Kihívásfa</h3>
                    <p>
                        Nem könnyítők, hanem plusz feltételek. XP-vel nyílnak, indításkor időre kell
                        megoldanod egy vagy több feladatot.
                    </p>
                </div>
                <div className="dash-skill-meta">
                    <div className="dash-skill-points">
                        <b>{points}</b>
                        <span>XP</span>
                    </div>
                    <div className="dash-skill-points dim">
                        <b>{openN}/{SKILL_NODES.length}</b>
                        <span>nyitva</span>
                    </div>
                </div>
            </div>

            <div className="dash-skill-legend">
                {(['flame', 'shield', 'vault', 'wind', 'mind'] as const).map((b) => (
                    <span key={b} className="dash-skill-chip" style={{ '--b': BRANCH_META[b].color } as any}>
                        {BRANCH_META[b].label}
                    </span>
                ))}
            </div>

            <div className="dash-skill-scroll">
                <div className="dash-skill-canvas" style={{ width: VW, height: VH }}>
                    <svg className="dash-skill-svg" viewBox={`0 0 ${VW} ${VH}`} aria-hidden>
                        {edges.map(({ from, to }) => {
                            const a = xy(from);
                            const b = xy(to);
                            const midY = (a.y + b.y) / 2;
                            const toNode = byId.get(to);
                            const color = toNode ? BRANCH_META[toNode.branch].color : '#888';
                            const lit = unlocked.includes(from);
                            return (
                                <path
                                    key={`${from}-${to}`}
                                    d={`M ${a.x} ${a.y + 36} C ${a.x} ${midY}, ${b.x} ${midY}, ${b.x} ${b.y - 36}`}
                                    fill="none"
                                    stroke={color}
                                    strokeWidth={lit ? 4 : 2}
                                    strokeOpacity={lit ? 0.85 : 0.22}
                                    className={lit ? 'lit' : ''}
                                />
                            );
                        })}
                    </svg>
                    {SKILL_NODES.map((n) => {
                        const open = unlocked.includes(n.id);
                        const ready = !open && n.requires.every((req) => unlocked.includes(req)) && points >= n.cost;
                        const locked = !open && !ready;
                        const meta = BRANCH_META[n.branch];
                        return (
                            <button
                                key={n.id}
                                type="button"
                                className={`dash-hex ${open ? 'open' : ''} ${ready ? 'ready' : ''} ${locked ? 'locked' : ''} ${selected === n.id ? 'sel' : ''} ${n.branch === 'cap' ? 'cap' : ''}`}
                                style={{
                                    left: `${n.x}%`,
                                    top: `${n.y}%`,
                                    '--b': meta.color,
                                    '--g': meta.glow,
                                } as any}
                                onClick={() => {
                                    setSelected(n.id);
                                    // #region agent log
                                    agentDebugLog({
                                        hypothesisId: 'C',
                                        location: 'SkillTreePanel.tsx:select',
                                        message: 'challenge selected',
                                        data: {
                                            id: n.id,
                                            q: n.rules.questionCount,
                                            sec: n.rules.seconds,
                                            timer: n.rules.timerMode,
                                            open,
                                        },
                                        runId: 'challenge-tree',
                                    });
                                    // #endregion
                                }}
                            >
                                <span className="dash-hex-inner">
                                    <span className="dash-hex-icon">{n.icon}</span>
                                    <span className="dash-hex-title">{n.title}</span>
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="dash-skill-detail">
                <div className="dash-skill-detail-icon" style={{ '--b': BRANCH_META[node.branch].color } as any}>
                    {node.icon}
                </div>
                <div className="dash-skill-detail-copy">
                    <strong>{node.title}</strong>
                    <span>{BRANCH_META[node.branch].label} · {node.cost} XP</span>
                    <p className="dash-skill-effect">{node.effect}</p>
                    <p>{node.desc}</p>
                </div>
                {isOpen ? (
                    <button
                        type="button"
                        className="dash-skill-buy ready"
                        onClick={() => {
                            // #region agent log
                            agentDebugLog({
                                hypothesisId: 'C',
                                location: 'SkillTreePanel.tsx:start',
                                message: 'challenge start clicked',
                                data: {
                                    id: node.id,
                                    q: node.rules.questionCount,
                                    sec: node.rules.seconds,
                                    timer: node.rules.timerMode,
                                },
                                runId: 'challenge-tree',
                            });
                            // #endregion
                            onStart(node.id);
                        }}
                    >
                        Indítom
                    </button>
                ) : (
                    <div className="dash-skill-buy">
                        {!prereqOk
                            ? 'Előbb az előző fok kell'
                            : xpLeft > 0
                                ? `Még ${xpLeft} XP`
                                : 'Hamarosan nyílik'}
                    </div>
                )}
            </div>
        </section>
    );
}
