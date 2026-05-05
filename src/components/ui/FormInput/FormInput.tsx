import React from 'react';

import { classnames } from '@/utils/classnames';
import { FormInputProps } from './types';

export const FormInput: React.FC<FormInputProps> = ({
  textarea,
  config,
  errors,
  register,
}) => {
  const { name, label, placeholder, validation } = config;
  const isRequired = validation?.required;
  const isError = errors?.[name];

  return (
    <>
      <label
        htmlFor={name}
        className="mb-2 block font-montserrat text-sm text-[#e8d59c]"
      >
        {label} {isRequired?.value && '*'}
      </label>

      {textarea ? (
        <textarea
          id={name}
          placeholder={placeholder}
          {...register(name, {
            ...validation,
            required: isRequired,
            pattern: {
              value: validation?.pattern
                ? new RegExp(validation.pattern.value)
                : new RegExp(''),
              message: validation?.pattern ? validation?.pattern?.message : '',
            },
          })}
          className="mb-4 h-28 w-full resize-none rounded-md border border-[#e8d59c] bg-[#2a1f18] px-4 py-3 font-montserrat text-base text-[#e8d59c] outline-none transition placeholder:text-[#bfae7a] focus:border-yellow-300 focus:shadow-[0_0_10px_rgba(250,204,21,0.5)]"
        />
      ) : (
        <input
          aria-required="true"
          aria-invalid={isError ? 'true' : 'false'}
          aria-describedby={isError ? `errorName${name}` : undefined}
          id={name}
          {...register(name, {
            ...validation,
            required: isRequired,
            minLength: {
              value: validation?.minLength ? validation?.minLength?.value : 13,
              message: validation?.minLength
                ? validation?.minLength?.message
                : '',
            },
            maxLength: {
              value: validation?.maxLength ? validation?.maxLength?.value : 13,
              message: validation?.maxLength
                ? validation?.maxLength?.message
                : '',
            },
            pattern: {
              value: validation?.pattern
                ? new RegExp(validation.pattern.value)
                : new RegExp(''),
              message: validation?.pattern ? validation?.pattern?.message : '',
            },
          })}
          placeholder={placeholder}
          className={classnames(
            'w-full rounded-md border border-[#e8d59c] bg-[#2a1f18] px-4 py-3 font-montserrat text-base text-[#e8d59c] outline-none transition placeholder:text-[#bfae7a] focus:border-yellow-300 focus:shadow-[0_0_10px_rgba(250,204,21,0.5)]',
            isError ? 'mb-0 border-error' : 'mb-6',
          )}
        />
      )}

      {isError && (
        <span
          id={`errorName${name}`}
          className="mb-2 block text-right font-montserrat text-xs text-error"
        >
          {isError.message}
        </span>
      )}
    </>
  );
};
