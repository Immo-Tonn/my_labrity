'use client';

import { createContext, useContext, useState } from 'react';
import QuizModal from './QuizModal';

type QuizContextType = {
  open: boolean;
  openQuiz: () => void;
  closeQuiz: () => void;
};

export const QuizContext = createContext<QuizContextType | null>(null);

export const useQuiz = () => {
  const context = useContext(QuizContext);

  if (!context) {
    throw new Error('QuizProvider missing');
  }

  return context;
};

export default function QuizProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const openQuiz = () => setOpen(true);
  const closeQuiz = () => setOpen(false);

  return (
    <QuizContext.Provider
      value={{
        open,
        openQuiz,
        closeQuiz,
      }}
    >
      {children}

      <QuizModal />
    </QuizContext.Provider>
  );
}
