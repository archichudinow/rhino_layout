PART 1 — ROOM SCALE (Grain)
1.1 Input

Program list:

room name

required area (target / min / max)

functional tags (daylight, access, privacy)

1.2 RoomNode Definition

Implement a RoomNode data structure:

RoomNode {
  id
  name
  area_target
  area_min
  area_max

  width_range
  depth_range
  aspect_ratio_range

  requires_daylight
  requires_access

  color
  variants[]
  activeVariantId
}

1.3 Room Variant Generation

For each RoomNode:

Generate 3–6 size variants

Each variant must:

Match area within tolerance

Respect depth/width constraints

Define:

facade edge (if daylight required)

access edge

RoomVariant {
  id
  width
  depth
  area

  facade_edge
  access_edge

  notes
}

1.4 Room Validation

Validate each variant:

Area tolerance

Reasonable proportions

No self-intersection

1.5 Room Preview (Three.js)

Render each variant as:

Rectangle outline

Facade edge highlighted

Access edge dashed

Billboard label:

Room name

WxD

Area

1.6 Room UI

Implement:

Scrollable list of room variants

Hover → preview in viewport

Click → select

Lock → set as active variant

Only active variants continue.