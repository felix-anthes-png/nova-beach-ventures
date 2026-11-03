# World collision and depth

## Purpose

The campus should behave like a physical tycoon world rather than a painted map. The player must move around buildings, shops, furniture, trees, and constructed facilities while retaining predictable keyboard and click movement.

## Behaviour

- Outdoor architecture, opened stores, event venues, major fixed props, trees, and placed facilities have solid footprints.
- Interior counters, shelving, tables, lounges, storage rooms, plants, and walls have solid footprints.
- Paths remain walkable.
- Diagonal movement slides along an obstruction when one axis remains clear.
- Clicking a blocked footprint selects the closest safe point instead of moving through the object.
- Zone transitions and saved positions recover to a nearby walkable point when necessary.
- A short ground ripple gives immediate feedback when the player meets a solid object.
- Large world structures use their front edge for depth sorting so the player correctly passes behind or in front of them.

## Acceptance checks

1. Walking into a building, store, tree, or constructed facility stops at its footprint.
2. Walking diagonally against a wall continues along its free edge.
3. Paths and open circulation areas remain traversable.
4. Interior furniture cannot be crossed.
5. A click inside a solid object resolves to a nearby walkable position.
6. Entering a room or loading an older save never leaves the player trapped inside a new collider.
7. The player is occluded by large buildings only when physically behind them.
