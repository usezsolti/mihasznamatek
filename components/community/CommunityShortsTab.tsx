import type { MathShort } from '../../utils/socialTypes';

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
    return (
        <div className="mm-social-panel">
            <div className="mm-social-shorts-toolbar">
                <input
                    value={shortTopic}
                    onChange={(e) => onShortTopicChange(e.target.value)}
                    placeholder="Téma (pl. deriválás)"
                />
                <button type="button" className="mm-social-primary" onClick={onGenerateShort} disabled={busy}>
                    AI short generálás
                </button>
            </div>
            {currentShort ? (
                <div className="mm-social-short-card">
                    <p className="mm-social-short-topic">
                        {currentShort.topic} · {currentShort.difficulty}
                    </p>
                    <h2>{currentShort.title}</h2>
                    <p className="mm-social-short-hook">{currentShort.hook}</p>
                    <p className="mm-social-short-body">{currentShort.body}</p>
                    <p className="mm-social-short-tip">Tipp: {currentShort.tip}</p>
                    <div className="mm-social-short-nav">
                        <button type="button" disabled={shortIndex <= 0} onClick={onPrev}>
                            ↑ Előző
                        </button>
                        <span>
                            {shortIndex + 1}/{shortsLength}
                        </span>
                        <button type="button" disabled={shortIndex >= shortsLength - 1} onClick={onNext}>
                            Következő ↓
                        </button>
                    </div>
                </div>
            ) : (
                <p className="mm-social-muted">Generálj egy AI matek shortot!</p>
            )}
        </div>
    );
}
