import { useState } from 'react';
import type { SocialProfile, StudyGroup } from '../../utils/socialTypes';
import { useLang } from '../../utils/i18n';
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
    const { t } = useLang();
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
                <h2>{t('community.groups.newTitle')}</h2>
                <p className="mm-social-muted" style={{ margin: 0 }}>
                    {t('community.groups.newHint')}
                </p>
                <input
                    value={groupName}
                    onChange={(e) => onGroupNameChange(e.target.value)}
                    placeholder={t('community.groups.namePlaceholder')}
                    maxLength={60}
                />
                <input
                    value={groupTopic}
                    onChange={(e) => onGroupTopicChange(e.target.value)}
                    placeholder={t('community.groups.topicPlaceholder')}
                    maxLength={60}
                />
                <textarea
                    value={groupDesc}
                    onChange={(e) => onGroupDescChange(e.target.value)}
                    placeholder={t('community.groups.descPlaceholder')}
                    maxLength={200}
                    rows={2}
                />
                <button type="button" className="mm-social-primary" onClick={onCreateGroup} disabled={busy}>
                    {t('community.groups.create')}
                </button>
            </div>
            <div className="mm-social-groups">
                {groups.map((g) => {
                    const isMember = g.memberIds.includes(uid);
                    return (
                        <article key={g.id} className="mm-social-group">
                            <h3>{g.name}</h3>
                            <p>{g.description || t('community.groups.noDesc')}</p>
                            <small>
                                {t('community.groups.members', {
                                    topic: g.topic || t('community.groups.general'),
                                    count: String(g.memberCount),
                                    owner: g.ownerName,
                                })}
                            </small>
                            <div className="mm-social-group-actions">
                                {isMember && (
                                    <button
                                        type="button"
                                        className="mm-ig-btn is-primary"
                                        onClick={() => setActive(g)}
                                    >
                                        {t('community.groups.enterRoom')}
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
                                            ? t('community.groups.owner')
                                            : t('community.groups.leave')
                                        : t('community.groups.join')}
                                </button>
                            </div>
                        </article>
                    );
                })}
            </div>
        </div>
    );
}
