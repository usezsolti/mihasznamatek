import SuccessSpeedometer, { speedometerColor } from './SuccessSpeedometer';
import type { ExamTopicGauge } from '../utils/examTopicStats';

type Props = {
    gauges: ExamTopicGauge[];
    title?: string;
    lead?: string;
};

export default function ExamTopicGauges({
    gauges,
    title = 'Témakörök a dolgozatokból',
    lead = 'A helyes és hibás feladatok témakörönként — a gyengébb témák elöl.',
}: Props) {
    if (!gauges.length) return null;

    return (
        <section className="exam-topic-gauges">
            <h3 className="exam-topic-gauges-title">{title}</h3>
            {lead ? <p className="exam-topic-gauges-lead">{lead}</p> : null}
            <div className="topics-grid profile-game-grid">
                {gauges.map((g) => {
                    const color = speedometerColor(g.percent);
                    return (
                        <div key={g.topicId} className="topic-card speedometer-card">
                            <div className="card-header">
                                <div className="topic-icon" style={{ backgroundColor: color }}>
                                    {g.percent < 50 ? '⚠️' : g.percent >= 80 ? '✓' : '●'}
                                </div>
                                <div className="topic-info">
                                    <h3 className="topic-title">{g.title}</h3>
                                </div>
                            </div>
                            <SuccessSpeedometer
                                percent={g.percent}
                                color={color}
                                compact
                                label={`${g.correct} helyes · ${g.wrong} hibás`}
                                sublabel={`${g.total} feladat ebből a témakörből`}
                            />
                        </div>
                    );
                })}
            </div>
            <style jsx>{`
                .exam-topic-gauges {
                    margin: 1.1rem 0 1.4rem;
                }
                .exam-topic-gauges-title {
                    margin: 0 0 0.25rem;
                    font-size: 1.15rem;
                    color: inherit;
                }
                .exam-topic-gauges-lead {
                    margin: 0 0 0.85rem;
                    color: #a8b8b0;
                    font-size: 0.9rem;
                }
            `}</style>
        </section>
    );
}
