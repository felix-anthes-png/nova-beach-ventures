# Contributing

Nova Beach Ventures is developed in small, reviewable product increments. A change should explain the player problem it solves, identify the rules it changes, and include evidence that saved campaigns remain safe.

## Feature workflow

1. Start from the latest integrated branch.
2. Create one focused branch using `feature/`, `fix/`, `docs/`, or `chore/`.
3. Add or update a short specification in `specs/` for behavioural work.
4. Implement the smallest complete player-facing slice.
5. Add automated checks for deterministic rules.
6. Run the full verification commands and perform the relevant browser checks.
7. Open a pull request using the repository template.
8. Merge only after the checks pass and the acceptance evidence is recorded.

## Verification

```bash
node --check dist/core.js
node --check dist/app.js
node --test tests/*.test.mjs
git diff --check
```

For visual or interaction work, also verify the affected workflow in a local static server at desktop and narrow viewport widths.

Use `./start-dev` for that browser check. It prints the active URL, opens the browser, and reloads whenever a file in `dist/` changes.

## Design principles

- Prefer connected systems over isolated features.
- Keep financial outcomes explainable from visible inputs.
- Preserve existing saves through explicit migration defaults.
- Keep simulation rules in `dist/core.js` and browser concerns in `dist/app.js`.
- Use integer cents for money and whole units for stock.
- Rejected actions must not partially mutate state.
- A time slice or day may be recorded only once.

## Commit and pull-request scope

Use outcome-oriented commit subjects such as `Add scheduled campus deliveries`. Avoid generic subjects such as `Update files`. Keep generated hosting-source commits separate from feature commits where the hosting system requires them.

Do not rewrite published history to change authorship or timestamps. Corrections should be made through an additional commit so the development record stays inspectable.
