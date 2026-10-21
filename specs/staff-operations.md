# Staff operations

## Product contract

Staff are individual employees rather than permanent global modifiers. Every employee has a role, district assignment, shift, recruitment fee, and daily wage. Changes persist immediately.

Campus use generates deterministic work orders. Litter reduces cleanliness until an on-shift caretaker assigned to that district clears it. A breakdown temporarily removes its store or amenity from guest choices until an assigned technician completes the repair.

At 19:30 the daily report charges payroll once and includes wages in operating profit. Cash never becomes negative; any shortfall becomes overdue payroll and pauses all staff until settled.

## Acceptance checks

1. Hiring creates one roster entry with the correct role, default district, shift, and wage.
2. Shift and district assignments control whether that employee contributes.
3. A caretaker resolves litter only while working in the affected district.
4. A failed store is closed to guests until a technician completes its repair.
5. Day close deducts payroll once and reports operating profit after wages.
6. Insufficient cash creates payroll arrears without negative cash.
7. Older saves migrate staff counts into the roster exactly once.
