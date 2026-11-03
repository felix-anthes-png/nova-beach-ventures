# Nova Beach Ventures — Group Project Overview

## 1. Project summary

**Nova Beach Ventures** is a browser-based campus management game inspired by classic tycoon games. It is set on a stylised waterfront campus influenced by Nova SBE in Carcavelos. The player begins with a small Atlantic Café and grows it into a lively campus destination by managing products, prices, stock, guests, staff, facilities, events, and new districts.

The project started as a small five-day business simulation. Its original purpose was to demonstrate a clear relationship between pricing, demand, inventory, and profit. The current direction keeps this understandable economic core but places it inside an open-ended tycoon campaign. The campus is therefore not only a background: its quality, facilities, cleanliness, events, and design influence how many guests arrive, where they go, how long they stay, and how much they spend.

The intended experience is:

> Start with one modest café, learn the rhythm of campus life, make understandable business decisions, and reinvest the results into a growing waterfront destination.

## 2. Project objectives

The group is building the project around four objectives:

1. **Create a playable business simulation.** Prices must affect demand, stock must limit sales, and financial results must be traceable.
2. **Make the campus feel alive.** Guests should arrive at realistic times, have individual needs, form queues, use facilities, and react to the player’s decisions.
3. **Provide meaningful tycoon progression.** Profit should unlock store upgrades, staff, attractions, campus improvements, and new districts.
4. **Keep development reviewable.** Each substantial outcome is developed as a separate GitHub feature batch with a specification, tests, documentation, and pull request.

The project is successful when a new player can understand what is happening, make a decision, observe its effect in the world, and explain why the business gained or lost money.

## 3. Target audience and player experience

The primary audience is players who enjoy accessible management and tycoon games but do not want to learn an overly complex economic model. The game should be readable enough for a short university demonstration while having enough interconnected systems to support a longer campaign.

The main player journey is:

1. Open the Atlantic Café with limited money and no stock.
2. Order products and choose selling prices and opening hours.
3. Watch students and visitors arrive according to the campus timetable.
4. Serve guests while monitoring queues, stock, needs, and campus quality.
5. Review revenue, cost of goods sold, payroll, overhead, and operating profit.
6. Reinvest in staffing, facilities, store upgrades, events, or new land.
7. Unlock and operate additional businesses and districts.

The player should always be able to connect an outcome to a cause. For example, a long queue may result from insufficient staffing, low attendance may follow poor cleanliness, and weak sales may come from high prices, missing stock, or unsuitable opening hours.

## 4. Current product scope

### Business simulation

- Start with €100.00 and the Atlantic Café.
- Purchase stock with whole-number quantities and fixed unit costs.
- Set positive selling prices for individual products.
- Use a transparent demand model based on each product’s reference price.
- Limit sales by stock, guest affordability, opening hours, and service capacity.
- Record revenue, cost of goods sold, gross profit, wages, overhead, and operating profit.
- Carry unsold stock and campaign progress into the following day.
- Save accepted decisions immediately and reject invalid actions without changing state.

### Campus simulation

- Explore a 2.5D campus using WASD or click-to-move controls.
- Follow six daily phases, including morning arrival, lectures, lunch, afternoon activity, and sunset.
- Simulate guests with hunger, thirst, energy, bladder, happiness, budget, queue patience, and preferences.
- Show visible guest journeys, queues, purchases, conversations, breaks, and event attendance.
- Provide designed public areas such as the arrival plaza, academic courtyard, café terrace, food court, student lawn, event square, and beach promenade.
- Allow the player to build and manage paths, scenery, amenities, services, and attractions.

### Management and progression

- Unlock five commercial venues and fifteen products over ten company levels.
- Upgrade stores through three visible levels.
- Specialise stores and facilities around Flow, Wellbeing, or Experience concepts.
- Hire staff, assign districts and shifts, and pay daily wages.
- Manage litter, breakdowns, repairs, and temporary closures.
- Acquire additional campus districts and event venues.
- Schedule and operate ticketed DJ events.
- Use management overlays for guest flow, needs, commercial readiness, and operations.
- Work toward long-term attendance and campus-rating goals.

### Technical scope

- Static browser application with no required backend or paid service.
- Deterministic simulation rules in `dist/core.js`.
- Browser rendering, input, animation, and persistence in `dist/app.js`.
- Persistent local campaign state using browser `localStorage`.
- Automated Node.js tests for business and simulation rules.
- Public hosted release plus an editable local development URL.

## 5. Current project status

The game is currently a **playable advanced prototype**. Its main economic, guest, progression, time, staffing, event, construction, and persistence systems are implemented. The current version can be played as a continuous campaign rather than a fixed five-day exercise.

The strongest completed areas are:

- the auditable stock, pricing, and sales model;
- continuous campus days and scheduled deliveries;
- guest needs and visible guest-driven transactions;
- store, staff, district, and event progression;
- maintenance, cleanliness, wages, and operating costs;
- management overlays and daily reports;
- persistent saves and protection against repeated transactions after reload;
- a one-command local development environment;
- a public playable deployment.

The next phase should focus primarily on **usability, balance, visual consistency, and onboarding**. The project already contains many systems; adding disconnected content would currently contribute less than making the existing systems clearer and more satisfying.

## 6. Scope boundaries

### Included in the current project

- A single-player continuous campaign.
- A fixed supplied product and venue catalogue.
- Understandable deterministic business rules.
- Local browser persistence.
- Campus construction and progression.
- Guest, staff, event, maintenance, and time systems.
- Desktop-first play with a responsive management interface.

### Not planned for the current release

- Multiplayer or a shared online economy.
- User accounts, cloud saves, or a mandatory backend.
- Paid APIs or live external integrations.
- Complex loans, taxes, supplier negotiations, or product spoilage.
- Random events that make financial outcomes difficult to explain.
- Large amounts of cosmetic content without gameplay consequences.
- A fully realistic recreation of the Nova SBE campus.

These boundaries protect the project from becoming too broad and keep the central business simulation understandable.

## 7. Development workflow

The repository uses a **feature-batch workflow**. A batch represents one coherent player-facing outcome rather than a collection of unrelated edits.

### Standard batch process

1. **Define the problem.** Describe the player need, expected behaviour, saved data, acceptance examples, and non-goals in `specs/`.
2. **Create a branch.** Use a descriptive branch such as `feature/staff-shifts`, `fix/delivery-replay`, or `docs/project-overview`.
3. **Implement the outcome.** Keep deterministic rules in the core and browser-specific behaviour in the app layer.
4. **Add verification.** Create focused automated tests and run the complete test suite because the simulation systems interact.
5. **Review in the browser.** Check controls, visuals, animation, persistence, and time progression using the local development URL.
6. **Document the change.** Update the specification, changelog, README status, and decision log where relevant.
7. **Open a pull request.** Explain the problem, solution, state changes, evidence, and deliberately deferred work.
8. **Merge and release.** Merge after verification succeeds and deploy the exact reviewed commit.

### Definition of done

A feature batch is complete when:

- it matches its agreed specification;
- important deterministic behaviour has automated test coverage;
- all existing checks continue to pass;
- older saved games receive safe defaults when state changes;
- rejected actions leave state unchanged;
- browser behaviour and persistence have been manually checked;
- documentation reflects the implemented result;
- the branch can be reviewed independently through GitHub.

## 8. Repository and tools

| Area | Location or tool | Purpose |
| --- | --- | --- |
| Simulation | `dist/core.js` | Business rules and deterministic state changes |
| Browser game | `dist/app.js` | Rendering, controls, animation, and save wiring |
| Presentation | `dist/*.css` and `dist/assets/` | Interface, world styling, and runtime artwork |
| Verification | `tests/` | Automated behaviour and regression checks |
| Feature contracts | `specs/` | Expected behaviour and acceptance criteria |
| Project documentation | `docs/` | Product, architecture, workflow, decisions, and milestones |
| Collaboration | GitHub branches and pull requests | Reviewable development batches |
| Continuous integration | GitHub Actions | Runs syntax and simulation checks |
| Local development | `./start-dev` | Opens an editable localhost version with automatic reload |
| Public release | Sites deployment | Stable playable version for demonstrations |

To run the editable game locally:

```bash
cd "/Users/felix/Documents/ChatGPT/Solo project/nova-beach-ventures"
./start-dev
```

To run the project checks:

```bash
node --check dist/core.js
node --check dist/app.js
node --test tests/*.test.mjs
git diff --check
```

## 9. Suggested group responsibilities

The following responsibilities can be assigned to individuals, but important changes should still be reviewed by at least one other group member.

| Responsibility | Typical work |
| --- | --- |
| Product and game design | Player loop, scope, balance targets, acceptance criteria |
| Simulation development | Economy, guests, time, progression, staff, persistence |
| Interface and world design | Campus composition, management UI, animation, visual consistency |
| Quality assurance | Automated tests, browser scenarios, save/reload checks, regression review |
| Documentation and release | Specifications, changelog, pull requests, deployment evidence |

For a smaller group, one person may own several areas. Ownership does not mean working in isolation: specifications, pull requests, and acceptance checks provide shared checkpoints.

## 10. Recommended next milestones

### Milestone A — Onboarding and first-session clarity

- Introduce the café, ordering, pricing, opening hours, and first sale in a guided sequence.
- Explain why guests choose or reject a store.
- Provide a clear first objective without removing player freedom.

**Success measure:** a new player can complete the first profitable day without outside explanation.

### Milestone B — Balance and progression pass

- Review prices, wages, overhead, unlock thresholds, and upgrade value.
- Ensure each store and specialisation supports a distinct strategy.
- Improve the pace of land acquisition and long-term goals.

**Success measure:** several viable strategies exist and progression neither stalls nor becomes automatic.

### Milestone C — Management feedback and polish

- Improve alerts, tooltips, financial explanations, and queue feedback.
- Make maintenance, staffing, and campus needs easier to diagnose from the world.
- Reduce visual noise and improve consistency between exteriors, interiors, facilities, and people.

**Success measure:** the player can identify a problem and find the relevant management action quickly.

### Milestone D — Release candidate

- Complete regression, persistence, and responsive-layout testing.
- Resolve high-impact bugs and animation glitches.
- Refresh screenshots, project documentation, and acceptance evidence.
- Deploy the reviewed release commit.

**Success measure:** the game can be demonstrated from a fresh save through meaningful expansion without manual intervention or broken state.

## 11. Quality and acceptance strategy

Quality is assessed at three levels:

1. **Rule verification:** automated tests cover deterministic actions such as purchases, sales, demand, queues, staffing, events, progression, deliveries, and daily reconciliation.
2. **Browser verification:** manual scenarios cover movement, layout, animation, interaction, persistence, responsive behaviour, and visual feedback.
3. **Product acceptance:** each batch is evaluated against player-facing examples instead of only checking whether code was added.

Particular attention is required for persistence and time. Reloading the game must not repeat sales, deliveries, payroll, events, or daily closing actions. Cash and stock must never become negative, and financial values must not be deducted twice.

## 12. Risks and mitigation

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Too many connected systems | New changes may create regressions | Keep batches narrow and run the complete test suite |
| Feature growth exceeds available time | Core experience remains unfinished | Prioritise onboarding, balance, and polish over more catalogue items |
| Visual inconsistency | The game feels assembled rather than designed | Use one art direction and review world, interiors, facilities, and characters together |
| Save-state changes break existing campaigns | Players lose progress or receive invalid state | Add migration defaults and perform reload checks |
| Unclear management feedback | Players cannot understand poor results | Surface causes through reports, overlays, alerts, and visible world behaviour |
| Group work becomes difficult to review | Changes overlap or authorship becomes unclear | Use one outcome per branch and pull request |

## 13. Final project direction

Nova Beach Ventures should not attempt to match the scale of a commercial tycoon game. Its strength is the combination of a lively, explorable campus with an economic model that remains easy to understand and verify.

The final project should demonstrate a complete chain of cause and effect:

> The player changes the business or campus, guests react visibly, operations create measurable results, and those results fund the next stage of growth.

That loop is the centre of the project. Future work should strengthen it before expanding the game into additional systems.
