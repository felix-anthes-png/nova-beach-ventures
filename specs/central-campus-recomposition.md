# Central campus recomposition

## Purpose

Turn the expanded campus from a long eastward strip into a connected tycoon map with the Academic Core at its geographical and operational centre.

## Map composition

- **West:** Transit & Arrival
- **Northwest:** Student Village
- **Centre:** Academic Core, Arrival Plaza, Atlantic Café, Food Court and Student Hub
- **South:** one continuous Beachfront and coastal event lawn
- **East:** Innovation District
- **Far northwest:** Sports Campus beside Student Village, away from the shoreline

## Player-visible behaviour

- Land purchases expand the walkable bounds in the direction of the acquired district.
- The shoreline now belongs entirely to the Beachfront, with one continuous timber promenade, sand field and water edge.
- Transit buses approach from the western road and unload beside the central-campus connection.
- District gates sit on the edge of the Academic Core and preview the direction of each expansion.
- All five unowned districts keep a visible, named `LAND FOR SALE` gate on the edge of their future parcel from the beginning of a campaign; level and ownership prerequisites are enforced inside the acquisition panel rather than by hiding the land.
- Guest routes use west, northwest, far-northwest, east and south connectors through the central campus.
- Existing stores, district businesses, operational overlays, collisions and issue markers follow their relocated parcels.
- The construction boundary expands with owned land while preserving future business plots.

## Acceptance checks

1. Transit & Arrival and Student Village sit entirely west of the Academic Core.
2. Beachfront sits south of the Academic Core and meets the shoreline.
3. Innovation District sits east of the Academic Core.
4. Sports Campus sits inland west of Student Village and does not compete with the beach.
5. District plots remain inside their parcels and retain circulation clearance.
6. The relocated Beach Bar, Surf Shack and Coastline Pavilion do not overlap Beachfront businesses.
7. The Beachfront promenade, sand field and shoreline read as one connected leisure district.
8. The Transit bus stops at the western interchange.
9. Existing saves remain compatible because district ownership and business IDs do not change.
