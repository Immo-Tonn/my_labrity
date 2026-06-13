export type QuizAnswers = Record<string, string[]>;

export type ContactFormData = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  privacy: boolean;
};

export type QuizQuestion = {
  id: string;
  title: string;
  multiple?: boolean;
  options: string[];
};

export type QuizDictionary = {
  progress: string;
  next: string;
  submit: string;

  form: {
    title: string;

    firstName: string;
    lastName: string;
    phone: string;
    email: string;

    success: string;
    error: string;

    required: string;
    invalidEmail: string;
    invalidPhone: string;
  };

  questions: QuizQuestion[];
};
