# Guest journeys and venue interiors

## Purpose

Connect transport, campus circulation, queues, interior activity and purchases into one readable guest journey.

## Behaviour

- Each guest is assigned a credible arrival mode: campus bus, bicycle or walking.
- Bus guests remain off-site until the scheduled bus is stopped with its doors open.
- Guests continue to use the central campus spine and timetable agenda before making commercial choices.
- Atlantic Café customers queue at the Academic Wing entrance and Merch Lab customers queue at the Student Hub entrance.
- After service, those guests cross into the matching interior, follow its circulation route, use the venue, and return through the same entrance.
- Completed purchases remain visible as coffee cups or shopping bags while guests continue to a terrace or lawn activity.
- The same live guest is rendered inside when the player enters the corresponding building; it is not replaced by a decorative duplicate.
- Stock, cash, demand, budgets and visit records continue to use the existing atomic transaction rules.

## Acceptance checks

1. A commuter using an operating Transit district waits for the real bus boarding phase before entering campus.
2. Eligible campus groups can arrive by bicycle; all other arrivals remain readable as walking arrivals.
3. Café and Merch Lab guests route to the correct exterior entrance and do not pass through the building shell.
4. Entering the Academic Wing or Student Hub reveals the same guests using those interiors.
5. Guests return outdoors after their interior activity and visibly carry the purchased item.
6. One interior visit produces at most one transaction and one completed visit.
