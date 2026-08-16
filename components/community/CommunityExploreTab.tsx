import type { SocialProfile } from '../../utils/socialTypes';
import { useLang } from '../../utils/i18n';
import CommunityAvatar from './CommunityAvatar';

type CommunityExploreTabProps = {
    me: SocialProfile;
    leaderboard: SocialProfile[];
    profiles: SocialProfile[];
    followingIds: string[];
    busy: boolean;
    onOpenProfile: (uid: string) => void;
    onToggleFollow: (target: SocialProfile) => void;
    onMessage: (uid: string) => void;
};

export default function CommunityExploreTab({
    me,
    leaderboard,
    profiles,
    followingIds,
    busy,
    onOpenProfile,
    onToggleFollow,
    onMessage,
}: CommunityExploreTabProps) {
    const { t } = useLang();
    return (
        <div className="mm-social-panel">
            <h2 className="mm-social-section-title">{t('community.explore.leaderboard')}</h2>
            <p className="mm-social-muted">{t('community.explore.leaderboardHint')}</p>
            <div className="mm-social-leaderboard">
                {leaderboard.map((p, i) => (
                    <button
                        key={p.uid}
                        type="button"
                        className="mm-social-leader-row"
                        onClick={() => onOpenProfile(p.uid)}
                    >
                        <span className="mm-social-rank">#{i + 1}</span>
                        <CommunityAvatar url={p.photoURL} name={p.displayName} size={36} />
                        <span className="mm-social-leader-meta">
                            <strong>{p.displayName}</strong>
                            <small>
                                @{p.username} · {p.rank}
                            </small>
                        </span>
                        <strong className="mm-social-xp">{p.xp} XP</strong>
                    </button>
                ))}
            </div>

            <h2 className="mm-social-section-title">{t('community.explore.students')}</h2>
            <div className="mm-social-people-grid">
                {profiles.map((p) => (
                    <div key={p.uid} className="mm-social-person-card">
                        <button type="button" className="mm-social-userbtn" onClick={() => onOpenProfile(p.uid)}>
                            <CommunityAvatar url={p.photoURL} name={p.displayName} size={56} />
                            <span>
                                <strong>{p.displayName}</strong>
                                <small>
                                    @{p.username}
                                    {p.showXp ? ` · ${p.xp} XP` : ''}
                                </small>
                            </span>
                        </button>
                        {p.uid !== me.uid && (
                            <div className="mm-social-person-actions">
                                <button
                                    type="button"
                                    className="mm-social-primary mm-social-btn-sm"
                                    onClick={() => onToggleFollow(p)}
                                    disabled={busy}
                                >
                                    {followingIds.includes(p.uid) ? t('community.explore.following') : t('community.explore.follow')}
                                </button>
                                <button
                                    type="button"
                                    className="mm-social-ghost mm-social-btn-sm"
                                    onClick={() => onMessage(p.uid)}
                                >
                                    {t('community.explore.message')}
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
