import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import type { SocialPost, SocialProfile } from '../../utils/socialTypes';
import { useLang } from '../../utils/i18n';
import CommunityAvatar from './CommunityAvatar';
import CommunityPostCard from './CommunityPostCard';

type CommunityFeedTabProps = {
    me: SocialProfile;
    postText: string;
    onPostTextChange: (value: string) => void;
    mediaFile: File | null;
    onMediaFileChange: (file: File | null) => void;
    onCreatePost: () => void;
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

    const visiblePosts =
        feedMode === 'following'
            ? safePosts.filter((p) => safeFollowing.includes(p.authorId) || p.authorId === me.uid)
            : safePosts;

    const onPick = (e: ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] || null;
        onMediaFileChange(f);
        e.target.value = '';
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

            <div className="mm-ig-stories" aria-label={t('community.feed.stories')}>
                <button type="button" className="mm-ig-story is-self" onClick={() => onOpenProfile(me.uid)}>
                    <span className="mm-ig-story-ring">
                        <CommunityAvatar url={me.photoURL} name={me.displayName} size={56} />
                    </span>
                    <span className="mm-ig-story-name">{t('community.feed.you')}</span>
                </button>
                {safeStories.map((p) => (
                    <button
                        key={p.uid}
                        type="button"
                        className="mm-ig-story"
                        onClick={() => onOpenProfile(p.uid)}
                    >
                        <span className="mm-ig-story-ring">
                            <CommunityAvatar url={p.photoURL} name={p.displayName} size={56} />
                        </span>
                        <span className="mm-ig-story-name">{p.username || p.displayName}</span>
                    </button>
                ))}
            </div>

            <div className="mm-social-compose ig">
                <CommunityAvatar url={me.photoURL} name={me.displayName} />
                <div className="mm-social-compose-body">
                    <textarea
                        value={postText}
                        onChange={(e) => onPostTextChange(e.target.value)}
                        placeholder={t('community.feed.composePlaceholder')}
                        maxLength={500}
                        rows={2}
                    />
                    {previewUrl && mediaFile && (
                        <div className="mm-social-media-preview">
                            {mediaFile.type.startsWith('video/') ? (
                                // eslint-disable-next-line jsx-a11y/media-has-caption
                                <video src={previewUrl} controls playsInline />
                            ) : (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={previewUrl} alt={t('community.feed.previewAlt')} />
                            )}
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
                            accept="image/*,video/*"
                            hidden
                            onChange={onPick}
                        />
                        <button
                            type="button"
                            className="mm-social-ghost mm-social-btn-sm"
                            onClick={() => fileRef.current?.click()}
                            disabled={busy}
                        >
                            {t('community.feed.mediaButton')}
                        </button>
                        <button
                            type="button"
                            className="mm-social-primary"
                            onClick={onCreatePost}
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
