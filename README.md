# Rhino Layout Generator

A procedural architectural layout generator with human-in-the-loop selection, using Three.js for visualization.

## 🎯 Project Status: Phase 0 - Setup & OpenAI Integration ✅

### ✅ Completed
- [x] Project structure with TypeScript + React + Three.js
- [x] OpenAI SDK integration for brief parsing
- [x] Core data type definitions (RoomNode, GroupNode, etc.)
- [x] Brief parser tool that normalizes architectural briefs into structured data
- [x] **0.1m (100mm) grid system** - All dimensions snap to grid
- [x] Validation tools for grid alignment and room constraints
- [x] **AI room variant generator** - Proposes 3-4 optimal proportions per room

### 📊 Current Capabilities

**Brief Parser** - Converts natural language architectural briefs into normalized `RoomNode` data:
```bash
npm run parse-brief
```

**Input:** [inputs/brief.md](inputs/brief.md) - Tabular facility requirements  
**Output:** [inputs/normalized-brief.json](inputs/normalized-brief.json) - Structured room data ready for pipeline

**AI Variant Generator** - Creates 3-4 optimal room proportions using GPT-3.5-Turbo:
```bash
npm run generate-variants  # ~36s for 49 rooms, ~$0.03 cost
```

**Input:** Normalized brief with room constraints  
**Output:** [inputs/brief-with-variants.json](inputs/brief-with-variants.json) - Rooms with AI-proposed variants

**Example Output:**
```json
{
  "rooms": [
    {
      "id": "room-1",
      "name": "Living/bedroom 1-bed incl. bathroom",
      "area_target": 30,
      "area_min": 24,
      "area_max": 36,
      "requires_daylight": true,
      "category": "client",
      "quantity": 80,
      "notes": "Each living group has its own front door"
    }
  ]
}
```

## 🏗️ Architecture

### Three-Scale System
1. **Room Scale (Grain)** - Generate room variants with dimensional constraints
2. **Function Group Scale (Mid)** - Arrange rooms into circulation groups
3. **Building Scale (Macro)** - Assemble groups with cores across floors

### Core Principles
- **Logic ≠ Geometry** - All reasoning in data structures, geometry only for preview
- **Human-in-the-loop** - AI proposes, user selects & locks variants
- **Explorable Variants** - Never auto-pick, always show options
- **3D Debuggable** - Every scale has preview mode
- **0.1m Grid System** - All dimensions aligned to 100mm construction grid

## 🚀 Next Steps: Phase 1

### Phase 1: Room Scale Implementation
- [x] AI room variant generator (3-4 optimal variants per room) ✅
- [ ] Basic Three.js viewport setup
- [ ] Room rectangle visualization with labels
- [ ] Simple React UI for variant selection
- [ ] Interactive variant preview and locking

## 📦 Installation

```bash
npm install
```

## 🔐 Environment Setup

Create `.env` file:
```bash
OPENAI_API_KEY=your_api_key_here
```

## 🛠️ Development

```bash
# Parse brief (Phase 0)
npm run parse-brief

# View brief statistics
npGenerate AI-proposed room variants
npm run generate-variants

# View variant statistics
npm run view-variants

# m run summarize-brief

# Validate grid alignment
npm run validate-grid

# See grid system examples
npm run grid-examples

# Start dev server (Phase 1+)
npm run dev

# Build for production
npm run build
```

## 📚 Documentation

- [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md) - **Complete development roadmap**
- **[docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md)** - Complete development roadmap (Phases 1-5)
- **[docs/UI_LAYOUT.md](docs/UI_LAYOUT.md)** - Detailed UI layout specification (split-panel design)
- [docs/INDEX.md](docs/INDEX.md) - Documentation index & knowledge base
- [docs/PART_0.md](docs/PART_0.md) - System architecture overview
- [docs/PART_1.md](docs/PART_1.md) - Room scale specification
- [docs/PART_2.md](docs/PART_2.md) - Function group scale
- [docs/PART_3.md](docs/PART_3.md) - Building scale
- [docs/PART_4.md](docs/PART_4.md) - Debug modes & AI integration
- [docs/GRID_SYSTEM.md](docs/GRID_SYSTEM.md) - 0.1m grid documentation
- [docs/AI_VARIANTS.md](docs/AI_VARIANTS.md) - AI variant generation system
- [docs/API_COSTS.md](docs/API_COSTS.md) - Cost optimization guide

## 📁 Project Structure

```
/workspaces/rhino_layout/
├── src/
│   ├── core/
│   │   ├── types.ts              # TypeScript type definitions
│   │   ├── grid.ts               # 0.1m grid system utilities
│   │   ├── validators.ts         # Dimension validation
│   │   └── variantGenerator.ts   # AI-powered variant generation
│   └── tools/
│       ├── parseBrief.ts         # OpenAI brief parser
│       ├── summarizeBrief.ts     # Statistics viewer
│       ├── validateGrid.ts       # Grid alignment checker
│       ├── gridExamples.ts       # Grid system examples
│       ├── generateVariants.ts   # AI variant generator tool
│       └── viewVariants.ts       # Variant statistics viewer
├── inputs/
│   ├── brief.md                  # Raw architectural brief
│   ├── normalized-brief.json     # Parsed room data
│   └── brief-with-variants.json  # Rooms with AI-proposed variants
├── GRID_SYSTEM.md                # Grid system documentation
├── AI_VARIANTS.md                # AI variant generation docs
├── package.json
└── vite.config.ts
```

## 🧪 Testing Strategy

Each phase will be tested incrementally:
- **Phase 0:** ✅ Brief parsing accuracy
- **Phase 1:** Room variant generation & selection
- **Phase 2:** Group assembly & validation
- **Phase 3:** Multi-floor building composition
- **Phase 4:** Debug visualization tools

---

**Built with:** React • TypeScript • Three.js • OpenAI • Vite
