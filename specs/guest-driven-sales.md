# Guest-driven sales

## Outcome

Visible shop customers are the source of product sales. When a guest reaches the front of a queue and completes service, exactly one unit is sold and the same transaction updates stock, cash, COGS, daily results, and the guest ledger.

## Rules

- The store must be open and the product must be unlocked and in stock.
- The guest must be able to afford the current positive price.
- The existing deterministic demand rule remains authoritative and caps each product at 10 daily sales at or below reference, 5 above reference through 2×, and 0 above 2×.
- A rejected sale changes no financial or inventory state.
- Time progression may create visitors, deliveries, event results, and day reports, but never invisible product sales.
- Accepted sales are persisted immediately and daily reports read from the same product ledger.

## Acceptance checks

1. One completed café purchase removes one unit and posts its price, cost, and gross profit once.
2. The last unit can be sold; the next guest is rejected without negative stock or duplicate revenue.
3. Unaffordable, closed-store, and zero-demand purchases leave the run unchanged.
4. Ten deterministic guest seeds produce availability counts of 10, 5, 5, and 0 at the four demand boundaries.
5. Advancing time cannot change product stock or shop revenue on its own.
6. Saving, reopening, and closing the day records an accepted sale exactly once.

DJ ticket settlement remains part of the existing event-operation model and is outside this batch.
