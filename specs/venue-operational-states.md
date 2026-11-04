# Venue operational states

## Purpose

Make shop and venue conditions readable from the campus itself, without opening a management panel.

## Visual contract

- Operating venues illuminate their counter and show a physical open sign.
- Closed venues switch off and lower a shutter.
- Retail displays visibly empty as stock runs down and show a sold-out state at zero stock.
- Recent deliveries leave boxes and a restocking worker at the destination.
- Busy, stocked venues deploy queue stanchions during rush periods or once a queue forms.
- Breakdowns close the frontage with cones, barrier tape, a warning lamp, and inactive equipment.
- Cleaning issues lose visible litter as work progresses and show a caretaker, broom, cone, and cleaning sparkle.
- Scheduled DJ events add bunting, equipment cases, and a setup board before opening.
- Service venues such as gyms and courts use availability boards instead of retail shelves.

## Acceptance checks

The state model is deterministic and covered by `tests/venue-operational-states.test.mjs`. Manual review should confirm that treatments remain anchored to their venue and do not obscure guest movement.
