import { StatePanel } from '../../components';
import { getDailyQuiz } from '../../lib/api';
import { QuizClient } from './quiz-client';

export const dynamic = 'force-dynamic';

export default async function QuizPage() {
  const quiz = await getDailyQuiz('poker');

  if (quiz.error) {
    return (
      <div className="min-h-screen max-w-6xl mx-auto px-4 py-12">
        <StatePanel
          eyebrow="Quiz"
          title="Quiz data is unavailable"
          description={quiz.error.message}
          actionLabel="Back to dashboard"
          actionHref="/dashboard"
          tone="error"
        />
      </div>
    );
  }

  if (!quiz.data) {
    return (
      <div className="min-h-screen max-w-6xl mx-auto px-4 py-12">
        <StatePanel
          eyebrow="Quiz"
          title="No quiz available"
          description="The API did not return a daily quiz for the selected game."
          actionLabel="Open lessons"
          actionHref="/lessons"
        />
      </div>
    );
  }

  return <QuizClient quiz={quiz.data} />;
}
