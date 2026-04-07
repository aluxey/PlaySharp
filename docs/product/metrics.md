# Metrics

## Purpose

Use a small set of product metrics to validate that the learning loop is working.

## Acquisition and activation

- `sign_up_rate`: visitors who create an account
- `quiz_start_rate`: signed-in users who begin a quiz
- `first_quiz_completion_rate`: users who complete their first quiz

## Engagement

- `daily_active_users`: users active on a given day
- `quiz_completion_rate`: completed quizzes divided by started quizzes
- `lesson_view_rate`: lesson visits divided by quiz completions

## Retention

- `d1_retention`: returning active users after one day
- `d7_retention`: returning active users after seven days
- `streak_growth`: change in streak length over time

## Learning quality

- `accuracy_rate`: correct answers divided by total answers
- `weak_theme_recovery`: improvement in weak themes over time
- `explanation_view_rate`: answer views that reach the explanation step

## Operational health

- `api_error_rate`
- `quiz_latency`
- `build_success_rate`

## Notes

- Set numeric targets after the first beta cohort.
- Track trends before optimizing for absolute values.
