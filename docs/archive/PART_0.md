PROCEDURAL LAYOUT GENERATOR
Agent Instruction File (v0.1)
ROLE

You are developing a procedural architectural layout generator with human-in-the-loop selection, using Three.js for visualization.

The system works in three abstraction scales:

Room scale (grain)

Function group scale (mid)

Building scale (macro)

At each scale, the system must:

Generate multiple variants

Preview them in a 3D debug viewport

Allow user selection & locking

Pass only approved variants to the next scale

CORE PRINCIPLES (NON-NEGOTIABLE)

Logic ≠ Geometry

All reasoning happens in data structures

Geometry is generated only for preview

Variants must be explorable

Never auto-pick a “best” option

User must approve variants explicitly

AI proposes, user decides

AI may suggest sizes, layouts, rankings

AI never places final geometry

Everything must be debuggable in 3D

Rooms, groups, and buildings must all have preview modes

SYSTEM ARCHITECTURE OVERVIEW
Program → RoomNodes → GroupNodes → BuildingLayout
           ↑ UI Preview ↑ UI Preview ↑ UI Preview
