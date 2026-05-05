import { FieldErrors, UseFormRegister } from 'react-hook-form';

export type FormData = {
  name: string;
  email: string;
  phone: string;
  message: string;
  checkbox: boolean;
};

export type FormInputProps = {
  config: FormInputsConfig;
  textarea: boolean;
  register: UseFormRegister<FormData>;
  errors?: FieldErrors<FormData>;
};

export type FormInputsConfig = {
  name: 'name' | 'email' | 'phone' | 'message';
  label: string;
  placeholder?: string;
  validation?: ValidationInput;
};

export type ValidationInput = {
  required?: ValidationRequired;
  pattern?: ValidationPattern;
  minLength?: ValidationLength;
  maxLength?: ValidationLength;
};

export type ValidationRequired = {
  value: boolean;
  message: string;
};

export type ValidationPattern = {
  value: string;
  message: string;
};

export type ValidationLength = {
  value: number;
  message: string;
};
