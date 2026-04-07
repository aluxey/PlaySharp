# 3 Modélisation base de données (propre et scalable)

## 1 Tables principales

### USERS

```sql
id (uuid)
email
password_hash
role (user/admin)
plan (free/premium)
created_at
```

---

### GAMES

```sql
id
name (poker / blackjack)
```

---

### THEMES

```sql
id
game_id (FK)
name
level (beginner/intermediate/advanced)
```

---

### LESSONS

```sql
id
theme_id (FK)
title
content
level
created_at
```

---

### QUESTIONS

```sql
id
theme_id (FK)
title
scenario
difficulty
explanation
is_premium
created_at
```

---

### ANSWER_CHOICES

```sql
id
question_id (FK)
label
is_correct
explanation
```

---

### QUIZ_ATTEMPTS

```sql
id
user_id (FK)
game_id (FK)
started_at
finished_at
score
```

---

### QUESTION_ATTEMPTS

```sql
id
quiz_attempt_id (FK)
question_id (FK)
selected_choice_id
is_correct
response_time
error_theme_id
```

---

## 2 Tables avancées (premium / scaling)

### USER_STATS

```sql
id
user_id (FK)
theme_id (FK)
success_rate
total_attempts
last_updated
```

---

### DAILY_USAGE

```sql
id
user_id (FK)
date
questions_answered
```

---

### SUBSCRIPTIONS

```sql
id
user_id (FK)
stripe_customer_id
status
current_period_end
```

---

# API (structure minimale)

## Auth

* POST /register
* POST /login

## Quiz

* GET /questions?theme=...
* POST /submit-answer
* POST /quiz/start
* POST /quiz/end

## Progression

* GET /stats
* GET /history

## Premium

* POST /subscribe
* GET /subscription-status

---

