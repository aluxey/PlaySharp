export type GameCode = 'poker' | 'blackjack';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type Tone = 'blue' | 'violet' | 'gold' | 'emerald' | 'rose';

export type DashboardStat = {
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
  icon: string;
};

export type FocusTheme = {
  theme: string;
  accuracy: number;
  questions: number;
  icon: string;
};

export type RecommendedLesson = {
  title: string;
  description: string;
  tags: ReadonlyArray<string>;
  difficulty: Difficulty;
  duration: string;
  href: string;
  locked?: boolean;
  tone: Tone;
};

export type ActivityItem = {
  type: 'Quiz' | 'Lesson';
  title: string;
  score?: number;
  total?: number;
  progress?: number;
  time: string;
};

export type LessonEntry = {
  slug: string;
  title: string;
  description: string;
  content: string;
  game: GameCode;
  difficulty: Difficulty;
  duration: string;
  tags: ReadonlyArray<string>;
  locked: boolean;
  tone: Tone;
  image?: string;
};

export type QuizOption = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export type QuizQuestion = {
  id: number;
  question: string;
  options: ReadonlyArray<QuizOption>;
  explanation: string;
};

export type ProgressTheme = {
  theme: string;
  accuracy: number;
  questions: number;
  improvement: number;
};

export type MistakeItem = {
  mistake: string;
  occurrences: number;
  lastSeen: string;
};

export type ProfileScore = {
  name: string;
  score: number;
  total: number;
  date: string;
};

export type Achievement = {
  icon: string;
  name: string;
  unlocked: boolean;
};

export const dashboardStats: ReadonlyArray<DashboardStat> = [
  { label: 'Daily Streak', value: '7', change: '+1', positive: true, icon: '🔥' },
  { label: 'Accuracy Rate', value: '84%', change: '+3%', positive: true, icon: '🎯' },
  { label: 'Quizzes Completed', value: '156', icon: '⚡' },
  { label: 'Lessons Done', value: '23', icon: '🏆' },
];

export const focusThemes: ReadonlyArray<FocusTheme> = [
  { theme: 'Post-Flop Play', accuracy: 62, questions: 24, icon: '↗' },
  { theme: 'Pot Odds Calculation', accuracy: 71, questions: 18, icon: '∑' },
  { theme: 'Bluff Detection', accuracy: 68, questions: 31, icon: '◌' },
];

export const recommendedLessons: ReadonlyArray<RecommendedLesson> = [
  {
    title: 'Advanced Post-Flop Strategy',
    description: 'Master the art of playing after the flop with GTO principles',
    tags: ['Poker', 'Strategy'],
    difficulty: 'advanced',
    duration: '45 min',
    href: '/lessons/advanced-post-flop-strategy',
    tone: 'violet',
  },
  {
    title: 'Pot Odds Mastery',
    description: 'Learn to calculate pot odds quickly and make better decisions',
    tags: ['Poker', 'Math'],
    difficulty: 'intermediate',
    duration: '30 min',
    href: '/lessons/pot-odds-mastery',
    tone: 'blue',
  },
  {
    title: 'Reading Your Opponents',
    description: 'Identify betting patterns and detect bluffs effectively',
    tags: ['Poker', 'Psychology'],
    difficulty: 'advanced',
    duration: '50 min',
    href: '/lessons/reading-your-opponents',
    locked: true,
    tone: 'gold',
  },
];

export const dashboardActivity: ReadonlyArray<ActivityItem> = [
  {
    type: 'Quiz',
    title: 'Pre-Flop Strategy Quiz',
    score: 8,
    total: 10,
    time: '2 hours ago',
  },
  {
    type: 'Lesson',
    title: 'GTO Basics',
    progress: 60,
    time: '5 hours ago',
  },
  {
    type: 'Quiz',
    title: 'Blackjack Basic Strategy',
    score: 9,
    total: 10,
    time: 'Yesterday',
  },
];

export const lessonLibrary: ReadonlyArray<LessonEntry> = [
  {
    slug: 'pre-flop-strategy-fundamentals',
    title: 'Pre-Flop Strategy Fundamentals',
    description: 'Master opening ranges, position play, and initial decision-making',
    content:
      'A compact primer on opening ranges, position leverage, and the first decision tree you build at the table.',
    game: 'poker',
    difficulty: 'beginner',
    duration: '35 min',
    tags: ['Poker', 'Beginner'],
    locked: false,
    tone: 'blue',
    image: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=400',
  },
  {
    slug: 'advanced-post-flop-strategy',
    title: 'Advanced Post-Flop Strategy',
    description: 'Master the art of playing after the flop with GTO principles',
    content:
      'Study board texture, range interaction, and how to pressure capped ranges without over-committing.',
    game: 'poker',
    difficulty: 'advanced',
    duration: '45 min',
    tags: ['Poker', 'Strategy'],
    locked: false,
    tone: 'violet',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400',
  },
  {
    slug: 'pot-odds-mastery',
    title: 'Pot Odds Mastery',
    description: 'Learn to calculate pot odds quickly and make better decisions',
    content:
      'Turn the math into a fast habit. This path keeps the numbers small, clear, and tied to action.',
    game: 'poker',
    difficulty: 'intermediate',
    duration: '30 min',
    tags: ['Poker', 'Math'],
    locked: false,
    tone: 'gold',
    image: 'https://images.unsplash.com/photo-1611224885990-ab7363d1f2c3?w=400',
  },
  {
    slug: 'blackjack-basic-strategy',
    title: 'Blackjack Basic Strategy',
    description: 'Learn the fundamental strategy chart and when to hit, stand, or double',
    content:
      'A clean strategy lane for dealer structure, soft hands, and the most common early-game decisions.',
    game: 'blackjack',
    difficulty: 'beginner',
    duration: '25 min',
    tags: ['Blackjack', 'Strategy'],
    locked: false,
    tone: 'emerald',
    image: 'https://images.unsplash.com/photo-1542645976-dfdbd69ee770?w=400',
  },
  {
    slug: 'card-counting-basics',
    title: 'Card Counting Basics',
    description: 'Introduction to Hi-Lo counting system and bankroll management',
    content:
      'A first look at count tracking, bet sizing, and the discipline required to keep the edge intact.',
    game: 'blackjack',
    difficulty: 'advanced',
    duration: '50 min',
    tags: ['Blackjack', 'Advanced'],
    locked: true,
    tone: 'rose',
    image: 'https://images.unsplash.com/photo-1571988840298-3b5301d5109b?w=400',
  },
  {
    slug: 'reading-your-opponents',
    title: 'Reading Your Opponents',
    description: 'Identify betting patterns and detect bluffs effectively',
    content:
      'Focus on timing, sizing, and the friction points that reveal when a line is stronger than it looks.',
    game: 'poker',
    difficulty: 'advanced',
    duration: '50 min',
    tags: ['Poker', 'Psychology'],
    locked: true,
    tone: 'gold',
    image: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=400',
  },
  {
    slug: 'tournament-strategy',
    title: 'Tournament Strategy',
    description: 'Adjust your play for different tournament stages and stack sizes',
    content:
      'Build the habit of adjusting ranges as stacks shorten, pressure rises, and payout thresholds matter more.',
    game: 'poker',
    difficulty: 'intermediate',
    duration: '40 min',
    tags: ['Poker', 'Tournament'],
    locked: false,
    tone: 'blue',
    image: 'https://images.unsplash.com/photo-1515968730927-e0819901e456?w=400',
  },
  {
    slug: 'bankroll-management',
    title: 'Bankroll Management',
    description: 'Essential concepts for managing your poker bankroll effectively',
    content:
      'A practical lesson on sizing your bankroll so you can keep learning without the emotional noise.',
    game: 'poker',
    difficulty: 'beginner',
    duration: '20 min',
    tags: ['Poker', 'Finance'],
    locked: false,
    tone: 'emerald',
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400',
  },
  {
    slug: 'side-bet-strategies',
    title: 'Side Bet Strategies',
    description: 'Understanding side bets in blackjack and when they make sense',
    content:
      'A short lesson on when side bets are entertainment and when they become noise in your decision process.',
    game: 'blackjack',
    difficulty: 'intermediate',
    duration: '35 min',
    tags: ['Blackjack', 'Strategy'],
    locked: true,
    tone: 'violet',
    image: 'https://images.unsplash.com/photo-1541336032412-2048ef281121?w=400',
  },
];

export function getLessonBySlug(slug: string): LessonEntry | null {
  return lessonLibrary.find((lesson) => lesson.slug === slug) ?? null;
}

export const quizQuestions: ReadonlyArray<QuizQuestion> = [
  {
    id: 1,
    question: 'Vous avez A♠ K♠ en main. Le flop est Q♠ J♠ 2♣. Quelle est votre meilleure action ?',
    options: [
      { id: 'a', text: 'Check pour voir la turn gratuitement', isCorrect: false },
      { id: 'b', text: 'Bet environ 60% du pot', isCorrect: true },
      { id: 'c', text: 'All-in immédiatement', isCorrect: false },
      { id: 'd', text: 'Fold car trop de cartes dangereuses', isCorrect: false },
    ],
    explanation:
      "Avec une top pair + nut flush draw, vous avez beaucoup d'equity. Un bet à 60% du pot permet de protéger votre main, construire le pot et obtenir de la value contre des mains plus faibles.",
  },
  {
    id: 2,
    question:
      'Au blackjack, vous avez 16 et le dealer montre un 7. Quelle est la meilleure décision selon la stratégie de base ?',
    options: [
      { id: 'a', text: 'Stand', isCorrect: false },
      { id: 'b', text: 'Hit', isCorrect: true },
      { id: 'c', text: 'Double Down', isCorrect: false },
      { id: 'd', text: 'Surrender', isCorrect: false },
    ],
    explanation:
      "Avec 16 contre un 7 du dealer, vous devez Hit selon la stratégie de base. Le dealer a de bonnes chances d'avoir une main forte, et rester sur 16 est trop risqué.",
  },
  {
    id: 3,
    question: "En position UTG avec 9♥ 9♦, quelle est l'action recommandée en cash game ?",
    options: [
      { id: 'a', text: 'Fold', isCorrect: false },
      { id: 'b', text: 'Call', isCorrect: false },
      { id: 'c', text: 'Raise 2.5-3x BB', isCorrect: true },
      { id: 'd', text: 'All-in', isCorrect: false },
    ],
    explanation:
      "Les pocket pairs moyennes comme 99 doivent être jouées avec un raise standard en UTG pour construire le pot et isoler les adversaires. C'est une main premium qui justifie une ouverture.",
  },
];

export const weeklyProgress: ReadonlyArray<{ day: string; accuracy: number }> = [
  { day: 'Mon', accuracy: 75 },
  { day: 'Tue', accuracy: 78 },
  { day: 'Wed', accuracy: 82 },
  { day: 'Thu', accuracy: 80 },
  { day: 'Fri', accuracy: 84 },
  { day: 'Sat', accuracy: 86 },
  { day: 'Sun', accuracy: 88 },
];

export const progressThemes: ReadonlyArray<ProgressTheme> = [
  { theme: 'Post-Flop Play', accuracy: 62, questions: 24, improvement: -3 },
  { theme: 'Pot Odds Calculation', accuracy: 71, questions: 18, improvement: 5 },
  { theme: 'Bluff Detection', accuracy: 68, questions: 31, improvement: 2 },
  { theme: 'Position Play', accuracy: 74, questions: 19, improvement: -1 },
];

export const recurringMistakes: ReadonlyArray<MistakeItem> = [
  { mistake: 'Over-betting on draws', occurrences: 8, lastSeen: '2 days ago' },
  { mistake: 'Calling too wide from early position', occurrences: 6, lastSeen: '4 days ago' },
  { mistake: 'Missing pot odds calculations', occurrences: 5, lastSeen: '1 day ago' },
];

export const profileStats = [
  { label: 'Total Quiz Completed', value: '156' },
  { label: 'Average Accuracy', value: '84%' },
  { label: 'Current Streak', value: '7 days' },
  { label: 'Lessons Completed', value: '23' },
] as const;

export const recentQuizScores: ReadonlyArray<ProfileScore> = [
  { name: 'Pre-Flop Strategy', score: 8, total: 10, date: '2 hours ago' },
  { name: 'Pot Odds Calculation', score: 7, total: 10, date: 'Yesterday' },
  { name: 'Blackjack Basic Strategy', score: 9, total: 10, date: '2 days ago' },
  { name: 'Position Play', score: 6, total: 10, date: '3 days ago' },
];

export const achievements: ReadonlyArray<Achievement> = [
  { icon: '🔥', name: 'Week Streak', unlocked: true },
  { icon: '🎯', name: 'Perfect Score', unlocked: true },
  { icon: '📚', name: '20 Lessons', unlocked: true },
  { icon: '⚡', name: '100 Quizzes', unlocked: true },
  { icon: '🏆', name: 'Champion', unlocked: false },
  { icon: '💎', name: 'Elite Player', unlocked: false },
];
