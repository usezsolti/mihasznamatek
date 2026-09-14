import { useMemo, useState } from 'react';
import type { SocialProfile, StudyGroup } from '../../utils/socialTypes';
import { useLang } from '../../utils/i18n';
import CommunityGroupRoom from './CommunityGroupRoom';
import CommunityAvatar from './CommunityAvatar';

type CommunityGroupsTabProps = {
    uid: string;
    me: SocialProfile;
    profiles: SocialProfile[];
    followingIds: string[];
    groupName: string;
    groupTopic: string;
    groupDesc: string;
    onGroupNameChange: (value: string) => void;
    onGroupTopicChange: (value: string) => void;
    onGroupDescChange: (value: string) => void;
    onCreateGroup: (memberIds: string[]) => void | Promise<void>;
    groups: StudyGroup[];
    onJoinLeave: (g: StudyGroup) => void;
    onGroupUpdated: (next: StudyGroup) => void;
    onToast: (msg: string) => void;
    busy: boolean;
};

export default function CommunityGroupsTab({
    uid,
    me,
    profiles,
    followingIds,
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
    const [pickedIds, setPickedIds] = useState<string[]>([]);
    const [peopleQ, setPeopleQ] = useState('');

    const candidates = useMemo(() => {
        const q = peopleQ.trim().toLowerCase();
        return profiles
            .filter((p) => p.uid !== uid)
            .filter((p) => {
                if (!q) return true;
                return (
                    p.displayName.toLowerCase().includes(q) ||
                    p.username.toLowerCase().includes(q)
                );
            })
            .sort((a, b) => {
                const af = followingIds.includes(a.uid) ? 1 : 0;
                const bf = followingIds.includes(b.uid) ? 1 : 0;
                if (af !== bf) return bf - af;
                return a.displayName.localeCompare(b.displayName, 'hu');
            });
    }, [profiles, uid, peopleQ, followingIds]);

    const togglePerson = (id: string) => {
        setPickedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

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

                <div className="mm-group-people">
                    <div className="mm-group-people-head">
                        <strong>{t('community.groups.peopleTitle')}</strong>
                        <span className="mm-social-muted">
                            {t('community.groups.selectedCount', { n: String(pickedIds.length) })}
                        </span>
                    </div>
                    <p className="mm-social-muted" style={{ margin: 0 }}>
                        {t('community.groups.peopleHint')}
                    </p>
                    <input
                        value={peopleQ}
                        onChange={(e) => setPeopleQ(e.target.value)}
                        placeholder={t('community.groups.peopleSearch')}
                        maxLength={60}
                    />
                    <div className="mm-group-people-list" role="list">
                        <div className="mm-group-person is-self" role="listitem">
                            <CommunityAvatar url={me.photoURL} name={me.displayName} size={36} />
                            <span className="mm-group-person-meta">
                                <strong>{me.displayName}</strong>
                                <small>{t('community.groups.youOwner')}</small>
                            </span>
                            <span className="mm-group-person-mark" aria-hidden>
                                ✓
                            </span>
                        </div>
                        {candidates.length === 0 && (
                            <p className="mm-social-empty">
                                {profiles.filter((p) => p.uid !== uid).length === 0
                                    ? t('community.groups.peopleEmpty')
                                    : t('community.groups.peopleNoneMatch')}
                            </p>
                        )}
                        {candidates.map((p) => {
                            const on = pickedIds.includes(p.uid);
                            return (
                                <button
                                    key={p.uid}
                                    type="button"
                                    role="listitem"
                                    className={`mm-group-person${on ? ' is-on' : ''}`}
                                    onClick={() => togglePerson(p.uid)}
                                    aria-pressed={on}
                                >
                                    <CommunityAvatar url={p.photoURL} name={p.displayName} size={36} />
                                    <span className="mm-group-person-meta">
                                        <strong>{p.displayName}</strong>
                                        <small>
                                            @{p.username}
                                            {followingIds.includes(p.uid)
                                                ? ` · ${t('community.explore.following')}`
                                                : ''}
                                        </small>
                                    </span>
                                    <span className="mm-group-person-mark" aria-hidden>
                                        {on ? '✓' : '+'}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <button
                    type="button"
                    className="mm-social-primary"
                    onClick={async () => {
                        try {
                            await onCreateGroup(pickedIds);
                            setPickedIds([]);
                            setPeopleQ('');
                        } catch {
                            /* a szülő már jelezte a hibát */
                        }
                    }}
                    disabled={busy}
                >
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
