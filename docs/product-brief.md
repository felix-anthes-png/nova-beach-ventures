# Product brief

## Opportunity

A player should be able to run a small campus business and understand why it succeeds or fails. Prices affect demand, stock limits sales, and campus investment changes how many people arrive and how long they stay.

## Product direction

The first concept was a five-day trading exercise with three products and €100.00 starting cash. Playtesting and design iteration exposed a stronger direction: keep those legible business rules, but place them inside a continuous tycoon campaign where the campus itself becomes the growth engine.

The current product therefore combines two layers:

- **Business layer:** stock, prices, store hours, queues, revenue, cost of goods, profit, and daily reconciliation.
- **Campus layer:** people, needs, facilities, staff, events, districts, atmosphere, and progression.

Neither layer should work alone. A beautiful campus without viable shops has no economy; profitable stores without facilities, movement, or guests do not feel like a tycoon game.

## Player promise

Start with one modest café on a quiet waterfront campus. Learn its daily rhythm, serve the right products at the right times, improve the environment, and turn the campus into a destination with multiple businesses and events.

## Core loop

1. Read the current campus phase and expected crowd.
2. Order inventory for a scheduled delivery.
3. Set prices and shop hours.
4. Improve facilities, staffing, or attractions.
5. Watch guests arrive, choose destinations, queue, and spend.
6. Review the daily financial report.
7. Reinvest into upgrades, stores, events, and land.

## Current scope

- Five commercial venues and fifteen products.
- Three campus districts with progressive acquisition.
- Six daily phases between 07:30 and 19:30.
- Persistent guests, facilities, staff, store operations, deliveries, and event history.
- One managed DJ attraction plus repeatable pavilion events.
- Ten company levels and long-term visitor/rating goals.

## Non-negotiable rules

- Cash and stock never become negative.
- Rejected actions do not change saved state.
- Purchases reduce cash exactly once.
- Sales add revenue; cost of goods sold is a reporting value, not a second cash deduction.
- Sales never exceed inventory or demand.
- Each completed time slice and campus day is recorded once.
- Reloading must not replay sales, deliveries, or events.

## Near-term roadmap

1. Strengthen staffing as an operational system with shifts, wages, and visible assignments.
2. Add maintenance and cleanliness consequences that connect facilities to campus rating.
3. Expand event operations beyond the DJ deck without duplicating its management model.
4. Improve onboarding and surface the first profitable strategy without removing experimentation.
5. Add save-slot export/import only if it can remain local and understandable.

## Out of scope for the current release

- Multiplayer or online economies.
- Paid APIs or server-required gameplay.
- Random outcomes that obscure the financial model.
- Complex debt, tax, spoilage, or supplier negotiation systems.
- Cosmetic items with no campus or business effect.
