import type { SocialProfile } from '../../utils/socialTypes';
import CommunityAvatar from './CommunityAvatar';

type CommunityProfileTabProps = {
    me: SocialProfile;
    profileShown: SocialProfile;
    followingView: boolean;
    busy: boolean;
    usernameDraft: string;
    bioDraft: string;
    onUsernameDraftChange: (value: string) => void;
    onBioDraftChange: (value: string) => void;
    onToggleFollow: (target: SocialProfile) => void;
    onStartMessage: (uid: string) => void;
    onSaveProfile: () => void;
};

export default function CommunityProfileTab({
    me,
    profileShown,
    followingView,
    busy,
    usernameDraft,
    bioDraft,
    onUsernameDraftChange,
    onBioDraftChange,
    onToggleFollow,
    onStartMessage,
    onSaveProfile,
}: CommunityProfileTabProps) {
    return (
        <div className="mm-social-panel">
            <div className="mm-social-profile-hero">
                <CommunityAvatar url={profileShown.photoURL} name={profileShown.displayName} size={84} />
                <div>
                    <h2>{profileShown.displayName}</h2>
                    <p>@{profileShown.username}</p>
                    <p className="mm-social-muted">{profileShown.bio || 'Még nincs bio.'}</p>
                    <div className="mm-social-stats">
                        <span>
                            <strong>{profileShown.postCount}</strong> poszt
                        </span>
                        <span>
                            <strong>{profileShown.followerCount}</strong> követő
                        </span>
                        <span>
                            <strong>{profileShown.followingCount}</strong> követés
                        </span>
                        {profileShown.showXp && (
                            <span>
                                <strong>{profileShown.xp}</strong> XP · {profileShown.rank}
                            </span>
                        )}
                    </div>
                    {profileShown.uid !== me.uid ? (
                        <div className="mm-social-profile-actions">
                            <button
                                type="button"
                                className="mm-social-primary"
                                onClick={() => onToggleFollow(profileShown)}
                                disabled={busy}
                            >
                                {followingView ? 'Követed' : 'Követés'}
                            </button>
                            <button
                                type="button"
                                className="mm-social-ghost"
                                onClick={() => onStartMessage(profileShown.uid)}
                            >
                                Üzenet
                            </button>
                        </div>
                    ) : (
                        <div className="mm-social-compose mm-social-compose-stack">
                            <h3>Saját profil szerkesztése</h3>
                            <input
                                value={usernameDraft}
                                onChange={(e) => onUsernameDraftChange(e.target.value)}
                                placeholder="Felhasználónév"
                                maxLength={20}
                            />
                            <textarea
                                value={bioDraft}
                                onChange={(e) => onBioDraftChange(e.target.value)}
                                placeholder="Bio"
                                maxLength={160}
                                rows={2}
                            />
                            <button
                                type="button"
                                className="mm-social-primary"
                                onClick={onSaveProfile}
                                disabled={busy}
                            >
                                Mentés
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
