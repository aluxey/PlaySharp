export const supportedGames = ['poker', 'blackjack'] as const;
export type GameName = (typeof supportedGames)[number];

export const skillLevels = ['beginner', 'intermediate', 'advanced'] as const;
export type SkillLevel = (typeof skillLevels)[number];

export const userPlans = ['free', 'premium'] as const;
export type UserPlan = (typeof userPlans)[number];

export * from './content';
