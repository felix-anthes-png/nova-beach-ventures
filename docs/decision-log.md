# Decision log

This log captures product and technical choices that materially shaped the current game.

## D001 — Preserve a deterministic economy

**Decision:** Keep demand and financial calculations deterministic in the current release.

**Reason:** The player should be able to connect price, stock, footfall, and profit without hidden randomness. Later variation can be added as visible forecasts or named events rather than unexplained dice rolls.

## D002 — Evolve beyond the five-day ending

**Decision:** Close and report each day, but immediately continue the campaign the following morning.

**Reason:** Progression, district acquisition, store upgrades, and managed events need a longer arc. The daily report retains the clarity of the original assignment without stopping the tycoon loop.

## D003 — Begin with one operating venue

**Decision:** Only Atlantic Café is available at the start.

**Reason:** An already-built catalogue removes the satisfaction of growth. Unlocking the Fuel Bar, Merch Lab, Beach Bar, and Surf Shack gives revenue a visible purpose.

## D004 — Make campus quality economic

**Decision:** Amenities, scenery, events, and staffing influence attendance, needs, or destination appeal.

**Reason:** Construction should be more than decoration. The world-building layer earns its place by affecting how many guests arrive and what they choose to do.

## D005 — Model individual guest decisions

**Decision:** Give each guest needs, a budget, patience, and preferences instead of distributing all demand globally.

**Reason:** Visible people and queues only feel credible when their movement reflects the same prices and facilities that the player controls.

## D006 — Schedule deliveries instead of instant restocking

**Decision:** Stock purchases reserve cash immediately and arrive at one of three daily delivery windows.

**Reason:** This creates planning pressure around lunch and evening crowds while keeping supplier logic understandable.

## D007 — Keep deployment static

**Decision:** Use browser storage and a static host rather than a backend.

**Reason:** The core experience must work with supplied content, survive reloads, and avoid a paid service or live integration.
