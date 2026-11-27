---
name: commit-message
description: Write a Conventional Commits message for the current uncommitted changes, for the owner to paste into VS Code Source Control. Never stages, commits or pushes. Use at the end of a task, or when asked for a commit message.
---

# Commit message (the owner commits)

You never run `git add`, `git commit`, `git push` or `git stash`. The owner
commits through VS Code Source Control.

1. Read the change: `git status --short` and `git diff` (plus untracked
   files). Understand _why_, not just what.
2. Write:
   ```
   <type>(<optional scope>): <imperative summary, ≤ 72 chars, no period>

   - <the most important change and its reason>
   - <user-visible fixes worth calling out>
   - <anything the reviewer must know: migrations, env vars, held packages>
   ```
   Types: `feat`, `fix`, `perf`, `refactor`, `style`, `chore`, `docs`,
   `test`, `build`, `ci`. Bullets are short and lower-case; skip trivia.
3. No `Co-Authored-By`, "Generated with Claude Code" or any AI attribution.
4. If the diff mixes unrelated work, suggest splitting it into separate
   commits and which files go where (the owner stages them).
5. Remind the owner of any manual step the commit needs (e.g. run
   `npm run db:migrate`, add an env var on Vercel).
