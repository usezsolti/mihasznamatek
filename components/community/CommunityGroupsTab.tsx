import { useState } from 'react';
import type { SocialProfile, StudyGroup } from '../../utils/socialTypes';
import CommunityGroupRoom from './CommunityGroupRoom';

type CommunityGroupsTabProps = {
    uid: string;
    me: SocialProfile;
    groupName: string;
    groupTopic: string;
    groupDesc: string;
    onGroupNameChange: (value: string) => void;
    onGroupTopicChange: (value: string) => void;
    onGroupDescChange: (value: string) => void;
    onCreateGroup: () => void;
    groups: StudyGroup[];
    onJoinLeave: (g: StudyGroup) => void;
    onGroupUpdated: (next: StudyGroup) => void;
    onToast: (msg: string) => void;
    busy: boolean;
};

export default function CommunityGroupsTab({
    uid,
    me,
    groupName,
    groupTopic,
    groupDesc,
    onGroupNameChange,
    onGroupTopicChange,
    onGroupDescChange,
    onCreateGroup,
    groups,
    onJoinLeave,
    onGroupUpdated,
    onToast,
    busy,
}: CommunityGroupsTabProps) {
    const [active, setActive] = useState<StudyGroup | null>(null);

    if (active && active.memberIds.includes(uid)) {
        return (
            <CommunityGroupRoom
                me={me}
                group={active}
                onBack={() => setActive(null)}
                onGroupUpdated={(next) => {
                    onGroupUpdated(next);
                    setActive(next);
                }}
                onToast={onToast}
            />
        );
    }

    return (
        <div className="mm-social-panel">
            <div className="mm-social-compose mm-social-compose-stack">
                <h2>Új tanulócsoport</h2>
                <p className="mm-social-muted" style={{ margin: 0 }}>
                    A csoportban: csevegés, közös tábla, csoportos hívás.
                </p>
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
                {groups.map((g) => {
                    const isMember = g.memberIds.includes(uid);
                    return (
                        <article key={g.id} className="mm-social-group">
                            <h3>{g.name}</h3>
                            <p>{g.description || 'Nincs leírás'}</p>
                            <small>
                                {g.topic || 'Általános'} · {g.memberCount} tag · {g.ownerName}
                            </small>
                            <div className="mm-social-group-actions">
                                {isMember && (
                                    <button
                                        type="button"
                                        className="mm-ig-btn is-primary"
                                        onClick={() => setActive(g)}
                                    >
                                        Belépés a szobába
                                    </button>
                                )}
                                <button
                                    type="button"
                                    className="mm-social-ghost"
                                    onClick={() => onJoinLeave(g)}
                                    disabled={busy || g.ownerId === uid}
                                >
                                    {isMember
                                        ? g.ownerId === uid
                                            ? 'Tulajdonos'
                                            : 'Kilépés'
                                        : 'Csatlakozás'}
                                </button>
                            </div>
                        </article>
                    );
                })}
            </div>
        </div>
    );
}
