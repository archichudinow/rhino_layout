# Documentation Index

**Last Updated:** January 20, 2026

## 🎯 Start Here

New to the project? Read these in order:

1. [README.md](../README.md) - Project overview and quick start
2. [PHASED_IMPLEMENTATION.md](PHASED_IMPLEMENTATION.md) - Development strategy and phasing
3. [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) - Complete phase-by-phase plan
4. [DEVELOPMENT_GUIDE_UPDATE.md](DEVELOPMENT_GUIDE_UPDATE.md) - Comprehensive 5-level architecture

---

## 📚 Core Architecture

### The 5-Level System

The system operates across **five abstraction levels**:

**Level 0: Program Knowledge** (Phase 0 ✅)
- Input: Natural language brief
- Output: Normalized room data structure
- Status: Complete
- See: [PHASE_0_COMPLETE.md](PHASE_0_COMPLETE.md)

**Level 1: Room Nodes** (Phase 1 🔨)
- Individual rooms with dimensional variants
- No placement, just proportions
- Status: In progress
- See: [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) (Phase 1)

**Level 2: Program Zones** (Phase 2 📋)
- Elastic clusters (functional intentions)
- Capacity-based, no room geometry yet
- Status: Planned
- See: [PHASE_2_PLANNING.md](PHASE_2_PLANNING.md), [LEVEL_2_QUICK_REF.md](LEVEL_2_QUICK_REF.md)

**Level 3: Circulation Skeleton** (Phase 3 🔮)
- Topological graph of cores and corridors
- Status: Future
- See: [DEVELOPMENT_GUIDE_UPDATE.md](DEVELOPMENT_GUIDE_UPDATE.md) (Section on Level 3)

**Level 4: Geometry Fitting** (Phase 4 🔮)
- Actual room placement and packing
- Status: Future
- See: [DEVELOPMENT_GUIDE_UPDATE.md](DEVELOPMENT_GUIDE_UPDATE.md) (Section on Level 4)

---

## 📋 Implementation Guides

### Current Phase

- **[PHASED_IMPLEMENTATION.md](PHASED_IMPLEMENTATION.md)** - Phasing discipline and strategy
  - What to build now vs later
  - Scope boundaries for each phase
  - Rules for avoiding over-engineering

- **[IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)** - Detailed technical plan
  - Week-by-week breakdown
  - Component specifications
  - Success criteria for each phase

### Phase Documentation

- **[PHASE_0_COMPLETE.md](PHASE_0_COMPLETE.md)** ✅
  - Brief parsing with OpenAI
  - Data normalization
  - 184 rooms → 4,257 m²

- **[PHASE_2_PLANNING.md](PHASE_2_PLANNING.md)** 📋
  - Program Zones concept
  - Implementation strategy
  - Example zone derivations

- **[PHASE_2_PLANNING_COMPLETE.md](PHASE_2_PLANNING_COMPLETE.md)** 📋
  - Integration summary
  - Timeline and checklist
  - Phase relationships

### Quick References

- **[LEVEL_2_QUICK_REF.md](LEVEL_2_QUICK_REF.md)** - Visual guide to Program Zones
  - ASCII diagrams
  - Zone anatomy
  - UI mockups
  - Data flow charts

---

## 🔧 Technical Specifications

### Core Systems

- **[GRID_SYSTEM.md](GRID_SYSTEM.md)** - 0.1m grid alignment
  - Why 100mm grid
  - Implementation details
  - Validation rules

- **[AI_VARIANTS.md](AI_VARIANTS.md)** - AI variant generation
  - Why use AI for variants
  - Variant types (square, wide, deep, balanced)
  - Prompt engineering
  - Quality assurance

### Performance & Costs

- **[API_COSTS.md](API_COSTS.md)** - OpenAI cost tracking
  - Cost per brief (~$0.03)
  - Token optimization
  - Model selection (GPT-3.5-Turbo)

- **[OPTIMIZATION_SUMMARY.md](OPTIMIZATION_SUMMARY.md)** - Performance optimization
  - Batch processing (5 parallel requests)
  - Speed improvements (7.6x faster)
  - Cost reduction (10x cheaper)

---

## 🏗️ Architecture Principles

### Core Philosophy

**"Rooms are facts, Zones are intentions, Circulation is logic, Geometry is a consequence"**

### Key Rules

1. **Separation of Abstraction Levels**
   - One level active at a time
   - Clear boundaries between levels
   - No premature concretization

2. **Bidirectional Iteration**
   - Can backtrack if needed
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

---

## 📊 Project Status

### Completed ✅
- Phase 0: Brief parsing and normalization
- Type system for all 5 levels
- AI variant generation system
- Grid alignment validation
- Development tooling setup

### In Progress 🔨
- Phase 1: Room variant visualization
- Three.js viewport
- Left panel tree UI
- Variant selection interface

### Planned 📋
- Phase 2: Program Zones (after Phase 1 complete)
- Phase 3: Circulation Skeleton
- Phase 4: Geometry Fitting

### Current Stats
```
Rooms parsed:       184
Total area:         4,257 m²
Variants generated: 168
Average per room:   3.4 variants
Processing time:    36 seconds
Processing cost:    $0.03
```

---

## 🗂️ File Organization

```
docs/
├── README.md (this file)
├── DEVELOPMENT_GUIDE_UPDATE.md     # Comprehensive reference
├── PHASED_IMPLEMENTATION.md        # Strategy & discipline
├── IMPLEMENTATION_PLAN.md          # Detailed technical plan
├── PHASE_0_COMPLETE.md            # Phase 0 summary
├── PHASE_2_PLANNING.md            # Phase 2 strategy
├── PHASE_2_PLANNING_COMPLETE.md   # Phase 2 integration
├── LEVEL_2_QUICK_REF.md           # Visual reference
├── GRID_SYSTEM.md                 # Technical spec
├── AI_VARIANTS.md                 # AI system docs
├── API_COSTS.md                   # Cost tracking
├── OPTIMIZATION_SUMMARY.md        # Performance docs
└── archive/                       # Outdated docs (historical)
    ├── README.md                  # Archive explanation
    ├── PART_0.md                  # Old architecture (3-scale)
    ├── PART_1.md                  # Old room scale
    ├── PART_2.md                  # Old function groups
    ├── PART_3.md                  # Old building scale
    ├── PART_4.md                  # Old debug modes
    ├── INDEX.md                   # Old index
    └── UI_LAYOUT.md               # Old UI spec
```

---

## 🔍 Finding Information

**"How do I...?"**

| Question | Document |
|----------|----------|
| Understand the overall vision | [DEVELOPMENT_GUIDE_UPDATE.md](DEVELOPMENT_GUIDE_UPDATE.md) |
| Know what to build now | [PHASED_IMPLEMENTATION.md](PHASED_IMPLEMENTATION.md) |
| Get implementation details | [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) |
| Learn about Program Zones | [PHASE_2_PLANNING.md](PHASE_2_PLANNING.md) |
| See visual examples | [LEVEL_2_QUICK_REF.md](LEVEL_2_QUICK_REF.md) |
| Understand the grid system | [GRID_SYSTEM.md](GRID_SYSTEM.md) |
| Learn about AI variants | [AI_VARIANTS.md](AI_VARIANTS.md) |
| Check costs and performance | [OPTIMIZATION_SUMMARY.md](OPTIMIZATION_SUMMARY.md) |
| See what's been completed | [PHASE_0_COMPLETE.md](PHASE_0_COMPLETE.md) |

**"What's the difference between...?"**

| Concept A | Concept B | Key Difference |
|-----------|-----------|----------------|
| Room Node | Program Zone | Room = individual space; Zone = functional cluster |
| Level 1 | Level 2 | L1 = room dimensions; L2 = zone capacities |
| Variant | Strategy | Variant = specific dimensions; Strategy = organizational approach |
| Phase 1 | Phase 2 | P1 = room selection; P2 = zone grouping |
| Abstract | Concrete | Abstract = capacity/rules; Concrete = geometry/placement |

---

## 🚀 Quick Commands

```bash
# Parse brief
npm run parse-brief

# View brief summary
npm run summarize-brief

# Generate room variants
npm run generate-variants

# View variants
npm run view-variants

# Validate grid alignment
npm run validate-grid

# Start development server
npm run dev
```

---

## 💡 Design Patterns

### Variant Pattern
Every entity (room, zone, building) has:
- Multiple variants (2-6 options)
- One active variant (user selection)
- Preview capability (visual comparison)
- Lock mechanism (finalize choice)

### Abstraction Ladder
Progress through levels sequentially:
```
Level 0 (Brief) 
  ↓ produces
Level 1 (Rooms with variants)
  ↓ produces
Level 2 (Zones with strategies)
  ↓ produces
Level 3 (Circulation topology)
  ↓ produces
Level 4 (Concrete geometry)
```

### Human-in-the-Loop
At every level:
1. System generates options
2. User previews in 3D
3. User selects preferred variant
4. System locks selection
5. Move to next level

---

## 📖 Related Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Three.js Documentation](https://threejs.org/docs)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Need help?** Check the specific document for your area of interest, or start with [PHASED_IMPLEMENTATION.md](PHASED_IMPLEMENTATION.md) for strategic guidance.
