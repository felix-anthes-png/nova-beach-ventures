# Management UI and information overlays

## Intent

Let the player understand the campus without opening and closing several management panels. This batch adds a readable control layer over the existing simulation; it does not introduce a separate economy.

## Player-facing behaviour

- Four map lenses show guest flow, campus needs, commercial readiness, and operations coverage.
- Overlay buttons and the `1`–`4` shortcuts switch views; `M` cycles through them.
- The selected lens survives a reload without changing campaign state.
- A live briefing shows the highest-priority management signals and opens the relevant screen directly.
- Store markers reconcile schedule, stock, queues, closures, revenue, and gross profit with the same run state used by the simulation.
- Operations markers show district cleanliness, on-shift staff, work orders, and closed assets.
- Needs markers make amenity coverage and the weakest campus needs visible.

## Acceptance checks

1. A new run reports Atlantic Café as open but unstocked and surfaces a stock action.
2. Store overlay totals match current stock and today's product ledger.
3. Opening hours and breakdowns change the store status shown by management data.
4. Placing an amenity changes the ranked campus needs.
5. Litter or breakdowns appear in the correct district summary.
6. Locked venues remain visible as future capacity without counting as open operations.

## Scope boundary

The overlays explain current state. They do not automate pricing, staffing, construction, or purchasing.
