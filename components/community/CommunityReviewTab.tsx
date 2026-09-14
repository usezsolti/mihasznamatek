import type { SocialPost, SocialProfile } from '../../utils/socialTypes';
import { useLang } from '../../utils/i18n';
import CommunityPostCard from './CommunityPostCard';

type CommunityReviewTabProps = {
    me: SocialProfile;
    posts: SocialPost[];
    likedMap: Record<string, boolean>;
    busy: boolean;
    onApprove: (postId: string) => void;
    onReject: (postId: string) => void;
    onOpenProfile: (uid: string) => void;
    onMessage: (uid: string) => void;
    onPostChanged: (next: SocialPost) => void;
};

export default function CommunityReviewTab({
    me,
    posts,
    likedMap,
    busy,
    onApprove,
    onReject,
    onOpenProfile,
    onMessage,
    onPostChanged,
}: CommunityReviewTabProps) {
    const { t } = useLang();
    return (
        <div className="mm-social-panel mm-review-panel">
            <h2 className="mm-review-title">{t('community.review.title')}</h2>
            <p className="mm-review-lead">{t('community.review.lead')}</p>
            {posts.length === 0 && <p className="mm-social-empty">{t('community.review.empty')}</p>}
            {posts.map((p) => (
                <div key={p.id} className="mm-review-item">
                    <CommunityPostCard
                        post={p}
                        me={me}
                        liked={!!likedMap[p.id]}
                        onOpenProfile={onOpenProfile}
                        onMessage={onMessage}
                        onChanged={onPostChanged}
                    />
                    <div className="mm-review-actions">
                        <button
                            type="button"
                            className="mm-social-primary"
                            disabled={busy}
                            onClick={() => onApprove(p.id)}
                        >
                            {t('community.review.approve')}
                        </button>
                        <button
                            type="button"
                            className="mm-social-ghost"
                            disabled={busy}
                            onClick={() => onReject(p.id)}
                        >
                            {t('community.review.reject')}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
