# District visual overhaul

## Purpose

Make every expansion feel like an intentionally designed part of Nova's coastal campus while preserving its distinct business problem.

## District language

- Student Village: warm residential courtyard, compact services, planting, and evening-oriented storefronts.
- Beachfront: sand, timber boardwalk, leisure kiosks, restaurant frontage, and real volleyball courts.
- Innovation District: larger glass pavilions, purple wayfinding, landscaped spine, and premium institutional scale.
- Sports Campus: turf, training buildings, recovery services, and marked padel courts.
- Transit & Arrival: asphalt bays, parking markings, bicycle racks, bus shelter, and grab-and-go services.

## Acceptance checks

- Businesses use varied footprints and district-specific architecture rather than one repeated box.
- Built businesses participate in normal world-depth sorting and physical collision.
- Every plot stays inside its acquired district and remains separated from neighbouring plots.
- Beachfront businesses do not overlap the existing Beach Bar, Surf Shop, or Coastline Pavilion.
- Coastline Pavilion belongs to the Beachfront rather than occupying Student Village.
- Business labels appear contextually during normal play and remain available through management overlays.

## Verification

- Automated composition coverage: `tests/district-visual-overhaul.test.mjs`
- Live review: traverse all five owned districts in the Showcase Editor at normal and wide camera framing.
