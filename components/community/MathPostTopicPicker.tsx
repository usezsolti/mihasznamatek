import { MATH_POST_TOPICS, type MathPostTopic } from '../../utils/socialTypes';
import { useLang } from '../../utils/i18n';

type MathPostTopicPickerProps = {
    value: string;
    onChange: (topic: MathPostTopic) => void;
};

export default function MathPostTopicPicker({ value, onChange }: MathPostTopicPickerProps) {
    const { t } = useLang();
    return (
        <div className="mm-math-topics" role="group" aria-label={t('community.feed.topicLabel')}>
            <span className="mm-math-topics-label">{t('community.feed.topicLabel')}</span>
            <div className="mm-math-topics-row">
                {MATH_POST_TOPICS.map((topic) => (
                    <button
                        key={topic}
                        type="button"
                        className={`mm-math-topic${value === topic ? ' is-on' : ''}`}
                        onClick={() => onChange(topic)}
                    >
                        {t(`community.topic.${topic}`)}
                    </button>
                ))}
            </div>
        </div>
    );
}
