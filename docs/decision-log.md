# Decision log

This log captures product and technical choices that materially shaped the current game.

## D001 — Preserve a deterministic economy

**Decision:** Keep demand and financial calculations deterministic in the current release.

**Reason:** The player should be able to connect price, stock, footfall, and profit without hidden randomness. Later variation can be added as visible forecasts or named events rather than unexplained dice rolls.

## D002 — Evolve beyond the five-day ending

**Decision:** Close and report each day, but immediately continue the campaign the following morning.

**Reason:** Progression, district acquisition, store upgrades, and managed events need a longer arc. The daily report retains the clarity of the original assignment without stopping the tycoon loop.

## D003 — Begin with one operating venue

**Decision:** Only Atlantic Café is available at the start.

**Reason:** An already-built catalogue removes the satisfaction of growth. Unlocking the Fuel Bar, Merch Lab, Beach Bar, and Surf Shack gives revenue a visible purpose.

## D004 — Make campus quality economic

**Decision:** Amenities, scenery, events, and staffing influence attendance, needs, or destination appeal.

**Reason:** Construction should be more than decoration. The world-building layer earns its place by affecting how many guests arrive and what they choose to do.

## D005 — Model individual guest decisions

**Decision:** Give each guest needs, a budget, patience, and preferences instead of distributing all demand globally.

**Reason:** Visible people and queues only feel credible when their movement reflects the same prices and facilities that the player controls.

## D006 — Schedule deliveries instead of instant restocking

**Decision:** Stock purchases reserve cash immediately and arrive at one of three daily delivery windows.

**Reason:** This creates planning pressure around lunch and evening crowds while keeping supplier logic understandable.

## D007 — Keep deployment static

**Decision:** Use browser storage and a static host rather than a backend.

**Reason:** The core experience must work with supplied content, survive reloads, and avoid a paid service or live integration.

## D008 — Make visible service authoritative

**Decision:** A shop transaction is created when a visible guest completes service, not by a separate background sales loop.

**Reason:** Stock, queues, staffing, guest budgets, and the financial report should describe the same event the player sees in the world.

## D009 — Make staffing operational rather than permanent

**Decision:** Model staff as individual scheduled employees assigned to one district, with wages and task-specific responses.

**Reason:** A permanent global bonus does not create management decisions. Shifts, payroll, litter, closures, and repairs make coverage visible, local, and financially accountable.

## D010 — Make expansion create pressure as well as opportunity

**Decision:** Charge readable daily costs for open venues and acquired districts, make venue levels increase both throughput and overhead, and let each closing day update future attendance momentum.

**Reason:** Existing systems should form one feedback loop. Growth is more satisfying when additional guests create both revenue and operational pressure, while the player can see exactly why the next day is stronger or weaker.

## D011 — Explain state before adding more systems

**Decision:** Add map lenses and contextual management signals before expanding the simulation again.

**Reason:** A tycoon game becomes harder to play when important state is scattered across separate panels. Showing flow, needs, commercial readiness, and operational risk in the world makes existing decisions faster and more legible without hiding the underlying rules.

## D012 — Let districts express an operating identity

**Decision:** Give stores and facilities one of three shared focuses and reward matching choices only inside the same district.

**Reason:** Upgrades become more meaningful when they define how a venue operates, and construction becomes more strategic when placement can support a nearby business. A capped local bonus keeps the relationship visible without replacing the base pricing, stock, staffing, and queue rules.

## D013 — Use one architectural language with varied building types

**Decision:** Share a small set of campus materials and details across the world, while giving every commercial venue its own silhouette and upgrade expression.

**Reason:** Repeating one generic shop shell makes expansion feel cosmetic, while unrelated landmark assets make the campus feel assembled from separate images. A common material language creates cohesion; different typologies preserve recognition and progression.

## D014 — Let the world carry the presentation

**Decision:** Keep the permanent interface compact and reveal labels, operational states, and guest intent through proximity or an explicit management lens.

**Reason:** Persistent floating cards made the world read like a debug view and obscured the campus. Contextual information preserves tycoon readability while allowing architecture, crowds, and public spaces to establish the visual identity.

## D015 — Compose the campus as connected public rooms

**Decision:** Organise the coast district around eight named spaces and route guests through that network.

**Reason:** Strong individual buildings still felt unrelated when they sat on one continuous paving field. Different ground materials, edges, furniture, and circulation roles make the campus legible at a glance, while shared materials keep it cohesive. Protecting only essential circulation leaves social areas open to player construction.

## D016 — Animate intent, not generic movement

**Decision:** Use one directional character system with state-specific poses for every person in the world.

**Reason:** Additional character detail is only useful when it explains what people are doing. A guest facing a counter, a caretaker holding a broom, and an event crowd dancing make queues, operations, and attractions readable without more interface labels. Shared proportions and rendering rules keep the larger variety coherent.

## D017 — Keep local development dependency-free

**Decision:** Provide a Python-based Terminal launcher instead of requiring a framework development server.

**Reason:** The game is a static application and the target Mac already provides Python, while Node and npm may not be available on the normal Terminal path. `./start-dev` therefore creates the development URL, opens the browser, and reloads changed source without an installation step. Optional npm aliases remain available for environments that already have Node.

## D018 — Make investment visible before it becomes productive

**Decision:** Store openings and upgrades create timed construction projects that close the venue until completion.

**Reason:** Immediate model replacement made major spending feel like a menu transaction. A saved construction phase connects investment to the world, creates a readable temporary trade-off, and makes the finished venue feel earned. Modular level structures and specialisation fit-outs preserve variety without requiring a separate building asset for every combination.

## D019 — Animate one environment, not individual props

**Decision:** Derive outdoor motion from one deterministic Atlantic environment profile tied to campaign day and time.

**Reason:** Independent looping props make the campus feel synthetic and visually noisy. Shared wind and sea intensity let clouds, surf, palms, flags, umbrellas, and fountains behave like parts of the same place while leaving the business simulation deterministic.

## D020 — Demonstrate through a separate sandbox

**Decision:** Give presentation mode its own save, budget, and progression state while retaining normal purchase rules.

**Reason:** Unlocking everything inside the campaign would invalidate its progression and financial history. A separate showcase lets a presenter demonstrate the full product honestly, including costs and construction, and return to the unchanged player company afterward.

## D021 — Give rendered objects physical footprints

**Decision:** Derive player collision from the same building and facility dimensions used by the world, with deterministic sliding and safe-position recovery.

**Reason:** Visual detail does not create depth when characters can pass through every asset. A small physics layer makes construction placement, interiors, paths, entrances, and architectural depth meaningful without replacing the existing canvas renderer or business simulation.

## D022 — Make the calendar change the business problem

**Decision:** Use a deterministic seven-day campus programme and compose each live crowd from visitor groups with their own schedules and economic behaviour.

**Reason:** More stores alone do not create strategic variety if every day produces the same customer. Forecastable day types let the player prepare stock, hours, prices, staffing, facilities, and events while keeping the simulation understandable and reproducible.

## D023 — Make land change the operating model

**Decision:** Treat districts as separate economies with their own traffic rhythm, visitor group, business catalogue, income profile, upkeep, and maintenance exposure.

**Reason:** A larger map is not meaningful progression when every parcel behaves like more space for the same shop. The district portfolio makes expansion a strategic choice: residential trade peaks late, the Beachfront depends on weather, Innovation rewards premium weekday demand, Sports produces capacity spikes, and Transit increases high-volume arrival pressure. Deterministic modifiers keep those differences forecastable and auditable.

## D024 — Depth-sort architecture by local footprint

**Decision:** Render wide buildings as local sections and give façade furniture its own world-depth actor.

**Reason:** One depth value for an entire building lets its distant front edge paint over characters standing elsewhere on the map. Local actors preserve the existing isometric painter model while making occlusion follow the visible position of each canopy, column, and planter.

## D025 — Compose districts before decorating plots

**Decision:** Give every expansion its own ground plan, circulation system, architectural family, and verified plot geometry.

**Reason:** Recolouring identical buildings does not create district identity, and placing them independently produces overlaps with paths and established venues. Authored layouts make each expansion readable at a glance while shared materials keep the full campus coherent.

## D026 — Give the coastline to one district

**Decision:** Keep the Beachfront as the campus's only shoreline parcel and place Sports Campus inland beside Student Village.

**Reason:** Two independently designed districts sharing one narrow coast produced competing ground edges, crowded silhouettes, and no clear beach identity. A continuous promenade and sand field now make the coast read as one destination, while the inland sports parcel creates a more believable athletics cluster and a distinct cross-campus journey.

## D027 — Compact expansions around real entrances

**Decision:** Place each district gate on its physical parcel edge and use the land between commercial buildings as an authored public space.

**Reason:** A remote sign and large areas of generic terrain make a district feel disconnected even when its buildings do not overlap. Compact parcels shorten camera travel, make progression legible, and turn necessary circulation clearance into boardwalks, courtyards, and shared campus routes rather than visual emptiness.

## D028 — Preserve guest identity across building thresholds

**Decision:** A guest entering an interior remains the same simulation actor, with one budget, one destination, one transaction and one visit record.

**Reason:** Replacing visitors with decorative indoor figures makes transport, queues and purchases feel unrelated. Moving the live actor between outdoor and indoor coordinate spaces creates a continuous journey while preserving the deterministic economy and avoiding duplicate sales.

## D029 — Let the timetable create real indoor attendance

**Decision:** Academic agenda stops move live guests into a physical lecture hall instead of treating the university building as an exterior landmark.

**Reason:** Lecture blocks only feel meaningful when students and professors visibly leave the campus paths, occupy a classroom and return afterward. Reusing the existing agenda and threshold systems keeps attendance deterministic while making the main building central to campus life.
