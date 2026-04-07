import { supportedGames, type GameName } from '@playsharp/shared';

export function isGameName(value: string): value is GameName {
  return (supportedGames as ReadonlyArray<string>).includes(value);
}

export function parseGameName(
  value: string | undefined,
  fallback: GameName = 'poker',
): GameName | null {
  if (value === undefined) {
    return fallback;
  }

  return isGameName(value) ? value : null;
}

export function gameLabel(game: GameName): string {
  switch (game) {
    case 'poker':
      return 'Poker';
    case 'blackjack':
      return 'Blackjack';
  }
}
