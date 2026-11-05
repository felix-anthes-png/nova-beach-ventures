# World ground-contact pass

## Purpose

Remove the remaining suspended or layered appearance from expansion districts. Buildings and physical objects must share the visible height of the parcel beneath them instead of beginning at world height zero.

## Behaviour

- Owned district parcels establish a shared raised ground datum.
- Building foundations begin at that datum and building walls begin at the top of their foundation.
- Shadows touch the footprint they belong to and do not sit several pixels away from it.
- Courts, paths, parking areas, shelters, canopies, columns, and empty construction plots begin on the parcel surface.
- Temporary operational props such as crates, barriers, cones, and workers use the same supported surface.
- Roofs, awnings, status lights, and service animations retain their existing simulation behaviour.

## Acceptance checks

1. No enclosed district venue draws its wall faces below the district platform.
2. Innovation, Sports, Beachfront, Student Village, and Transit structures remain visually attached while the camera moves.
3. Court and transit slabs use a shallow curb above the parcel rather than a block extending to world zero.
4. Canopy and shelter posts visibly meet their supporting slab.
5. Queue and repair equipment starts at the frontage surface.
6. Existing collision footprints, business rules, prices, stock, and saved campaigns remain unchanged.
