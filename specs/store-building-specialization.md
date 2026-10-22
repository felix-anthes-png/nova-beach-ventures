# Store and building specialization

## Product outcome

Expansion should create different operating strategies, not only larger versions of the same shop or amenity. Store concepts and facility blueprints give each venue a role and make nearby campus construction part of that decision.

## Store concepts

- A store unlocks specialization at venue level two.
- Every store offers one named concept for each focus: Flow, Wellbeing, and Experience.
- A concept has an immediate fit-out cost, a daily operating cost, a service multiplier, destination appeal, and selected campus-need effects.
- A player may refit an existing concept by paying for the new concept.
- Rejected or unaffordable changes leave cash and the active concept unchanged.

## Facility blueprints

- Scenery, benches, recycling points, water points, restrooms, and food gardens each offer two purpose-built blueprints.
- A blueprint must match the underlying facility type.
- Applying or changing a blueprint has an immediate cost and is persisted on the placed facility.
- A blueprint changes campus needs and guest destination appeal and adds a visible world treatment.
- Paths keep their routing role; custom experiences retain their existing module system.

## District synergy

- Store concepts and facility blueprints use one of three readable focuses: Flow, Wellbeing, or Experience.
- A specialized facility strengthens a store only when both share a focus and occupy the same district.
- Each match adds 4% service speed and 4 destination appeal, capped at three matches per store.
- Moving a facility can therefore create or remove a synergy without modifying the chosen blueprint.

## Persistence and compatibility

- Existing saves migrate to state version 6 with no specialization selected.
- Accepted changes save immediately through the normal run persistence path.
- Specialization history records the target, previous choice, new choice, cost, day, and timestamp.

## Acceptance checks

1. A level-one store rejects specialization without changing cash.
2. A level-two store deducts the exact fit-out cost and updates service and operating cost.
3. An unaffordable refit leaves the previous concept unchanged.
4. A facility rejects a blueprint intended for another facility type.
5. A facility blueprint changes its stated need effects.
6. Matching focuses in one district activate synergy; another district does not.
7. Older saves migrate without receiving free concepts or blueprints.
