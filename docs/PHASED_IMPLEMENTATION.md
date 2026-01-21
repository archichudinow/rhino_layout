# Phased Implementation Strategy
**Focus: Build foundation before complexity**

## 🎯 Core Philosophy
> "Rooms are facts, Zones are intentions, Circulation is logic, Geometry is a consequence"

**DO:**
- Complete each phase fully before moving to next
- Keep future phases as abstract placeholders
- Validate and test at each gate
- User approval required to advance phases

**DON'T:**
- Try to solve all levels at once
- Build features for future phases
- Over-engineer for distant needs
- Skip validation steps

---

## 📋 Phase Roadmap

### ✅ PHASE 0: Program Knowledge (COMPLETE)
**Abstraction Level 0**

**What we built:**
- OpenAI brief parser
- Normalized room data structure
- 184 rooms → 4,257 m² parsed and structured

**Output:** `inputs/normalized-brief.json` with complete `RoomNode[]`

**Status:** ✅ Production ready

---

### 🔨 PHASE 1: Room Variants (CURRENT FOCUS)
**Abstraction Level 1 - Micro Scale**

**Goal:** Generate and visualize dimensional variants for individual rooms

**Scope:**
```typescript
RoomNode {
  variants: RoomVariant[]  // 3-6 variants per room
  activeVariantId: string  // user selection
}
```

**Implementation checklist:**
- [ ] Variant generation algorithm (width/depth combinations)
- [ ] Three.js room visualization (2D rectangles)
- [ ] Left panel: Folder tree (category → rooms → variants)
- [ ] Right panel: Variant details (width, depth, area, edges)
- [ ] Click variant → preview in viewport
- [ ] Lock/unlock variant selection
- [ ] Validation (area tolerance, aspect ratio)

**What to SKIP for now:**
- ❌ Room placement in building
- ❌ Multi-room grouping
- ❌ Circulation logic
- ❌ Zone fitting
- ❌ AI scoring/recommendations

**Success criteria:**
- User can see all 184 rooms
- Each room has 3-6 valid variants
- User can preview and select variants
- All selections validated against constraints
- No geometry placement yet

**Duration estimate:** 2-3 development sessions

---

### 🔮 PHASE 2: Functional Groups (DEFERRED)
**Abstraction Level 2 - Elastic Clusters**

**Goal:** Group rooms into functional zones WITHOUT placement

**Concept preview:**
```typescript
ProgramZoneNode {
  id: string
  name: string
  roomIds: string[]          // which rooms belong here
  target_area: number         // sum of room areas + circulation
  circulation_ratio: number   // 20-40% buffer
  daylight_ratio: number      // % of zone needing windows
  elastic_shape: boolean      // can stretch/split/stack
  
  // NO geometry yet - just intentions
  variants: ZoneVariant[]     // different grouping strategies
}
```

**Why defer:**
- Need complete room variant library first
- Requires mature understanding of room relationships
- Adds significant complexity without immediate value
- Can't test without Phase 1 foundation

**When to start:**
- After 90%+ of room variants are finalized
- When users request multi-room analysis
- When ready to think about building topology

**Estimated gap:** 1-2 weeks after Phase 1

---

### 🔮 PHASE 3: Circulation Skeleton (DEFERRED)
**Abstraction Level 3 - Topological Logic**

**Goal:** Define cores, stairs, corridors as graph topology

**Concept preview:**
```typescript
CirculationSkeleton {
  cores: CoreNode[]           // vertical circulation
  graph: {
    nodes: AccessPoint[]      // connection points
    edges: CirculationEdge[]  // corridors (no geometry)
  }
  hierarchy: 'public' | 'staff' | 'service'
}
```

**Why defer:**
- Requires zones to be defined first
- Highly complex spatial reasoning
- Needs AI advisory system
- Not testable without room fitting engine

**When to start:**
- After Phase 2 groups are stable
- When vertical logic becomes necessary
- When ready for multi-story layouts

**Estimated gap:** 3-4 weeks after Phase 1

---

### 🔮 PHASE 4: Geometry Fitting (FUTURE)
**Abstraction Level 4 - Resolution**

**Goal:** Convert abstract zones + rooms into concrete geometry

**Concept preview:**
- Packing algorithms
- Collision detection
- Backtracking/optimization
- Multi-floor stacking

**Why defer:**
- Requires all previous phases complete
- Most computationally intensive
- Needs sophisticated failure handling
- AI advisory becomes critical here

**When to start:**
- When ready for production layouts
- After extensive Phase 1-3 testing
- When building topology is validated

**Estimated gap:** 2-3 months after Phase 1

---

## 🚧 Implementation Discipline

### Current Phase Rules (Phase 1)

**IN SCOPE:**
- Room-level data only
- Variant generation and selection
- Visual preview of single rooms
- Validation of individual room constraints
- UI for browsing room hierarchy

**OUT OF SCOPE (Keep abstracted):**
- ❌ Room positioning (x, y coordinates)
- ❌ Room relationships/adjacencies
- ❌ Group formations
- ❌ Circulation design
- ❌ Building-level logic
- ❌ AI recommendations (beyond variant generation)
- ❌ Multi-room operations

### How to Handle Future Feature Requests

**If user asks about grouping/zones/circulation:**
1. Acknowledge it's in the roadmap
2. Reference this phasing document
3. Stay focused on Phase 1 completion
4. Add notes to future phase sections if needed

**If encountering design decisions:**
- Choose the simplest solution for Phase 1
- Don't over-engineer for future phases
- Document assumptions in code comments
- Mark extension points with `// PHASE 2:`

### Code Organization

```typescript
// ✅ GOOD - Phase 1 focused
export interface RoomVariant {
  id: string;
  width: number;
  depth: number;
  area: number;
  facade_edge?: string;
  access_edge?: string;
}

// ❌ BAD - Premature Phase 4 thinking
export interface RoomVariant {
  // ... same fields ...
  position?: { x: number; y: number };  // DON'T ADD YET
  rotation?: number;                     // DON'T ADD YET
  zoneId?: string;                       // PHASE 2 concept
}
```

---

## 🎓 Learning from Development Guide

### Key Concepts to Carry Forward

1. **Separation of Abstraction Levels**
   - Each phase operates at ONE level
   - Don't mix room logic with zone logic
   - Clear boundaries prevent complexity creep

2. **Bidirectional Iteration**
   - If Phase 3 fails, can backtrack to Phase 2
   - Variant selection enables undo/redo
   - No destructive operations

3. **User as Gatekeeper**
   - No automatic transitions between phases
   - Explicit approval required
   - Preview before commit

4. **AI as Advisor Only**
   - AI suggests, never decides
   - Generate options, not solutions
   - Human validates all outputs

### Concepts to Keep Abstract (For Now)

- **ProgramZoneNode** - Documented in types.ts, not implemented
- **CirculationSkeleton** - Mentioned in types.ts, not built
- **Room-to-Zone fitting** - Algorithm design deferred
- **Multi-floor logic** - Future consideration
- **Optimization engines** - Phase 4 only

---

## 📊 Success Metrics by Phase

### Phase 1 Complete When:
- [ ] All 184 rooms have 3-6 variants
- [ ] Variant generation respects all constraints
- [ ] UI shows full room hierarchy
- [ ] Users can preview any room variant
- [ ] Active variant selection persists
- [ ] Viewport renders rooms accurately
- [ ] No console errors or validation failures

### Phase 2 Will Start When:
- Phase 1 metrics 100% complete
- User expresses need for room grouping
- Team ready for next complexity level

---

## 🔄 Current Sprint Focus

**THIS WEEK:** Complete Phase 1 - Room Variants

**Next Steps:**
1. ✅ Review this phasing document
2. Build variant generator (`src/core/variantGenerator.ts`)
3. Implement Three.js room preview
4. Build left panel tree UI
5. Add variant selection logic
6. Validation and testing

**Context to ignore:**
- ProgramZoneNode details
- Circulation graph structures
- Room positioning algorithms
- Multi-room optimization
- Building topology

**Keep it simple. Build the foundation. Test thoroughly.**

---

*"Don't try to solve all at once. Master one abstraction level before moving to the next."*
