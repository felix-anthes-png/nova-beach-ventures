# Acceptance review

Status: passed for the current campaign baseline.

## Automated evidence

The repository contains 81 passing Node tests across sixteen suites.

| Area | Evidence |
| --- | --- |
| Building mode | Rotation, collision rejection, cost-neutral moving, demolition salvage |
| Progression | Starting venue, level gates, staff gates, district sequence, event lifecycle, long-term goals |
| Guest behaviour | Needs, affordability, price response, patience, preferences, quality, need relief, activity history |
| DJ operations | Prerequisites, forecasts, upgrades, scheduling, revenue, attendance, ticket affordability |
| Time and logistics | Phase boundaries, shop hours, delivery arrival, next-day rollover, continuous day close |
| Building lifecycle | Construction timing, venue closure, completion idempotency, migration, and presentation contract |
| Environmental motion | Shared climate profile, animated world layers, and reduced-motion coverage |

Verification command:

```bash
node --test tests/*.test.mjs
```

## Original financial scenarios

The core model continues to honour the initial product constraints:

- stock purchases reduce cash and increase inventory without allowing negative balances;
- selling-price demand boundaries use the fixed reference price;
- units sold are capped by available stock;
- revenue and cost of goods sold reconcile to gross profit;
- remaining inventory carries forward;
- completed simulation periods are persisted and not replayed after reload.

The original five-day stop was deliberately superseded by the continuous-campaign decision recorded as D002. Day reports remain individually auditable.

## Manual browser review

The current release has been checked for:

- WASD and click-to-move navigation;
- entering and leaving campus interiors;
- placing and managing facilities;
- visible queues and guest destinations;
- store, supplier, progression, and event panels;
- phase changes and smooth time-of-day treatment;
- end-of-day report while the following day is already running;
- reload persistence without duplicated sales or deliveries;
- desktop and narrow responsive layouts.

## Review conclusion

The current baseline is suitable for further feature work. New batches should add operational depth to existing systems and retain the same evidence standard rather than expanding the catalogue without consequences.
