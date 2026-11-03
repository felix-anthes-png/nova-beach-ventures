# Character and crowd animation overhaul

## Purpose

People should communicate campus activity rather than look like identical markers moving across the map. This batch replaces the previous four-frame side-facing figure with a shared directional character system for guests, the player, staff, interior students, queues, and event crowds.

## Player-facing contract

- Moving characters use a six-frame walk with front, back, and side orientation derived from their actual movement vector.
- The population includes varied skin tones, proportions, hairstyles, trousers, shoes, bags, and clothing colours while retaining one coherent illustrated style.
- Guest actions reflect their destination: eating, drinking, browsing, sitting, checking a phone, chatting, or dancing.
- Guests arrive in small cohorts during busy periods rather than appearing as isolated single figures.
- Each store has a stable queue direction and spacing. Waiting guests face the counter and do not collapse into one point.
- Caretakers, technicians, service staff, and hosts carry recognisable work props. Working staff face their task.
- DJ crowds dance, chat, and face the stage instead of standing in a rigid grid.
- Busy campus phases can show up to 48 live guests while retaining the existing deterministic economy.

## Acceptance checks

1. Walking animation contains six distinct leg positions and responds to the movement direction.
2. Front-facing characters show facial detail; back-facing characters do not.
3. At least seven activity poses are mapped to guest states and destinations.
4. Three guests can enter as one spatial cohort without occupying the same coordinate.
5. Queues form along venue-specific vectors and face the service point.
6. Staff roles have distinct props and task poses.
7. Event attendees visibly dance or talk while facing the stage.
8. Syntax checks and the complete automated suite pass.
