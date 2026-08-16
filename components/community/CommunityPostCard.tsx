import { useCallback, useEffect, useMemo, useState } from 'react';
import type { SocialComment, SocialPost, SocialProfile } from '../../utils/socialTypes';
import { apiAddComment, apiHasLiked, apiListComments, apiToggleLike } from '../../utils/socialApi';
import { useLang } from '../../utils/i18n';
import CommunityAvatar from './CommunityAvatar';

type CommunityPostCardProps = {
    post: SocialPost;
    me: SocialProfile;
    liked: boolean;
    onOpenProfile: (uid: string) => void;
    onMessage: (uid: string) => void;
    onChanged: (post: SocialPost) => void;
};

export default function CommunityPostCard({ post, me, liked: likedProp, onOpenProfile, onMessage, onChanged }: CommunityPostCardProps) {
    const { t } = useLang();
    const [liked, setLiked] = useState(likedProp);
    const [likeCount, setLikeCount] = useState(post.likeCount);
    const [comments, setComments] = useState<SocialComment[]>([]);
    const [showComments, setShowComments] = useState(false);
    const [draft, setDraft] = useState('');
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        setLiked(likedProp);
        setLikeCount(post.likeCount);
    }, [likedProp, post.likeCount, post.id]);

    const loadComments = useCallback(async () => {
        const list = await apiListComments(post.id);
        setComments(list);
    }, [post.id]);

    const onLike = async () => {
        if (busy) return;
        setBusy(true);
        try {
            const res = await apiToggleLike(post.id, me.uid);
            setLiked(res.liked);
            setLikeCount(res.likeCount);
            onChanged({ ...post, likeCount: res.likeCount });
        } finally {
            setBusy(false);
        }
    };

    const onToggleComments = async () => {
        const next = !showComments;
        setShowComments(next);
        if (next) await loadComments();
    };

    const onSubmitComment = async () => {
        if (!draft.trim() || busy) return;
        setBusy(true);
        try {
            const c = await apiAddComment(post.id, me, draft);
            setComments((prev) => [...prev, c]);
            setDraft('');
            onChanged({ ...post, commentCount: post.commentCount + 1, likeCount });
        } catch (e: any) {
            alert(e?.message || t('community.post.commentError'));
        } finally {
            setBusy(false);
        }
    };

    const timeLabel = useMemo(() => {
        const diff = Date.now() - post.createdAtMs;
        const m = Math.floor(diff / 60000);
        if (m < 1) return t('community.time.now');
        if (m < 60) return t('community.time.minutesLong', { n: String(m) });
        const h = Math.floor(m / 60);
        if (h < 24) return t('community.time.hoursLong', { n: String(h) });
        return t('community.time.daysLong', { n: String(Math.floor(h / 24)) });
    }, [post.createdAtMs, t]);

    return (
        <div className="mm-social-post">
            <div className="mm-social-post-head">
                <button type="button" className="mm-social-userbtn" onClick={() => onOpenProfile(post.authorId)}>
                    <CommunityAvatar url={post.authorPhoto} name={post.authorName} />
                    <span>
                        <strong>{post.authorName}</strong>
                        <small>
                            @{post.authorUsername} · {timeLabel}
                        </small>
                    </span>
                </button>
                {post.authorId !== me.uid && (
                    <button type="button" className="mm-social-ghost" onClick={() => onMessage(post.authorId)}>
                        {t('community.post.message')}
                    </button>
                )}
            </div>
            {post.text ? <p className="mm-social-post-text">{post.text}</p> : null}
            {post.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="mm-social-post-image" src={post.imageUrl} alt="" />
            ) : null}
            {post.videoUrl ? (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <video className="mm-social-post-video" src={post.videoUrl} controls playsInline preload="metadata" />
            ) : null}
            <div className="mm-social-post-actions">
                <button type="button" className={liked ? 'is-on' : ''} onClick={onLike} disabled={busy}>
                    {liked ? '♥' : '♡'} {likeCount}
                </button>
                <button type="button" onClick={onToggleComments}>
                    💬 {post.commentCount}
                </button>
                {post.authorId !== me.uid && (
                    <button type="button" onClick={() => onMessage(post.authorId)}>
                        ✉ {t('community.post.message')}
                    </button>
                )}
            </div>
            {showComments && (
                <div className="mm-social-comments">
                    {comments.map((c) => (
                        <div key={c.id} className="mm-social-comment">
                            <CommunityAvatar url={c.authorPhoto} name={c.authorName} />
                            <div>
                                <strong>{c.authorName}</strong>
                                <p>{c.text}</p>
                            </div>
                        </div>
                    ))}
                    <div className="mm-social-comment-compose">
                        <input
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            placeholder={t('community.post.commentPlaceholder')}
                            maxLength={300}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') onSubmitComment();
                            }}
                        />
                        <button type="button" onClick={onSubmitComment} disabled={busy || !draft.trim()}>
                            {t('community.post.send')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export async function resolveLikedMap(posts: SocialPost[], uid: string): Promise<Record<string, boolean>> {
    const entries = await Promise.all(
        posts.map(async (p) => [p.id, await apiHasLiked(p.id, uid)] as const)
    );
    return Object.fromEntries(entries);
}
