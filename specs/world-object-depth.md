# World object depth correction

## Purpose

Keep large campus buildings visually grounded by making character occlusion follow each object's local map position.

## Acceptance checks

- Academic wings use separate world-depth actors.
- Visible building walls and their collision rectangles use the same footprint data.
- Whole-building depth follows the player's local position along the front wall, not one fixed point on a wide roof.
- Long canopies and planters are divided into locally sorted sections.
- Façade planter boxes are solid and cannot be walked through.
- Façade support columns sort independently instead of inheriting one building-wide depth.
- A character in front of a façade remains visible; a character behind it is naturally occluded and cannot cross the wall.
- Existing movement, collision, and business systems remain unchanged.

## Verification

- Automated structural coverage: `tests/world-depth-layers.test.mjs`
- Visual check: walk the player across the Academic Core, Mercado, Learning Center, and Student Hub façades in the local browser build.
