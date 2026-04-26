import { FieldErrors, UseFormRegister } from 'react-hook-form';

export type FormData = {
  name: string;
  email: string;
  phone: string;
  message: string;
  checkbox: boolean;
};

export type CheckBoxProps = {
  register: UseFormRegister<FormData>;
  errors?: FieldErrors<FormData>;
  checkboxInput?: boolean;
};
