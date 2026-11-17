# Submission

## What I Did

1 - Data persistence [Prisma + SQLite]
- Setup prisma 7
- Create schema (ShortenedUrl)
- Init prisma client
- Delete old Map and use prisma functions
- Configurations: commands, .env, docker...

2 - Short code generation [Nanoid]
- Replace the old "abc"/2-char generator with nanoid(8) (218B codes)
- Verify uniqueness against the database with retry logic

3 - Input validation [Zod]
- Shared schema in libs/engine
- Validate in the server action
- Error feedback on the client

## What I Would Do With More Time

<!-- What would you tackle next if you had more time? -->

## AI Usage

<!-- How did you use AI tools (if any)? Include some example prompts if you used any agent. -->

## Feedback

<!-- Any feedback on the challenge? Was it clear? Too easy/hard? Suggestions? -->
