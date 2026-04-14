# Screen Architecture

## Landing page

Purpose: conversion.

Core content:

- Hero section
- Demo quiz block
- Benefits
- Free vs premium comparison
- Sign-up CTA

## Dashboard

Purpose: the main post-login home.

Core content:

- Global progress
- "Start daily quiz" CTA
- Quick stats: score and streak
- Theme recommendation
- Fast access to lessons and quiz

## Quiz page

States:

1. Question state
2. Feedback state

Question state content:

- Title or scenario
- Optional visual
- 3 to 5 answer choices
- Validate action

Feedback state content:

- Correct or incorrect result
- Explanation
- Next action button

## Result page

Core content:

- Score
- Success rate
- Time or pace
- Weak themes
- Retry or continue action

## Lessons page

Core content:

- Theme list
- Filters by level and game
- Detailed lesson page with examples

## Progress page

Core content:

- 7-day and 30-day evolution
- Success rate by theme
- Frequent mistakes
- Performance heatmap

## Profile page

Core content:

- User information
- Subscription status
- Activity history
- Upgrade CTA

## Payment page

Future scope:

- Premium plan
- Stripe checkout
- Confirmation state

## Admin area

Core content:

- Read-only inventory totals
- Theme, lesson, and question listings
- Manifest/source-of-truth references
- Coverage and difficulty summaries
- Quiz/content preview links
- Global stats

V1 note: content edits stay in versioned JSON and the admin surface remains read-only.
