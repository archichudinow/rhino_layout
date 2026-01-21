# Archived Documentation

**Date Archived:** January 20, 2026

These documents represent an earlier architecture design and have been superseded by the current implementation strategy.

## Why Archived?

The original architecture used a **3-scale system** (grain/mid/macro):
- Room Scale (grain)
- Function Group Scale (mid) 
- Building Scale (macro)

This has been replaced by a **5-level abstraction system** from the Development Guide:
- Level 0: Program Knowledge
- Level 1: Room Nodes
- Level 2: Program Zones (elastic clusters)
- Level 3: Circulation Skeleton
- Level 4: Geometry Fitting

## Archived Files

### Original Architecture Docs:
- **PART_0.md** - Old core system architecture
- **PART_1.md** - Old room scale specification
- **PART_2.md** - Old function group specification (now "Program Zones")
- **PART_3.md** - Old building scale specification
- **PART_4.md** - Old debug modes
- **INDEX.md** - Old documentation index (referenced PART_*.md files)

### UI Documentation:
- **UI_LAYOUT.md** - Early UI spec (now integrated into IMPLEMENTATION_PLAN.md)

## Key Changes in New Architecture

### Old: Function Groups (PART_2.md)
- Immediate room placement
- Fixed corridor layouts
- Concrete geometry from start

### New: Program Zones (Level 2)
- **Abstract clusters first**
- No room placement initially
- Elastic envelopes (stretch/split/stack)
- Geometry deferred to Level 4

## Current Documentation

Refer to:
- [../DEVELOPMENT_GUIDE_UPDATE.md](../DEVELOPMENT_GUIDE_UPDATE.md) - Comprehensive 5-level system
- [../PHASED_IMPLEMENTATION.md](../PHASED_IMPLEMENTATION.md) - Phasing strategy
- [../IMPLEMENTATION_PLAN.md](../IMPLEMENTATION_PLAN.md) - Detailed implementation plan
- [../PHASE_0_COMPLETE.md](../PHASE_0_COMPLETE.md) - Phase 0 completion
- [../PHASE_2_PLANNING.md](../PHASE_2_PLANNING.md) - Phase 2 (Program Zones) plan
- [../LEVEL_2_QUICK_REF.md](../LEVEL_2_QUICK_REF.md) - Visual reference

## Historical Value

These documents may still be useful for:
- Understanding design evolution
- Reference for UI layout patterns
- Historical context for decisions

**Do not use these for current development.**
