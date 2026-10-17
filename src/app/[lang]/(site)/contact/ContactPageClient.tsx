'use client';

import { ChangeEvent, FormEvent, useRef, useState } from 'react';

import { sendMessage } from '@/api/telegram';
import { LocalizedLink } from '@/components/ui/LocalizedLink';

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

export type ContactData = {
  hero: {
    kicker: string;
    title: string;
    description: string;
  };
  sidebar: {
    kicker: string;
    title: string;
    description: string;
    locationNote?: string;
    contacts: ContactLink[];
  };
  form: {
    fields: ContactField[];
    submitLabel: string;
    sendingLabel: string;
    emailAltLabel: string;
    note: string;
  };
  errors: {
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
    phonePattern?: string;
    phoneMin?: string;
    phoneMax?: string;
    messageRequired?: string;
    messageMin?: string;
    messageMax?: string;
    privacyRequired?: string;
    sendFailed?: string;
  };
  checkbox: {
    label: string;
    linkLabel: string;
  };
  successMessage: string;
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

// DOM order of the form controls — used to focus the first invalid one.
const fieldOrder: (keyof ContactFormState)[] = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'message',
  'privacy',
];

const autoCompleteFor: Record<string, string> = {
  firstName: 'given-name',
  lastName: 'family-name',
  email: 'email',
  phone: 'tel',
};

const initialFormState: ContactFormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  message: '',
  privacy: false,
};

export default function ContactPageClient({
  initialData,
}: {
  initialData: ContactData;
}) {
  const content = initialData;
  const emailLinks = content.sidebar.contacts.filter(item =>
    item.href.startsWith('mailto:'),
  );
  const [formData, setFormData] = useState<ContactFormState>(initialFormState);
  const [formErrors, setFormErrors] = useState<ContactFormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  // Guards against a second submit firing before React has re-rendered the
  // button as disabled (rapid double-click/double-tap) — isLoading itself
  // only updates on the next render, which isn't synchronous enough.
  const isSubmittingRef = useRef(false);

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

    // Phone is optional: only validated when the visitor filled it in.
    if (phone) {
      if (phone.length < 7) {
        errors.phone = content.errors?.phoneMin;
      } else if (phone.length > 20) {
        errors.phone = content.errors?.phoneMax;
      } else if (!phonePattern.test(phone)) {
        errors.phone = content.errors?.phonePattern;
      }
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

    if (isSubmittingRef.current) return;

    const validationErrors = validateForm();
    setFormErrors(validationErrors);
    setSubmitError('');

    const firstInvalid = fieldOrder.find(name => validationErrors[name]);
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    isSubmittingRef.current = true;

    try {
      setIsLoading(true);

      const message = `📩 New request from Labrity

👤 First name: ${formData.firstName}
👤 Last name: ${formData.lastName}
📧 Email: ${formData.email}
${formData.phone.trim() ? `📱 Phone: ${formData.phone.trim()}\n` : ''}💬 Message: ${formData.message}`;

      await sendMessage(message);

      setIsSubmitted(true);
      setFormData(initialFormState);
      setFormErrors({});
    } catch {
      setSubmitError(content.errors?.sendFailed ?? '');
    } finally {
      setIsLoading(false);
      isSubmittingRef.current = false;
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f6f1] pt-[120px] md:pt-[140px] xl:pt-[170px]">
      <section className="container pb-[90px] md:pb-[110px] xl:pb-[140px]">
        <div className="overflow-hidden border border-[#e7e2d9] bg-white shadow-[0_24px_60px_rgba(0,0,0,0.05)]">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="flex flex-col justify-between bg-[#151515] px-6 py-10 text-white md:px-10 md:py-14 xl:px-14 xl:py-16">
              <div>
                <p className="mb-4 font-montserrat text-xs uppercase tracking-[0.32em] text-white/60 md:text-xs">
                  {content.sidebar.kicker}
                </p>

                <h1 className="max-w-[420px] font-tenor text-[36px] leading-[1.04] text-white md:text-[52px] xl:text-[68px]">
                  {content.sidebar.title}
                </h1>

                <p className="mt-6 max-w-[420px] font-montserrat text-sm leading-7 text-white/75 md:text-base">
                  {content.sidebar.description}
                </p>

                {content.sidebar.locationNote && (
                  <p className="mt-5 max-w-[420px] font-montserrat text-[13px] leading-7 text-white/65 md:text-sm">
                    {content.sidebar.locationNote}
                  </p>
                )}
              </div>

              <div className="border-white/12 mt-12 border-t pt-6">
                <div className="flex flex-wrap gap-x-6 gap-y-1 font-montserrat text-[12px] uppercase tracking-[0.16em] text-white/75 md:text-[13px]">
                  {content.sidebar.contacts.map((item, index) => {
                    const isExternal = item.href.startsWith('http');

                    return (
                      <a
                        key={`${item.label}-${index}`}
                        href={item.href}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                        className="inline-flex min-h-[44px] items-center transition duration-300 hover:text-white"
                      >
                        {item.label}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="bg-[#fffdfa] px-6 py-10 md:px-10 md:py-14 xl:px-14 xl:py-16">
              <p className="mb-4 font-montserrat text-xs uppercase tracking-[0.32em] text-neutral-400 md:text-xs">
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
                noValidate
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
                        aria-required="true"
                        aria-invalid={formErrors[field.name] ? true : undefined}
                        aria-describedby={
                          formErrors[field.name]
                            ? `${field.name}-error`
                            : undefined
                        }
                        className="w-full resize-none border-b border-[#d8d3ca] bg-transparent pb-4 font-montserrat text-[15px] text-black outline-none transition duration-300 placeholder:text-neutral-400 focus:border-black"
                      />

                      {formErrors[field.name] && (
                        <p
                          id={`${field.name}-error`}
                          className="mt-2 font-montserrat text-xs text-red-700"
                        >
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
                        autoComplete={autoCompleteFor[field.name]}
                        aria-required={
                          field.name === 'phone' ? undefined : true
                        }
                        aria-invalid={formErrors[field.name] ? true : undefined}
                        aria-describedby={
                          formErrors[field.name]
                            ? `${field.name}-error`
                            : undefined
                        }
                        className="w-full border-b border-[#d8d3ca] bg-transparent pb-4 font-montserrat text-[15px] text-black outline-none transition duration-300 placeholder:text-neutral-400 focus:border-black"
                      />

                      {formErrors[field.name] && (
                        <p
                          id={`${field.name}-error`}
                          className="mt-2 font-montserrat text-xs text-red-700"
                        >
                          {formErrors[field.name]}
                        </p>
                      )}
                    </div>
                  ),
                )}

                <div className="md:col-span-2">
                  <label className="flex items-start gap-3 font-montserrat text-sm leading-6 text-neutral-600">
                    <input
                      id="privacy"
                      type="checkbox"
                      name="privacy"
                      aria-required="true"
                      aria-invalid={formErrors.privacy ? true : undefined}
                      aria-describedby={
                        formErrors.privacy ? 'privacy-error' : undefined
                      }
                      checked={formData.privacy}
                      onChange={handleChange}
                      className="mt-1 h-4 w-4 border border-[#cfc8bd]"
                    />

                    <span>
                      {content.checkbox?.label}
                      <LocalizedLink
                        href="/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black underline underline-offset-2 transition duration-300 hover:text-neutral-600"
                      >
                        {content.checkbox?.linkLabel ?? ''}
                      </LocalizedLink>
                    </span>
                  </label>

                  {formErrors.privacy && (
                    <p
                      id="privacy-error"
                      className="mt-2 font-montserrat text-xs text-red-700"
                    >
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
                    {isLoading
                      ? content.form.sendingLabel
                      : content.form.submitLabel}
                  </button>

                  {submitError && (
                    <p
                      role="alert"
                      className="mt-5 font-montserrat text-sm leading-6 text-red-700"
                    >
                      {submitError}
                    </p>
                  )}

                  <p
                    role="status"
                    aria-live="polite"
                    className="mt-5 font-montserrat text-sm leading-6 text-neutral-500"
                  >
                    {isSubmitted ? content.successMessage : content.form.note}
                  </p>

                  {emailLinks.length > 0 && (
                    <p className="mt-3 font-montserrat text-sm leading-6 text-neutral-600">
                      {content.form.emailAltLabel}{' '}
                      {emailLinks.map((item, index) => (
                        <span key={item.href}>
                          {index > 0 && ', '}
                          <a
                            href={item.href}
                            className="text-black underline underline-offset-2 transition duration-300 hover:text-neutral-600"
                          >
                            {item.label}
                          </a>
                        </span>
                      ))}
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
