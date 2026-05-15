'use client';

import { useEffect, useState } from 'react';

import { sendMessage } from '@/api/telegram';

import { ContactFormData, QuizAnswers } from './quiz.types';

import { useQuiz } from '@/components/quiz';

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

        return [`${index + 1}. ${question.id}`, values].join('\n');
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
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm(prev => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const inputClass = `
    w-full
    rounded-2xl
    border
    border-[#e7e2d9]
    px-5
    py-4
    text-base
    outline-none
    transition-all
    focus:border-black
  `;

  const errorClass = `
    mt-2
    text-sm
    text-red-500
  `;

  return (
    <div className="p-8">
      <h2 className="mb-2 text-3xl">{quiz.form.title}</h2>

      <p className="mb-8 text-sm text-gray-500">
        Please fill your contact details
      </p>

      <div className="grid gap-5">
        <div>
          <input
            value={form.firstName}
            onChange={change('firstName')}
            placeholder={quiz.form.firstName}
            className={inputClass}
          />
          {errors.firstName && <p className={errorClass}>{errors.firstName}</p>}
        </div>

        <div>
          <input
            value={form.lastName}
            onChange={change('lastName')}
            placeholder={quiz.form.lastName}
            className={inputClass}
          />
          {errors.lastName && <p className={errorClass}>{errors.lastName}</p>}
        </div>

        <div>
          <input
            value={form.phone}
            onChange={change('phone')}
            placeholder={quiz.form.phone}
            className={inputClass}
          />
          {errors.phone && <p className={errorClass}>{errors.phone}</p>}
        </div>

        <div>
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
        disabled={loading || !!success}
        onClick={submit}
        className="
          mt-8
          w-full
          rounded-2xl
          bg-black
          px-6
          py-4
          text-white
          transition
          hover:opacity-90
          disabled:opacity-50
        "
      >
        {loading ? '...' : quiz.submit}
      </button>

      {success && (
        <div className="mt-6 rounded-2xl bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
