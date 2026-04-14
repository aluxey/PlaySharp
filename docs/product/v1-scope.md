# V1 Scope

## Objective

Ship a focused learning product for poker and blackjack that helps users practice daily,
understand mistakes quickly, and track improvement over time.

## In scope

- Landing page
- Authentication shell
- Dashboard
- Daily quiz flow
- Lesson browsing
- Progress overview
- Read-only admin workspace
- Versioned content for poker and blackjack

## Out of scope

- Premium subscription
- Stripe billing
- Social leagues
- Friend rankings
- Advanced analytics
- Mobile app

## Primary user journey

1. Land on the product and understand the value proposition
2. Sign in or register
3. Start the daily quiz
4. Review the answer and explanation
5. Browse lessons for the weak theme
6. Check progress and repeat the loop

## Release criteria

- A user can complete a quiz without friction
- A user can read the explanation immediately after answering
- A user can browse lessons by game and theme
- The admin workspace exposes live content inventory, source manifests, and coverage totals for internal review

## Admin decision for V1

- V1 keeps the admin workspace read-only.
- Versioned JSON under `content/` remains the source of truth for content changes.
- Internal content updates still go through Git review plus `npm run seed --workspace @playsharp/api`.
- Admin CRUD and write endpoints are deferred until after V1.
