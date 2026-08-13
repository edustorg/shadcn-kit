---
description: Generate a conventional commit from staged changes and commit them. Use when user asks to commit, make a commit, or generate commit message.
---

1. Run `git status --short`.

2. If there are untracked (`??`) or unstaged changes:
   - Show a short summary of them.
   - Run `git add -A`.
   - If there are no staged changes after this, stop and say: "No staged changes found."

3. Run `git diff --cached` to review the staged changes.

4. Generate a conventional commit message using:
   - Format: `<type>(<scope>): <summary>`
   - Types: feat, fix, docs, style, refactor, test, chore, perf, ci
   - Scope: Use the most relevant scope. If changes span multiple scopes, use a broader scope such as api, services, or omit the scope entirely.
   - Summary: Concise description of the primary change.
   - Body: If there are multiple significant changes, append a bullet list describing the additional functional or business changes.

5. Show the generated commit message and wait 2 seconds, then run `git commit` automatically (no prompt before committing).
    - **[SKIP]** → output only the generated commit message without committing.

6. After committing, **[ASK]** whether to push to the remote.
    - Yes or Enter → run `git push`.
    - No → stop.
