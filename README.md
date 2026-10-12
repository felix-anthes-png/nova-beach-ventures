# Nova Beach Ventures

An open-ended campus tycoon set on a stylized Nova SBE / Carcavelos waterfront. Explore with WASD or click-to-move, begin with one café, reinvest live profits into new venues, and turn a sparse campus into a high-footfall destination.

## Tycoon systems

- Start with Atlantic Café, then purchase Beach Fuel Bar and Nova Supply Co. with earned cash.
- Three venues and nine products across café, beach-fuel and campus-merch categories.
- Venue upgrades, product unlocks, reputation, demand-capacity and portfolio views.
- Accelerated continuous days from 07:30 to 19:30 with pause, 1×, 2× and 4× speed controls.
- Automatic live sales, persistent daily ledgers, visible customer queues, and morning, lunch and after-class rushes.
- A 42×30 coast overworld plus separate Mercado Supply Hall, Academic Wing and Student Hub interiors, each with its own NPCs, props, interactions and return route.
- A persistent room-aware player location, click-to-move, WASD movement, marked entrances and quick management shortcuts.
- Buildable paths, scenery, amenities, staff and custom attractions; campus quality increases guest count, which directly increases sales demand.
- Immediate autosave for purchases, prices, upgrades, position and completed trading days.

## Play locally

Serve `dist/` with any static HTTP server, then open the local URL. No build step or paid service is required.

The run is saved in browser `localStorage` under `nova-beach-ventures-v1`.

## Business rules

- Starting cash: €100.00; starting stock: zero.
- Base price interest is 10 units at or below reference price, 5 units above reference up to 2×, and 0 above 2×. Live demand scales with campus footfall, venue level and the current rush period.
- Sales never exceed available stock.
- Gross profit is revenue less the purchase cost of units sold.
- Overall result is final cash plus remaining inventory at cost less €100.00.
- Trading runs automatically while the simulation clock is active. Each 19:30 close records one day and immediately begins the next morning; there is no final day.
