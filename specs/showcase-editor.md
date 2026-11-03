# Showcase editor

## Intent

Present the complete tycoon without altering or artificially advancing the player’s real campaign. The editor should expose every progression-gated purchase while retaining the real store, land, construction, staffing, event, and placement interactions.

## Behaviour

- A Showcase button opens an explanation before entering the editor.
- The editor uses its own browser save and never writes to the campaign save.
- A fresh showcase starts at company level 10 with €250,000 and 4× simulation speed.
- Stores and districts remain unpurchased so the presenter can demonstrate the real acquisition flows.
- All level-gated facilities, staff, venues, land, and events are available immediately.
- Purchases still deduct their real price and construction still appears in the world.
- Reset clears only the showcase save after an explicit confirmation.
- Return to campaign restores the campaign at its last saved position and balances.

## Acceptance checks

1. Entering Showcase does not change campaign cash, stock, facilities, history, or position.
2. The editor reports level 10 and makes every progression-gated catalogue item selectable.
3. Buying an item changes only the showcase save and uses the normal price.
4. Refreshing while in Showcase restores the editor state.
5. Returning to the campaign restores its previous state.
6. Resetting Showcase returns only the editor to its initial budget and empty build state.
