# Changelog

## World ground-contact pass — 2026-11

- Aligned every expansion building with the raised surface of its district parcel.
- Replaced walls that extended below the district platform with base-aware architectural blocks.
- Anchored courts, paths, parking, bike facilities, bus shelters, canopies, columns, and construction plots to the same ground datum.
- Replaced offset building shadows with footprint contact shadows.
- Raised queue barriers, repair equipment, delivery crates, and activity characters onto their supporting surface.

## Full-size campus bus and grounded buildings — 2026-11

- Replaced the symbolic Transit shelter vehicle with a full-size Nova campus bus.
- Added deterministic approach, braking, door opening, dwell, door closing, and departure phases.
- Added staggered waves of up to ten full-size passengers leaving the bus.
- Added bus glazing, body panels, route display, stripe, wheels, lights, and a physical collision footprint.
- Added foundation plinths, stronger contact shadows, and darker base faces to enclosed district buildings.

## District operational art integration — 2026-11

- Removed repeated floating `OPEN` and `BOOK` panels from expansion businesses.
- Removed generic freestanding stock shelves and oversized restocking workers from district venues.
- Replaced them with small façade status lamps and context-specific operational equipment.
- Limited district restocking to two compact crates at relevant retail businesses for 24 in-game minutes.
- Limited district queue barriers to venues with a real visible queue.
- Added delivery-minute persistence so operational graphics disappear at the correct time.

## Business animation art polish — 2026-11

- Rebuilt all eight business scenes around a consistent miniature character scale.
- Replaced symbolic equipment with layered ovens, treadmills, machines, racks, tables, vehicles, courts, and presentation furniture.
- Added grounded contact shadows, material contrast, glass court walls, equipment framing, and restrained motion trails.
- Reduced oversized character overlap and aligned every activity more closely with its venue footprint.

## Business and service animations — 2026-11

- Added working ovens, pastry trays, preparation, and service to Gate Bakery.
- Added treadmills, weights, and exercise activity to gym businesses.
- Added booked padel players, ball movement, and rally animation.
- Added rotating laundry machines, collection baskets, and attendant activity.
- Added occupied restaurant tables, serving trays, and clearing movement.
- Added visible surfboard removal and return activity.
- Added occupied parking bays and moving arrival or departure vehicles.
- Added conference presentations, seated delegates, and a live pointer.
- Connected every animation to capacity, breakdown, guest, queue, and campaign-time state.

## Venue operational states — 2026-11

- Added illuminated counters and physical open signs to operating venues.
- Added switched-off frontages and shutters outside opening hours.
- Added stocked, low-stock, and sold-out displays, plus service availability boards.
- Added destination boxes and a restocking worker after deliveries.
- Added queue barriers during rushes and visible repair closures during breakdowns.
- Added progressive litter removal, cleaning equipment, and caretaker feedback.
- Added event setup decorations before scheduled DJ events.

## Interior and building interaction overhaul — 2026-11

- Rebuilt the Academic Wing, Mercado Supply Hall, and Student Hub around distinct operational zones and circulation routes.
- Removed the exterior-style café and merch building pods from their interiors and connected management to real counters.
- Added café displays, menu boards, dispatch equipment, delivery crates, checkout furniture, and venture workstations.
- Added purposeful service, queueing, browsing, eating, studying, restocking, and networking characters.
- Unified furniture and counter rendering with player collision and safe click-to-move resolution.
- Added contextual indoor venue status, stock feedback, entrance markers, and proximity activity labels.
- Kept roofs and exterior walls fixed, with no transparency or cutaway behaviour.

## District business operations — 2026-11

- Added 50 products, services, rentals, bookings, passes, and memberships across all 25 district businesses.
- Added player-controlled stock or capacity purchasing and selling prices to every district venue.
- Added forecasts for demand, expected units, revenue, cost of sales, and gross profit.
- Connected guest needs, budgets, groups, campus phases, district rhythms, and weather to offer selection.
- Replaced passive district income with real guest transactions and reconciled daily results.
- Added migration defaults so previously owned businesses begin with usable capacity and reference prices.

## District visual overhaul — 2026-11

- Expanded the outer campus from 80 to 89 walkable tiles and introduced wider circulation seams between every expansion parcel.
- Re-spaced all 25 business plots so roofs, terraces, shelters, existing Beachfront venues, and nearby scenery no longer visually collide.
- Rebuilt all five expansion districts with distinct residential, leisure, innovation, sports, and transit art direction.
- Replaced identical business boxes with varied venue footprints, heights, façades, courts, shelters, parking, and mobility infrastructure.
- Added purpose-built silhouettes and operational details including open beach pavilions, stepped innovation buildings, shop displays, solar roofs, arrival shelters, and route furniture.
- Moved built district businesses into the world depth system and aligned collision with their real footprints.
- Relocated the Coastline Pavilion to the Beachfront and removed plot, legacy-venue, label, and district-gate overlaps.

## World object depth correction — 2026-11

- Split wide academic buildings into local render actors instead of one campus-wide layer.
- Grounded every main building at its front wall and made that wall share one source of truth with collision.
- Made wide-building depth follow the player's local façade position and added collision to every architectural planter.
- Depth-sorted façade canopies, support columns, and planter sections by their position in the world.
- Prevented distant building furniture from painting over nearby characters and appearing to float above the map.

## Larger district progression — 2026-11

- Expanded the Academic Core into a six-district campus portfolio.
- Added the Student Village, Beachfront, Innovation District, Sports Campus, and Transit & Arrival District.
- Added 25 purchasable district businesses with income, upkeep, appeal, breakdowns, and visible map buildings.
- Added resident, founder, athlete, and commuter guest groups that unlock with their relevant district.
- Added district-specific demand rhythms, deterministic coastal weather, portfolio forecasts, and persistent daily results.

## Campus calendar and guest groups — 2026-11

- Added seven recurring campus day types with attendance, phase, crowd, and preparation forecasts.
- Added eight visitor groups with distinct schedules, budgets, patience, preferences, price tolerance, colours, and accessories.
- Added live crowd composition plus group purchases and spending to guest intelligence.
- Added calendar and guest-group performance to the closing report and persistent ledger.

## World collision and depth — 2026-11

- Added solid footprints for campus architecture, stores, props, facilities, and interior furniture.
- Added collision sliding, safe click targets, and recovery for saved or transitioned positions.
- Corrected landmark depth ordering and added subtle blocked-movement feedback.

## Showcase editor

- Added a level-ten presentation sandbox with a €250,000 build budget and the complete catalogue available.
- Kept showcase purchases, builds, land, staff, and events in a separate persistent save.
- Added clear enter, exit, and showcase-only reset controls.
- Preserved real prices, construction phases, and operating interactions for credible demonstrations.

## Environmental motion

- Added a shared Atlantic environment profile that varies with campaign day and time.
- Animated layered ocean swells, shoreline foam, drifting clouds, distant birds, palms, flags, terrace canopies, and courtyard water.
- Connected the weather chip and sunset haze to the rendered outdoor conditions.
- Added a reduced-motion fallback that preserves the composition without continuous ambient movement.

This file records meaningful product increments. Individual implementation checkpoints remain available through the linked feature branches and commit history.

## Unreleased

### Visual building lifecycle

- Added persistent timed construction projects for new venues and level upgrades.
- Added fencing, scaffolding, partial structures, site workers, progress boards, and completion camera moments.
- Added physical shutters for scheduled closures and breakdowns.
- Added visible delivery carts that follow the saved logistics schedule from the service lane to destination stores.
- Added construction status to venue management and portfolio views, with duplicate upgrades prevented until completion.

### Character and crowd animation overhaul

- Replaced the four-frame crowd figure with a directional six-frame character system shared by guests, staff, the player, interiors, and events.
- Added varied proportions, skin tones, hairstyles, clothing, shoes, and bags within one consistent campus art style.
- Added visible eating, drinking, sitting, browsing, phone, conversation, cleaning, repair, service, and dance poses.
- Added cohort arrivals, venue-specific queue geometry, counter-facing behavior, and denser peak-period crowds.

### Designed campus spaces

- Replaced the open coast tile field with eight purpose-designed campus places, each with its own material, boundary, furniture, and ground marker.
- Added an arrival plaza, academic courtyard, café terrace, food court, student lawn, promenade, event square, and service lane.
- Routed guests through the public-space network so campus crowds now reinforce the map composition.
- Protected critical entrances and operational circulation while retaining buildable social areas.

### Tycoon art-direction reset

- Reduced the permanent HUD so the campus remains the visual focus during normal play.
- Made building, door, store-status, and guest-activity labels contextual instead of permanently floating above the map.
- Replaced the fluid procedural walk with a deliberately quantised four-frame tycoon animation.
- Simplified terrain patterning, wayfinding, shadows, and controls into a stricter authored palette.

### Visual world redesign

- Unified the campus around an Atlantic-modernist material palette, connected colonnades, planted courtyards, and architectural detailing.
- Replaced the shared shop box with five purpose-built venue silhouettes whose level upgrades remain visible.
- Redrew guests and the player with stable foot anchoring, more natural proportions, varied hair, clothing, and contact shadows.
- Strengthened interior identity with zone-specific floors, circulation bands, planters, lighting, and facade treatments.

### Store and building specialization

- Added three named operating concepts for every store, with distinct service, appeal, need, fit-out, and daily-cost trade-offs.
- Added purpose-built blueprints for scenery and guest amenities, including visible world treatments and gameplay effects.
- Added district synergies that reward matching Flow, Wellbeing, or Experience facilities with nearby store concepts.
- Added save migration and atomic transaction coverage for specialization changes.

### Management UI and information overlays

- Added four live map lenses for guest flow, campus needs, commercial readiness, and operations coverage.
- Added a compact management briefing with prioritised alerts and direct links to the relevant controls.
- Added keyboard navigation, persistent overlay choice, active-panel feedback, and a contextual legend.

### Tycoon integration and balancing

- Connected campus rating, operating profit, product availability, work orders, and queue walkaways to persistent attendance momentum.
- Added daily store and district operating costs, overdue campus bills, and venue-level service-speed trade-offs.
- Added a control room that explains management health, costs, priorities, seven-day traffic, and the reasons momentum changed.
- Expanded daily reports and ledgers to reconcile payroll, overhead, operating profit, and attendance outlook.

### Staff, maintenance, and cleanliness operations

- Replaced permanent staff bonuses with individual employees, shifts, district assignments, and daily wages.
- Added deterministic litter and equipment failures, visible workers, repair progress, and temporary closures.
- Added an operations console plus payroll and work-order reconciliation in the daily ledger.

### Guest-driven sales

- Made visible counter service the source of shop revenue, stock movement, and COGS.
- Removed background product sales from time progression.
- Added atomic transaction records and acceptance coverage for affordability, stock, opening hours, demand boundaries, persistence, and daily reconciliation.

### Project workflow

- Added a documented feature-branch and pull-request process.
- Added continuous verification for syntax and all simulation tests.
- Added product, architecture, decision, milestone, and acceptance documentation.
- Added issue and pull-request templates for future feature batches.
- Added a dependency-free Terminal launcher that creates an editable local URL and reloads after source changes.

## Campaign systems — 2026-10

### Living campus time

- Replaced the fixed five-day ending with an ongoing campaign.
- Added six campus phases with different footfall patterns.
- Added smooth time-of-day lighting and a live schedule view.
- Added configurable shop opening hours and scheduled stock deliveries.
- Added a non-blocking end-of-day financial report.

### Managed attractions

- Turned the DJ deck into an operational venue.
- Added event scheduling, music styles, ticket pricing, DJs, and four upgrade paths.
- Added forecasts for attendance, revenue, operating cost, noise, comfort, and excitement.

### Guest simulation

- Added hunger, thirst, energy, bladder, happiness, budget, patience, and preferences.
- Made queues, price, availability, opening hours, and campus quality affect decisions.
- Made guests physically visit stores, amenities, and events.

### Progression

- Added ten company levels and gated store unlocks.
- Added five stores, staff specialisms, three-level venue upgrades, and scenario goals.
- Added East Promenade and Ocean Pier acquisitions.
- Added the Coastline Pavilion and repeatable crowd events.

### Building and presentation

- Added placement footprints, rotation, collision detection, relocation, and salvage.
- Rebuilt facility catalogue cards and map objects into distinct visual families.
- Reworked the campus as a cohesive 2.5D waterfront with separate interiors.

## Foundation

- Implemented the original stock, pricing, demand, sales, and persistence rules.
- Added Atlantic Café as the starting business with €100.00 and zero stock.
- Added WASD and click-to-move campus exploration.
