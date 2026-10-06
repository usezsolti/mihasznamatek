import type { PaperRunSummary } from '../../utils/game/paperRun';

type Props = {
    summary: PaperRunSummary;
    onRetry: () => void;
};

export default function PaperRunSummaryView({ summary, onRetry }: Props) {
    return (
        <section className="paper-run-summary">
            <p className="paper-run-kicker">
                {summary.complete ? '100%-os teljesítés' : 'Feladatsor összegzés'}
            </p>
            <h2 className="paper-run-percent">Teljesítés: {summary.percent}%</h2>
            <ul className="paper-run-stats">
                <li>Megoldott feladatok: {summary.attempted}/{summary.total}</li>
                <li>Helyesen megoldott feladatok: {summary.solved}/{summary.total}</li>
                <li>Elsőre helyes: {summary.firstTryCorrect}</li>
                <li>Elrontott feladatok: {summary.wrongAtLeastOnce}</li>
                <li>Újra megoldandó feladatok: {summary.retryLeft}</li>
            </ul>

            {summary.retryItems.length > 0 ? (
                <>
                    <h3>Ezeket kell még helyesen megoldani</h3>
                    <ul className="paper-run-retry">
                        {summary.retryItems.map((item) => (
                            <li key={item.questionId}>
                                {item.label} – {item.topicTitle}
                            </li>
                        ))}
                    </ul>
                    <button type="button" className="submit-button" onClick={onRetry}>
                        Hibás feladatok újra megoldása
                    </button>
                </>
            ) : (
                <>
                    <p className="paper-run-done">
                        Minden feladatot legalább egyszer helyesen megoldottál.
                    </p>
                    <h3>Próbálkozások</h3>
                    <ul className="paper-run-history">
                        {summary.history.map((row) => (
                            <li key={row.questionId}>
                                <strong>{row.label}</strong>
                                <span>
                                    {row.topicTitle} · {row.attempts} próbálkozás
                                    {row.firstAttemptCorrect ? ' · elsőre helyes' : ` · ${row.attempts}. próbálkozásra`}
                                </span>
                            </li>
                        ))}
                    </ul>
                </>
            )}

            <h3>Témakörök</h3>
            <ul className="paper-run-topics">
                {summary.topics.map((topic) => (
                    <li key={topic.topicId}>
                        <strong>{topic.title}</strong>
                        <span>
                            {topic.correct}/{topic.total} helyes
                            {topic.missing > 0 ? ` · ${topic.missing} még hiányzik` : ''}
                        </span>
                    </li>
                ))}
            </ul>
        </section>
    );
}
