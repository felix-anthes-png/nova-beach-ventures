# District business operations

## Purpose

Turn the 25 expansion-district buildings from passive income generators into businesses the player actively operates. Every venue has its own sellable products, services, bookings, passes, or memberships, while retaining the same stock, pricing, demand, and guest-decision logic as the original stores.

## Player flow

1. Acquire a district and open one of its businesses.
2. Purchase stock or service capacity using available cash.
3. Set a positive selling price for each offer.
4. Read the demand forecast, need alignment, expected revenue, cost of sales, and gross profit.
5. Let suitable guests queue and purchase the offer during the live campus day.
6. Reinvest the resulting cash and review the realised sale in the daily report.

Gate Bakery, for example, sells croissants and filled rolls. Village Gym sells day passes and memberships. Sports Padel sells court hours and racket rental. The same two-offer structure covers every other district business.

## Business rules

- Every district business has two fixed offers with a unit cost, reference selling price, and primary guest need.
- Physical goods use stock; services, rentals, bookings, and memberships use purchasable capacity. Both are stored as non-negative whole units.
- Price demand follows the established rule: full demand at or below reference price, reduced demand up to twice reference price, and zero demand above twice reference price.
- Campus phase, district rhythm, weather, guest group, need, budget, and availability refine which venue and offer a guest chooses.
- A completed guest purchase reduces stock or capacity by one and increases cash by the exact selling price.
- Daily district revenue, cost of goods or service capacity, units sold, and gross profit come from completed purchases. District businesses no longer create passive sales income.
- Existing owned businesses migrate with starter capacity and their reference prices, so an old campaign remains playable.

## Acceptance checks

1. All 25 district businesses expose exactly two configurable offers.
2. Buying a positive whole-number quantity updates cash and capacity together; invalid or unaffordable orders change neither.
3. Selling prices must be positive and the demand boundary remains deterministic.
4. A completed sale reconciles cash, remaining capacity, revenue, cost of sales, and guest history.
5. Guests only consider offers that are operating, in stock, affordable, and relevant to their needs and preferences.
6. The operations panel shows live demand, expected sales, revenue, cost, and gross profit before the player commits more cash.
7. Closing the day records only realised district sales and never replays them.

## Verification

- Automated rules: `tests/district-business-operations.test.mjs`
- Regression coverage: `tests/district-progression.test.mjs` and `tests/guest-decision-engine.test.mjs`
- Manual check: open a built district business, change a price, buy capacity, observe a guest purchase, then confirm the daily figures.
