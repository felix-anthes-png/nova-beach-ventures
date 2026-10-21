# Architecture

## Overview

Nova Beach Ventures is a static browser game with a deterministic simulation core. There is no runtime backend and no package build step.

```text
Player input
    ↓
dist/app.js ─── render world, panels, movement, persistence
    ↓
dist/core.js ── validate actions and return updated run state
    ↓
localStorage ── persist the complete campaign snapshot
```

## Simulation boundary

`dist/core.js` contains catalogue data and state transitions. Its exported functions receive a run state plus explicit inputs and return the updated state or reject the action. The Node test suites import this module directly, so rule verification does not require a browser.

Important state groups include:

- balances, prices, stock, and deliveries;
- current day, clock, day history, and store hours;
- venues, districts, facilities, staff, and upgrades;
- guests, needs, decisions, queues, and activity history;
- events, DJ operations, progression, and goals.

## Browser boundary

`dist/app.js` owns the parts that depend on a page:

- keyboard and pointer input;
- canvas/world rendering and depth ordering;
- management panels and live HUD updates;
- animation timing and simulation speed;
- localStorage loading, migration, and autosave.

The browser layer calls core functions instead of reproducing financial or validation rules.

## Persistence

The full run is stored under `nova-beach-ventures-v1`. New persistent fields receive defaults during hydration so older saves can continue. Accepted purchases, configuration changes, placement actions, and time progression are saved immediately.

State transitions must be idempotent at persistence boundaries. A reload may resume from the last saved clock value but must not repeat the previous slice, delivery, event, or day close.

## Assets and styling

Runtime art is delivered as WebP atlases in `dist/assets/`. Source variants remain in `art-source/`, with `scripts/slice_art.py` preserving the repeatable slicing step.

CSS is layered by feature system. `styles.css` supplies the base interface, while world, facility, guest, event, and time styles can evolve independently.

## Deployment

The hosting manifest points Sites at `dist/`. A deployment archive is built from the exact Git commit selected for release. Hosting metadata is not part of the simulation and no secret is stored in the repository.
