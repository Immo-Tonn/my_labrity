'use client';

import { ContactFormData, QuizAnswers } from './quiz.types';
import { calculateEstimate } from './estimate';

import { useQuiz } from '@/components/quiz';

type Props = {
  quiz: any;
  answers: QuizAnswers;
  form: ContactFormData;
};

export default function QuizResult({
  quiz,
  answers,
  form,
}: Props) {
  const { closeQuiz } = useQuiz();

  const estimate = calculateEstimate(answers);

  const formatPrice = (value: number) =>
    new Intl.NumberFormat('de-DE').format(value);

  return (
    <div className="p-8">
      {/* HEADER */}
      <div className="mb-10">
        <h2 className="mb-3 text-3xl">
          {quiz.result.title}
        </h2>

        <p className="text-gray-600">
          {quiz.result.subtitle}
        </p>
      </div>

      {/* CONTACT */}
      <div className="mb-8 rounded-2xl border border-[#e7e2d9] bg-white p-6">
        <h3 className="mb-4 text-lg font-medium">
          {quiz.result.summaryTitle}
        </h3>

        <div className="grid gap-2 text-sm text-gray-700">
          <p>
            <strong>{quiz.form.firstName}:</strong>{' '}
            {form.firstName}
          </p>

          <p>
            <strong>{quiz.form.lastName}:</strong>{' '}
            {form.lastName}
          </p>

          <p>
            <strong>{quiz.form.phone}:</strong>{' '}
            {form.phone}
          </p>

          <p>
            <strong>{quiz.form.email}:</strong>{' '}
            {form.email}
          </p>
        </div>
      </div>

      {/* ANSWERS */}
      <div className="mb-8 rounded-2xl border border-[#e7e2d9] bg-white p-6">
        <h3 className="mb-5 text-lg font-medium">
          {quiz.result.summaryTitle}
        </h3>

        <div className="grid gap-5">
          {quiz.questions.map((question: any) => {
            const selected = answers[question.id] || [];

            return (
              <div key={question.id}>
                <p className="mb-2 font-medium">
                  {question.title}
                </p>

                <p className="text-sm text-gray-600">
                  {selected.length
                    ? selected.join(', ')
                    : '-'}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ESTIMATE */}
      <div className="mb-8 rounded-2xl border border-black bg-black p-6 text-white">
        <p className="mb-3 text-sm uppercase tracking-wider text-white/70">
          {quiz.result.estimateTitle}
        </p>

        <div className="mb-4 text-4xl font-semibold">
          {formatPrice(estimate.min)} € –{' '}
          {formatPrice(estimate.max)} €
        </div>

        <p className="text-sm leading-6 text-white/75">
          {quiz.result.estimateNote}
        </p>
      </div>

      {/* NEXT STEPS */}
      <div className="mb-10 rounded-2xl border border-[#e7e2d9] bg-white p-6">
        <h3 className="mb-3 text-lg font-medium">
          {quiz.result.nextTitle}
        </h3>

        <p className="text-sm leading-7 text-gray-600">
          {quiz.result.nextText}
        </p>
      </div>

      {/* ACTION */}
      <button
        type="button"
        onClick={closeQuiz}
        className="
          w-full
          rounded-2xl
          bg-black
          px-6
          py-4
          text-white
          transition
          hover:opacity-90
        "
      >
        {quiz.result.close}
      </button>
    </div>
  );
}