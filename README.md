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
- Upgrade stores through three visible levels and acquire two new districts.
- Run ticketed DJ events with configurable programme, pricing, staff, and equipment.
- Follow six daily campus phases from morning arrival to the sunset period.
- Review persistent daily ledgers without interrupting the larger campaign.
- Switch between live guest-flow, needs, commercial, and operations map lenses.
- Use the live briefing to jump from a visible risk to the management screen that can resolve it.
- Specialize stores into named Flow, Wellbeing, or Experience concepts and pair them with matching facility blueprints in the same district.
- Explore a unified Atlantic-modernist campus with connected courtyards, layered landscaping, distinct store architecture, and redesigned guests.
- Play through a deliberately restrained tycoon interface where world labels and guest signals appear only when they are useful.
- Move through eight designed campus places, from the arrival plaza and academic courtyard to the food court, student lawn, event square, and beach promenade.

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
| Staff operations | Shifts, payroll, district coverage, cleaning, failures, and repairs | [`specs/staff-operations.md`](specs/staff-operations.md) · `feature/staff-operations` |
| Tycoon integration | Operating costs, momentum, management signals, and connected daily outcomes | [`specs/tycoon-integration.md`](specs/tycoon-integration.md) · `feature/tycoon-integration-pass` |
| Management overlays | Map lenses, contextual alerts, and direct management navigation | [`specs/management-overlays.md`](specs/management-overlays.md) · `feature/management-overlays` |
| Store and building specialization | Store concepts, facility blueprints, visible fit-outs, and district synergies | [`specs/store-building-specialization.md`](specs/store-building-specialization.md) · `feature/store-building-specialization` |
| Visual world redesign | Cohesive campus materials, unique store silhouettes, improved interiors, and stable character art | [`specs/visual-world-redesign.md`](specs/visual-world-redesign.md) · `feature/visual-world-redesign` |
| Tycoon art-direction reset | Reduced HUD, contextual labels, authored campus kit, and four-frame character movement | [`specs/tycoon-art-direction-reset.md`](specs/tycoon-art-direction-reset.md) · `feature/tycoon-art-direction-reset` |
| Designed campus spaces | Eight distinct public spaces and destination-aware guest circulation | [`specs/designed-campus-spaces.md`](specs/designed-campus-spaces.md) · `feature/designed-campus-spaces` |

See [`docs/milestones.md`](docs/milestones.md) for the full feature narrative and acceptance evidence.

## Run locally

The project is a dependency-free static application. Use Python, Node, or any other static server:

```bash
python3 -m http.server 4173 --directory dist
```

Then open `http://localhost:4173`. Progress is stored in browser `localStorage` under `nova-beach-ventures-v1`.

## Verify the product rules

Node.js 20 or newer is sufficient. No package installation is required.

```bash
node --check dist/core.js
node --check dist/app.js
node --test tests/*.test.mjs
```

The automated checks cover building placement, progression, guest decisions and sales, staff operations, DJ operations, scheduled deliveries, store hours, connected tycoon economics, management overlays, specializations, continuous day progression, and the visual presentation contract. Pull requests run the same checks in GitHub Actions.

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
- Each closing report updates attendance momentum from rating, profit, product availability, unresolved work, and queue walkaways.
- Store concepts and facility blueprints change service, appeal, needs, and overhead; matching focuses create a capped district synergy.
- Revenue increases cash; cost of goods sold is reported but never deducted twice.
- Remaining inventory carries forward and cash or stock cannot become negative.
- A completed campus day is recorded once, then the campaign continues the following morning.

## Status

The current campaign systems are playable and persisted. The next development phase should focus on operational depth and polish rather than adding disconnected catalogue items. Candidate work is tracked in the issue templates and the roadmap in [`docs/product-brief.md`](docs/product-brief.md).
