# Blackjack Content

Blackjack content is stored in `content.json` and grouped by theme, lesson, and question sets.

Expected next layers:

- themes
- lessons
- questions
- explanations
- stable slugs for sync

## Questions prompt : 

```
Your goal is to extend an existing JSON file with HIGH-QUALITY blackjack educational content that is:
- strategically correct,
- beginner-friendly but not simplistic,
- varied in question patterns,
- useful for learning through feedback and correction.

IMPORTANT RULES:
1. Output VALID JSON ONLY.
2. Keep the same structure and naming conventions as the existing file.
3. Do not rewrite existing entries unless asked.
4. Add new themes, lessons, and questions that fit naturally into the current file.
5. Every question must have exactly one best answer unless explicitly stated otherwise.
6. Explanations must teach the reasoning, not just give the answer.
7. Advice must be practical and concise.
8. Avoid duplicate scenarios, duplicate wording, and repetitive answer patterns.
9. Use standard blackjack basic-strategy logic unless a variation is explicitly mentioned.
10. If a rule assumption matters, state it clearly in the explanation.

PEDAGOGICAL GOALS:
- Teach the player how to think, not just memorize.
- Include diverse situations:
  - hard totals
  - soft totals
  - pairs
  - weak dealer upcards
  - strong dealer upcards
  - hit / stand / double / split / surrender when relevant
- Include common beginner mistakes.
- Include corrective explanations for wrong choices.
- Make content progressively harder.

CONTENT QUALITY REQUIREMENTS:
- Lesson content must be short, clear, and actionable.
- Question scenarios must be concrete and realistic.
- Correct explanations must explain WHY the right action is best.
- Wrong-choice explanations must explain the specific mistake.
- Add small strategic advice when relevant, for example: - “Do not overvalue a stiff hand against a weak dealer card.”
- “Soft hands gain value from flexibility.”
- “Do not confuse a playable hand with a strong hand.” STYLE:
- Clear, professional, educational.
- Avoid vague phrases like “it feels better” or “usually maybe”.
- Prefer precise reasoning:
  - dealer bust risk
  - hand flexibility
  - value of improving
- risk of overplaying - pair value - positional pressure from dealer upcard DIFFICULTY DISTRIBUTION: - 50% beginner - 35% intermediate - 15% advanced DIVERSITY REQUIREMENTS: - Vary question titles and scenario phrasings. - Vary distractor answers so they are believable. - Include some trap answers based on common misconceptions. - Do not always put the correct answer in the first choice position. - Use a mix of: - direct action questions - mistake recognition questions - comparison questions - “best adjustment” questions LESSON FORMAT: Each lesson must include: - slug - title - content - level QUESTION FORMAT: Each question must include: - slug - title - scenario - difficulty - explanation - isPremium - choices Each choice must include: - label - isCorrect - explanation SLUG RULES: - lowercase - hyphen-separated - unique - descriptive CONSISTENCY RULES: - Theme level, lesson level, and question difficulty must make sense together. - Beginner content should avoid overly technical edge cases. - Intermediate and advanced content can include more nuanced decisions. - Premium questions can be slightly more complex or mixed-concept. CORRECTION QUALITY: For each incorrect answer, explain: - what the player is misunderstanding, - why that instinct is tempting, - why it is still the wrong play here. OUTPUT TASK: Extend the blackjack JSON with: - 3 new themes - each theme containing 2 to 4 lessons - each theme containing 6 to 10 questions Return the FULL UPDATED JSON.
```
