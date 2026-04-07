import { appNavItems } from './routes';

export const siteConfig = {
  name: 'PlaySharp',
  description:
    'A premium training platform for poker and blackjack with fast feedback and measurable progress.',
  navItems: appNavItems,
} as const;

export const heroHighlights = [
  'Instant correction after every answer',
  'Lesson paths organized by game, theme, and level',
  'Progress tracking designed for daily repetition and retention',
] as const;
