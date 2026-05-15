import { useQuiz } from '@/components/quiz';
import Quiz from './Quiz';

export default function QuizModal() {
  const { open, closeQuiz } = useQuiz();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={closeQuiz} />

      <div className="absolute right-0 top-0 h-full w-full overflow-auto bg-white md:w-[720px]">
        <button onClick={closeQuiz} className="absolute right-4 top-4">
          ✕
        </button>

        <Quiz />
      </div>
    </div>
  );
}
