import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import type { SocialPost, SocialProfile } from '../../utils/socialTypes';
import { sortSocialFeed } from '../../utils/socialDomain';
import { useLang } from '../../utils/i18n';
import CommunityAvatar from './CommunityAvatar';
import CommunityPostCard from './CommunityPostCard';

type CommunityFeedTabProps = {
    me: SocialProfile;
    postText: string;
    onPostTextChange: (value: string) => void;
    mediaFile: File | null;
    onMediaFileChange: (file: File | null) => void;
    onCreatePost: (file?: File | null, daily?: boolean) => void;
    canPostDaily?: boolean;
    busy: boolean;
    posts: SocialPost[];
    likedMap: Record<string, boolean>;
    followingIds: string[];
    storyProfiles: SocialProfile[];
    onOpenProfile: (uid: string) => void;
    onMessage: (uid: string) => void;
    onPostChanged: (next: SocialPost) => void;
};

export default function CommunityFeedTab({
    me,
    postText,
    onPostTextChange,
    mediaFile = null,
    onMediaFileChange,
    onCreatePost,
    canPostDaily = false,
    busy,
    posts = [],
    likedMap = {},
    followingIds = [],
    storyProfiles = [],
    onOpenProfile,
    onMessage,
    onPostChanged,
}: CommunityFeedTabProps) {
    const { t } = useLang();
    const [feedMode, setFeedMode] = useState<'foryou' | 'following'>('foryou');
    const [asDaily, setAsDaily] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!mediaFile) {
            setPreviewUrl(null);
            return;
        }
        const url = URL.createObjectURL(mediaFile);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [mediaFile]);

    const safePosts = Array.isArray(posts) ? posts : [];
    const safeFollowing = Array.isArray(followingIds) ? followingIds : [];
    const safeStories = Array.isArray(storyProfiles) ? storyProfiles : [];

    const visiblePosts = sortSocialFeed(
        feedMode === 'following'
            ? safePosts.filter((p) => safeFollowing.includes(p.authorId) || p.authorId === me.uid)
            : safePosts
    );

    const onPick = (e: ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] || null;
        e.target.value = '';
        if (f && (f.type.startsWith('video/') || /\.(mp4|webm|mov|m4v|avi|mkv)$/i.test(f.name))) {
            onMediaFileChange(null);
            return;
        }
        onMediaFileChange(f);
    };

    return (
        <div className="mm-social-panel mm-social-feed-panel">
            <div className="mm-ig-feed-tabs" role="tablist" aria-label="Feed">
                <button
                    type="button"
                    role="tab"
                    className={feedMode === 'foryou' ? 'is-on' : ''}
                    aria-selected={feedMode === 'foryou'}
                    onClick={() => setFeedMode('foryou')}
                >
                    {t('community.feed.forYou')}
                </button>
                <button
                    type="button"
                    role="tab"
                    className={feedMode === 'following' ? 'is-on' : ''}
                    aria-selected={feedMode === 'following'}
                    onClick={() => setFeedMode('following')}
                >
                    {t('community.feed.following')}
                </button>
            </div>

            {safeStories.length > 0 && (
                <div className="mm-ig-stories" aria-label={t('community.feed.stories')}>
                    {safeStories.map((p) => {
                        const isSelf = p.uid === me.uid;
                        return (
                            <button
                                key={p.uid}
                                type="button"
                                className={`mm-ig-story${isSelf ? ' is-self' : ''}`}
                                onClick={() => onOpenProfile(p.uid)}
                            >
                                <span className="mm-ig-story-ring">
                                    <CommunityAvatar url={p.photoURL} name={p.displayName} size={56} />
                                </span>
                                <span className="mm-ig-story-name">
                                    {isSelf ? t('community.feed.you') : p.username || p.displayName}
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}

            <div className="mm-social-compose ig">
                <CommunityAvatar url={me.photoURL} name={me.displayName} />
                <div className="mm-social-compose-body">
                    <textarea
                        value={postText}
                        onChange={(e) => onPostTextChange(e.target.value)}
                        placeholder=""
                        maxLength={500}
                        rows={2}
                    />
                    {previewUrl && mediaFile && mediaFile.type.startsWith('image/') && (
                        <div className="mm-social-media-preview">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={previewUrl} alt={t('community.feed.previewAlt')} />
                            <button
                                type="button"
                                className="mm-social-ghost mm-social-btn-sm"
                                onClick={() => onMediaFileChange(null)}
                            >
                                {t('community.feed.removeMedia')}
                            </button>
                        </div>
                    )}
                    <div className="mm-social-compose-actions">
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={onPick}
                        />
                        {canPostDaily && (
                            <label className="mm-daily-toggle">
                                <input
                                    type="checkbox"
                                    checked={asDaily}
                                    onChange={(e) => setAsDaily(e.target.checked)}
                                    disabled={busy}
                                />
                                {t('community.feed.dailyToggle')}
                            </label>
                        )}
                        <button
                            type="button"
                            className="mm-social-ghost mm-social-btn-sm mm-social-attach-btn"
                            onClick={() => fileRef.current?.click()}
                            disabled={busy}
                            title={t('community.feed.mediaButton')}
                            aria-label={t('community.feed.mediaButton')}
                        >
                            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
                                <path
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21.4 11.6l-8.2 8.2a5.5 5.5 0 0 1-7.8-7.8l8.5-8.5a3.5 3.5 0 0 1 5 5l-8.5 8.4a1.5 1.5 0 0 1-2.1-2.1l7.4-7.4"
                                />
                            </svg>
                        </button>
                        <button
                            type="button"
                            className="mm-social-primary"
                            onClick={() => {
                                onCreatePost(null, canPostDaily && asDaily);
                                setAsDaily(false);
                            }}
                            disabled={busy || (!postText.trim() && !mediaFile)}
                        >
                            {t('community.feed.share')}
                        </button>
                    </div>
                </div>
            </div>
            <div className="mm-social-feed">
                {visiblePosts.length === 0 && (
                    <p className="mm-social-empty">
                        {feedMode === 'following'
                            ? t('community.feed.emptyFollowing')
                            : t('community.feed.emptyForYou')}
                    </p>
                )}
                {visiblePosts.map((p) => (
                    <CommunityPostCard
                        key={p.id}
                        post={p}
                        me={me}
                        liked={!!likedMap?.[p.id]}
                        onOpenProfile={onOpenProfile}
                        onMessage={onMessage}
                        onChanged={onPostChanged}
                    />
                ))}
            </div>
        </div>
    );
}
