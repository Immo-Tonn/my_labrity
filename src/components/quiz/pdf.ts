import jsPDF from 'jspdf';
import notoSansBase64 from '@/fonts/notoSansBase64';

import { QuizAnswers, QuizDictionary } from './quiz.types';

type GeneratePdfParams = {
  form: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };

  answers: QuizAnswers;

  estimate: number;

  quiz: QuizDictionary;
};

export const generateQuizPdf = ({
  form,
  answers,
  estimate,
  quiz,
}: GeneratePdfParams) => {
  const pdf = new jsPDF();

  // ===== FONT =====

  pdf.addFileToVFS('NotoSans-Regular.ttf', notoSansBase64);

  pdf.addFont('NotoSans-Regular.ttf', 'NotoSans', 'normal');

  pdf.setFont('NotoSans');

  const pageHeight = pdf.internal.pageSize.getHeight();

  const marginBottom = 20;
  const marginTop = 20;

  let y = marginTop;

  const lineHeightFactor = 1.3;

  const ensureSpace = (h: number) => {
    if (y + h > pageHeight - marginBottom) {
      pdf.addPage();

      pdf.setFont('NotoSans');

      y = marginTop;
    }
  };

  const addText = (text: string | string[], fontSize = 11) => {
    pdf.setFontSize(fontSize);

    const lines = Array.isArray(text) ? text : pdf.splitTextToSize(text, 170);

    const height = (lines.length * fontSize * lineHeightFactor) / 2;

    ensureSpace(height);

    pdf.text(lines as any, 20, y);

    y += height;

    return height;
  };

  const date = new Date().toLocaleDateString();

  // ================= HEADER =================

  addText('LABRITY', 22);

  addText('Webentwicklung & Digitale Lösungen', 11);

  y += 5;

  pdf.line(20, y, 190, y);

  y += 12;

  // ================= TITLE =================

  addText(quiz.result.title, 18);

  addText(`${date}`, 11);

  y += 5;

  // ================= INTRO =================

  addText(quiz.result.subtitle, 12);

  y += 5;

  // ================= CONTACT =================

  addText(quiz.result.contactTitle, 15);

  addText(`${quiz.form.firstName}: ${form.firstName}`);

  addText(`${quiz.form.lastName}: ${form.lastName}`);

  addText(`${quiz.form.phone}: ${form.phone}`);

  addText(`${quiz.form.email}: ${form.email}`);

  y += 5;

  // ================= ANSWERS =================

  addText(quiz.result.summaryTitle, 15);

  quiz.questions.forEach(question => {
    const selected = answers[question.id] || [];

    addText(question.title, 12);

    addText(selected.length ? selected.join(', ') : '-');

    y += 3;
  });

  y += 5;

  // ================= ESTIMATE =================

  const estimateNote = quiz.result.estimateNote;

  const estimateText = `${quiz.result.estimateFrom} ${estimate.toLocaleString()} €`;

  const estimateHeight = 20 + 15 + 20;

  ensureSpace(estimateHeight);

  pdf.line(20, y, 190, y);

  y += 12;

  addText(quiz.result.estimateTitle, 16);

  addText(estimateNote, 11);

  addText(estimateText, 26);

  y += 5;

  // ================= NEXT STEP =================

  const nextText = quiz.result.nextText;

  const nextHeight = 40;

  ensureSpace(nextHeight);

  addText(quiz.result.nextTitle, 15);

  addText(nextText, 11);

  y += 5;

  // ================= CONTACT =================

  addText(quiz.result.contactTitle, 15);

  addText('E-Mail: labrity@web.de');

  addText('Website: https://mylabrity.vercel.app');

  // ================= FOOTER =================

  const footer = 'LABRITY • labrity@web.de • https://mylabrity.vercel.app';

  const pageCount = pdf.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);

    pdf.setFont('NotoSans');

    pdf.setFontSize(9);

    pdf.text(footer, 20, pageHeight - 10);
  }

  pdf.save(`labrity-projektuebersicht-${date.replaceAll('.', '-')}.pdf`);
};
