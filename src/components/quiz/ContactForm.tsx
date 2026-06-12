'use client';

import { useEffect, useState, type ChangeEvent } from 'react';

import { sendMessage } from '@/api/telegram';
import { useQuiz } from '@/components/quiz';

import { ContactFormData, QuizAnswers } from './quiz.types';

type Props = {
  quiz: any;
  answers: QuizAnswers;
};

export default function ContactForm({ quiz, answers }: Props) {
  const { closeQuiz } = useQuiz();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [errors, setErrors] = useState<Partial<ContactFormData>>({});

  const [form, setForm] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    if (!success) return;

    const timeout = setTimeout(() => {
      closeQuiz();
    }, 5000);

    return () => clearTimeout(timeout);
  }, [success, closeQuiz]);

  const validate = () => {
    const nextErrors: Partial<ContactFormData> = {};

    if (!form.firstName.trim()) {
      nextErrors.firstName = quiz.form.required;
    }

    if (!form.lastName.trim()) {
      nextErrors.lastName = quiz.form.required;
    }

    if (!form.email.trim()) {
      nextErrors.email = quiz.form.required;
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      nextErrors.email = quiz.form.invalidEmail;
    }

    if (!form.phone.trim()) {
      nextErrors.phone = quiz.form.required;
    } else if (!/^\+?[0-9\s\-()]{7,}$/.test(form.phone)) {
      nextErrors.phone = quiz.form.invalidPhone;
    }

    setErrors(nextErrors);

    return !Object.keys(nextErrors).length;
  };

  const buildAnswers = () => {
    return quiz.questions
      .map((question: any, index: number) => {
        const selected = answers[question.id] || [];
        const values = selected.length ? selected.join('\n') : '-';

        return [`${index + 1}. ${question.title}`, values].join('\n');
      })
      .join('\n\n');
  };

  const buildMessage = () => {
    const messageParts = [
      '🔥 NEW WEBSITE REQUEST',
      '',
      '────────────────────',
      '',
      '👤 CONTACT',
      '',
      `Name: ${form.firstName} ${form.lastName}`,
      `Phone: ${form.phone}`,
      `Email: ${form.email}`,
      '',
      '────────────────────',
      '',
      '📋 QUIZ ANSWERS',
      '',
      buildAnswers(),
      '',
      '────────────────────',
    ];

    return messageParts.join('\n');
  };

  const submit = async () => {
    if (!validate()) return;

    setLoading(true);
    setError('');

    try {
      await sendMessage(buildMessage());
      setSuccess(quiz.form.success);
    } catch {
      setError(quiz.form.error);
    } finally {
      setLoading(false);
    }
  };

  const change =
    (field: keyof ContactFormData) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setForm(prev => ({
        ...prev,
        [field]: event.target.value,
      }));

      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    };

  const inputClass = `
    w-full
    border-0
    border-b
    border-[#d8d1c6]
    bg-transparent
    px-0
    py-4
    font-montserrat
    text-[14px]
    text-black
    outline-none
    transition
    duration-300
    placeholder:text-neutral-400
    focus:border-black
  `;

  const errorClass = `
    mt-2
    font-montserrat
    text-[12px]
    leading-5
    text-red-500
  `;

  return (
    <div className="w-full">
      <div className="mb-10">
        <p className="mb-5 font-montserrat text-[11px] font-medium uppercase tracking-[0.32em] text-black/40">
          {quiz.form.kicker || 'Kontakt'}
        </p>

        <h2 className="max-w-[720px] font-tenor text-[38px] leading-[1] tracking-[-0.04em] text-black md:text-[56px]">
          {quiz.form.title}
        </h2>

        <p className="mt-5 max-w-[620px] font-montserrat text-[14px] leading-7 text-neutral-500 md:text-[16px]">
          {quiz.form.description}
        </p>
      </div>

      <div className="grid gap-x-8 gap-y-5 md:grid-cols-2">
        <div>
          <label className="font-montserrat text-[10px] font-medium uppercase tracking-[0.24em] text-black/35">
            {quiz.form.firstName}
          </label>

          <input
            value={form.firstName}
            onChange={change('firstName')}
            placeholder={quiz.form.firstName}
            className={inputClass}
          />

          {errors.firstName && <p className={errorClass}>{errors.firstName}</p>}
        </div>

        <div>
          <label className="font-montserrat text-[10px] font-medium uppercase tracking-[0.24em] text-black/35">
            {quiz.form.lastName}
          </label>

          <input
            value={form.lastName}
            onChange={change('lastName')}
            placeholder={quiz.form.lastName}
            className={inputClass}
          />

          {errors.lastName && <p className={errorClass}>{errors.lastName}</p>}
        </div>

        <div>
          <label className="font-montserrat text-[10px] font-medium uppercase tracking-[0.24em] text-black/35">
            {quiz.form.phone}
          </label>

          <input
            value={form.phone}
            onChange={change('phone')}
            placeholder={quiz.form.phone}
            className={inputClass}
          />

          {errors.phone && <p className={errorClass}>{errors.phone}</p>}
        </div>

        <div>
          <label className="font-montserrat text-[10px] font-medium uppercase tracking-[0.24em] text-black/35">
            {quiz.form.email}
          </label>

          <input
            value={form.email}
            onChange={change('email')}
            placeholder={quiz.form.email}
            className={inputClass}
          />

          {errors.email && <p className={errorClass}>{errors.email}</p>}
        </div>
      </div>

      <button
        type="button"
        disabled={loading || Boolean(success)}
        onClick={submit}
        className="
          mt-10
          inline-flex
          min-h-[56px]
          w-full
          items-center
          justify-center
          border
          border-black
          bg-black
          px-8
          font-montserrat
          text-[12px]
          font-semibold
          uppercase
          tracking-[0.08em]
          text-white
          transition
          duration-300
          hover:-translate-y-[1px]
          hover:shadow-[0_12px_30px_rgba(0,0,0,0.18)]
          disabled:cursor-not-allowed
          disabled:border-black/20
          disabled:bg-black/20
          disabled:text-black/40
          disabled:shadow-none
        "
      >
        {loading ? '...' : quiz.submit}
      </button>

      {success && (
        <div className="mt-6 border border-green-200 bg-green-50 px-5 py-4 font-montserrat text-[13px] leading-6 text-green-700">
          {success}
        </div>
      )}

      {error && (
        <div className="mt-6 border border-red-200 bg-red-50 px-5 py-4 font-montserrat text-[13px] leading-6 text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
