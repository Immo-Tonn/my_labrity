import { useQuiz } from '@/components/quiz';
import Quiz from './Quiz';

export default function QuizModal() {
  const { open, closeQuiz } = useQuiz();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={closeQuiz}
      />

      {/* MODAL */}
      <div
        className="
          relative z-10
          w-full max-w-[720px]

          overflow-hidden
          rounded-2xl

          bg-white
          shadow-2xl
        "
      >
        {/* CLOSE */}
        <button
          onClick={closeQuiz}
          className="
            absolute right-4 top-4 z-20
            text-2xl leading-none
          "
        >
          ✕
        </button>

        {/* SCROLL AREA */}
        <div className="max-h-[90vh] overflow-auto">
          <Quiz />
        </div>
      </div>
    </div>
  );
}