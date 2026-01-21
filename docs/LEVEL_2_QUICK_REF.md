# Level 2 Quick Reference
**Program Zones (Elastic Clusters)**

## Visual Concept

```
┌─────────────────────────────────────────────────────────────┐
│                  LEVEL 1 → LEVEL 2 TRANSITION               │
│                                                             │
│  FROM (Level 1):                TO (Level 2):              │
│                                                             │
│  🏠 Individual Rooms            📦 Functional Zones         │
│  - 184 separate entities        - 4-6 logical groupings    │
│  - Each with variants           - Each with strategies     │
│  - No position yet              - Still no position        │
│  - Dimensional (W×D)            - Capacity-based (area)    │
│                                                             │
│  [bedroom] [bedroom] [bedroom]  → [RESIDENTIAL ZONE]       │
│  [living]  [kitchen] [storage]     (80 units, 4 floors)   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Zone Anatomy

```
╔═══════════════════════════════════════════════════════════╗
║  PROGRAM ZONE: Residential Core                          ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  IDENTITY:                                                ║
║  • ID: "zone-residential-core"                           ║
║  • Function: residential                                 ║
║  • Name: "Residential Living Units"                      ║
║                                                           ║
║  CAPACITY:                                                ║
║  • Net area:     2,400 m² (usable room space)           ║
║  • Circulation:    840 m² (35% buffer)                   ║
║  • Gross area:   3,240 m² (total)                        ║
║                                                           ║
║  CONFIGURATION:                                           ║
║  • Allowed levels: [3, 4, 5] floors                      ║
║  • Preferred:      4 floors                              ║
║                                                           ║
║  REQUIREMENTS:                                            ║
║  • Daylight: 90% (most of zone needs windows)           ║
║  • Noise:    quiet                                       ║
║                                                           ║
║  ELASTIC PROPERTIES:                                      ║
║  • Can stretch:  No                                      ║
║  • Can split:    Yes (into 2-3 sub-zones)               ║
║  • Can stack:    Yes (repeat floor plate)               ║
║                                                           ║
║  ROOM TYPES ALLOWED:                                      ║
║  • living_bedroom                                        ║
║  • bathroom                                              ║
║  • storage                                               ║
║                                                           ║
║  VARIANTS (Strategies):                                   ║
║  ┌─────────────────────────────────────────┐            ║
║  │ Variant 1: STACKED                      │            ║
║  │ • 4 floors × 600m² footprint            │            ║
║  │ • Aspect ratio: 0.8 - 1.5               │            ║
║  │ • Strategy: Compact vertical tower      │            ║
║  └─────────────────────────────────────────┘            ║
║  ┌─────────────────────────────────────────┐            ║
║  │ Variant 2: SPLIT                        │            ║
║  │ • 3 floors × 800m² footprint            │            ║
║  │ • Aspect ratio: 1.0 - 2.5               │            ║
║  │ • Strategy: Divide into 2 buildings     │            ║
║  └─────────────────────────────────────────┘            ║
║                                                           ║
║  ❌ DOES NOT CONTAIN:                                     ║
║  • Specific room positions                               ║
║  • Exact width/depth dimensions                          ║
║  • Corridor layouts                                      ║
║  • Building coordinates                                  ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

---

## Variant Strategies

### 1. COMPACT
```
High, narrow footprint
Minimize land use

   ┌──┐
   │ 5│
   │ 4│
   │ 3│
   │ 2│
   │ 1│
   └──┘
```

### 2. LINEAR
```
Long, single-level
Maximize facade

┌────────────────┐
│       1        │
└────────────────┘
```

### 3. SPLIT
```
Divide into sub-zones
Separate functions

┌─────┐    ┌─────┐
│  A  │    │  B  │
└─────┘    └─────┘
```

### 4. STACKED
```
Replicate floor plates
Efficient circulation

   ┌────┐
   │ 4  │
   ├────┤
   │ 3  │
   ├────┤
   │ 2  │
   ├────┤
   │ 1  │
   └────┘
```

### 5. COURTYARD
```
Wrap around open space
Maximize daylight

   ┌─┬─┐
   │ ○ │
   └─┴─┘
```

---

## 3D Visualization

### Zone Rendering:
```
     ┌─────────────────┐
    ╱                 ╱│  ← Translucent volume
   ╱  RESIDENTIAL    ╱ │  
  ╱    CORE         ╱  │  • Color: Blue (#4A90E2)
 ╱   4 floors      ╱   │  • Opacity: 30%
╱_________________╱    │  • Height: 4 × 3.0m = 12m
│                 │    │
│                 │    │  
│  ┌───────────┐  │   ╱  ← Inner net area
│  │ Net: 2400 │  │  ╱   
│  │ m² usable │  │ ╱    ← Outer circulation halo
│  └───────────┘  │╱     
│_________________│      

Proportions: 0.8-1.5 aspect ratio
Footprint:   600m² per floor
```

### Circulation Buffer:
```
╔═════════════════════════════╗
║░░░░░░░░░░░░░░░░░░░░░░░░░░░░░║  ← Hatched halo (circulation)
║░░┌───────────────────┐░░░░░║
║░░│                   │░░░░░║
║░░│   Net Usable      │░░░░░║  ← Solid core (rooms)
║░░│   Area            │░░░░░║
║░░│   2400 m²         │░░░░░║
║░░│                   │░░░░░║
║░░└───────────────────┘░░░░░║
║░░░░░░░░░░░░░░░░░░░░░░░░░░░░░║
╚═════════════════════════════╝
```

### Elastic Indicators:
```
STRETCH:          SPLIT:           STACK:
<─────────>       ┌────┬────┐      ┌────┐
│ ZONE    │       │ A  │ B  │      │  3 │──┐
<─────────>       └────┴────┘      ├────┤  │
                                   │  2 │  │
                                   ├────┤  │
                                   │  1 │──┘
                                   └────┘
```

---

## Data Flow

```
PHASE 0                    PHASE 1                    PHASE 2
━━━━━━━                    ━━━━━━━                    ━━━━━━━

brief.md                   RoomNode[]                 ProgramZoneNode[]
   ↓                          ↓                          ↓
OpenAI                     Variant                    Zone Variant
Parser                     Generator                  Generator
   ↓                          ↓                          ↓
normalized-                room-variants              zone-variants
brief.json                 .json                      .json

184 room types          184 rooms with           4-6 zones with
• Categories            3-4 variants             2-4 strategies
• Area targets          • Dimensions             • Floor counts
• Requirements          • Proportions            • Capacities
                        • No position            • No position
```

---

## Key Differences: Room vs Zone

| Aspect         | Room (Level 1)        | Zone (Level 2)           |
|----------------|-----------------------|--------------------------|
| **Granularity**| Single space          | Group of spaces          |
| **Count**      | 184 instances         | 4-6 zones                |
| **Dimensions** | Exact W×D (meters)    | Aspect ratio ranges      |
| **Area**       | Precise target        | Aggregate capacity       |
| **Variants**   | 3-4 dimensional opts  | 2-4 strategic opts       |
| **Position**   | ❌ None yet           | ❌ None yet              |
| **Geometry**   | Rectangle             | Abstract envelope        |
| **Contains**   | Just itself           | Room type categories     |
| **Elastic**    | Fixed dimensions      | Can stretch/split/stack  |

---

## UI Layout (Phase 2)

```
┌────────────────────────────────────────────────────────────┐
│  LEFT PANEL (30%)      │  RIGHT PANEL (70%)                │
│  ─────────────────     │  ─────────────────────            │
│                        │                                    │
│  📁 Rooms              │  ┌──────────────────────────────┐ │
│    └─ Living/bedroom   │  │                              │ │
│        ├─ var-1 ✓      │  │   THREE.JS VIEWPORT          │ │
│        └─ var-2        │  │                              │ │
│                        │  │   [Zone visualization]       │ │
│  📁 Program Zones ◀────┼──┼─ NEW IN PHASE 2              │ │
│    📦 Residential Core │  │                              │ │
│       ├─ var-1 ✓       │  │   • Translucent volumes      │ │
│       ├─ var-2         │  │   • Stacking shown           │ │
│       └─ var-3         │  │   • Circulation halos        │ │
│    📦 Shared Facilities│  │   • Elastic indicators       │ │
│       └─ var-1         │  │                              │ │
│    📦 Staff Spaces     │  └──────────────────────────────┘ │
│       └─ var-1         │  ┌──────────────────────────────┐ │
│    📦 Support Services │  │  INFO PANEL                  │ │
│       ├─ var-1         │  │  ────────────────            │ │
│       └─ var-2         │  │  Zone: Residential Core      │ │
│                        │  │  Strategy: Stacked           │ │
│  📁 Circulation        │  │                              │ │
│    └─ (Phase 3)        │  │  Net:  2,400 m²             │ │
│                        │  │  Circ:   840 m² (35%)       │ │
│                        │  │  Gross: 3,240 m²            │ │
│                        │  │                              │ │
│                        │  │  Floors: 4 × 600m² each     │ │
│                        │  │  Aspect: 0.8 - 1.5          │ │
│                        │  │                              │ │
│                        │  │  Daylight: 90% required     │ │
│                        │  │  Noise: Quiet               │ │
│                        │  │                              │ │
│                        │  │  Can stack: Yes             │ │
│                        │  │  Can split: Yes             │ │
│                        │  └──────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

---

## Implementation Timeline

```
WEEK 4: Data Model & Derivation
├─ Day 1-2: Define types ✅ (done)
├─ Day 3:   Analyze brief to identify zones
├─ Day 4:   Calculate zone areas
└─ Day 5:   Determine elastic properties

WEEK 5: Variant Generation
├─ Day 1:   Compact strategy generator
├─ Day 2:   Linear strategy generator
├─ Day 3:   Split strategy generator
├─ Day 4:   Stacked strategy generator
└─ Day 5:   Courtyard strategy + validation

WEEK 6: Visualization
├─ Day 1-2: ZoneEnvelope3D component
├─ Day 3:   Circulation buffer rendering
├─ Day 4:   Elastic indicators
└─ Day 5:   Polish and testing

WEEK 7: UI & Integration
├─ Day 1-2: Zone tree in left panel
├─ Day 3:   Info panel for zones
├─ Day 4:   AI advisory system
└─ Day 5:   Validation and export
```

---

## Success Checklist

**Before starting Phase 2:**
- [ ] Phase 1 100% complete
- [ ] All rooms have variants
- [ ] Room selection UI working
- [ ] Room visualization tested

**Phase 2 milestones:**
- [ ] Zones derived from brief
- [ ] Zone variants generated
- [ ] Zone visualization working
- [ ] Zone selection UI complete
- [ ] AI advisory integrated
- [ ] All zones locked
- [ ] Export to JSON successful

**Phase 2 complete when:**
- [ ] User can see all zones
- [ ] User can preview zone strategies
- [ ] User can lock zone selections
- [ ] No room placement visible
- [ ] Ready for Phase 3 (circulation)

---

*Keep zones abstract. Don't try to solve room fitting yet. One level at a time.* ✨
