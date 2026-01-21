PROCEDURAL ARCHITECTURAL LAYOUT GENERATOR
Design & AI Integration Instructions (v1.0)
0. CORE PRINCIPLES

The system must separate abstraction levels.

Layout generation is iterative and bidirectional, not a linear pipeline.

AI is an advisor, never an author of final geometry.

Geometry is always a consequence, never a starting point.

User approval gates every transition to a higher resolution.

1. ABSTRACTION LEVELS (MANDATORY)

The system operates across four abstraction levels.
Only one level is “active” at a time.

LEVEL 0 — PROGRAM KNOWLEDGE (STATIC INPUT)

Purpose: Normalize the brief into computable constraints.

Inputs:

Original brief

Room list

Area requirements

Daylight, access, noise, adjacency rules

Quantity and repetition rules

Output:

Structured program rules

No geometry

AI MAY:

Normalize text

Extract constraints

Flag conflicts

AI MUST NOT:

Propose layouts

LEVEL 1 — ROOM NODES (MICRO SCALE)

Purpose: Define rooms as dimensional entities with variations.

Each room is a RoomNode with multiple RoomVariants.

RoomNode contains:

ID, name, category

Area target / min / max

Width & depth ranges

Aspect ratio range

Daylight requirement

Access requirement

Quantity

Notes

RoomVariant contains:

Width

Depth

Area

Facade edge (light)

Access edge (corridor)

Notes

Rules:

Rooms are NOT placed globally

Rooms do NOT know about the building

One active variant per room at a time

Output:

List of RoomNodes with variants

AI MAY:

Propose room proportions

Score variants

AI MUST NOT:

Place rooms

LEVEL 2 — PROGRAM ZONES (ELASTIC CLUSTERS)

Purpose: Represent large functional intentions without room detail.

Program zones are rubber-like containers.

ProgramZoneNode contains:

ID, name, function type

Target area (net)

Min / max area

Circulation buffer ratio

Allowed number of levels (1 / 2 / 3)

Daylight ratio requirement

Noise level

Internal room types allowed

Elastic shape flag

Important:

Zones DO NOT contain rooms yet

Zones DO NOT have fixed geometry

Zones may stretch, split, or stack

Output:

Zone nodes with abstract envelopes

AI MAY:

Propose zone splits

Suggest stacking strategies

Recommend adjacency patterns

AI MUST NOT:

Assign exact room geometry

LEVEL 3 — CIRCULATION & CORE SKELETON (TOPOLOGICAL)

Purpose: Define building logic before geometry.

Skeleton contains:

Vertical cores (stairs, lifts, service)

Circulation graph (nodes & edges)

Access hierarchy (public / staff / service)

Rules:

Graph-based only

No dimensions

No room fitting

Output:

Circulation + core topology

AI MAY:

Suggest circulation typologies

Score efficiency and clarity

AI MUST NOT:

Draw corridors

LEVEL 4 — FITTING ROOMS INTO ZONES (RESOLUTION STEP)

Purpose: Convert abstraction into geometry.

Process:

Select a ProgramZone

Assign compatible RoomNodes

Use active RoomVariants

Attempt packing within zone envelope

Respect:

Facade edges

Access edges

Area constraints

Circulation buffer

If fitting fails:

Stretch zone

Split zone

Stack zone

Change room variants

Go UP one abstraction level only

Output:

Concrete geometry

Validated layouts

AI MAY:

Suggest corrective actions

Propose alternative room variants

AI MUST NOT:

Automatically accept solutions

2. DATA HIERARCHY
RoomNode
  ↓
ProgramZoneNode
  ↓
CirculationSkeleton
  ↓
BuildingLayout


This hierarchy is non-linear and supports backtracking.

3. VARIANT MANAGEMENT RULES

Every node (Room / Zone / Cluster) has:

Variants

One active variant

Variants are previewable

Variant selection is user-driven

4. UI / DEBUG REQUIREMENTS
Variant Selection UI

Scrollable list

Click → preview in viewport

Metadata shown:

Name

Area

Width × Depth

Facade edge

Access edge

Viewport Modes

Room Variant Preview

Program Zone Preview (no rooms)

Skeleton Preview

Room-in-Zone Preview

Full Building Preview

5. AI INTEGRATION RULES (STRICT)
AI MAY:

Propose room proportions

Suggest zone typologies

Score layout variants

Generate notes and warnings

Highlight inefficiencies

AI MUST NOT:

Finalize selections

Place geometry

Modify accepted layouts

AI is an advisor, not a designer.

6. THREE.JS IMPLEMENTATION NOTES

Use abstraction-based render layers

Toggle visibility per abstraction level

Geometry generation is always downstream

Never auto-commit geometry

7. CORE DESIGN PHILOSOPHY (DO NOT BREAK)

Rooms are facts
Zones are intentions
Circulation is logic
Geometry is a consequence

8. NEXT IMPLEMENTATION STEPS (FOR AGENT)

Implement ProgramZoneNode schema

Implement circulation graph structure

Build variant preview system

Add room-to-zone fitting engine

Add AI advisory hooks (non-authoritative)