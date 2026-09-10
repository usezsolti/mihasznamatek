import { jsPDF } from 'jspdf';
import type { LessonPackContent } from './lessonPack';

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

export function buildLessonPackPdfBlob(content: LessonPackContent): Blob {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const left = 16;
    const width = 178;
    let y = 20;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    y = writeWrapped(doc, content.title || 'Oraanyag', left, y, width, 7);
    y += 2;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    y = writeWrapped(doc, `Cel: ${content.goal || '-'}`, left, y, width, 6);
    y += 3;
    doc.setFontSize(10);
    y = writeWrapped(doc, content.intro || '', left, y, width, 5.4);
    y += 4;

    for (const section of content.sections || []) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        y = writeWrapped(doc, section.heading, left, y, width, 6);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        y = writeWrapped(doc, section.body, left, y, width, 5.4);
        y += 3;
    }

    if (content.examples?.length) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        y = writeWrapped(doc, 'Peldak', left, y, width, 6);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        content.examples.forEach((ex, i) => {
            y = writeWrapped(doc, `${i + 1}. ${ex.title}`, left, y, width, 5.4);
            y = writeWrapped(doc, `Feladat: ${ex.problem}`, left, y, width, 5.4);
            y = writeWrapped(doc, `Megoldas: ${ex.steps}`, left, y, width, 5.4);
            y = writeWrapped(doc, `Valasz: ${ex.answer}`, left, y, width, 5.4);
            y += 2;
        });
    }

    if (content.practice?.length) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        y = writeWrapped(doc, 'Gyakorlo feladatok', left, y, width, 6);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        content.practice.forEach((p, i) => {
            y = writeWrapped(doc, `${i + 1}. ${p.problem}`, left, y, width, 5.4);
            if (p.hint) y = writeWrapped(doc, `Tipp: ${p.hint}`, left, y, width, 5.4);
            y = writeWrapped(doc, `Megoldas: ${p.answer}`, left, y, width, 5.4);
            y += 2;
        });
    }

    if (content.teacherNotes) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        y = writeWrapped(doc, 'Tanari lap', left, y, width, 6);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        y = writeWrapped(doc, content.teacherNotes, left, y, width, 5.4);
    }

    doc.setFontSize(8);
    doc.text('Mihaszna Matek — oraanyag', left, 290);
    return doc.output('blob');
}

export function downloadLessonPackPdf(content: LessonPackContent, fileName: string): void {
    const blob = buildLessonPackPdfBlob(content);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
}
