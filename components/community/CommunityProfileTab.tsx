import { useState } from 'react';
import type { SocialPost, SocialProfile } from '../../utils/socialTypes';
import { useLang } from '../../utils/i18n';
import CommunityAvatar from './CommunityAvatar';
import CommunityPostCard from './CommunityPostCard';

type CommunityProfileTabProps = {
    me: SocialProfile;
    profileShown: SocialProfile;
    followingView: boolean;
    busy: boolean;
    usernameDraft: string;
    bioDraft: string;
    posts: SocialPost[];
    likedMap: Record<string, boolean>;
    onUsernameDraftChange: (value: string) => void;
    onBioDraftChange: (value: string) => void;
    onToggleFollow: (target: SocialProfile) => void;
    onStartMessage: (uid: string) => void;
    onSaveProfile: () => void;
    onOpenProfile: (uid: string) => void;
    onMessage: (uid: string) => void;
    onPostChanged: (next: SocialPost) => void;
};

type ProfileView = 'grid' | 'reels' | 'saved' | 'tagged';

export default function CommunityProfileTab({
    me,
    profileShown,
    followingView,
    busy,
    usernameDraft,
    bioDraft,
    posts,
    likedMap,
    onUsernameDraftChange,
    onBioDraftChange,
    onToggleFollow,
    onStartMessage,
    onSaveProfile,
    onOpenProfile,
    onMessage,
    onPostChanged,
}: CommunityProfileTabProps) {
    const { t } = useLang();
    const isSelf = profileShown.uid === me.uid;
    const [editing, setEditing] = useState(false);
    const [view, setView] = useState<ProfileView>('grid');
    const [lightbox, setLightbox] = useState<SocialPost | null>(null);

    const bioLines = (profileShown.bio || '')
        .split(/\n|•/)
        .map((s) => s.trim())
        .filter(Boolean);
    const bioCategory = bioLines[0] || '';
    const bioRest = bioLines.slice(1);
    const handle = (profileShown.username || profileShown.displayName || '').replace(/^@/, '');

    return (
        <div className="mm-ig-profile">
            <div className="mm-ig-profile-head">
                <div className="mm-ig-profile-avatar-wrap">
                    <span className="mm-ig-profile-note" aria-hidden>
                        Note…
                    </span>
                    <CommunityAvatar url={profileShown.photoURL} name={profileShown.displayName} size={150} />
                </div>

                <div className="mm-ig-profile-main">
                    <div className="mm-ig-profile-top">
                        <h1 className="mm-ig-profile-username">{handle}</h1>
                    </div>

                    <p className="mm-ig-profile-name">{profileShown.displayName}</p>

                    <div className="mm-ig-profile-stats">
                        <span>
                            <strong>{posts.length || profileShown.postCount}</strong> {t('community.profile.posts')}
                        </span>
                        <span>
                            <strong>{profileShown.followerCount}</strong> {t('community.profile.followers')}
                        </span>
                        <span>
                            <strong>{profileShown.followingCount}</strong> {t('community.profile.following')}
                        </span>
                    </div>

                    <div className="mm-ig-profile-bio-block">
                        {bioCategory ? (
                            <p className="mm-ig-profile-category">{bioCategory}</p>
                        ) : (
                            !editing && <p className="mm-ig-profile-bio-empty">{t('community.profile.noBio')}</p>
                        )}
                        {bioRest.map((line) => (
                            <p key={line} className="mm-ig-profile-bio-line">
                                {line}
                            </p>
                        ))}
                        {profileShown.showXp && (
                            <p className="mm-ig-profile-xp">
                                {profileShown.xp} XP · {profileShown.rank}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="mm-ig-profile-actions">
                {isSelf ? (
                    <>
                        <button
                            type="button"
                            className="mm-ig-btn mm-ig-btn-wide"
                            onClick={() => setEditing((v) => !v)}
                        >
                            {editing ? t('common.close') : t('community.profile.editProfile')}
                        </button>
                        <a href="/dashboard" className="mm-ig-btn mm-ig-btn-wide" style={{ textAlign: 'center', textDecoration: 'none' }}>
                            {t('community.profile.accountLessons')}
                        </a>
                    </>
                ) : (
                    <>
                        <button
                            type="button"
                            className={`mm-ig-btn mm-ig-btn-wide${followingView ? '' : ' is-primary'}`}
                            onClick={() => onToggleFollow(profileShown)}
                            disabled={busy}
                        >
                            {followingView ? t('community.profile.followingBtn') : t('community.profile.followBtn')}
                        </button>
                        <button
                            type="button"
                            className="mm-ig-btn mm-ig-btn-wide"
                            onClick={() => onStartMessage(profileShown.uid)}
                        >
                            {t('community.profile.messageBtn')}
                        </button>
                    </>
                )}
            </div>

            {isSelf && editing && (
                <div className="mm-ig-profile-edit">
                    <input
                        value={usernameDraft}
                        onChange={(e) => onUsernameDraftChange(e.target.value)}
                        placeholder={t('community.profile.usernamePlaceholder')}
                        maxLength={20}
                    />
                    <textarea
                        value={bioDraft}
                        onChange={(e) => onBioDraftChange(e.target.value)}
                        placeholder={t('community.profile.bioPlaceholder')}
                        maxLength={160}
                        rows={4}
                    />
                    <button
                        type="button"
                        className="mm-ig-btn is-primary"
                        onClick={() => {
                            onSaveProfile();
                            setEditing(false);
                        }}
                        disabled={busy}
                    >
                        {t('community.profile.save')}
                    </button>
                </div>
            )}

            <div className="mm-ig-highlights" aria-label={t('community.profile.highlights')}>
                <button type="button" className="mm-ig-highlight is-new" disabled title={t('community.messages.comingSoon')}>
                    <span>+</span>
                    <small>{t('community.profile.new')}</small>
                </button>
            </div>

            <div className="mm-ig-profile-tabs" role="tablist">
                {(
                    [
                        ['grid', '▦', t('community.profile.tabPosts')],
                        ['reels', '▶', t('community.profile.tabShorts')],
                        ['saved', '🔖', t('community.profile.tabSaved')],
                        ['tagged', '👤', t('community.profile.tabTagged')],
                    ] as const
                ).map(([id, icon, label]) => (
                    <button
                        key={id}
                        type="button"
                        role="tab"
                        className={view === id ? 'is-on' : ''}
                        aria-label={label}
                        onClick={() => setView(id)}
                    >
                        <span aria-hidden>{icon}</span>
                    </button>
                ))}
            </div>

            {view === 'grid' && (
                <div className="mm-ig-post-grid">
                    {posts.length === 0 && (
                        <p className="mm-ig-profile-empty">{t('community.profile.emptyPosts')}</p>
                    )}
                    {posts.map((p) => (
                        <button
                            key={p.id}
                            type="button"
                            className="mm-ig-grid-cell"
                            onClick={() => setLightbox(p)}
                        >
                            {p.videoUrl ? (
                                <>
                                    {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                                    <video src={p.videoUrl} muted playsInline preload="metadata" />
                                    <span className="mm-ig-grid-video" aria-hidden>
                                        ▶
                                    </span>
                                </>
                            ) : p.imageUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={p.imageUrl} alt="" />
                            ) : (
                                <span className="mm-ig-grid-text">{p.text.slice(0, 80)}</span>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {view !== 'grid' && (
                <p className="mm-ig-profile-empty">
                    {view === 'reels'
                        ? t('community.profile.comingShorts')
                        : view === 'saved'
                          ? t('community.profile.comingSaved')
                          : t('community.profile.comingTagged')}
                </p>
            )}

            {lightbox && (
                <div className="mm-ig-lightbox" role="dialog" aria-modal="true">
                    <button
                        type="button"
                        className="mm-ig-lightbox-close"
                        onClick={() => setLightbox(null)}
                        aria-label={t('common.close')}
                    >
                        ×
                    </button>
                    <div className="mm-ig-lightbox-card">
                        <CommunityPostCard
                            post={lightbox}
                            me={me}
                            liked={!!likedMap[lightbox.id]}
                            onOpenProfile={onOpenProfile}
                            onMessage={onMessage}
                            onChanged={(next) => {
                                onPostChanged(next);
                                setLightbox(next);
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
