# Documentation

This directory keeps durable product, technical, UX, data, and staging references.

## Start here

- `../README.md`: local setup, commands, repository layout, and current status.
- `technical-setup.md`: environment details and the normal development workflow.
- `deployment-staging.md`: minimal staging setup, deployment order, and release checklist.

## Product

- `product/README.md`: product vision, V1 boundaries, release criteria, and metrics.
- `product/roadmap.md`: delivery phases and current focus.
- `product/stories.md`: active unfinished stories only.

## UX

- `ux/screens.md`: target content and states for each screen.
- `ux/frontend-guidelines.md`: visual tokens, components, navigation, and accessibility rules.

## Data and API

- `data/api-contract.md`: response envelope, route table, auth rules, and stable error codes.
- `data/database.md`: current Prisma-backed data model overview.

## Documentation policy

- Keep setup steps in `../README.md`; add details in `technical-setup.md` only when the README
  would become too noisy.
- Keep API route details in `data/api-contract.md`; do not duplicate route tables elsewhere.
- Keep completed implementation checklists out of the repo. Active follow-up work belongs in
  `product/stories.md`.
- Keep generated prompts and one-off notes out of per-game content READMEs. Content structure and
  workflow belong in `../content/README.md`.
