import type { SocialPost, SocialProfile } from '../../utils/socialTypes';
import CommunityAvatar from './CommunityAvatar';
import CommunityPostCard from './CommunityPostCard';

type CommunityFeedTabProps = {
    me: SocialProfile;
    postText: string;
    onPostTextChange: (value: string) => void;
    onCreatePost: () => void;
    busy: boolean;
    posts: SocialPost[];
    likedMap: Record<string, boolean>;
    onOpenProfile: (uid: string) => void;
    onMessage: (uid: string) => void;
    onPostChanged: (next: SocialPost) => void;
};

export default function CommunityFeedTab({
    me,
    postText,
    onPostTextChange,
    onCreatePost,
    busy,
    posts,
    likedMap,
    onOpenProfile,
    onMessage,
    onPostChanged,
}: CommunityFeedTabProps) {
    return (
        <div className="mm-social-panel">
            <div className="mm-social-compose">
                <CommunityAvatar url={me.photoURL} name={me.displayName} />
                <textarea
                    value={postText}
                    onChange={(e) => onPostTextChange(e.target.value)}
                    placeholder="Mi a matek hangulat? Ossz meg egy tippet, sikert, kérdést…"
                    maxLength={500}
                    rows={3}
                />
                <button type="button" className="mm-social-primary" onClick={onCreatePost} disabled={busy}>
                    Posztolás
                </button>
            </div>
            <div className="mm-social-feed">
                {posts.length === 0 && (
                    <p className="mm-social-empty">
                        Még nincs poszt a feedben — írj be valamit fent, és nyomd meg a Posztolás gombot.
                    </p>
                )}
                {posts.map((p) => (
                    <CommunityPostCard
                        key={p.id}
                        post={p}
                        me={me}
                        liked={!!likedMap[p.id]}
                        onOpenProfile={onOpenProfile}
                        onMessage={onMessage}
                        onChanged={onPostChanged}
                    />
                ))}
            </div>
        </div>
    );
}
