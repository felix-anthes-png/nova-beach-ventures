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

## D008 — Make visible service authoritative

**Decision:** A shop transaction is created when a visible guest completes service, not by a separate background sales loop.

**Reason:** Stock, queues, staffing, guest budgets, and the financial report should describe the same event the player sees in the world.

## D009 — Make staffing operational rather than permanent

**Decision:** Model staff as individual scheduled employees assigned to one district, with wages and task-specific responses.

**Reason:** A permanent global bonus does not create management decisions. Shifts, payroll, litter, closures, and repairs make coverage visible, local, and financially accountable.

## D010 — Make expansion create pressure as well as opportunity

**Decision:** Charge readable daily costs for open venues and acquired districts, make venue levels increase both throughput and overhead, and let each closing day update future attendance momentum.

**Reason:** Existing systems should form one feedback loop. Growth is more satisfying when additional guests create both revenue and operational pressure, while the player can see exactly why the next day is stronger or weaker.

## D011 — Explain state before adding more systems

**Decision:** Add map lenses and contextual management signals before expanding the simulation again.

**Reason:** A tycoon game becomes harder to play when important state is scattered across separate panels. Showing flow, needs, commercial readiness, and operational risk in the world makes existing decisions faster and more legible without hiding the underlying rules.

## D012 — Let districts express an operating identity

**Decision:** Give stores and facilities one of three shared focuses and reward matching choices only inside the same district.

**Reason:** Upgrades become more meaningful when they define how a venue operates, and construction becomes more strategic when placement can support a nearby business. A capped local bonus keeps the relationship visible without replacing the base pricing, stock, staffing, and queue rules.

## D013 — Use one architectural language with varied building types

**Decision:** Share a small set of campus materials and details across the world, while giving every commercial venue its own silhouette and upgrade expression.

**Reason:** Repeating one generic shop shell makes expansion feel cosmetic, while unrelated landmark assets make the campus feel assembled from separate images. A common material language creates cohesion; different typologies preserve recognition and progression.

## D014 — Let the world carry the presentation

**Decision:** Keep the permanent interface compact and reveal labels, operational states, and guest intent through proximity or an explicit management lens.

**Reason:** Persistent floating cards made the world read like a debug view and obscured the campus. Contextual information preserves tycoon readability while allowing architecture, crowds, and public spaces to establish the visual identity.
