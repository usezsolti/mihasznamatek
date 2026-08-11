import { useCallback, useEffect, useMemo, useState } from 'react';
import type { SocialComment, SocialPost, SocialProfile } from '../utils/socialTypes';
import { addComment, hasLiked, listComments, toggleLike } from '../utils/social';

type Props = {
    post: SocialPost;
    me: SocialProfile;
    liked: boolean;
    onOpenProfile: (uid: string) => void;
    onMessage: (uid: string) => void;
    onChanged: (post: SocialPost) => void;
};

function Avatar({ url, name }: { url?: string; name: string }) {
    if (url) {
        // eslint-disable-next-line @next/next/no-img-element
        return <img className="mm-social-avatar" src={url} alt="" />;
    }
    return (
        <span className="mm-social-avatar mm-social-avatar-fallback" aria-hidden>
            {(name[0] || '?').toUpperCase()}
        </span>
    );
}

export default function PostCard({ post, me, liked: likedProp, onOpenProfile, onMessage, onChanged }: Props) {
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
        const list = await listComments(post.id);
        setComments(list);
    }, [post.id]);

    const onLike = async () => {
        if (busy) return;
        setBusy(true);
        try {
            const res = await toggleLike(post.id, me.uid);
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
            const c = await addComment(post.id, me, draft);
            setComments((prev) => [...prev, c]);
            setDraft('');
            onChanged({ ...post, commentCount: post.commentCount + 1, likeCount });
        } catch (e: any) {
            alert(e?.message || 'Komment hiba');
        } finally {
            setBusy(false);
        }
    };

    const timeLabel = useMemo(() => {
        const diff = Date.now() - post.createdAtMs;
        const m = Math.floor(diff / 60000);
        if (m < 1) return 'most';
        if (m < 60) return `${m} p`;
        const h = Math.floor(m / 60);
        if (h < 24) return `${h} ó`;
        return `${Math.floor(h / 24)} n`;
    }, [post.createdAtMs]);

    return (
        <article className="mm-social-post">
            <header className="mm-social-post-head">
                <button type="button" className="mm-social-userbtn" onClick={() => onOpenProfile(post.authorId)}>
                    <Avatar url={post.authorPhoto} name={post.authorName} />
                    <span>
                        <strong>{post.authorName}</strong>
                        <small>
                            @{post.authorUsername} · {timeLabel}
                        </small>
                    </span>
                </button>
                {post.authorId !== me.uid && (
                    <button type="button" className="mm-social-ghost" onClick={() => onMessage(post.authorId)}>
                        Üzenet
                    </button>
                )}
            </header>
            <p className="mm-social-post-text">{post.text}</p>
            {post.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="mm-social-post-image" src={post.imageUrl} alt="" />
            ) : null}
            <div className="mm-social-post-actions">
                <button type="button" className={liked ? 'is-on' : ''} onClick={onLike} disabled={busy}>
                    {liked ? '♥' : '♡'} {likeCount}
                </button>
                <button type="button" onClick={onToggleComments}>
                    💬 {post.commentCount}
                </button>
            </div>
            {showComments && (
                <div className="mm-social-comments">
                    {comments.map((c) => (
                        <div key={c.id} className="mm-social-comment">
                            <Avatar url={c.authorPhoto} name={c.authorName} />
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
                            placeholder="Komment…"
                            maxLength={300}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') onSubmitComment();
                            }}
                        />
                        <button type="button" onClick={onSubmitComment} disabled={busy || !draft.trim()}>
                            Küld
                        </button>
                    </div>
                </div>
            )}
        </article>
    );
}

export async function resolveLikedMap(posts: SocialPost[], uid: string): Promise<Record<string, boolean>> {
    const entries = await Promise.all(
        posts.map(async (p) => [p.id, await hasLiked(p.id, uid)] as const)
    );
    return Object.fromEntries(entries);
}
