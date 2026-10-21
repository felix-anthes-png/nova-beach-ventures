# Repository working agreement

## Product

Nova Beach Ventures is an open-ended campus tycoon. Preserve the readable business model while increasing the depth of the campus simulation.

## Branches and batches

- Treat each requested feature group as one branch and one reviewable batch.
- Use `feature/`, `fix/`, `docs/`, or `chore/` for new branch names.
- Do not combine unrelated visual, economic, and infrastructure work.
- Never rewrite published commits or attribute work to a different author.

## Implementation boundaries

- `dist/core.js` owns deterministic rules and state transitions.
- `dist/app.js` owns DOM, input, animation, and persistence wiring.
- CSS is split by system; extend the closest existing stylesheet before creating another.
- Store money as integer cents and inventory as whole non-negative units.
- Add migration defaults whenever persistent run state changes.
- Keep the app usable without a paid service or live integration.

## Required checks

Run before every feature commit:

```bash
node --check dist/core.js
node --check dist/app.js
node --test tests/*.test.mjs
git diff --check
```

Visual changes additionally require a local browser check. Persistence changes require a reload check. Time progression must be checked for duplicate processing.

## Documentation

- Update the relevant file in `specs/` when behaviour changes.
- Update `CHANGELOG.md` for a player-visible release increment.
- Record material architecture or product trade-offs in `docs/decision-log.md`.
- Keep README status and test counts accurate.
