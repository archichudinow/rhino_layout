PART 2 — FUNCTION GROUP SCALE (Mid)
2.1 Input

Approved RoomVariants

Grouping rules

Circulation ratios

2.2 GroupNode Definition
GroupNode {
  id
  name
  roomIds[]

  groupType
  circulation_ratio

  variants[]
  activeVariantId
}

2.3 Group Variant Generation

For each group:

Generate multiple variants:

Single-loaded

Double-loaded

Clustered

Compute:

Group envelope

Internal room layout

Circulation area

Access edges

Facade edges

2.4 Group Validation

Validate:

All rooms fit

No overlaps

Circulation area within limits

Daylight rooms touch facade

2.5 Group Preview (Three.js)

Render:

Group envelope

Rooms inside

Circulation zones

Access & facade edges

2.6 Group UI

Implement:

Scrollable list of group variants

Preview on hover

Lock selection

Toggle stacking allowed

Only approved groups continue.