# Database Model

## Core tables

### users

- `id` (uuid)
- `email`
- `password_hash`
- `role` (`user` / `admin`)
- `plan` (`free` / `premium`)
- `created_at`

### games

- `id`
- `name` (`poker` / `blackjack`)

### themes

- `id`
- `game_id` (FK)
- `name`
- `level` (`beginner` / `intermediate` / `advanced`)

### lessons

- `id`
- `theme_id` (FK)
- `title`
- `content`
- `level`
- `created_at`

### questions

- `id`
- `theme_id` (FK)
- `title`
- `scenario`
- `difficulty`
- `explanation`
- `is_premium`
- `created_at`

### answer_choices

- `id`
- `question_id` (FK)
- `label`
- `is_correct`
- `explanation`

### quiz_attempts

- `id`
- `user_id` (FK)
- `game_id` (FK)
- `started_at`
- `finished_at`
- `score`

### question_attempts

- `id`
- `quiz_attempt_id` (FK)
- `question_id` (FK)
- `selected_choice_id`
- `is_correct`
- `response_time`
- `error_theme_id`

## Analytics and premium tables

### user_stats

- `id`
- `user_id` (FK)
- `theme_id` (FK)
- `success_rate`
- `total_attempts`
- `last_updated`

### daily_usage

- `id`
- `user_id` (FK)
- `date`
- `questions_answered`

### subscriptions

- `id`
- `user_id` (FK)
- `stripe_customer_id`
- `status`
- `current_period_end`

## Notes

- Keep learning content separate from progression data.
- Keep premium data optional until the payment layer is activated.
- Use UUIDs for primary keys and explicit foreign keys for all relations.
