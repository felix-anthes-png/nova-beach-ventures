# Development milestones

The repository history is organised around complete player-facing batches. Later branches build on earlier ones, so each commit acts as a stable checkpoint rather than an unrelated prototype.

## 1. Campus foundation

**Checkpoint:** `06a0cc4` on `main`

Established the waterfront world, player movement, separate interiors, shops, pricing, inventory, persistence, and the first cohesive architectural pass.

## 2. Smarter building mode

**Checkpoint:** `eafb2b6` on `codex/smarter-building-mode`

Added quarter-turn rotation, footprint collision checks, moving, demolition, and salvage. Automated rules live in `tests/building-mode.test.mjs`.

## 3. Guests use the campus

**Checkpoint:** `df81c83` on `codex/guests-use-campus`

Connected guests to placed amenities and campus destinations instead of treating them as decorative background movement.

## 4. Deeper progression

**Checkpoint:** `45c0237` on `codex/deeper-progression`

Changed the opening state to one café and introduced company levels, venue unlocks, staff, store upgrades, land acquisition, event venues, and long-term goals.

## 5. Facility design system

**Checkpoints:** `9ad0368` and `c8fc4fe`

Reworked catalogue presentation and map assets so paths, landscaping, amenities, services, and attractions read as different families rather than repeated cards or identical blocks.

## 6. Meaningful guest decisions

**Checkpoint:** `20c0c53` on `codex/guest-decision-system`

Added personal needs, spending budgets, patience, preferences, queue response, price response, and recorded interactions. Behaviour is covered by `tests/guest-behavior.test.mjs`.

## 7. Managed DJ events

**Checkpoint:** `f5f4670` on `codex/managed-dj-events`

Turned a visual attraction into an operation with programme, ticket price, DJ, capacity, equipment upgrades, costs, forecasts, and physical crowds. Rules are covered by `tests/dj-operations.test.mjs`.

## 8. Living campus time

**Checkpoint:** `9f2a3b4` on `codex/living-campus-time`

Added smooth lighting, six timetable phases, opening hours, scheduled deliveries, phase-specific footfall, and an end-of-day report that does not stop the campaign. Rules are covered by `tests/time-system.test.mjs`.

## 9. Management overlays

**Checkpoint:** `feature/management-overlays`

Added four world-space information lenses, a prioritised live briefing, direct navigation into corrective actions, keyboard controls, and deterministic management summaries. Rules are covered by `tests/management-overlays.test.mjs`.

## 10. Store and building specialization

**Checkpoint:** `feature/store-building-specialization`

Added named store concepts, facility blueprints, visual fit-outs, and district-level focus synergies. Rules are covered by `tests/specializations.test.mjs`.

## 11. Visual world redesign

**Checkpoint:** `feature/visual-world-redesign`

Reframed the campus as one Atlantic-modernist complex, introduced distinct architecture for all five stores, strengthened room identity, and replaced the rigid crowd figures with a stable, more expressive character system. This batch changes presentation only; simulation rules and saved progression remain compatible.

## 12. Tycoon art-direction reset

**Checkpoint:** `feature/tycoon-art-direction-reset`

Removed permanent presentation noise, made world information contextual, consolidated the campus palette and paving rhythm, and introduced a quantised four-frame crowd animation. The reset intentionally favours authored readability over additional decorative detail.

## 13. Designed campus spaces

**Checkpoint:** `feature/designed-campus-spaces`

Recomposed the original coast district as eight connected public rooms: the Arrival Plaza, Academic Courtyard, Shaded Café Terrace, Food Court, Student Lawn, Beach Promenade, Event Square, and Service & Delivery Lane. Guest paths now reinforce those spaces, while essential arrival and logistics routes are protected from conflicting construction.

## 14. Character and crowd animation overhaul

**Checkpoint:** `feature/character-crowd-overhaul`

Replaced the repeated side-facing figure with a directional six-frame population system. Guests now arrive in cohorts, form stable venue-specific queues, and visibly eat, drink, browse, sit, talk, or dance. Staff carry role-specific equipment and event crowds face the stage, making existing simulation state readable through animation.

## 15. Editable local development URL

**Checkpoint:** `chore/local-development-url`

Added a dependency-free Terminal launcher that selects an available localhost port, opens the game, and reloads the browser when editable files in `dist/` change. A network mode supports testing from another device without changing the stable hosted release.

## 16. Visual building lifecycle

**Checkpoint:** `feature/visual-building-lifecycle`

Turned venue purchases and upgrades into saved construction projects. Stores remain closed while fencing, scaffolding, partial walls, workers, and progress signage occupy the plot. Completed projects trigger a short camera focus, while scheduled closures use physical shutters and stock deliveries travel visibly from the service lane toward their destination.

## Verification baseline

At the end of milestone 16:

- 78 automated tests pass, including construction lifecycle, save migration, visual-contract, and development-URL checks.
- `dist/core.js` and `dist/app.js` pass Node syntax checks.
- Accepted actions persist; rejected actions leave state unchanged.
- The deployed static build runs without a paid service.

These statements describe observed repository checkpoints. They do not replace the commit authorship or invent intermediate work that is not present in Git.
