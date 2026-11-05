# Nova Beach Ventures

[![Verify](https://github.com/felix-anthes-png/nova-beach-ventures/actions/workflows/verify.yml/badge.svg)](https://github.com/felix-anthes-png/nova-beach-ventures/actions/workflows/verify.yml)
[![Live game](https://img.shields.io/badge/play-live-143c46)](https://nova-beach-ventures.felix-anthes.chatgpt.site/)

An open-ended campus tycoon set on a stylised Nova SBE / Carcavelos waterfront. Start with a small café, respond to the campus timetable, and reinvest live profits into shops, staff, facilities, events, and new coastal districts.

**[Play the current release](https://nova-beach-ventures.felix-anthes.chatgpt.site/)**

## Product vision

Nova Beach Ventures began as a five-day pricing exercise and developed into a continuous tycoon campaign. The financial model is still deliberately readable: stock has a purchase cost, price changes demand, inventory limits sales, and every day closes with a reconcilable report. Around that core, the campus now behaves like a place rather than a spreadsheet.

The design has three goals:

1. Make every expansion decision visible in the world.
2. Give guests understandable needs, budgets, preferences, and queue patience.
3. Keep the underlying business results simple enough to audit.

## Current gameplay

- Walk the 2.5D campus with WASD or click-to-move.
- Begin with Atlantic Café and unlock four additional commercial venues.
- Buy stock through scheduled morning, midday, and afternoon deliveries.
- Set prices and opening hours, then watch demand react in real time.
- Serve visible guests: every completed shop visit moves one unit of stock and posts the matching revenue and COGS.
- Build paths, scenery, amenities, social spaces, and managed attractions.
- Recruit individual staff, assign districts and shifts, and cover daily wages.
- Respond to visible litter and breakdowns before cleanliness falls or assets remain closed.
- Balance venue and district overhead against faster service, stronger ratings, and attendance momentum.
- Upgrade stores through three visible levels and acquire five new districts, each with a different operating problem.
- Watch paid venue projects become fenced construction sites with workers, partial structures, completion cameras, shutters, and visible delivery carts.
- Run ticketed DJ events with configurable programme, pricing, staff, and equipment.
- Prepare for a recurring campus calendar with lecture days, exams, fairs, open days, surf tournaments, festivals, and weekends.
- Serve twelve visitor groups with different schedules, budgets, patience, price tolerance, and preferences.
- Develop 25 district businesses across the Student Village, Beachfront, Innovation District, Sports Campus, and Transit & Arrival District.
- Follow six daily campus phases from morning arrival to the sunset period.
- Review persistent daily ledgers without interrupting the larger campaign.
- Switch between live guest-flow, needs, commercial, and operations map lenses.
- Use the live briefing to jump from a visible risk to the management screen that can resolve it.
- Specialize stores into named Flow, Wellbeing, or Experience concepts and pair them with matching facility blueprints in the same district.
- Explore a unified Atlantic-modernist campus with connected courtyards, layered landscaping, distinct store architecture, and redesigned guests.
- Play through a deliberately restrained tycoon interface where world labels and guest signals appear only when they are useful.
- Move through eight designed campus places, from the arrival plaza and academic courtyard to the food court, student lawn, event square, and beach promenade.
- Watch directional, varied crowds queue, eat, study, browse, work, and dance instead of using one repeated walking figure.
- See one Atlantic environment move across the whole campus through layered surf, drifting clouds, birds, fountains, wind-responsive palms, flags, and terrace canopies.
- Open a separate level-ten Showcase Editor to demonstrate every store, district, facility, staff role, and event without altering the real campaign.

## Development milestones

Every major system was developed as an isolated feature batch. The specification explains the intended behaviour; the branch and commit preserve the implementation checkpoint.

| Milestone | Product outcome | Evidence |
| --- | --- | --- |
| Core campus | Trading, movement, interiors, and coastal world | `main` at `06a0cc4` |
| Smarter building mode | Rotation, collision rules, moving, demolition | [`specs/building-mode.md`](specs/building-mode.md) · `codex/smarter-building-mode` |
| Campus use | Guests visit placed facilities rather than only wandering | `codex/guests-use-campus` |
| Progression | Store unlocks, staff, districts, events, and long-term goals | [`specs/progression.md`](specs/progression.md) · `codex/deeper-progression` |
| Facility design | Distinct catalogue presentation and visual families | `codex/facility-design-system` · `codex/facility-catalogue-redesign-v2` |
| Guest decisions | Needs, budget, patience, preferences, and queue response | [`specs/guest-decisions.md`](specs/guest-decisions.md) · `codex/guest-decision-system` |
| DJ operations | Scheduled, staffed, priced, and upgradeable live events | [`specs/dj-operations.md`](specs/dj-operations.md) · `codex/managed-dj-events` |
| Living campus time | Day phases, lighting, opening hours, deliveries, daily reports | [`specs/time-system.md`](specs/time-system.md) · `codex/living-campus-time` |
| Guest-driven sales | Visible counter service is the source of shop transactions | [`specs/guest-driven-sales.md`](specs/guest-driven-sales.md) · `feature/guest-driven-sales` |
| Guest journeys and interiors | Arrival modes, real entrances, indoor activity, purchases, and post-visit behaviour | [`specs/guest-journeys-interiors.md`](specs/guest-journeys-interiors.md) · `feature/guest-journeys-interiors` |
| Staff operations | Shifts, payroll, district coverage, cleaning, failures, and repairs | [`specs/staff-operations.md`](specs/staff-operations.md) · `feature/staff-operations` |
| Tycoon integration | Operating costs, momentum, management signals, and connected daily outcomes | [`specs/tycoon-integration.md`](specs/tycoon-integration.md) · `feature/tycoon-integration-pass` |
| Management overlays | Map lenses, contextual alerts, and direct management navigation | [`specs/management-overlays.md`](specs/management-overlays.md) · `feature/management-overlays` |
| Store and building specialization | Store concepts, facility blueprints, visible fit-outs, and district synergies | [`specs/store-building-specialization.md`](specs/store-building-specialization.md) · `feature/store-building-specialization` |
| Visual world redesign | Cohesive campus materials, unique store silhouettes, improved interiors, and stable character art | [`specs/visual-world-redesign.md`](specs/visual-world-redesign.md) · `feature/visual-world-redesign` |
| Tycoon art-direction reset | Reduced HUD, contextual labels, authored campus kit, and four-frame character movement | [`specs/tycoon-art-direction-reset.md`](specs/tycoon-art-direction-reset.md) · `feature/tycoon-art-direction-reset` |
| Designed campus spaces | Eight distinct public spaces and destination-aware guest circulation | [`specs/designed-campus-spaces.md`](specs/designed-campus-spaces.md) · `feature/designed-campus-spaces` |
| Character and crowd overhaul | Directional movement, activity poses, stable queues, cohorts, and role-specific staff | [`specs/character-crowd-overhaul.md`](specs/character-crowd-overhaul.md) · `feature/character-crowd-overhaul` |
| Editable development URL | One-command Terminal launcher with automatic browser reload | [`docs/development-workflow.md`](docs/development-workflow.md) · `chore/local-development-url` |
| Visual building lifecycle | Timed construction, operational shutters, visible logistics, and completion moments | [`specs/visual-building-lifecycle.md`](specs/visual-building-lifecycle.md) · `feature/visual-building-lifecycle` |
| Environmental motion | Time-aware ocean, sky, vegetation, flags, fountains, and atmospheric haze | [`specs/environmental-motion.md`](specs/environmental-motion.md) · `feature/environmental-motion` |
| Showcase editor | Separate level-ten presentation sandbox with the complete purchasable catalogue | [`specs/showcase-editor.md`](specs/showcase-editor.md) · `feature/showcase-editor` |
| Larger district progression | Five map expansions, 25 businesses, district economies, and four unlockable guest cohorts | [`specs/larger-district-progression.md`](specs/larger-district-progression.md) · `feature/larger-district-progression` |
| World object depth correction | Local depth layers for wide buildings, canopies, columns, and planters | [`specs/world-object-depth.md`](specs/world-object-depth.md) · `fix/world-object-depth` |
| District visual overhaul | Authored expansion environments, recognisable venue silhouettes, and collision-safe plot composition | [`specs/district-visual-overhaul.md`](specs/district-visual-overhaul.md) · `feature/district-visual-overhaul` |
| District spacing correction | Wider expansion parcels, clearer circulation seams, and re-spaced venue plots | [`specs/district-visual-overhaul.md`](specs/district-visual-overhaul.md) · `fix/district-spacing-overlaps` |
| District business operations | Stock, capacity, pricing, needs-based demand, and real guest sales across all 25 district businesses | [`specs/district-business-operations.md`](specs/district-business-operations.md) · `feature/district-business-operations` |
| Interior interaction overhaul | Building-specific rooms, operational counters, indoor activity, collision-safe routes, and contextual venue feedback | [`specs/interior-interaction-overhaul.md`](specs/interior-interaction-overhaul.md) · `feature/interior-interaction-overhaul` |
| Venue operational states | Physical open, closed, stock, delivery, queue, repair, cleaning, and event-preparation feedback | [`specs/venue-operational-states.md`](specs/venue-operational-states.md) · `feature/venue-operational-states` |
| Business service animations | Authored bakery, gym, padel, laundry, restaurant, surf, parking, and conference activity | [`specs/business-service-animations.md`](specs/business-service-animations.md) · `feature/business-service-animations` |
| Business animation art polish | Unified miniature scale, stronger equipment depth, grounded shadows, and refined motion across district activities | [`specs/business-service-animations.md`](specs/business-service-animations.md) · `fix/business-animation-art-polish` |
| District operational art integration | Façade-integrated status lights, short restocking scenes, and queue equipment without floating world labels | [`specs/venue-operational-states.md`](specs/venue-operational-states.md) · `fix/district-operational-art-integration` |
| Full-size campus bus | A solid scheduled bus with arrival, doors, passenger waves, departure, and grounded district foundations | [`specs/full-size-campus-bus.md`](specs/full-size-campus-bus.md) · `feature/full-size-campus-bus` |
| World ground-contact pass | One shared height datum for district buildings, courts, paths, shelters, shadows, and temporary equipment | [`specs/world-ground-contact-pass.md`](specs/world-ground-contact-pass.md) · `fix/world-ground-contact-pass` |
| Campus circulation and guest agendas | Timetable-led cross-campus journeys, consolidated arrivals, and a shared east-west pedestrian spine | [`specs/campus-circulation-agendas.md`](specs/campus-circulation-agendas.md) · `feature/campus-circulation-agendas` |
| Central campus recomposition | Academic Core-centred geography with directional expansion land around the established campus | [`specs/central-campus-recomposition.md`](specs/central-campus-recomposition.md) · `feature/central-campus-recomposition` |
| Beachfront and Sports composition | One continuous southern beach plus an inland Sports Campus beside Student Village | [`specs/central-campus-recomposition.md`](specs/central-campus-recomposition.md) · `fix/beachfront-sports-composition` |
| Campus district spacing polish | Compact west-campus cluster, usable Innovation courtyard, and collision-free beach circulation | [`specs/central-campus-recomposition.md`](specs/central-campus-recomposition.md) · `fix/campus-district-spacing-polish` |

See [`docs/milestones.md`](docs/milestones.md) for the full feature narrative and acceptance evidence.

## Run locally

The project includes a dependency-free development server. From the repository directory, run:

```bash
./start-dev
```

The command opens the game and prints two development URLs:

```text
Local:   http://localhost:4173
Project: http://nova-beach-ventures.localhost:4173
```

Changes inside `dist/` reload the browser automatically, so the project remains fully editable. If port `4173` is occupied, the server selects the next available port and prints the resulting URL. Progress is stored in browser `localStorage` under `nova-beach-ventures-v1`.

To test from another device on the same network, run `./start-dev --host 0.0.0.0` and use the printed network URL. This development address is separate from the stable deployed release. If Node and npm are installed, `npm run dev` and `npm run dev:network` provide equivalent aliases.

## Verify the product rules

No package installation is required. Python 3 runs the development server; Node.js 20 or newer runs the automated verification suite.

```bash
node --check dist/core.js
node --check dist/app.js
node --test tests/*.test.mjs
```

The automated checks cover building placement, district progression, campus calendar forecasts, guest groups, guest decisions and sales, staff operations, DJ operations, scheduled deliveries, store hours, connected tycoon economics, management overlays, specializations, world collision and depth, continuous day progression, and the visual presentation contract. Pull requests run the same checks in GitHub Actions.

## Repository guide

| Path | Responsibility |
| --- | --- |
| `dist/core.js` | Deterministic simulation state and business rules |
| `dist/app.js` | Rendering, controls, interactions, and persistence |
| `dist/*.css` | Layered visual systems for the world and management interfaces |
| `dist/assets/` | Runtime sprite atlases |
| `art-source/` | Source artwork and sliced asset variants |
| `tests/` | Behaviour-focused Node test suites |
| `specs/` | Feature contracts agreed before or alongside implementation |
| `docs/` | Product brief, architecture, decisions, milestones, and reviews |
| `.github/` | Pull-request, issue, and verification workflow configuration |

## Project documents

- [`docs/group-project-overview.md`](docs/group-project-overview.md) — group-facing product plan, scope, workflow, responsibilities, and next milestones
- [`docs/product-brief.md`](docs/product-brief.md) — product direction and scope evolution
- [`docs/architecture.md`](docs/architecture.md) — simulation, UI, persistence, and deployment boundaries
- [`docs/decision-log.md`](docs/decision-log.md) — the important trade-offs behind the current design
- [`docs/acceptance-review.md`](docs/acceptance-review.md) — verified behaviour and known manual checks
- [`docs/development-workflow.md`](docs/development-workflow.md) — branch, test, review, and release process
- [`CHANGELOG.md`](CHANGELOG.md) — release-level product history

## Business model

- Money is stored as integer cents and stock as whole units.
- A product has fixed purchase cost and reference price.
- Base demand is 10 units at or below the reference price, 5 units above reference through 2× reference, and 0 above 2× reference.
- Guests only consider products that are affordable, in stock, within the demand range, and available at an open store.
- A shop sale occurs only when a visible guest finishes service; queue staffing therefore controls throughput.
- Staff only contribute while their assigned shift is active, wages are charged at day close, and breakdowns block affected destinations until repaired.
- Open stores and acquired districts create daily operating costs. Store levels improve service speed while increasing overhead and wear.
- District businesses add forecastable revenue, upkeep, visitor appeal, physical destinations, and additional maintenance risk.
- Each closing report updates attendance momentum from rating, profit, product availability, unresolved work, and queue walkaways.
- Store concepts and facility blueprints change service, appeal, needs, and overhead; matching focuses create a capped district synergy.
- Revenue increases cash; cost of goods sold is reported but never deducted twice.
- Remaining inventory carries forward and cash or stock cannot become negative.
- A completed campus day is recorded once, then the campaign continues the following morning.

## Status

The current campaign systems are playable and persisted. The next development phase should focus on operational depth and polish rather than adding disconnected catalogue items. Candidate work is tracked in the issue templates and the roadmap in [`docs/product-brief.md`](docs/product-brief.md).
