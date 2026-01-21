# Phase 2 Planning Summary
**Level 2: Program Zones (Elastic Clusters)**

## Status: PLANNED (Not Yet Implemented)

Phase 1 must complete before starting Phase 2.

---

## 🎯 What is a Program Zone?

A **Program Zone** is an abstract functional container that represents **intention without geometry**.

### Key Characteristics:

**✅ What Zones ARE:**
- Functional groupings (residential, shared, services, staff)
- Area capacity targets (how much space needed)
- Constraint sets (daylight, circulation, noise)
- Multi-floor capability (can stack 1-3 levels)
- Elastic properties (can stretch, split, stack)

**❌ What Zones are NOT (yet):**
- Positioned in space (no x, y coordinates)
- Containing specific room instances
- Having exact dimensions (only ratios and areas)
- Fixed geometry (they're rubber-like)

---

## 📊 Example from Current Brief

From our 184-room brief, we might derive zones like:

### Zone 1: Residential Core
```typescript
{
  id: "zone-residential-core",
  name: "Residential Living Units",
  function_type: "residential",
  target_area_net: 2400,  // 80 units × 30m² each
  circulation_ratio: 0.35, // 35% for corridors
  allowed_levels: [3, 4, 5], // Can be 3, 4, or 5 floors
  daylight_ratio: 0.9,     // 90% needs windows
  allowed_room_categories: ["living_bedroom", "bathroom"],
  can_stack: true,
  can_split: true,
  
  variants: [
    {
      strategy: "stacked",
      floor_count: 4,
      target_footprint: 600, // 2400 ÷ 4 floors
      aspect_ratio_range: [0.8, 1.5],
      gross_area: 3240       // Net + circulation
    },
    {
      strategy: "split",
      floor_count: 3,
      target_footprint: 800,
      aspect_ratio_range: [1.0, 2.5],
      gross_area: 3240
    }
  ]
}
```

### Zone 2: Shared Facilities
```typescript
{
  id: "zone-shared",
  name: "Communal Living Spaces",
  function_type: "shared",
  target_area_net: 320,    // Kitchens, dining, lounges
  circulation_ratio: 0.25,
  allowed_levels: [1, 2],
  daylight_ratio: 0.8,
  allowed_room_categories: ["shared_kitchen", "dining", "lounge"],
  can_stretch: true,
  
  variants: [
    {
      strategy: "linear",
      floor_count: 1,
      target_footprint: 320,
      aspect_ratio_range: [2.0, 4.0]
    }
  ]
}
```

---

## 🔧 Implementation Breakdown

### Week 4: Data Model & Derivation
- Define `ProgramZoneNode` and `ZoneVariant` types ✅ (done)
- Create zone derivation tool
- Analyze brief to identify logical zones
- Calculate aggregate areas
- Identify functional characteristics

### Week 5: Variant Generation
- Build zone variant generator
- Implement strategies: compact, linear, split, stacked, courtyard
- Calculate gross areas (net + circulation)
- Validate against constraints
- Score variants by efficiency

### Week 6: Visualization
- Render zones as translucent volumes
- Show proportions (aspect ratio)
- Indicate floor count (stacking)
- Color-code by function type
- Visualize circulation buffer
- Add elastic property indicators

### Week 7: UI & Validation
- Add "Program Zones" folder to left panel
- Zone variant selection interface
- Info panel for zone metadata
- Comparison view
- Lock zone selections
- Validate before Phase 3
- AI advisory integration (suggestions only)

---

## 🎨 Visual Design

### Zone Representation in 3D:
- **Translucent boxes** (not solid)
- **Height** = floor_count × 3.0m
- **Proportions** match aspect ratio range
- **Colors** by function:
  - Residential: Blue
  - Shared: Green
  - Services: Orange
  - Staff: Purple
  - Support: Gray

### Circulation Buffer:
- Inner volume: solid color (net usable area)
- Outer halo: hatched pattern (circulation buffer)

### Elastic Indicators:
- `can_stretch`: Double-headed arrows
- `can_split`: Dashed divider line
- `can_stack`: Layered visual effect

### Daylight Requirements:
- Glowing edges (% of perimeter based on daylight_ratio)

---

## 🤖 AI Integration (Advisory Only)

**AI MAY:**
- ✅ Suggest logical zone groupings
- ✅ Recommend circulation ratios
- ✅ Propose adjacency patterns
- ✅ Identify stacking opportunities
- ✅ Flag functional conflicts

**AI MUST NOT:**
- ❌ Assign exact room geometry
- ❌ Place zones in building
- ❌ Finalize zone selections
- ❌ Override user choices

---

## 📋 Success Criteria

Phase 2 complete when:
- [ ] All zones derived from brief
- [ ] Each zone has 2-4 valid variants
- [ ] All zones visualized as abstract envelopes
- [ ] UI allows zone variant selection
- [ ] All zones have locked selections
- [ ] Total capacity matches brief
- [ ] Circulation ratios validated (15-40%)
- [ ] Export produces valid JSON for Phase 3
- [ ] **NO room placement yet** (that's Phase 4)

---

## 🚫 Out of Scope for Phase 2

These are **Phase 3 & 4 concerns**:
- ❌ Zone positioning in building (x, y, z)
- ❌ Room placement within zones
- ❌ Corridor/core design
- ❌ Inter-zone connections
- ❌ Building massing
- ❌ Site placement
- ❌ Packing algorithms

---

## 🔗 Connection to Other Phases

### Phase 1 (Current) → Phase 2:
- Phase 1 provides: Room definitions with locked variants
- Phase 2 uses: Room categories and areas to derive zones

### Phase 2 → Phase 3:
- Phase 2 provides: Abstract zones with locked strategies
- Phase 3 uses: Zones to design circulation skeleton

### Phase 2 → Phase 4:
- Phase 2 provides: Zone envelopes and capacities
- Phase 4 uses: Zones to fit actual room geometry

---

## 📁 Files Created/Modified

### Type Definitions:
- [src/core/types.ts](../src/core/types.ts) - Added `ProgramZoneNode` and `ZoneVariant`

### Tools (Placeholders):
- [src/tools/deriveZones.ts](../src/tools/deriveZones.ts) - Zone derivation (deferred)

### Documentation:
- [docs/IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) - Phase 2 detailed plan
- [docs/PHASED_IMPLEMENTATION.md](PHASED_IMPLEMENTATION.md) - Overall phasing strategy
- [docs/PHASE_2_PLANNING.md](PHASE_2_PLANNING.md) - This summary

---

## 🎯 Current Focus

**DO NOW:** Complete Phase 1
- Finish room variant visualization
- Complete UI for room selection
- Validate all room constraints

**DO LATER:** Start Phase 2 (after Phase 1 is 100% complete)
- Implement zone derivation
- Build zone visualization
- Add zone selection UI

---

**Remember:** "Zones are intentions, not geometry" ✨
