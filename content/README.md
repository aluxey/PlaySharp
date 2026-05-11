# Content

This folder stores the versioned seed manifests for educational content.

Admin edits are written to PostgreSQL. Use the admin export flow when database edits need to be
reviewed and brought back into these manifests.

## Structure

- `poker/content.json`: poker catalog manifest
- `blackjack/content.json`: blackjack catalog manifest

## Rules

- Keep content files small and explicit
- Use stable slugs for themes, lessons, and questions
- Mirror the database seed structure when content is synced
- Commit content changes alongside the code that depends on them
- Keep lesson explanations practical and question distractors believable
- Avoid duplicate scenarios, duplicate wording, and repetitive correct-answer positions
- Rerun `npm run seed --workspace @playsharp/api` after changing manifests

## Manifest shape

Each game manifest contains:

- `game`
- `name`
- `themes[]`

Each theme contains lessons and questions with stable slugs, level labels, and answer choices.

## Workflow

1. Edit `content/{game}/content.json`
2. Run `npm run content:check`
3. Rerun the Prisma seed so PostgreSQL matches the manifests
4. Review the affected API/web screens locally
