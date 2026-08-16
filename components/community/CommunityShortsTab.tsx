import { useEffect, useRef } from 'react';
import type { SocialPost } from '../../utils/socialTypes';
import { useLang } from '../../utils/i18n';
import CommunityAvatar from './CommunityAvatar';

type CommunityShortsTabProps = {
    currentShort: SocialPost | null;
    shortIndex: number;
    shortsLength: number;
    onPrev: () => void;
    onNext: () => void;
    onOpenProfile: (uid: string) => void;
};

export default function CommunityShortsTab({
    currentShort,
    shortIndex,
    shortsLength,
    onPrev,
    onNext,
    onOpenProfile,
}: CommunityShortsTabProps) {
    const { t } = useLang();
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const el = videoRef.current;
        if (!el || !currentShort?.videoUrl) return;
        el.load();
        const play = el.play();
        if (play && typeof play.catch === 'function') play.catch(() => undefined);
        return () => {
            el.pause();
        };
    }, [currentShort?.id, currentShort?.videoUrl]);

    return (
        <div className="mm-social-panel mm-social-shorts-panel">
            {currentShort?.videoUrl ? (
                <div className="mm-social-short-stage mm-social-short-stage--video">
                    <div className="mm-social-short-card ig mm-social-short-card--video">
                        <video
                            ref={videoRef}
                            className="mm-social-short-video"
                            src={currentShort.videoUrl}
                            controls
                            playsInline
                            loop
                            muted
                            preload="metadata"
                        />
                        <div className="mm-social-short-meta">
                            <button
                                type="button"
                                className="mm-social-userbtn"
                                onClick={() => {
                                    if (currentShort.authorId.startsWith('mihasocial')) return;
                                    onOpenProfile(currentShort.authorId);
                                }}
                            >
                                <CommunityAvatar url={currentShort.authorPhoto} name={currentShort.authorName} />
                                <span>
                                    <strong>{currentShort.authorName}</strong>
                                    <small>@{currentShort.authorUsername}</small>
                                </span>
                            </button>
                            {currentShort.text ? <p className="mm-social-short-caption">{currentShort.text}</p> : null}
                        </div>
                    </div>
                    <div className="mm-social-short-nav">
                        <button type="button" disabled={shortIndex <= 0} onClick={onPrev}>
                            {t('community.shorts.prev')}
                        </button>
                        <span>
                            {shortIndex + 1}/{shortsLength || 1}
                        </span>
                        <button type="button" disabled={shortIndex >= shortsLength - 1} onClick={onNext}>
                            {t('community.shorts.next')}
                        </button>
                    </div>
                </div>
            ) : (
                <p className="mm-social-empty">{t('community.shorts.empty')}</p>
            )}
        </div>
    );
}
