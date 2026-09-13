import { useEffect, useState } from 'react';
import {
    BRANCH_META,
    BRANCH_ORDER,
    SKILL_NODES,
    branchNodes,
    canStartChallenge,
    skillNodeById,
    type SkillNode,
    type SkillNodeId,
} from '../utils/skillTree';
import type { GameJuiceState } from '../utils/gameJuice';
import { agentDebugLog } from '../utils/agentDebugLog';

type Props = {
    juice: GameJuiceState;
    xp: number;
};

function gateLabel(node: SkillNode, completed: string[], xp: number): string {
    const gate = canStartChallenge(node.id, completed, xp);
    if (gate.ok) return '';
    if (gate.reason === 'xp') return `Még ${gate.xpLeft} XP`;
    if (gate.reason === 'prereq') {
        const first = gate.missing[0];
        if (!first) return 'Előbb az előző szint';
        if (first.branch === 'csucs') return 'Mind az öt ág kell';
        return `Előbb: ${first.title}`;
    }
    return 'Zárva';
}

export default function SkillTreePanel({ juice, xp }: Props) {
    const [selected, setSelected] = useState<SkillNodeId>(SKILL_NODES[0].id);
    const completed = juice.completedChallenges || [];
    const points = xp || 0;
    const doneN = completed.length;
    const node = skillNodeById(selected) || SKILL_NODES[0];
    const done = completed.includes(node.id);
    const gate = canStartChallenge(node.id, completed, points);
    const canPlay = gate.ok;
    const meta = BRANCH_META[node.branch];
    const master = skillNodeById('mihasznaMester')!;

    useEffect(() => {
        agentDebugLog({
            hypothesisId: 'C',
            location: 'SkillTreePanel.tsx:mount',
            message: 'challenge tree render',
            data: {
                firstId: SKILL_NODES[0].id,
                nodeN: SKILL_NODES.length,
                doneN,
                xp: points,
            },
            runId: 'challenge-tree',
        });
    }, [doneN, points]);

    return (
        <section className="dash-skill" aria-label="Kihívásfa">
            <div className="dash-skill-head">
                <div>
                    <h3>Kihívásfa</h3>
                    <p>
                        Itt látod, melyik kihívást csináltad meg. Új kört játék közben kapsz,
                        amikor megvan hozzá az XP.
                    </p>
                </div>
                <div className="dash-skill-meta">
                    <div className="dash-skill-points">
                        <b>{points}</b>
                        <span>XP</span>
                    </div>
                    <div className="dash-skill-points dim">
                        <b>{doneN}/{SKILL_NODES.length}</b>
                        <span>kész</span>
                    </div>
                </div>
            </div>

            <div className="dash-skill-legend">
                {BRANCH_ORDER.map((b) => (
                    <span key={b} className="dash-skill-chip" style={{ '--b': BRANCH_META[b].color } as any}>
                        {BRANCH_META[b].icon} {BRANCH_META[b].label}
                    </span>
                ))}
            </div>

            <div className="dash-skill-scroll">
                <div className="dash-skill-grid">
                    {BRANCH_ORDER.map((branch) => {
                        const nodes = branchNodes(branch);
                        const cleared = nodes.filter((n) => completed.includes(n.id)).length;
                        const col = BRANCH_META[branch];
                        return (
                            <div key={branch} className="dash-skill-col">
                                <div className="dash-skill-col-head" style={{ '--b': col.color } as any}>
                                    <strong>{col.icon} {col.label}</strong>
                                    <em>{col.tagline}</em>
                                    <span>{cleared}/10 kész</span>
                                </div>
                                {nodes.map((n) => {
                                    const isDone = completed.includes(n.id);
                                    const ready = !isDone && canStartChallenge(n.id, completed, points).ok;
                                    const locked = !isDone && !ready;
                                    return (
                                        <button
                                            key={n.id}
                                            type="button"
                                            className={`dash-skill-node ${isDone ? 'done' : ''} ${ready ? 'ready' : ''} ${locked ? 'locked' : ''} ${selected === n.id ? 'sel' : ''}`}
                                            style={{ '--b': col.color, '--g': col.glow } as any}
                                            onClick={() => {
                                                setSelected(n.id);
                                                agentDebugLog({
                                                    hypothesisId: 'C',
                                                    location: 'SkillTreePanel.tsx:select',
                                                    message: 'challenge selected',
                                                    data: {
                                                        id: n.id,
                                                        q: n.rules.questionCount,
                                                        sec: n.rules.seconds,
                                                        timer: n.rules.timerMode,
                                                        done: isDone,
                                                    },
                                                    runId: 'challenge-tree',
                                                });
                                            }}
                                        >
                                            <span className="dash-skill-node-lv">{n.level}</span>
                                            <span className="dash-skill-node-icon">{n.icon}</span>
                                            <span className="dash-skill-node-title">{n.title}</span>
                                            {isDone && <span className="dash-skill-node-check">kész</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
                <button
                    type="button"
                    className={`dash-skill-cap ${completed.includes(master.id) ? 'done' : ''} ${canStartChallenge(master.id, completed, points).ok && !completed.includes(master.id) ? 'ready' : ''} ${selected === master.id ? 'sel' : ''}`}
                    onClick={() => setSelected(master.id)}
                >
                    <span>{master.icon}</span>
                    <strong>{master.title}</strong>
                    <em>
                        {completed.includes(master.id)
                            ? 'Kész — a fa teteje megvan'
                            : 'Mind az öt ág teteje + 4000 XP'}
                    </em>
                </button>
            </div>

            <div className="dash-skill-detail">
                <div className="dash-skill-detail-icon" style={{ '--b': meta.color } as any}>
                    {node.icon}
                </div>
                <div className="dash-skill-detail-copy">
                    <strong>{node.title}</strong>
                    <span>
                        {meta.label}
                        {node.branch !== 'csucs' ? ` · ${node.level}. szint` : ''}
                        {' · '}
                        {node.minXp} XP
                        {node.badgeId ? ' · badge' : ''}
                    </span>
                    <p className="dash-skill-effect">{node.effect}</p>
                    <p>{node.desc}</p>
                </div>
                <div className={`dash-skill-buy ${done ? 'open' : canPlay ? 'ready' : ''}`}>
                    {done
                        ? 'Kész'
                        : canPlay
                            ? 'Játék közben indul'
                            : gateLabel(node, completed, points)}
                </div>
            </div>
        </section>
    );
}
