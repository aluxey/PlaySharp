import { appNavItems } from './routes';

export const siteConfig = {
  name: 'PlaySharp',
  description: 'Daily training for poker and blackjack with fast feedback and measurable progress.',
  navItems: appNavItems,
} as const;

export const heroHighlights = [
  'Instant correction after every answer',
  'Lesson library organized by game and theme',
  'Progress tracking built for repetition and retention',
] as const;
