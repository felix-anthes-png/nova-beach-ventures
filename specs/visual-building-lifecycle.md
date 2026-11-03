# Visual building lifecycle

## Player outcome

Investing in a venue should create a visible campus event rather than replacing one building with another instantly. New stores and upgrades therefore move through an active construction phase, close to guests until completion, and reopen with a recognisable new stage.

## Rules

- Opening a store creates a 90-minute in-game construction project.
- Level-two upgrades take 120 in-game minutes and level-three upgrades take 180.
- The full project cost is paid when work starts.
- A store with an active project cannot serve guests or begin another upgrade.
- Construction progress is saved and advances only with campaign time.
- Completion is recorded once and restores normal schedule-based opening.
- Older saves migrate with an empty project ledger and keep their existing venue levels.
- Scheduled stock deliveries remain deterministic; visible carts are a presentation of the saved logistics state and do not create additional stock changes.

## Presentation

- Construction plots show fencing, scaffolding, partial walls, two workers, and a progress board.
- Closed or broken stores show a physical shutter instead of relying only on a status label.
- Level architecture and specialisation fit-outs remain visible after the project completes.
- Incoming and recently delivered stock is represented by a service cart travelling from the service lane toward the destination store.
- A completed project triggers a short camera focus and completion notification.
- Venue and portfolio panels explain construction progress and prevent duplicate upgrades.

## Acceptance examples

1. Opening Fuel Bar deducts its cost, creates a 90-minute project, and keeps the venue closed.
2. Halfway through a level-two upgrade, the project reports 50% and the store remains unavailable.
3. Completing a project records one completion, restores opening-hour logic, and does not award completion reputation again.
4. Reloaded version-six saves receive an empty project ledger without changing their stores.
5. The world contains construction, shutter, delivery, and completion-camera presentation hooks.

## Non-goals

- Construction loans, contractor choice, material procurement, or random delays.
- Replacing the current 2.5D renderer or rotating the map.
- Creating separate bespoke artwork for every store, level, and specialisation combination.
