# Tycoon art-direction reset

## Goal

Make the game feel intentionally art-directed rather than procedurally decorated. The campus should remain readable as a management simulation without covering the world in permanent interface elements.

## Visual rules

- Use a limited Atlantic palette: chalk concrete, deep teal glass, warm timber, coral wayfinding, lime interaction states, sand, and water.
- Use one structural grid and one light direction across campus buildings.
- Prefer strong silhouettes and repeated construction details over unique decoration on every surface.
- Show location names, store status, and guest intent through proximity or an explicit management overlay.
- Use a four-frame stepped walk cycle so crowd movement reads like classic tycoon animation.
- Keep the normal-play HUD to one compact objective, one actionable alert, the core run stats, and the management toolbar.

## Acceptance checks

1. The world remains clearly visible at a 1366×768 viewport without permanent panels covering both sides.
2. Distant doors and venues do not display floating labels in the default Flow view.
3. Approaching an interactive location reveals its name and interaction state.
4. Needs, Trade, and Operations lenses may show additional world-space information because the player explicitly requested it.
5. Guest walk animation uses four stable frames without continuous limb deformation.
6. Existing saves, simulation rules, and controls remain unchanged.
