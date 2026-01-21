# Documentation Index

## Getting Started
- [README.md](../README.md) - Project overview and setup
- [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) - Complete development roadmap
- [UI_LAYOUT.md](UI_LAYOUT.md) - Detailed UI layout specification

## System Architecture
- [PART_0.md](PART_0.md) - Core system architecture and principles
- [PART_1.md](PART_1.md) - Room scale (grain) specification
- [PART_2.md](PART_2.md) - Function group scale (mid) specification
- [PART_3.md](PART_3.md) - Building scale (macro) specification
- [PART_4.md](PART_4.md) - Debug modes and AI integration rules

## Technical Documentation
- [GRID_SYSTEM.md](GRID_SYSTEM.md) - 0.1m grid system implementation
- [AI_VARIANTS.md](AI_VARIANTS.md) - AI-powered room variant generation
- [API_COSTS.md](API_COSTS.md) - Cost optimization strategies

## Project Status
- [PHASE_0_COMPLETE.md](PHASE_0_COMPLETE.md) - Phase 0 completion summary

## Knowledge Base

### Core Concepts

**Three-Scale Architecture:**
1. **Room Scale (Grain)** - Individual spaces with dimensional variants
2. **Function Group Scale (Mid)** - Rooms organized by circulation
3. **Building Scale (Macro)** - Multi-floor assembly with cores

**Foundational Principles:**
- Logic ≠ Geometry (data-driven, geometry for preview only)
- Human-in-the-loop (AI proposes, user decides)
- 0.1m grid alignment (all dimensions on 100mm module)
- Explorable variants (never auto-select)

### Key Systems

**Grid System:**
- All dimensions snap to 0.1m (100mm)
- Eliminates floating point errors
- Aligns with construction standards
- See [GRID_SYSTEM.md](GRID_SYSTEM.md)

**AI Variant Generation:**
- Uses GPT-3.5-Turbo for cost efficiency
- Batch processing (5 parallel requests)
- 3-4 variants per room (square, wide, deep, balanced)
- Fallback to geometric generation if needed
- See [AI_VARIANTS.md](AI_VARIANTS.md)

**Brief Parsing:**
- Extracts room requirements from natural language
- Normalizes into structured `RoomNode` data
- Infers functional requirements (daylight, etc.)
- Grid-snaps all dimensions

### Development Workflow

```bash
# 1. Parse architectural brief
npm run parse-brief

# 2. Validate grid alignment
npm run validate-grid

# 3. Generate AI-proposed variants
npm run generate-variants

# 4. View results
npm run view-variants
```

### Data Flow

```
brief.md (raw)
  ↓ AI parsing (GPT-3.5-Turbo)
normalized-brief.json (RoomNodes)
  ↓ AI variant generation (batched)
brief-with-variants.json (RoomNodes + Variants)
  ↓ Phase 1: 3D visualization
User selection → Locked variants
  ↓ Phase 2: Group assembly
GroupNodes with room layouts
  ↓ Phase 3: Building assembly
Complete multi-floor building
```

### Technology Stack

**Core:**
- TypeScript (type safety)
- React (UI framework)
- Three.js / react-three-fiber (3D visualization)
- Zustand (state management)

**Build:**
- Vite (fast dev server, HMR)
- tsx (TypeScript execution)

**AI:**
- OpenAI GPT-3.5-Turbo (cost-optimized)
- Batch processing (5 concurrent)
- JSON mode (structured output)

### File Organization

```
/workspaces/rhino_layout/
├── docs/                      # Documentation (this folder)
├── src/
│   ├── core/                  # Pure logic, no UI
│   │   ├── types.ts          # Data structures
│   │   ├── grid.ts           # Grid utilities
│   │   ├── validators.ts     # Validation logic
│   │   └── variantGenerator.ts # AI generation
│   └── tools/                 # CLI utilities
│       ├── parseBrief.ts     # Brief parser
│       ├── generateVariants.ts # Variant generator
│       └── ...
├── inputs/                    # Data files
│   ├── brief.md              # Raw input
│   ├── normalized-brief.json # Parsed data
│   └── brief-with-variants.json # With variants
└── package.json
```

### Common Commands

```bash
# Development
npm run dev              # Start dev server (Phase 1+)
npm run build            # Production build

# Brief Processing
npm run parse-brief      # Parse brief.md
npm run summarize-brief  # View statistics
npm run validate-grid    # Check grid alignment

# Variant Generation
npm run generate-variants # Generate AI variants
npm run view-variants    # View variant stats

# Examples
npm run grid-examples    # Grid system demo
```

### Best Practices

**When adding new rooms:**
1. Add to brief.md in tabular format
2. Run `npm run parse-brief` to normalize
3. Run `npm run validate-grid` to check
4. Run `npm run generate-variants` to create options

**When modifying dimensions:**
- Always use grid utilities (`snapToGrid`, `gridArea`)
- Never hardcode dimensions
- Validate with `validateRoomNode` or `validateRoomVariant`

**When working with AI:**
- Use GPT-3.5-Turbo for cost (not GPT-4o)
- Batch requests when possible
- Implement fallbacks for failures
- See [API_COSTS.md](API_COSTS.md)

### Troubleshooting

**"OPENAI_API_KEY not set"**
```bash
echo "OPENAI_API_KEY=your-key-here" > .env
```

**"Dimensions off-grid"**
- Run `npm run validate-grid`
- Re-parse brief: `npm run parse-brief`
- Check grid utilities usage

**"No variants generated"**
- Check API key and quota
- Review rejected variants in logs
- Fallbacks should auto-generate

---

**Last Updated:** Phase 0 Complete  
**Status:** Ready for Phase 1 (3D visualization)
