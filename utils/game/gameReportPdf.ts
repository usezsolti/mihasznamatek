import { jsPDF } from 'jspdf';
import { reportFileName, type GameReport } from './gameReport';

/** Helvetica nem tudja az ő/ű betűket — ö/ü-re cseréljük a PDF-ben. */
function pdfSafe(value: string): string {
    return String(value || '')
        .replace(/ő/g, 'ö')
        .replace(/Ő/g, 'Ö')
        .replace(/ű/g, 'ü')
        .replace(/Ű/g, 'Ü')
        .replace(/–/g, '-')
        .replace(/—/g, '-')
        .replace(/[“”]/g, '"')
        .replace(/[‘’]/g, "'");
}

function writeWrapped(
    doc: jsPDF,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineH: number
): number {
    const lines = doc.splitTextToSize(pdfSafe(text), maxWidth);
    for (const line of lines) {
        if (y > 280) {
            doc.addPage();
            y = 18;
        }
        doc.text(line, x, y);
        y += lineH;
    }
    return y;
}

export function buildGameReportPdfBlob(report: GameReport): Blob {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const left = 16;
    const width = 178;
    let y = 20;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    y = writeWrapped(doc, report.title || 'Játék', left, y, width, 7);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    y = writeWrapped(doc, `Dátum: ${report.dateLabel}`, left, y, width, 6);
    y += 2;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    y = writeWrapped(doc, `Teljesítés: ${report.percent}%`, left, y, width, 7);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    y = writeWrapped(doc, `Megoldott feladatok: ${report.solved}/${report.total}`, left, y, width, 6);
    y = writeWrapped(doc, `Elsőre helyes: ${report.firstTryCorrect}`, left, y, width, 6);
    y = writeWrapped(doc, `Elrontott feladatok: ${report.wrongAtLeastOnce}`, left, y, width, 6);
    y += 3;

    if (report.topics.length) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        y = writeWrapped(doc, 'Témakörök', left, y, width, 6);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        for (const topic of report.topics) {
            y = writeWrapped(doc, `${topic.title}: ${topic.correct}/${topic.total} helyes`, left, y, width, 5.4);
        }
        y += 3;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    y = writeWrapped(doc, 'Feladatok', left, y, width, 6);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    for (const task of report.tasks) {
        y = writeWrapped(
            doc,
            `${task.label} — ${task.topicTitle} — ${task.detail}`,
            left,
            y,
            width,
            5.4
        );
    }

    doc.setFontSize(8);
    doc.text('Mihaszna Matek — játékjelentés', left, 290);
    return doc.output('blob');
}

export function downloadGameReportPdf(report: GameReport): void {
    const blob = buildGameReportPdfBlob(report);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = reportFileName(report.fileDate);
    link.click();
    URL.revokeObjectURL(url);
}
