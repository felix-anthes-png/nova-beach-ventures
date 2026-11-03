# Development workflow

## Why the repository uses feature batches

The game contains connected simulation systems. Isolating one outcome per branch makes it possible to review economic rules, save migration, UI changes, and visual impact together without mixing unrelated work.

## Standard sequence

### 1. Frame the player problem

Write or update a specification in `specs/`. It should include the intended player experience, rules, saved state, acceptance examples, and explicit non-goals.

### 2. Create a branch

Use a short outcome name:

```text
feature/staff-shifts
fix/delivery-replay
docs/project-workflow
```

Existing `codex/*` branches are preserved as historical feature checkpoints. New work follows the simpler prefixes above.

### 3. Implement and verify

Keep deterministic rules in the core and add focused tests. Run the complete suite because guest, time, progression, and financial systems interact.

Start the editable browser build from the repository root:

```bash
./start-dev
```

The terminal prints the active local URL and opens it automatically. The server watches `dist/` and reloads connected browsers after source changes. It has no package dependencies and uses Python 3, which is already available in the standard project environment. Use `./start-dev --host 0.0.0.0` only when testing from another device on the same local network, and stop the server with `Ctrl+C`. The npm commands remain optional aliases.

### 4. Perform manual checks

Use the browser for controls, layout, animation, and persistence. Reload after state-changing actions. For time features, verify at normal and accelerated speed.

### 5. Open a pull request

The pull request should state:

- the player problem;
- the implemented outcome;
- rules or saved fields that changed;
- automated and manual evidence;
- screenshots for material visual changes;
- follow-up work deliberately left out.

### 6. Merge and release

Merge only after CI passes. Update `CHANGELOG.md` for a player-visible increment. Deploy from the exact merged commit and retain the existing access policy unless the project owner explicitly changes it.

## Definition of done

A feature batch is complete when:

- the behaviour matches its specification;
- automated checks cover deterministic rules;
- app syntax and all existing tests pass;
- old saves receive safe defaults;
- rejected actions preserve previous state;
- the relevant browser workflow has been checked;
- documentation and changelog are accurate;
- the branch is published and reviewed through a pull request.
