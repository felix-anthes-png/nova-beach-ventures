# Interior architectural redesign

## Goal

Make every accessible building read as a deliberately designed place that belongs to the same Atlantic-modernist campus while retaining its own operational identity.

## Building plans

- **Academic Wing:** a compact Atlantic Café, enclosed Study Commons and separately accessible Nova Auditorium connected by one circulation spine.
- **Mercado Supply Hall:** receiving bay, marked stock aisles, dispatch station and a temperature-controlled cold room.
- **Student Hub:** Merch Lab retail gallery, glass-enclosed Venture Studio and furnished Student Commons.

## Visual system

- Every operational zone receives its own restrained floor material and perimeter.
- Shared ceiling rails, wall glazing and campus signage connect the interiors to the exterior architecture.
- Partitions and door openings define rooms instead of relying on coloured labels alone.
- Building-specific fixtures communicate purpose: storage racks and loading markings in Mercado, merchandise islands in the Hub, and acoustic panels in the Academic Wing.
- New furniture uses the same collision data as player movement.

## Acceptance checks

1. The three interiors remain visually distinct while using a shared architectural language.
2. Café, commons, auditorium, retail, studio, lounge, stock, dispatch and cold-storage zones are individually readable.
3. Partitions block shortcuts but their intended doorways remain walkable.
4. New merchandise, collaboration and lounge fixtures have solid footprints.
5. Existing guest journeys, sales and lecture attendance remain unchanged.

## Verification

- Automated contract: `tests/interior-architectural-redesign.test.mjs`
- Layout geometry: `dist/interior-layouts.js`
- Rendering: `dist/app.js`
