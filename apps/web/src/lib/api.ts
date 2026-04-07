import type {
  ContentGame,
  ContentGameName,
  ContentGameSummary,
  DailyQuiz,
} from '@playsharp/shared';

const apiBaseUrl = (process.env.API_BASE_URL ?? 'http://127.0.0.1:3001/api').replace(/\/$/, '');

const fallbackGameSummaries: ReadonlyArray<ContentGameSummary> = [
  { game: 'poker', name: 'Poker', themeCount: 1, lessonCount: 2, questionCount: 2 },
  { game: 'blackjack', name: 'Blackjack', themeCount: 1, lessonCount: 2, questionCount: 2 },
];

function getFallbackDailyQuiz(game: ContentGameName): DailyQuiz {
  if (game === 'blackjack') {
    return {
      game: 'blackjack',
      themeSlug: 'basic-strategy-basics',
      themeName: 'Basic Strategy Basics',
      question: {
        slug: 'hard-12-vs-dealer-4',
        title: 'Hard 12 versus dealer 4',
        scenario: 'You have a hard 12 against a dealer 4.',
        difficulty: 'beginner',
        explanation:
          'A dealer 4 is a weak upcard, so standing on hard 12 is the disciplined default because the dealer is more likely to bust.',
        isPremium: false,
        choices: [
          { label: 'Stand', isCorrect: true, explanation: 'The dealer is in a poor position.' },
          { label: 'Hit immediately', isCorrect: false, explanation: 'You improve too slowly.' },
          { label: 'Double down', isCorrect: false, explanation: 'Not enough upside.' },
        ],
      },
    };
  }

  return {
    game: 'poker',
    themeSlug: 'preflop-position',
    themeName: 'Preflop Position',
    question: {
      slug: 'button-open-raise',
      title: 'Button open raise',
      scenario: 'You are on the button in a soft cash game. The players in the blinds are passive.',
      difficulty: 'beginner',
      explanation:
        'The button should open wider because you act last postflop and steal more uncontested pots.',
      isPremium: false,
      choices: [
        {
          label: 'Raise a wider range',
          isCorrect: true,
          explanation: 'Uses position to win more pots.',
        },
        { label: 'Limp most hands', isCorrect: false, explanation: 'Gives up initiative.' },
        {
          label: 'Fold everything except premiums',
          isCorrect: false,
          explanation: 'Too tight for the button.',
        },
      ],
    },
  };
}

async function apiGet<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function getGameSummaries(): Promise<ReadonlyArray<ContentGameSummary>> {
  const response = await apiGet<{ games: ContentGameSummary[] }>('/content/games');
  return response?.games ?? fallbackGameSummaries;
}

export async function getGameContent(game: ContentGameName): Promise<ContentGame | null> {
  return apiGet<ContentGame>(`/content/games/${game}`);
}

export async function getDailyQuiz(game: ContentGameName = 'poker'): Promise<DailyQuiz | null> {
  return apiGet<DailyQuiz>(`/quiz/daily?game=${game}`) ?? getFallbackDailyQuiz(game);
}
