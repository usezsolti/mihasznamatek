import type { MathShort } from '../../utils/socialTypes';
import { useLang } from '../../utils/i18n';

type CommunityShortsTabProps = {
    shortTopic: string;
    onShortTopicChange: (value: string) => void;
    onGenerateShort: () => void;
    busy: boolean;
    currentShort: MathShort | null;
    shortIndex: number;
    shortsLength: number;
    onPrev: () => void;
    onNext: () => void;
};

export default function CommunityShortsTab({
    shortTopic,
    onShortTopicChange,
    onGenerateShort,
    busy,
    currentShort,
    shortIndex,
    shortsLength,
    onPrev,
    onNext,
}: CommunityShortsTabProps) {
    const { t } = useLang();
    return (
        <div className="mm-social-panel mm-social-shorts-panel">
            <div className="mm-social-shorts-toolbar">
                <input
                    value={shortTopic}
                    onChange={(e) => onShortTopicChange(e.target.value)}
                    placeholder={t('community.shorts.topicPlaceholder')}
                />
                <button type="button" className="mm-social-primary" onClick={onGenerateShort} disabled={busy}>
                    {t('community.shorts.generate')}
                </button>
            </div>
            {currentShort ? (
                <div className="mm-social-short-stage">
                    <div className="mm-social-short-card ig">
                        <p className="mm-social-short-topic">
                            {currentShort.topic} · {currentShort.difficulty}
                        </p>
                        <h2>{currentShort.title}</h2>
                        <p className="mm-social-short-hook">{currentShort.hook}</p>
                        <p className="mm-social-short-body">{currentShort.body}</p>
                        <p className="mm-social-short-tip">{t('community.shorts.tip', { tip: currentShort.tip })}</p>
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
