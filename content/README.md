# Content

This folder is the versioned source of truth for educational content.

## Structure

- `poker/content.json`: poker catalog manifest
- `blackjack/content.json`: blackjack catalog manifest

## Rules

- Keep content files small and explicit
- Use stable slugs for themes, lessons, and questions
- Mirror the database seed structure when content is synced

## Manifest shape

Each game manifest contains:

- `game`
- `name`
- `themes[]`

Each theme contains lessons and questions with stable slugs, level labels, and answer choices.
