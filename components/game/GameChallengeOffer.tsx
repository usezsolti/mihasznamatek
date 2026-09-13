import { BRANCH_META, type SkillNode } from '../../utils/skillTree';

type Props = {
    node: SkillNode;
    onAccept: () => void;
    onSkip: () => void;
};

export default function GameChallengeOffer({ node, onAccept, onSkip }: Props) {
    const meta = BRANCH_META[node.branch];
    return (
        <div className="chal-offer" role="dialog" aria-label="Elérhető kihívás">
            <div className="chal-offer-card" style={{ '--b': meta.color } as any}>
                <span className="chal-offer-kicker">{meta.label}</span>
                <strong>{node.icon} {node.title}</strong>
                <p className="chal-offer-effect">{node.effect}</p>
                <p>{node.desc}</p>
                <div className="chal-offer-actions">
                    <button type="button" className="chal-offer-go" onClick={onAccept}>
                        Megcsinálom
                    </button>
                    <button type="button" className="chal-offer-skip" onClick={onSkip}>
                        Most nem
                    </button>
                </div>
            </div>
        </div>
    );
}
