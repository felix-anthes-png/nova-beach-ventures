# Nova Beach Ventures

A deterministic five-day campus tycoon set on a stylized Nova SBE / Carcavelos waterfront. Explore an isometric campus with WASD or click-to-move, operate three venues across separate districts, and grow them from level-one pop-ups into flagship businesses.

## Tycoon systems

- Three venues and nine products across café, beach-fuel and campus-merch categories.
- Venue upgrades, product unlocks, reputation, demand-capacity and portfolio views.
- A layered explorable world with supplier market, courtyard, student hub, promenade, beach stage and venture HQ.
- Immediate autosave for purchases, prices, upgrades, position and completed trading days.

## Play locally

Serve `dist/` with any static HTTP server, then open the local URL. No build step or paid service is required.

The run is saved in browser `localStorage` under `nova-beach-ventures-v1`.

## Business rules

- Starting cash: €100.00; starting stock: zero.
- Demand per product is 10 units at or below reference price, 5 units above reference up to 2×, and 0 above 2×.
- Units sold are `min(demand, stock)`.
- Gross profit is revenue less the purchase cost of units sold.
- Overall result is final cash plus remaining inventory at cost less €100.00.
- Every explicit trade records and advances exactly one day; trading and purchasing stop after day five.
