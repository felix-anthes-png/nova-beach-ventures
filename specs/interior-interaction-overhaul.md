# Interior and building interaction overhaul

## Purpose

Make the enterable campus buildings feel like playable operating spaces rather than generic rooms containing exterior-style store objects. The update keeps the existing fixed walls and roofs; it does not introduce transparency or cutaway rendering.

## Interior identities

- **Academic Wing:** Atlantic Café service counter, pastry display, menu wall, customer queue, communal study table, quiet tables, and study lounge.
- **Mercado Supply Hall:** dry-stock aisles, order-and-dispatch desk, scanner, delivery crates, cold storage, and a clear logistics route.
- **Student Hub:** Nova Merch Lab display and checkout, venture workstations, finance desk, social lounge, and student-club activity.

## Interaction and movement

- Each interior has a declared entrance route, operational zones, solid fixtures, and activity points.
- Counters, displays, desks, shelving, lounges, tables, cold storage, planters, and walls block the player consistently.
- Clicking an occupied fixture resolves to accessible floor space instead of placing the player inside it.
- Store interactions use the visible interior counter rather than rendering a second exterior building pod inside the room.
- Nearby interaction feedback communicates whether a venue is open, closed, under repair, or low on stock.

## Living interiors

- Characters occupy purpose-built service, queue, browsing, eating, studying, networking, restocking, and finance positions.
- Crowd pressure changes how many people are visible inside.
- Characters turn toward the counter or activity they are using.
- Short contextual labels appear when the player approaches an active character.

## Acceptance checks

1. All three interiors expose at least three named operational zones.
2. Every interior has a clear entrance route, a service counter, and at least six activity positions.
3. Entrance routes and activity positions do not intersect solid fixtures.
4. The café and Merch Lab no longer render exterior store pods inside their buildings.
5. Player movement stops at counters, furniture, storage, and walls.
6. Venue status and stock are visible at the relevant indoor service point.
7. No roof or front-wall transparency is introduced.

## Verification

- Automated contract: `tests/interior-interaction-overhaul.test.mjs`
- Layout geometry: `dist/interior-layouts.js`
- Manual browser review: Academic Wing, Mercado Supply Hall, and Student Hub at lunch and lecture traffic levels.
