'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import type {
  AdminLessonMutationRequest,
  AdminLessonRecord,
  AdminQuestionChoiceMutationRequest,
  AdminQuestionMutationRequest,
  AdminQuestionRecord,
  AdminThemeRecord,
  ApiErrorResponse,
  ContentDifficulty,
  ContentGameName,
} from '@playsharp/shared';

type AdminEditorProps = {
  themes: ReadonlyArray<AdminThemeRecord>;
  lessons: ReadonlyArray<AdminLessonRecord>;
  questions: ReadonlyArray<AdminQuestionRecord>;
};

const difficultyOptions = ['beginner', 'intermediate', 'advanced'] as const;

type LessonFormState = AdminLessonMutationRequest;
type QuestionFormState = AdminQuestionMutationRequest;

function emptyLesson(theme: AdminThemeRecord | undefined): LessonFormState {
  return {
    game: theme?.game ?? 'poker',
    themeSlug: theme?.themeSlug ?? '',
    lessonSlug: '',
    title: '',
    content: '',
    level: theme?.level ?? 'beginner',
  };
}

function emptyQuestion(theme: AdminThemeRecord | undefined): QuestionFormState {
  return {
    game: theme?.game ?? 'poker',
    themeSlug: theme?.themeSlug ?? '',
    questionSlug: '',
    title: '',
    scenario: '',
    difficulty: theme?.level ?? 'beginner',
    explanation: '',
    isPremium: false,
    choices: [
      { label: '', isCorrect: true, explanation: '' },
      { label: '', isCorrect: false, explanation: '' },
    ],
  };
}

function lessonToForm(lesson: AdminLessonRecord): LessonFormState {
  return {
    game: lesson.game,
    themeSlug: lesson.themeSlug,
    lessonSlug: lesson.lessonSlug,
    title: lesson.title,
    content: lesson.content,
    level: lesson.level,
  };
}

function questionToForm(question: AdminQuestionRecord): QuestionFormState {
  return {
    game: question.game,
    themeSlug: question.themeSlug,
    questionSlug: question.questionSlug,
    title: question.title,
    scenario: question.scenario ?? '',
    difficulty: question.difficulty,
    explanation: question.explanation,
    isPremium: question.isPremium,
    choices: question.choices.map((choice) => ({
      label: choice.label,
      isCorrect: choice.isCorrect,
      explanation: choice.explanation ?? '',
    })),
  };
}

async function readMutationError(response: Response) {
  const payload = (await response.json().catch(() => null)) as ApiErrorResponse | null;
  return payload?.message ?? `Request failed with status ${response.status}.`;
}

function themeKey(theme: { game: ContentGameName; themeSlug: string }) {
  return `${theme.game}:${theme.themeSlug}`;
}

export function AdminEditor({ themes, lessons, questions }: AdminEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const activeLessons = lessons.filter((lesson) => lesson.archivedAt === null);
  const activeQuestions = questions.filter((question) => question.archivedAt === null);
  const firstTheme = themes[0];
  const [selectedLessonId, setSelectedLessonId] = useState<string>('new');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('new');
  const selectedLesson = lessons.find((lesson) => lesson.id === selectedLessonId);
  const selectedQuestion = questions.find((question) => question.id === selectedQuestionId);
  const [lessonForm, setLessonForm] = useState<LessonFormState>(() => emptyLesson(firstTheme));
  const [questionForm, setQuestionForm] = useState<QuestionFormState>(() =>
    emptyQuestion(firstTheme),
  );
  const [lessonError, setLessonError] = useState<string | null>(null);
  const [questionError, setQuestionError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const themeOptions = useMemo(
    () =>
      themes.map((theme) => ({
        key: themeKey(theme),
        label: `${theme.game} / ${theme.themeName}`,
        game: theme.game,
        themeSlug: theme.themeSlug,
      })),
    [themes],
  );

  function refresh(message: string) {
    setNotice(message);
    startTransition(() => router.refresh());
  }

  function selectLesson(id: string) {
    setSelectedLessonId(id);
    setLessonError(null);
    setLessonForm(
      id === 'new'
        ? emptyLesson(firstTheme)
        : lessonToForm(lessons.find((lesson) => lesson.id === id)!),
    );
  }

  function selectQuestion(id: string) {
    setSelectedQuestionId(id);
    setQuestionError(null);
    setQuestionForm(
      id === 'new'
        ? emptyQuestion(firstTheme)
        : questionToForm(questions.find((question) => question.id === id)!),
    );
  }

  function setLessonTheme(value: string) {
    const option = themeOptions.find((theme) => theme.key === value);
    if (!option) {
      return;
    }

    setLessonForm((current) => ({
      ...current,
      game: option.game,
      themeSlug: option.themeSlug,
    }));
  }

  function setQuestionTheme(value: string) {
    const option = themeOptions.find((theme) => theme.key === value);
    if (!option) {
      return;
    }

    setQuestionForm((current) => ({
      ...current,
      game: option.game,
      themeSlug: option.themeSlug,
    }));
  }

  async function saveLesson() {
    setLessonError(null);
    setNotice(null);

    const response = await fetch(
      selectedLessonId === 'new' ? '/api/admin/lessons' : `/api/admin/lessons/${selectedLessonId}`,
      {
        method: selectedLessonId === 'new' ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lessonForm),
      },
    );

    if (!response.ok) {
      setLessonError(await readMutationError(response));
      return;
    }

    refresh(selectedLessonId === 'new' ? 'Lesson created.' : 'Lesson updated.');
  }

  async function archiveLesson() {
    if (selectedLessonId === 'new') {
      return;
    }

    setLessonError(null);
    setNotice(null);

    const response = await fetch(`/api/admin/lessons/${selectedLessonId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      setLessonError(await readMutationError(response));
      return;
    }

    setSelectedLessonId('new');
    setLessonForm(emptyLesson(firstTheme));
    refresh('Lesson archived.');
  }

  async function saveQuestion() {
    setQuestionError(null);
    setNotice(null);

    const response = await fetch(
      selectedQuestionId === 'new'
        ? '/api/admin/questions'
        : `/api/admin/questions/${selectedQuestionId}`,
      {
        method: selectedQuestionId === 'new' ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(questionForm),
      },
    );

    if (!response.ok) {
      setQuestionError(await readMutationError(response));
      return;
    }

    refresh(selectedQuestionId === 'new' ? 'Question created.' : 'Question updated.');
  }

  async function archiveQuestion() {
    if (selectedQuestionId === 'new') {
      return;
    }

    setQuestionError(null);
    setNotice(null);

    const response = await fetch(`/api/admin/questions/${selectedQuestionId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      setQuestionError(await readMutationError(response));
      return;
    }

    setSelectedQuestionId('new');
    setQuestionForm(emptyQuestion(firstTheme));
    refresh('Question archived.');
  }

  function updateChoice(index: number, patch: Partial<AdminQuestionChoiceMutationRequest>) {
    setQuestionForm((current) => ({
      ...current,
      choices: current.choices.map((choice, choiceIndex) =>
        choiceIndex === index ? { ...choice, ...patch } : choice,
      ),
    }));
  }

  function setCorrectChoice(index: number) {
    setQuestionForm((current) => ({
      ...current,
      choices: current.choices.map((choice, choiceIndex) => ({
        ...choice,
        isCorrect: choiceIndex === index,
      })),
    }));
  }

  return (
    <section className="space-y-6">
      {notice ? (
        <div className="rounded-2xl border border-success/40 bg-success/10 px-4 py-3 text-sm text-success">
          {notice}
        </div>
      ) : null}

      <div className="grid lg:grid-cols-2 gap-6">
        <article className="bg-surface-elevated border border-border rounded-2xl p-6 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-foreground-secondary">
                Lessons
              </p>
              <h2 className="text-2xl font-bold text-foreground">Lesson editor</h2>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
              {activeLessons.length} active
            </span>
          </div>

          <label className="block space-y-2 text-sm font-medium text-foreground">
            <span>Record</span>
            <select
              className="w-full rounded-xl border border-border bg-surface px-4 py-3"
              value={selectedLessonId}
              onChange={(event) => selectLesson(event.target.value)}
            >
              <option value="new">New lesson</option>
              {lessons.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.archivedAt ? '[archived] ' : ''}
                  {lesson.game} / {lesson.themeSlug} / {lesson.title}
                </option>
              ))}
            </select>
          </label>

          <ContentFields
            form={lessonForm}
            themeOptions={themeOptions}
            onThemeChange={setLessonTheme}
            onDifficultyChange={(level) => setLessonForm((current) => ({ ...current, level }))}
            onChange={(patch) => setLessonForm((current) => ({ ...current, ...patch }))}
          />

          <label className="block space-y-2 text-sm font-medium text-foreground">
            <span>Content</span>
            <textarea
              className="min-h-36 w-full rounded-xl border border-border bg-surface px-4 py-3"
              value={lessonForm.content}
              onChange={(event) =>
                setLessonForm((current) => ({ ...current, content: event.target.value }))
              }
            />
          </label>

          {lessonError ? (
            <div className="rounded-xl border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
              {lessonError}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button
              className="rounded-xl bg-primary px-4 py-2 font-semibold text-primary-foreground disabled:opacity-60"
              disabled={isPending}
              onClick={saveLesson}
              type="button"
            >
              {selectedLessonId === 'new' ? 'Create lesson' : 'Save lesson'}
            </button>
            <button
              className="rounded-xl border border-border px-4 py-2 text-foreground disabled:opacity-50"
              disabled={selectedLessonId === 'new' || Boolean(selectedLesson?.archivedAt)}
              onClick={archiveLesson}
              type="button"
            >
              Archive
            </button>
          </div>
        </article>

        <article className="bg-surface-elevated border border-border rounded-2xl p-6 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-foreground-secondary">
                Questions
              </p>
              <h2 className="text-2xl font-bold text-foreground">Question editor</h2>
            </div>
            <span className="rounded-full bg-secondary/10 px-3 py-1 text-sm text-secondary">
              {activeQuestions.length} active
            </span>
          </div>

          <label className="block space-y-2 text-sm font-medium text-foreground">
            <span>Record</span>
            <select
              className="w-full rounded-xl border border-border bg-surface px-4 py-3"
              value={selectedQuestionId}
              onChange={(event) => selectQuestion(event.target.value)}
            >
              <option value="new">New question</option>
              {questions.map((question) => (
                <option key={question.id} value={question.id}>
                  {question.archivedAt ? '[archived] ' : ''}
                  {question.game} / {question.themeSlug} / {question.title}
                </option>
              ))}
            </select>
          </label>

          <ContentFields
            form={{
              game: questionForm.game,
              themeSlug: questionForm.themeSlug,
              lessonSlug: questionForm.questionSlug,
              title: questionForm.title,
              level: questionForm.difficulty,
            }}
            slugLabel="Question slug"
            themeOptions={themeOptions}
            onThemeChange={setQuestionTheme}
            onDifficultyChange={(difficulty) =>
              setQuestionForm((current) => ({ ...current, difficulty }))
            }
            onChange={(patch) =>
              setQuestionForm((current) => ({
                ...current,
                ...(patch.lessonSlug !== undefined ? { questionSlug: patch.lessonSlug } : {}),
                ...(patch.title !== undefined ? { title: patch.title } : {}),
              }))
            }
          />

          <label className="block space-y-2 text-sm font-medium text-foreground">
            <span>Scenario</span>
            <textarea
              className="min-h-24 w-full rounded-xl border border-border bg-surface px-4 py-3"
              value={questionForm.scenario ?? ''}
              onChange={(event) =>
                setQuestionForm((current) => ({ ...current, scenario: event.target.value }))
              }
            />
          </label>

          <label className="block space-y-2 text-sm font-medium text-foreground">
            <span>Explanation</span>
            <textarea
              className="min-h-28 w-full rounded-xl border border-border bg-surface px-4 py-3"
              value={questionForm.explanation}
              onChange={(event) =>
                setQuestionForm((current) => ({ ...current, explanation: event.target.value }))
              }
            />
          </label>

          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <input
              checked={questionForm.isPremium}
              onChange={(event) =>
                setQuestionForm((current) => ({ ...current, isPremium: event.target.checked }))
              }
              type="checkbox"
            />
            Premium question
          </label>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Choices</h3>
              <button
                className="rounded-xl border border-border px-3 py-2 text-sm disabled:opacity-50"
                disabled={questionForm.choices.length >= 8}
                onClick={() =>
                  setQuestionForm((current) => ({
                    ...current,
                    choices: [...current.choices, { label: '', isCorrect: false, explanation: '' }],
                  }))
                }
                type="button"
              >
                Add choice
              </button>
            </div>
            {questionForm.choices.map((choice, index) => (
              <div key={index} className="rounded-xl border border-border bg-surface p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    checked={choice.isCorrect}
                    name="correct-choice"
                    onChange={() => setCorrectChoice(index)}
                    type="radio"
                  />
                  <input
                    className="min-w-0 flex-1 rounded-lg border border-border bg-surface-elevated px-3 py-2"
                    placeholder={`Choice ${index + 1}`}
                    value={choice.label}
                    onChange={(event) => updateChoice(index, { label: event.target.value })}
                  />
                  <button
                    className="rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-50"
                    disabled={questionForm.choices.length <= 2}
                    onClick={() =>
                      setQuestionForm((current) => ({
                        ...current,
                        choices: current.choices.filter((_, choiceIndex) => choiceIndex !== index),
                      }))
                    }
                    type="button"
                  >
                    Remove
                  </button>
                </div>
                <input
                  className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm"
                  placeholder="Optional choice feedback"
                  value={choice.explanation ?? ''}
                  onChange={(event) => updateChoice(index, { explanation: event.target.value })}
                />
              </div>
            ))}
          </div>

          {questionError ? (
            <div className="rounded-xl border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
              {questionError}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button
              className="rounded-xl bg-primary px-4 py-2 font-semibold text-primary-foreground disabled:opacity-60"
              disabled={isPending}
              onClick={saveQuestion}
              type="button"
            >
              {selectedQuestionId === 'new' ? 'Create question' : 'Save question'}
            </button>
            <button
              className="rounded-xl border border-border px-4 py-2 text-foreground disabled:opacity-50"
              disabled={selectedQuestionId === 'new' || Boolean(selectedQuestion?.archivedAt)}
              onClick={archiveQuestion}
              type="button"
            >
              Archive
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}

function ContentFields({
  form,
  slugLabel = 'Lesson slug',
  themeOptions,
  onThemeChange,
  onDifficultyChange,
  onChange,
}: {
  form: {
    game: ContentGameName;
    themeSlug: string;
    lessonSlug: string;
    title: string;
    level: ContentDifficulty;
  };
  slugLabel?: string;
  themeOptions: ReadonlyArray<{
    key: string;
    label: string;
    game: ContentGameName;
    themeSlug: string;
  }>;
  onThemeChange: (value: string) => void;
  onDifficultyChange: (value: ContentDifficulty) => void;
  onChange: (patch: Partial<LessonFormState>) => void;
}) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <label className="block space-y-2 text-sm font-medium text-foreground">
        <span>Theme</span>
        <select
          className="w-full rounded-xl border border-border bg-surface px-4 py-3"
          value={themeKey({ game: form.game, themeSlug: form.themeSlug })}
          onChange={(event) => onThemeChange(event.target.value)}
        >
          {themeOptions.map((theme) => (
            <option key={theme.key} value={theme.key}>
              {theme.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block space-y-2 text-sm font-medium text-foreground">
        <span>Difficulty</span>
        <select
          className="w-full rounded-xl border border-border bg-surface px-4 py-3"
          value={form.level}
          onChange={(event) => onDifficultyChange(event.target.value as ContentDifficulty)}
        >
          {difficultyOptions.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </label>

      <label className="block space-y-2 text-sm font-medium text-foreground">
        <span>{slugLabel}</span>
        <input
          className="w-full rounded-xl border border-border bg-surface px-4 py-3"
          value={form.lessonSlug}
          onChange={(event) => onChange({ lessonSlug: event.target.value })}
        />
      </label>

      <label className="block space-y-2 text-sm font-medium text-foreground">
        <span>Title</span>
        <input
          className="w-full rounded-xl border border-border bg-surface px-4 py-3"
          value={form.title}
          onChange={(event) => onChange({ title: event.target.value })}
        />
      </label>
    </div>
  );
}
