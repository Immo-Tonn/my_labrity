import { useQuiz } from '@/components/quiz';
import Quiz from './Quiz';

export default function QuizModal() {
  const { open, closeQuiz } = useQuiz();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={closeQuiz}
      />

      <div className="absolute right-0 top-0 h-full w-full md:w-[720px] bg-white overflow-auto">
        <button onClick={closeQuiz} className="absolute top-4 right-4">
          ✕
        </button>

        <Quiz />
      </div>
    </div>
  );
}