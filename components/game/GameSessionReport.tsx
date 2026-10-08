import { downloadGameReportPdf } from '../../utils/game/gameReportPdf';
import type { GameReport } from '../../utils/game/gameReport';

type Props = {
    report: GameReport;
};

export function ReportDownloadButton({ report }: Props) {
    return (
        <button
            type="button"
            className="paper-run-download"
            onClick={() => downloadGameReportPdf(report)}
        >
            Letöltés PDF
        </button>
    );
}

export default function GameSessionReport({ report }: Props) {
    return (
        <section className="paper-run-summary">
            <p className="paper-run-kicker">
                {report.percent === 100 ? '100%-os teljesítés' : 'Játék vége'}
            </p>
            <h2 className="paper-run-percent">{report.title}</h2>
            <p className="paper-run-date">{report.dateLabel}</p>
            <p className="paper-run-percent">Teljesítés: {report.percent}%</p>
            <ul className="paper-run-stats">
                <li>Megoldott feladatok: {report.solved}/{report.total}</li>
                <li>Elsőre helyes: {report.firstTryCorrect}</li>
                <li>Elrontott feladatok: {report.wrongAtLeastOnce}</li>
            </ul>
            {report.topics.length > 0 && (
                <>
                    <h3>Témakörök</h3>
                    <ul className="paper-run-topics">
                        {report.topics.map((topic) => (
                            <li key={topic.title}>
                                <strong>{topic.title}</strong>
                                <span>{topic.correct}/{topic.total} helyes</span>
                            </li>
                        ))}
                    </ul>
                </>
            )}
            <h3>Feladatok</h3>
            <ul className="paper-run-history">
                {report.tasks.map((task) => (
                    <li key={task.id}>
                        <strong>{task.label}</strong>
                        <span>{task.topicTitle} · {task.detail}</span>
                    </li>
                ))}
            </ul>
            <ReportDownloadButton report={report} />
        </section>
    );
}
