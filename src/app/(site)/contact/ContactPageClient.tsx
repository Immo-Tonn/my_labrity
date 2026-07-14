'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import { sendMessage } from '@/api/telegram';
import { useLanguage } from '@/utils/LanguageContext';
import { getData } from '@/utils/getData';

type ContactLink = {
  label: string;
  href: string;
};

type ContactField = {
  name: 'firstName' | 'lastName' | 'email' | 'phone' | 'message';
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea';
  placeholder: string;
};

type ContactData = {
  hero: {
    kicker: string;
    title: string;
    description: string;
  };
  sidebar: {
    kicker: string;
    title: string;
    description: string;
    contacts: ContactLink[];
  };
  form: {
    fields: ContactField[];
    submitLabel: string;
    note: string;
  };
  errors?: {
    firstNameRequired?: string;
    firstNameMin?: string;
    firstNameMax?: string;
    firstNamePattern?: string;
    lastNameRequired?: string;
    lastNameMin?: string;
    lastNameMax?: string;
    lastNamePattern?: string;
    emailRequired?: string;
    emailPattern?: string;
    phoneRequired?: string;
    phonePattern?: string;
    phoneMin?: string;
    phoneMax?: string;
    messageRequired?: string;
    messageMin?: string;
    messageMax?: string;
    privacyRequired?: string;
  };
  checkbox?: {
    label: string;
    linkLabel: string;
  };
  successMessage?: string;
};

type ContactFormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  privacy: boolean;
};

type ContactFormErrors = Partial<Record<keyof ContactFormState, string>>;

const fallbackContactData: ContactData = {
  hero: {
    kicker: 'Kontakt',
    title: 'Erzählen Sie uns von Ihrem Projekt',
    description:
      'Ob neue Website, Rebranding oder digitaler Auftritt — wir freuen uns auf Ihre Anfrage.',
  },
  sidebar: {
    kicker: 'Labrity',
    title: 'Lassen Sie uns über Ihr Projekt sprechen.',
    description:
      'Wir entwickeln digitale Auftritte, die hochwertig wirken, Vertrauen schaffen und Ihr Unternehmen klar positionieren.',
    contacts: [
      {
        label: 'labrity@web.de',
        href: 'mailto:labrity@web.de',
      },
      {
        label: 'tonn_andreas@web.de',
        href: 'mailto:tonn_andreas@web.de',
      },
      {
        label: 'Instagram',
        href: '#',
      },
      {
        label: 'LinkedIn',
        href: '#',
      },
    ],
  },
  form: {
    fields: [
      {
        name: 'firstName',
        label: 'Vorname',
        type: 'text',
        placeholder: 'Ihr Vorname',
      },
      {
        name: 'lastName',
        label: 'Nachname',
        type: 'text',
        placeholder: 'Ihr Nachname',
      },
      {
        name: 'email',
        label: 'E-Mail',
        type: 'email',
        placeholder: 'name@example.com',
      },
      {
        name: 'phone',
        label: 'Telefon / WhatsApp',
        type: 'tel',
        placeholder: '+49 123 456789',
      },
      {
        name: 'message',
        label: 'Nachricht',
        type: 'textarea',
        placeholder: 'Erzählen Sie uns kurz von Ihrem Projekt',
      },
    ],
    submitLabel: 'Anfrage senden',
    note: 'Wir antworten in der Regel innerhalb von 24–48 Stunden.',
  },
  errors: {
    firstNameRequired: 'Bitte geben Sie Ihren Vornamen ein.',
    firstNameMin: 'Mindestens 2 Zeichen erforderlich.',
    firstNameMax: 'Maximal 40 Zeichen erlaubt.',
    firstNamePattern: 'Bitte geben Sie einen gültigen Vornamen ein.',
    lastNameRequired: 'Bitte geben Sie Ihren Nachnamen ein.',
    lastNameMin: 'Mindestens 2 Zeichen erforderlich.',
    lastNameMax: 'Maximal 40 Zeichen erlaubt.',
    lastNamePattern: 'Bitte geben Sie einen gültigen Nachnamen ein.',
    emailRequired: 'Bitte geben Sie Ihre E-Mail-Adresse ein.',
    emailPattern: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
    phoneRequired: 'Bitte geben Sie Ihre Telefonnummer ein.',
    phonePattern: 'Bitte geben Sie eine gültige Telefonnummer ein.',
    phoneMin: 'Mindestens 7 Zeichen erforderlich.',
    phoneMax: 'Maximal 20 Zeichen erlaubt.',
    messageRequired: 'Bitte schreiben Sie eine Nachricht.',
    messageMin: 'Die Nachricht muss mindestens 10 Zeichen enthalten.',
    messageMax: 'Maximal 1000 Zeichen erlaubt.',
    privacyRequired: 'Bitte bestätigen Sie die Datenschutzerklärung.',
  },
  checkbox: {
    label:
      'Ich stimme der Verarbeitung meiner personenbezogenen Daten gemäß der ',
    linkLabel: 'Datenschutzerklärung',
  },
  successMessage: 'Vielen Dank! Ihre Anfrage wurde erfolgreich gesendet.',
};

const initialFormState: ContactFormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  message: '',
  privacy: false,
};

export default function ContactPageClient() {
  const { lang } = useLanguage();
  const [contact, setContact] = useState<ContactData | null>(null);
  const [formData, setFormData] = useState<ContactFormState>(initialFormState);
  const [formErrors, setFormErrors] = useState<ContactFormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getData('contact', lang);

        setContact({
          ...fallbackContactData,
          ...data,
          hero: {
            ...fallbackContactData.hero,
            ...(data?.hero || {}),
          },
          sidebar: {
            ...fallbackContactData.sidebar,
            ...(data?.sidebar || {}),
            contacts: data?.sidebar?.contacts?.length
              ? data.sidebar.contacts
              : fallbackContactData.sidebar.contacts,
          },
          form: {
            ...fallbackContactData.form,
            ...(data?.form || {}),
            fields: data?.form?.fields?.length
              ? data.form.fields
              : fallbackContactData.form.fields,
          },
          errors: {
            ...fallbackContactData.errors,
            ...(data?.errors || {}),
          },
          checkbox: {
            ...fallbackContactData.checkbox,
            ...(data?.checkbox || {}),
          },
          successMessage:
            data?.successMessage || fallbackContactData.successMessage,
        });
      } catch {
        setContact(fallbackContactData);
      }
    };

    loadData();
  }, [lang]);

  const content = useMemo(() => contact ?? fallbackContactData, [contact]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    setFormData(prev => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));

    setFormErrors(prev => ({
      ...prev,
      [name]: '',
    }));

    setIsSubmitted(false);
  };

  const validateForm = (): ContactFormErrors => {
    const errors: ContactFormErrors = {};
    const namePattern = /^[A-Za-zÄäÖöÜüẞßА-Яа-яЁёІіЇїЄєҐґ'ʼ` -]+$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\+?[0-9\s()-]{7,20}$/;

    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const message = formData.message.trim();

    if (!firstName) {
      errors.firstName = content.errors?.firstNameRequired;
    } else if (firstName.length < 2) {
      errors.firstName = content.errors?.firstNameMin;
    } else if (firstName.length > 40) {
      errors.firstName = content.errors?.firstNameMax;
    } else if (!namePattern.test(firstName)) {
      errors.firstName = content.errors?.firstNamePattern;
    }

    if (!lastName) {
      errors.lastName = content.errors?.lastNameRequired;
    } else if (lastName.length < 2) {
      errors.lastName = content.errors?.lastNameMin;
    } else if (lastName.length > 40) {
      errors.lastName = content.errors?.lastNameMax;
    } else if (!namePattern.test(lastName)) {
      errors.lastName = content.errors?.lastNamePattern;
    }

    if (!email) {
      errors.email = content.errors?.emailRequired;
    } else if (!emailPattern.test(email)) {
      errors.email = content.errors?.emailPattern;
    }

    if (!phone) {
      errors.phone = content.errors?.phoneRequired;
    } else if (phone.length < 7) {
      errors.phone = content.errors?.phoneMin;
    } else if (phone.length > 20) {
      errors.phone = content.errors?.phoneMax;
    } else if (!phonePattern.test(phone)) {
      errors.phone = content.errors?.phonePattern;
    }

    if (!message) {
      errors.message = content.errors?.messageRequired;
    } else if (message.length < 10) {
      errors.message = content.errors?.messageMin;
    } else if (message.length > 1000) {
      errors.message = content.errors?.messageMax;
    }

    if (!formData.privacy) {
      errors.privacy = content.errors?.privacyRequired;
    }

    return errors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setFormErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      setIsLoading(true);

      const message = `📩 New request from Labrity

👤 First name: ${formData.firstName}
👤 Last name: ${formData.lastName}
📧 Email: ${formData.email}
📱 Phone: ${formData.phone}
💬 Message: ${formData.message}`;

      await sendMessage(message);

      setIsSubmitted(true);
      setFormData(initialFormState);
      setFormErrors({});
    } catch {
      setFormErrors(prev => ({
        ...prev,
        message:
          lang === 'de'
            ? 'Senden fehlgeschlagen. Bitte versuchen Sie es erneut.'
            : lang === 'en'
              ? 'Sending failed. Please try again.'
              : 'Не вдалося надіслати. Спробуйте ще раз.',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f6f1] pt-[120px] md:pt-[140px] xl:pt-[170px]">
      <section className="container pb-[90px] md:pb-[110px] xl:pb-[140px]">
        <div className="overflow-hidden border border-[#e7e2d9] bg-white shadow-[0_24px_60px_rgba(0,0,0,0.05)]">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="flex flex-col justify-between bg-[#151515] px-6 py-10 text-white md:px-10 md:py-14 xl:px-14 xl:py-16">
              <div>
                <p className="mb-4 font-montserrat text-[11px] uppercase tracking-[0.32em] text-white/45 md:text-xs">
                  {content.sidebar.kicker}
                </p>

                <h1 className="max-w-[420px] font-tenor text-[36px] leading-[1.04] text-white md:text-[52px] xl:text-[68px]">
                  {content.sidebar.title}
                </h1>

                <p className="text-white/68 mt-6 max-w-[420px] font-montserrat text-sm leading-7 md:text-base">
                  {content.sidebar.description}
                </p>
              </div>

              <div className="border-white/12 mt-12 border-t pt-6">
                <div className="text-white/62 flex flex-wrap gap-x-6 gap-y-3 font-montserrat text-[12px] uppercase tracking-[0.16em] md:text-[13px]">
                  {content.sidebar.contacts.map((item, index) => (
                    <a
                      key={`${item.label}-${index}`}
                      href={item.href}
                      className="transition duration-300 hover:text-white"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[#fffdfa] px-6 py-10 md:px-10 md:py-14 xl:px-14 xl:py-16">
              <p className="mb-4 font-montserrat text-[11px] uppercase tracking-[0.32em] text-neutral-400 md:text-xs">
                {content.hero.kicker}
              </p>

              <h2 className="max-w-[620px] font-tenor text-[34px] leading-[1.04] text-black md:text-[48px] xl:text-[62px]">
                {content.hero.title}
              </h2>

              <p className="mt-5 max-w-[620px] font-montserrat text-sm leading-7 text-neutral-600 md:text-base">
                {content.hero.description}
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-10 grid gap-x-8 gap-y-8 md:grid-cols-2 xl:mt-12"
              >
                {content.form.fields.map(field =>
                  field.type === 'textarea' ? (
                    <div key={field.name} className="md:col-span-2">
                      <label
                        htmlFor={field.name}
                        className="mb-3 block font-montserrat text-[12px] uppercase tracking-[0.14em] text-neutral-500"
                      >
                        {field.label}
                      </label>

                      <textarea
                        id={field.name}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        rows={5}
                        className="w-full resize-none border-b border-[#d8d3ca] bg-transparent pb-4 font-montserrat text-[15px] text-black outline-none transition duration-300 placeholder:text-neutral-400 focus:border-black"
                      />

                      {formErrors[field.name] && (
                        <p className="mt-2 font-montserrat text-xs text-red-600">
                          {formErrors[field.name]}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div key={field.name}>
                      <label
                        htmlFor={field.name}
                        className="mb-3 block font-montserrat text-[12px] uppercase tracking-[0.14em] text-neutral-500"
                      >
                        {field.label}
                      </label>

                      <input
                        id={field.name}
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        className="w-full border-b border-[#d8d3ca] bg-transparent pb-4 font-montserrat text-[15px] text-black outline-none transition duration-300 placeholder:text-neutral-400 focus:border-black"
                      />

                      {formErrors[field.name] && (
                        <p className="mt-2 font-montserrat text-xs text-red-600">
                          {formErrors[field.name]}
                        </p>
                      )}
                    </div>
                  ),
                )}

                <div className="md:col-span-2">
                  <label className="flex items-start gap-3 font-montserrat text-sm leading-6 text-neutral-600">
                    <input
                      type="checkbox"
                      name="privacy"
                      checked={formData.privacy}
                      onChange={handleChange}
                      className="mt-1 h-4 w-4 border border-[#cfc8bd]"
                    />

                    <span>
                      {content.checkbox?.label}
                      <Link
                        href="/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black underline underline-offset-2 transition duration-300 hover:text-neutral-600"
                      >
                        {content.checkbox?.linkLabel ?? ''}
                      </Link>
                    </span>
                  </label>

                  {formErrors.privacy && (
                    <p className="mt-2 font-montserrat text-xs text-red-600">
                      {formErrors.privacy}
                    </p>
                  )}
                </div>

                <div className="mt-2 md:col-span-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex min-h-[56px] items-center justify-center border border-black bg-black px-8 font-montserrat text-[14px] font-semibold uppercase tracking-[0.08em] text-white transition duration-300 hover:-translate-y-[1px] hover:shadow-[0_12px_30px_rgba(0,0,0,0.18)] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isLoading ? 'Sending...' : content.form.submitLabel}
                  </button>

                  <p className="mt-5 font-montserrat text-sm leading-6 text-neutral-500">
                    {isSubmitted ? content.successMessage : content.form.note}
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
