'use client';

import type { QuizQuestion } from '../lib/training-content';

type QuizDemoCardProps = {
  question: QuizQuestion;
  selectedAnswer: string | null;
  showResult: boolean;
  onSelectAnswer: (id: string) => void;
  onValidate: () => void;
};

export function QuizDemoCard({
  question,
  selectedAnswer,
  showResult,
  onSelectAnswer,
  onValidate,
}: QuizDemoCardProps) {
  const correctAnswer = question.options.find((option) => option.isCorrect);

  return (
    <section className="quiz-card">
      <div className="quiz-card__question">
        <h3>{question.question}</h3>
      </div>

      <div className="quiz-card__options">
        {question.options.map((option) => {
          const isSelected = selectedAnswer === option.id;
          const isCorrect = option.isCorrect;
          const showCorrectState = showResult && isCorrect;
          const showIncorrectState = showResult && isSelected && !isCorrect;

          let className = 'quiz-option';

          if (showCorrectState) {
            className += ' quiz-option--correct';
          } else if (showIncorrectState) {
            className += ' quiz-option--incorrect';
          } else if (isSelected) {
            className += ' quiz-option--selected';
          }

          return (
            <button
              className={className}
              key={option.id}
              disabled={showResult}
              onClick={() => {
                if (!showResult) {
                  onSelectAnswer(option.id);
                }
              }}
              type="button"
            >
              <span className="quiz-option__text">{option.text}</span>
              {showResult ? (
                <span className="quiz-option__mark" aria-hidden="true">
                  {isCorrect ? '✓' : isSelected ? '✕' : ''}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {showResult ? (
        <div
          className={`quiz-card__result${
            selectedAnswer === correctAnswer?.id
              ? ' quiz-card__result--success'
              : ' quiz-card__result--error'
          }`}
        >
          <p>{selectedAnswer === correctAnswer?.id ? '✓ Correct!' : '✗ Incorrect'}</p>
          <span>{question.explanation}</span>
        </div>
      ) : null}

      {!showResult && selectedAnswer ? (
        <button className="button button--primary button--full" onClick={onValidate} type="button">
          Valider la réponse
        </button>
      ) : null}
    </section>
  );
}
