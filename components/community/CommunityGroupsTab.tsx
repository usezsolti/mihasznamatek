import type { StudyGroup } from '../../utils/socialTypes';

type CommunityGroupsTabProps = {
    uid: string;
    groupName: string;
    groupTopic: string;
    groupDesc: string;
    onGroupNameChange: (value: string) => void;
    onGroupTopicChange: (value: string) => void;
    onGroupDescChange: (value: string) => void;
    onCreateGroup: () => void;
    groups: StudyGroup[];
    onJoinLeave: (g: StudyGroup) => void;
    busy: boolean;
};

export default function CommunityGroupsTab({
    uid,
    groupName,
    groupTopic,
    groupDesc,
    onGroupNameChange,
    onGroupTopicChange,
    onGroupDescChange,
    onCreateGroup,
    groups,
    onJoinLeave,
    busy,
}: CommunityGroupsTabProps) {
    return (
        <div className="mm-social-panel">
            <div className="mm-social-compose mm-social-compose-stack">
                <h2>Új tanulócsoport</h2>
                <input
                    value={groupName}
                    onChange={(e) => onGroupNameChange(e.target.value)}
                    placeholder="Csoport neve"
                    maxLength={60}
                />
                <input
                    value={groupTopic}
                    onChange={(e) => onGroupTopicChange(e.target.value)}
                    placeholder="Téma (pl. érettségi)"
                    maxLength={60}
                />
                <textarea
                    value={groupDesc}
                    onChange={(e) => onGroupDescChange(e.target.value)}
                    placeholder="Rövid leírás"
                    maxLength={200}
                    rows={2}
                />
                <button type="button" className="mm-social-primary" onClick={onCreateGroup} disabled={busy}>
                    Létrehozás
                </button>
            </div>
            <div className="mm-social-groups">
                {groups.map((g) => (
                    <article key={g.id} className="mm-social-group">
                        <h3>{g.name}</h3>
                        <p>{g.description || 'Nincs leírás'}</p>
                        <small>
                            {g.topic || 'Általános'} · {g.memberCount} tag · {g.ownerName}
                        </small>
                        <button
                            type="button"
                            className="mm-social-ghost"
                            onClick={() => onJoinLeave(g)}
                            disabled={busy || g.ownerId === uid}
                        >
                            {g.memberIds.includes(uid)
                                ? g.ownerId === uid
                                    ? 'Tulajdonos'
                                    : 'Kilépés'
                                : 'Csatlakozás'}
                        </button>
                    </article>
                ))}
            </div>
        </div>
    );
}
