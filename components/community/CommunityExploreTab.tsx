import type { SocialProfile } from '../../utils/socialTypes';
import CommunityAvatar from './CommunityAvatar';

type CommunityExploreTabProps = {
    me: SocialProfile;
    leaderboard: SocialProfile[];
    profiles: SocialProfile[];
    followingIds: string[];
    busy: boolean;
    onOpenProfile: (uid: string) => void;
    onToggleFollow: (target: SocialProfile) => void;
};

export default function CommunityExploreTab({
    me,
    leaderboard,
    profiles,
    followingIds,
    busy,
    onOpenProfile,
    onToggleFollow,
}: CommunityExploreTabProps) {
    return (
        <div className="mm-social-panel">
            <h2>XP ranglista</h2>
            <p className="mm-social-muted">Lásd egymás pontjait — aki megosztja az XP-jét.</p>
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
            <h2>Diákok</h2>
            <div className="mm-social-people">
                {profiles.map((p) => (
                    <div key={p.uid} className="mm-social-person">
                        <button type="button" className="mm-social-userbtn" onClick={() => onOpenProfile(p.uid)}>
                            <CommunityAvatar url={p.photoURL} name={p.displayName} />
                            <span>
                                <strong>{p.displayName}</strong>
                                <small>
                                    @{p.username}
                                    {p.showXp ? ` · ${p.xp} XP` : ''}
                                </small>
                            </span>
                        </button>
                        {p.uid !== me.uid && (
                            <button
                                type="button"
                                className="mm-social-ghost"
                                onClick={() => onToggleFollow(p)}
                                disabled={busy}
                            >
                                {followingIds.includes(p.uid) ? 'Követed' : 'Követés'}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
