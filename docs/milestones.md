# Development milestones

The repository history is organised around complete player-facing batches. Later branches build on earlier ones, so each commit acts as a stable checkpoint rather than an unrelated prototype.

## 1. Campus foundation

**Checkpoint:** `06a0cc4` on `main`

Established the waterfront world, player movement, separate interiors, shops, pricing, inventory, persistence, and the first cohesive architectural pass.

## 2. Smarter building mode

**Checkpoint:** `eafb2b6` on `codex/smarter-building-mode`

Added quarter-turn rotation, footprint collision checks, moving, demolition, and salvage. Automated rules live in `tests/building-mode.test.mjs`.

## 3. Guests use the campus

**Checkpoint:** `df81c83` on `codex/guests-use-campus`

Connected guests to placed amenities and campus destinations instead of treating them as decorative background movement.

## 4. Deeper progression

**Checkpoint:** `45c0237` on `codex/deeper-progression`

Changed the opening state to one café and introduced company levels, venue unlocks, staff, store upgrades, land acquisition, event venues, and long-term goals.

## 5. Facility design system

**Checkpoints:** `9ad0368` and `c8fc4fe`

Reworked catalogue presentation and map assets so paths, landscaping, amenities, services, and attractions read as different families rather than repeated cards or identical blocks.

## 6. Meaningful guest decisions

**Checkpoint:** `20c0c53` on `codex/guest-decision-system`

Added personal needs, spending budgets, patience, preferences, queue response, price response, and recorded interactions. Behaviour is covered by `tests/guest-behavior.test.mjs`.

## 7. Managed DJ events

**Checkpoint:** `f5f4670` on `codex/managed-dj-events`

Turned a visual attraction into an operation with programme, ticket price, DJ, capacity, equipment upgrades, costs, forecasts, and physical crowds. Rules are covered by `tests/dj-operations.test.mjs`.

## 8. Living campus time

**Checkpoint:** `9f2a3b4` on `codex/living-campus-time`

Added smooth lighting, six timetable phases, opening hours, scheduled deliveries, phase-specific footfall, and an end-of-day report that does not stop the campaign. Rules are covered by `tests/time-system.test.mjs`.

## 9. Management overlays

**Checkpoint:** `feature/management-overlays`

Added four world-space information lenses, a prioritised live briefing, direct navigation into corrective actions, keyboard controls, and deterministic management summaries. Rules are covered by `tests/management-overlays.test.mjs`.

## 10. Store and building specialization

**Checkpoint:** `feature/store-building-specialization`

Added named store concepts, facility blueprints, visual fit-outs, and district-level focus synergies. Rules are covered by `tests/specializations.test.mjs`.

## 11. Visual world redesign

**Checkpoint:** `feature/visual-world-redesign`

Reframed the campus as one Atlantic-modernist complex, introduced distinct architecture for all five stores, strengthened room identity, and replaced the rigid crowd figures with a stable, more expressive character system. This batch changes presentation only; simulation rules and saved progression remain compatible.

## 12. Tycoon art-direction reset

**Checkpoint:** `feature/tycoon-art-direction-reset`

Removed permanent presentation noise, made world information contextual, consolidated the campus palette and paving rhythm, and introduced a quantised four-frame crowd animation. The reset intentionally favours authored readability over additional decorative detail.

## 13. Designed campus spaces

**Checkpoint:** `feature/designed-campus-spaces`

Recomposed the original coast district as eight connected public rooms: the Arrival Plaza, Academic Courtyard, Shaded Café Terrace, Food Court, Student Lawn, Beach Promenade, Event Square, and Service & Delivery Lane. Guest paths now reinforce those spaces, while essential arrival and logistics routes are protected from conflicting construction.

## 14. Character and crowd animation overhaul

**Checkpoint:** `feature/character-crowd-overhaul`

Replaced the repeated side-facing figure with a directional six-frame population system. Guests now arrive in cohorts, form stable venue-specific queues, and visibly eat, drink, browse, sit, talk, or dance. Staff carry role-specific equipment and event crowds face the stage, making existing simulation state readable through animation.

## 15. Editable local development URL

**Checkpoint:** `chore/local-development-url`

Added a dependency-free Terminal launcher that selects an available localhost port, opens the game, and reloads the browser when editable files in `dist/` change. A network mode supports testing from another device without changing the stable hosted release.

## 16. Visual building lifecycle

**Checkpoint:** `feature/visual-building-lifecycle`

Turned venue purchases and upgrades into saved construction projects. Stores remain closed while fencing, scaffolding, partial walls, workers, and progress signage occupy the plot. Completed projects trigger a short camera focus, while scheduled closures use physical shutters and stock deliveries travel visibly from the service lane toward their destination.

## 17. Environmental motion

**Checkpoint:** `feature/environmental-motion`

Connected the outdoor world to one time-aware Atlantic motion profile. Layered ocean swells and shoreline foam now move beside drifting cloud bands and birds, while palms, flags, promenade pennants, terrace canopies, and courtyard water respond coherently to the breeze. Reduced-motion preferences retain the environmental composition without continuous movement.

## 18. Showcase editor

**Checkpoint:** `feature/showcase-editor`

Added a presentation sandbox with a separate save, level-ten progression, a large build budget, and accelerated construction. The presenter can use the real purchase flows for every store, district, facility, staff role, specialization, and event, then return to the untouched campaign or reset only the showcase.

## 19. World collision and depth

**Checkpoint:** `feature/world-collision-depth`

Made the campus physically navigable rather than purely visual. Buildings, stores, constructed assets, trees, counters, shelving, and furniture now block the player; diagonal movement slides along edges, click targets resolve to safe ground, and landmark depth uses each structure's front edge.

The batch adds deterministic physics coverage in `tests/world-physics.test.mjs`.

## 20. Campus calendar and guest groups

**Checkpoint:** `feature/campus-calendar-guests`

Added a recurring seven-day programme and eight visible visitor groups. Calendar days now change attendance and phase pressure, while group schedules, budgets, patience, preferences, and price tolerance shape individual decisions. Forecasts appear before trading and group results persist in the daily ledger.

The batch is covered by `tests/campus-calendar-guests.test.mjs`.

## 21. Larger district progression

**Checkpoint:** `feature/larger-district-progression`

Expanded the original campus into six operating environments. Land purchases now visibly extend the traversable map and expose a district development pipeline rather than a single prebuilt venue. The Student Village, Beachfront, Innovation District, Sports Campus, and Transit & Arrival District each create a different traffic rhythm and management problem.

The portfolio contains 25 separately purchasable businesses. They create daily income and upkeep, add visitor appeal, can break down, become physical guest destinations, and unlock residents, founders, athletes, and commuters. Beachfront performance also responds to deterministic coastal weather. Coverage lives in `tests/district-progression.test.mjs`.

## 22. World object depth correction

**Checkpoint:** `fix/world-object-depth`

Corrected the painter ordering that made long façade objects appear to float over characters. The academic complex now renders as separate wings, while canopies, columns, and planter sections are sorted at their local map position. Main building walls share their footprint with collision and sort from the player's local position along the visible front wall. Façade planter boxes now have matching solid footprints, so characters remain in front of the architecture and cannot enter its furniture. Coverage lives in `tests/world-depth-layers.test.mjs`.

## 23. District visual overhaul

**Checkpoint:** `feature/district-visual-overhaul`

Recomposed the five expansion areas as recognisable campus environments rather than repeated white kiosks. Student Village now uses a residential courtyard, Beachfront combines timber boardwalks and leisure venues, Innovation uses glass pavilions and a connected spine, Sports Campus uses turf and real courts, and Transit & Arrival uses parking, bus, bicycle, and pedestrian infrastructure. Business footprints now determine both rendering depth and collision. Automated layout checks keep plots inside their land, separated from one another, and clear of the established Beach Bar, Surf Shop, and Coastline Pavilion.

## 24. District spacing correction

**Checkpoint:** `fix/district-spacing-overlaps`

Expanded the outer campus from 80 to 89 walkable tiles and rebuilt the expansion layout around deliberate circulation space. The northern parcels now retain a visible pedestrian seam, the southern Beachfront and Sports parcels are separated by more than a full tile, and all 25 business plots have larger visual clearances. Beachfront venues were specifically moved away from the established Maré Beach Bar, Surf Shack, and Coastline Pavilion. District gates, guest arrival points, walking bounds, operational ownership, and map classification moved with the new geometry.

Automated composition coverage now rejects plots with less than the required circulation clearance.

## 25. District business operations

**Checkpoint:** `feature/district-business-operations`

Replaced passive district revenue with 50 player-managed offers across all 25 expansion businesses. Players purchase physical stock or service capacity, choose selling prices, and use forecasts that expose demand, revenue, cost of sales, and gross profit. Guests select suitable offers according to their needs, group, budget, campus phase, district rhythm, weather, availability, and price, then create the actual cash transaction while physically using the venue.

The daily ledger now records realised district sales rather than background income. Existing campaigns migrate owned businesses with starter capacity and reference prices. Coverage lives in `tests/district-business-operations.test.mjs` and the updated district-progression regression suite.

## 26. Interior interaction overhaul

**Checkpoint:** `feature/interior-interaction-overhaul`

Rebuilt the three enterable buildings as operational spaces with their own authored floor zones, circulation routes, counters, displays, furniture, and character activities. Atlantic Café, Mercado dispatch, Nova Merch Lab, and Venture HQ now use fixtures that belong to their rooms instead of rendering exterior-style buildings indoors.

Interior geometry now drives both visual placement and player collision. Purposeful service, queueing, browsing, studying, restocking, and networking poses make each room readable, while contextual markers expose venue condition and stock. The batch deliberately keeps fixed roofs and walls and introduces no transparency system. Coverage lives in `tests/interior-interaction-overhaul.test.mjs`.

## 27. Venue operational states

**Checkpoint:** `feature/venue-operational-states`

Moved venue status out of management-only screens and into the campus world. Original stores and expansion businesses now communicate whether they are open, closed, busy, low on stock, sold out, restocking, being cleaned, or under repair. Scheduled DJ venues also prepare physically before an event with bunting, cases, and setup signage.

The visuals are driven by live simulation state rather than a decorative loop. Service venues use availability boards while retail venues expose shelf stock. Coverage lives in `tests/venue-operational-states.test.mjs`.

## 28. Business and service animations

**Checkpoint:** `feature/business-service-animations`

Gave eight expansion business categories their own operational motion and props. Bakeries prepare food, gyms exercise, padel courts host rallies, laundry drums rotate, restaurants serve tables, surf rentals move boards, parking receives vehicles, and conference centres present to delegates.

The activity is driven by real capacity, operational condition, active guests, queues, and campaign time. Broken or depleted businesses become inactive instead of continuing a decorative loop. Coverage lives in `tests/business-service-animations.test.mjs`.

## 29. Business animation art polish

**Checkpoint:** `fix/business-animation-art-polish`

Reworked the eight service scenes so they share the architectural model’s scale and material language. Oversized generic characters were replaced by grounded miniature workers and customers, while symbolic props became layered equipment with contact shadows, frames, glazing, furniture, and restrained motion.

The refinement does not change business simulation rules. Existing capacity, breakdown, queue, and guest-driven animation gates remain intact.

## 30. District operational art integration

**Checkpoint:** `fix/district-operational-art-integration`

Removed the repeated interface-like graphics that visually overwhelmed expansion areas. District businesses now communicate status through small façade lamps, their authored equipment, brief retail delivery crates, and queue barriers only when guests are actually waiting.

District stock purchases now persist their campaign minute, allowing restocking visuals to expire after 24 in-game minutes instead of remaining for the entire day. Original stores retain their more explicit frontage treatment; expansion venues no longer duplicate it.

## 31. Full-size campus bus and grounded buildings

**Checkpoint:** `feature/full-size-campus-bus`

Replaced the Transit bus symbol with a real scheduled vehicle. The bus now approaches along the arrival lane, stops, opens its passenger door, releases up to ten full-size passengers in waves, closes, and departs. It participates in world depth and collision like other large objects.

Enclosed expansion buildings now use a dedicated foundation plinth, stronger contact shadow, darker base material, and a front contact edge. This removes the suspended appearance visible around the Innovation buildings without changing their footprints.

Coverage lives in `tests/transit-bus-cycle.test.mjs`.

## 32. World ground-contact pass

**Checkpoint:** `fix/world-ground-contact-pass`

Unified the vertical coordinate system used by all expansion districts. Owned parcels remain four pixels above the terrain, while foundations, building walls, paths, courts, transit facilities, canopies, columns, construction plots, and temporary operating equipment now begin from that shared surface instead of world height zero.

This removes the camera-dependent floating effect without changing plot coordinates, collision footprints, business operations, or save data. Contact shadows now sit directly beneath their building footprints rather than being offset like detached objects.

Coverage lives in `tests/world-ground-contact.test.mjs`.

## 33. Campus circulation and guest agendas

**Checkpoint:** `feature/campus-circulation-agendas`

Reconnected the expanded campus through guest behaviour. Visitors now arrive from a small set of credible gates, receive agendas based on the live university timetable, and use a shared pedestrian spine when moving between the original campus and eastern districts. Most groups complete an Academic Core stop before making a free commercial choice, while a limited number of surfers and tourists retain direct beach visits.

The batch changes movement and destination sequencing without replacing the existing needs, queue, pricing, sales, or persistence systems. Coverage lives in `tests/campus-circulation-agendas.test.mjs`.

## 34. Central campus recomposition

**Checkpoint:** `feature/central-campus-recomposition`

Rebuilt the expansion topology around the Academic Core. Transit & Arrival now forms the western gateway, Student Village occupies the northwest, Beachfront extends south to the shoreline, Innovation anchors the east, and Sports Campus occupies the southeast. The central plaza, teaching buildings and Student Hub now connect most cross-campus journeys instead of beginning a long one-directional strip.

The move includes walkable bounds, shoreline rendering, district gates, guest connectors, the scheduled bus, store locations, collisions, overlays, issue markers, construction reservations and map indicators. District ownership and business IDs remain unchanged, preserving existing campaign data. Coverage lives in the updated district, circulation, transit and art-direction suites.

## 35. Beachfront and Sports composition

**Checkpoint:** `fix/beachfront-sports-composition`

Separated the two districts that previously competed for the southern coast. Sports Campus now forms an inland athletics cluster immediately west of Student Village, while the Beachfront owns one continuous timber promenade, sand field and shoreline edge.

The batch relocates sports businesses, staff patrols, litter points, the acquisition gate, guest routing and walkable bounds without changing ownership or business IDs. Beachfront stores, events and operations remain intact inside a clearer coastal ground plan. Coverage lives in the district visual and campus circulation suites.

## 36. Campus district spacing polish

**Checkpoint:** `fix/campus-district-spacing-polish`

Compacted the northwest Sports parcel into the space beside Student Village and above Transit & Arrival, putting its acquisition marker on the real district entrance and removing the long empty camera span. Innovation now uses its southern land as a prototype courtyard and second venue row.

The Beachfront no longer uses repeated crossing strips through its stores and event equipment. One northern boardwalk connects to Event Square, while an unobstructed shoreline walk frames the sand. Spatial assertions cover the compact plots, real gate position and absence of the retired crossing pattern.

## 37. Guest journeys and venue interiors

**Checkpoint:** `feature/guest-journeys-interiors`

Connected transport, campus routes, queues and interiors into one continuous guest lifecycle. Commuters now wait for the scheduled bus boarding phase, selected campus groups arrive by bicycle, and other visitors enter on foot.

Atlantic Café and Merch Lab customers queue at their real building doors, move through the matching interior, use the business, return outdoors with a visible purchase and continue to a terrace or lawn activity. The same live guest actor crosses the threshold, so budgets, needs, stock, sales and visit history remain atomic.

Coverage lives in `tests/guest-journeys-interiors.test.mjs`.

## 38. Lecture hall attendance

**Checkpoint:** `feature/lecture-hall-attendance`

Recomposed the Academic Wing around a full auditorium with a raised stage, a wide presentation wall, five split seating tiers, a central aisle and two illuminated side aisles. The café and study commons now occupy secondary support zones. Academic timetable stops bring the same live students and professors through the main entrance and into a longer class activity.

Students visibly sit and take notes, professors present, and completed classes return guests to the Academic Courtyard without creating a commercial transaction. Coverage lives in `tests/lecture-hall-attendance.test.mjs`.

## Verification baseline

At the end of milestone 36:

- 163 automated tests are defined, including lecture hall attendance, guest journeys and venue thresholds, central campus composition, campus circulation and agendas, world ground-contact, the full-size transit bus, business service animations, venue operational states, interior interaction, district business operations, district progression and spacing, campus calendar and guest groups, world physics and local depth layers, showcase isolation, construction lifecycle, environmental-motion, save migration, visual-contract, and development-URL checks.
- `dist/core.js` and `dist/app.js` pass Node syntax checks.
- Accepted actions persist; rejected actions leave state unchanged.
- The deployed static build runs without a paid service.

These statements describe observed repository checkpoints. They do not replace the commit authorship or invent intermediate work that is not present in Git.
