# Rhino Layout Generator - Complete Implementation Plan

## Current Status: Phase 0 Complete ✅

**Completed:**
- ✅ Project setup (TypeScript, React, Three.js, Vite)
- ✅ OpenAI integration (GPT-3.5-Turbo, batch processing)
- ✅ Brief parsing (natural language → structured data)
- ✅ 0.1m grid system (all dimensions aligned)
- ✅ AI room variant generator (3-4 optimal variants per room)
- ✅ Validation system (constraints, grid alignment)
- ✅ Cost optimization (~$0.03 per brief, 36s processing)
- ✅ Documentation organized in `/docs`

**Current State:**
- 49 room types parsed from brief
- 147 variants generated (3.0 avg per room)
- All dimensions grid-aligned to 0.1m
- Ready for Phase 1 implementation

---

## Phase 1: Room Scale Visualization & Selection (2-3 weeks)

### Goal
Enable users to view and select room variants in 3D before proceeding to group assembly.

### UI Layout Overview

**Split-panel design:**

```
┌─────────────────────────────────────────────────────┐
│  Left Panel (30%)      │  Right Panel (70%)         │
│  ──────────────────    │  ──────────────────────    │
│  📁 Rooms              │  ┌──────────────────────┐  │
│    └─ Living/bedroom   │  │                      │  │
│        ├─ var-1        │  │   Three.js Viewport  │  │
│        ├─ var-2 ✓      │  │   (3D Preview)       │  │
│        └─ var-3        │  │                      │  │
│    └─ Shared living    │  │   • White background │  │
│        ├─ var-1        │  │   • Orbit controls   │  │
│        └─ var-2        │  │   • Highlighted      │  │
│  📁 Function Groups    │  │     facade_edge      │  │
│    └─ (placeholder)    │  │   • Highlighted      │  │
│  📁 Building Variants  │  │     access_edge      │  │
│    └─ (placeholder)    │  └──────────────────────┘  │
│                        │  ┌──────────────────────┐  │
│                        │  │  Info Panel          │  │
│                        │  │  • Name              │  │
│                        │  │  • Quantity          │  │
│                        │  │  • Sizes (W×D)       │  │
│                        │  │  • Area              │  │
│                        │  │  • Notes             │  │
│                        │  └──────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

**Left Panel:** Nested folder tree structure
- Clicking on leaf nodes selects items to draw in 3D
- Tree structure: Rooms → room_name → variants
- Future: Function Groups and Building Variants folders

**Right Panel (Top 70%):** Three.js 3D viewport
- Shows selected room variant in 3D
- Simple orbit controls
- White background
- Highlights facade_edge and access_edge

**Right Panel (Bottom 30%):** Info panel
- Displays details for selected leaf node
- Shows: name, quantity, sizes, area, notes

---

### 1.1 Three.js Viewport Setup (Week 1, Days 1-3)

**Tasks:**
- [ ] Set up react-three-fiber canvas component
- [ ] Implement camera controls (OrbitControls)
- [ ] Add grid helper for reference
- [ ] Create lighting setup (ambient + directional)
- [ ] Implement responsive viewport sizing

**Deliverables:**
- Basic 3D viewport with camera controls
- Grid reference plane
- Proper lighting for shape visibility

**Technical Decisions:**
- Use `@react-three/fiber` for React integration
- Use `@react-three/drei` for helpers (OrbitControls, Grid)
- Orthographic camera for architectural views
- Grid at 1m spacing, highlighted at 5m

**File Structure:**
```
src/
├── components/
│   ├── Viewport.tsx           # Main 3D canvas
│   ├── CameraControls.tsx     # Camera setup
│   └── SceneSetup.tsx         # Lighting, grid
```

---

### 1.2 Room Rectangle Visualization (Week 1, Days 4-5)

**Tasks:**
- [ ] Create RoomGeometry component (2D rectangles)
- [ ] Implement facade edge highlighting (thicker line)
- [ ] Add access edge visualization (dashed line)
- [ ] Color-code by room category (client/general/supporting)
- [ ] Add hover effects (highlight on mouse over)

**Deliverables:**
- Rooms displayed as rectangles in 3D
- Visual distinction for edges (facade vs access)
- Color coding for quick identification

**Technical Decisions:**
- Use `LineSegments` for efficient rectangle rendering
- Different `LineDashedMaterial` for access edges
- Color palette: 
  - Client (blue): `#4A90E2`
  - General (green): `#7ED321`
  - Supporting (orange): `#F5A623`
- Hover: increase line width + add glow

**Component:**
```tsx
<RoomVariant
  variant={variant}
  roomCategory="client"
  isHovered={hoveredId === variant.id}
  isSelected={selectedId === variant.id}
/>
```

---

### 1.3 Billboard Labels (Week 2, Days 1-2)

**Tasks:**
- [ ] Implement 3D text labels (always face camera)
- [ ] Display: room name, dimensions, area
- [ ] Position labels above room rectangles
- [ ] Scale labels based on camera distance
- [ ] Add background for readability

**Deliverables:**
- Clear labels for each room variant
- Labels remain readable at all zoom levels
- Professional typography

**Technical Decisions:**
- Use `@react-three/drei` `<Text>` component
- Font: Arial or Inter for clarity
- Label format: `"Living Room\n5.5m × 6.0m\n33m²"`
- Billboard component from drei (always faces camera)

**Component:**
```tsx
<RoomLabel
  text={`${room.name}\n${variant.width}m × ${variant.depth}m\n${variant.area}m²`}
  position={[x, y + labelOffset, z]}
  fontSize={0.3}
/>
```

---

### 1.4 Left Panel Tree Structure UI (Week 2, Days 3-5)

**Tasks:**
- [ ] Create left panel with nested tree component
- [ ] Implement expandable/collapsible folder structure:
  - [ ] "Rooms" folder (root)
  - [ ] Room name nodes (expandable)
  - [ ] Variant leaf nodes (clickable)
- [ ] Add "Function Groups" folder (placeholder for Phase 2)
- [ ] Add "Building Variants" folder (placeholder for Phase 3)
- [ ] Implement variant selection (checkmark on selected)
- [ ] Highlight selected node in tree
- [ ] Auto-expand parent when variant selected
- [ ] Show lock icon next to locked variants

**Deliverables:**
- Nested folder tree navigation
- Click-to-select functionality
- Visual feedback for selection state
- Placeholder folders for future phases

**Technical Decisions:**
- Use Zustand for state management
- Panel fixed at 30% width on left side
- Tree icons: 📁 for folders, 📄 for room nodes, ✓ for locked variants
- Smooth expand/collapse animations
- Keyboard navigation support (arrow keys)

**State Structure:**
```typescript
interface RoomSelectionState {
  rooms: RoomNode[];
  selectedRoomId: string | null;
  hoveredVariantId: string | null;
  lockedRooms: Record<string, string>; // roomId -> variantId
  progress: { locked: number; total: number };
}
```

**UI Components:**
```tsx
<MainLayout>
  <LeftPanel width="30%">
    <TreeView>
      <FolderNode name="Rooms" expanded>
        <RoomNode name="Living/bedroom 1-bed">
          <VariantLeaf id="var-1" locked />
          <VariantLeaf id="var-2" selected />
          <VariantLeaf id="var-3" />
        </RoomNode>
        <RoomNode name="Shared living room">
          <VariantLeaf id="var-1" />
          <VariantLeaf id="var-2" />
        </RoomNode>
      </FolderNode>
      <FolderNode name="Function Groups" disabled>
        <PlaceholderNode />
      </FolderNode>
      <FolderNode name="Building Variants" disabled>
        <PlaceholderNode />
      </FolderNode>
    </TreeView>
  </LeftPanel>
  
  <RightPanel width="70%">
    <ViewportContainer height="70%">
      <ThreeJSCanvas>
        <RoomVariant3D highlighted />
      </ThreeJSCanvas>
    </ViewportContainer>
    
    <InfoPanel height="30%">
      <InfoField label="Name" value={selectedVariant.name} />
      <InfoField label="Quantity" value={selectedRoom.quantity} />
      <InfoField label="Sizes" value={`${variant.width}m × ${variant.depth}m`} />
      <InfoField label="Area" value={`${variant.area}m²`} />
      <InfoField label="Notes" value={variant.notes} />
    </InfoPanel>
  </RightPanel>
</MainLayout>
```

---

### 1.5 Info Panel (Week 2, Day 5)

**Tasks:**
- [ ] Create bottom info panel component (30% of right panel height)
- [ ] Display selected variant/room details:
  - [ ] Name (room name + variant ID)
  - [ ] Quantity (number of instances needed)
  - [ ] Sizes (width × depth in meters)
  - [ ] Area (total area in m²)
  - [ ] Notes (AI-generated notes from variant)
- [ ] Auto-update when selection changes
- [ ] Show empty state when nothing selected
- [ ] Style with clear typography and spacing

**Deliverables:**
- Info panel showing all relevant details
- Responsive layout
- Clear, readable presentation

**Technical Decisions:**
- Fixed height: 30% of right panel
- Scrollable if content overflows
- Clean table/grid layout for fields
- Highlight values in bold, labels in regular weight

---

### 1.6 Interactive Selection (Week 3)

**Tasks:**
- [ ] Implement variant selection on tree leaf click
- [ ] Show selected variant in 3D viewport with highlighted edges
- [ ] Update info panel with variant details
- [ ] Add lock/unlock button to info panel
- [ ] Click lock → commit selection → show checkmark in tree
- [ ] Keyboard shortcuts (Space to lock, Arrow keys to navigate)
- [ ] Export locked selections to JSON
- [ ] Validation: ensure all required rooms have locked variants

**Deliverables:**
- Fully interactive selection experience
- Lock/unlock functionality
- Export functionality for locked variants
- Validation before proceeding to Phase 2

**User Flow:**
1. User expands "Rooms" folder in left tree
2. Expands a room node → sees variant leaves
3. Clicks variant leaf → loads in 3D viewport + shows info panel
4. Views 3D preview with highlighted facade_edge and access_edge
5. Reviews details in info panel
6. Clicks lock button → checkmark appears in tree
7. Proceeds to next room
8. After all rooms locked → Export for Phase 2

**Export Format:**
```json
{
  "lockedVariants": {
    "room-1": "room-1-var-2",
    "room-2": "room-1-var-1",
    ...
  },
  "timestamp": "2026-01-20T...",
  "totalRooms": 49,
  "readyForPhase2": true
}
```

---

## Phase 2: Program Zones (Elastic Clusters) - LEVEL 2 (3-4 weeks)

### Core Principle
**"Zones are intentions, not geometry"**

> Program zones represent large functional intentions WITHOUT room detail.  
> Zones are rubber-like containers that can stretch, split, or stack.  
> **CRITICAL:** Zones DO NOT contain room geometry yet - only capacity and rules.

### Goal
Define abstract functional zones that will eventually contain rooms, but for now represent only:
- Functional intent (what happens here)
- Area capacity (how much space needed)
- Constraints (daylight, levels, circulation)
- Elastic properties (can this zone split/stack/stretch?)

---

### 2.1 Program Zone Data Model (Week 4, Days 1-2)

**Tasks:**
- [ ] Define `ProgramZoneNode` TypeScript interface
- [ ] Define `ZoneVariant` interface (different zoning strategies)
- [ ] Add zone properties: ID, name, function type
- [ ] Add area constraints: target, min, max
- [ ] Add circulation buffer ratio (20-40%)
- [ ] Add allowed levels (1, 2, or 3 floors)
- [ ] Add daylight ratio requirement (% of zone needing windows)
- [ ] Add noise level tolerance
- [ ] Add elastic shape flag (can stretch/split/stack)
- [ ] Add list of allowed room types (not instances)

**Deliverables:**
```typescript
interface ProgramZoneNode {
  id: string;
  name: string;
  function_type: 'residential' | 'shared' | 'services' | 'staff' | 'support';
  
  // Area (net usable, excluding circulation)
  target_area_net: number;
  area_min: number;
  area_max: number;
  
  // Circulation buffer (added on top of net area)
  circulation_ratio: number; // 0.20 = 20% circulation buffer
  
  // Multi-floor capability
  allowed_levels: number[]; // e.g., [1, 2, 3] means can be 1, 2, or 3 floors
  preferred_level: number;
  
  // Functional requirements
  daylight_ratio: number; // 0.0 to 1.0 (% of zone area needing facade access)
  noise_tolerance: 'quiet' | 'moderate' | 'noisy';
  
  // Room type compatibility (NOT specific room instances)
  allowed_room_categories: string[]; // e.g., ['bedroom', 'living_room', 'kitchen']
  
  // Elastic properties
  can_stretch: boolean;  // Can zone elongate?
  can_split: boolean;    // Can zone divide into sub-zones?
  can_stack: boolean;    // Can zone exist on multiple floors?
  
  // Adjacency preferences (for Phase 3)
  prefers_adjacent_to?: string[]; // IDs of other zones
  must_avoid?: string[];          // IDs of zones to separate from
  
  // Variants (different zoning strategies)
  variants: ZoneVariant[];
  activeVariantId?: string;
  
  notes?: string;
}

interface ZoneVariant {
  id: string;
  
  // Abstract envelope (intention, not geometry)
  target_footprint: number;  // Area per floor
  floor_count: number;       // How many levels this variant uses
  
  // Proportions (aspect ratio range, not exact dimensions)
  aspect_ratio_range: [number, number]; // e.g., [0.5, 2.0]
  preferred_aspect_ratio: number;
  
  // Capacity
  total_gross_area: number;  // Net area + circulation
  estimated_room_count: number;
  
  // Strategy description
  strategy: 'compact' | 'linear' | 'courtyard' | 'split' | 'stacked';
  
  notes?: string;
}
```

**Important - What NOT to include:**
- ❌ No `position: {x, y}` - zones don't have locations yet
- ❌ No `roomLayouts: RoomLayout[]` - rooms not assigned yet
- ❌ No exact dimensions (width, depth) - only ratios and areas
- ❌ No geometry objects - purely abstract

---

### 2.2 Zone Derivation from Brief (Week 4, Days 3-5)

**Goal:** Analyze normalized brief to identify logical functional zones

**Tasks:**
- [ ] Create zone analyzer tool (`src/tools/deriveZones.ts`)
- [ ] Group rooms by functional similarity (AI-assisted)
- [ ] Calculate aggregate area requirements per zone
- [ ] Identify shared characteristics (daylight, noise, access)
- [ ] Detect repetition patterns (e.g., 20x identical living units)
- [ ] Suggest circulation ratios based on zone type
- [ ] Generate 2-4 zoning strategies (variants)
- [ ] Validate zone viability (area feasibility, level distribution)

**Example Output:**
```typescript
// From brief with 80x living units + shared facilities
const derivedZones = [
  {
    id: "zone-residential-core",
    name: "Residential Living Units",
    function_type: "residential",
    target_area_net: 2400,  // 80 units × 30m² each
    circulation_ratio: 0.35, // 35% for corridors/stairs
    allowed_levels: [3, 4, 5],
    daylight_ratio: 0.9,
    allowed_room_categories: ["living_bedroom", "bathroom"],
    can_stack: true,
    can_split: true,
    variants: [
      {
        strategy: "stacked",
        floor_count: 4,
        target_footprint: 600, // 2400m² / 4 floors
        aspect_ratio_range: [0.5, 1.5]
      },
      {
        strategy: "split",
        floor_count: 3,
        target_footprint: 800,
        aspect_ratio_range: [1.0, 2.5]
      }
    ]
  },
  {
    id: "zone-shared-facilities",
    name: "Communal Living Spaces",
    function_type: "shared",
    target_area_net: 320,  // Kitchen, dining, lounges
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
];
```

**AI Integration (Advisory Only):**
- AI suggests logical groupings
- AI recommends circulation ratios
- AI identifies stacking opportunities
- **Human validates all suggestions**

---

### 2.3 Zone Variant Generator (Week 5)

**Tasks:**
- [ ] Create variant generator (`src/core/zoneVariantGenerator.ts`)
- [ ] Generate "compact" strategy (minimize footprint, stack vertically)
- [ ] Generate "linear" strategy (elongated single-level)
- [ ] Generate "split" strategy (divide into sub-zones)
- [ ] Generate "stacked" strategy (multi-floor replication)
- [ ] Generate "courtyard" strategy (wrap around open space)
- [ ] Calculate gross area for each variant (net + circulation)
- [ ] Validate against constraints (max levels, area limits)
- [ ] Score variants by efficiency metrics

**Variant Strategies Explained:**

**Compact:**
- Minimize footprint
- Stack vertically (use allowed_levels)
- Good for sites with limited land

**Linear:**
- Long, narrow footprint
- Single or double-loaded arrangement potential
- Good for maximizing facade access

**Split:**
- Divide zone into 2-3 sub-zones
- Useful for separating noisy/quiet functions
- Can be arranged with gaps between

**Stacked:**
- Replicate identical floor plates
- Common for repetitive programs (apartments)
- Efficient vertical circulation

**Courtyard:**
- Wrap around central open space
- Maximizes daylight and views
- Higher circulation ratio

**Deliverables:**
- 2-4 viable variants per zone
- Each variant has different spatial strategy
- All variants respect constraints
- Scoring metrics for comparison

---

### 2.4 Zone Visualization (Week 6)

**Goal:** Show zones as abstract "bubbles" or "envelopes" WITHOUT room detail

**Tasks:**
- [ ] Create `ZoneEnvelope3D` component
- [ ] Render zones as translucent volumes
- [ ] Show zone proportions (aspect ratio visualization)
- [ ] Indicate floor count (visual stacking)
- [ ] Color-code by function type
- [ ] Label with zone name and area
- [ ] Show circulation buffer as separate visual layer
- [ ] Animate elastic properties (pulse/stretch effect)
- [ ] Highlight daylight requirement (facade edge indication)

**Visual Language:**

**Zone Representation:**
- Translucent box (not solid)
- Proportions match aspect ratio range
- Height = floor count × 3.0m (standard floor height)
- Color by function:
  - Residential: Blue (#4A90E2)
  - Shared: Green (#7ED321)
  - Services: Orange (#F5A623)
  - Staff: Purple (#9013FE)
  - Support: Gray (#B8B8B8)

**Circulation Buffer:**
- Inner zone: solid color (usable net area)
- Outer halo: hatched pattern (circulation buffer)
- Width of halo = circulation_ratio × zone dimension

**Elastic Indicators:**
- `can_stretch`: Double-headed arrow overlay
- `can_split`: Dashed divider line through middle
- `can_stack`: Vertical layered effect

**Daylight Requirement:**
- Glow on edges (% of perimeter)
- Brighter glow = higher daylight_ratio

**Technical:**
```tsx
<ZoneEnvelope
  zone={programZone}
  variant={activeVariant}
  isSelected={selectedZoneId === zone.id}
  isHovered={hoveredZoneId === zone.id}
  showCirculationBuffer={true}
  showElasticIndicators={true}
/>
```

---

### 2.5 Zone Selection UI (Week 7)

**Tasks:**
- [ ] Add "Program Zones" folder to left panel tree
- [ ] List zones with variant counts
- [ ] Click zone → show all variants
- [ ] Click variant → preview in viewport
- [ ] Display zone metadata in info panel:
  - Function type
  - Target area (net + gross)
  - Circulation ratio
  - Allowed levels
  - Daylight ratio
  - Elastic properties
  - Allowed room types (list, not instances)
- [ ] Add variant comparison view (side-by-side)
- [ ] Lock zone variant selection
- [ ] Validate all zones locked before Phase 3

**Left Panel Structure:**
```
📁 Rooms (Phase 1)
   └─ ... (existing room tree)

📁 Program Zones (Phase 2)
   📦 Residential Core
      ├─ var-1: Stacked (4 floors) ✓
      ├─ var-2: Split (3 floors)
      └─ var-3: Compact (5 floors)
   📦 Shared Facilities
      ├─ var-1: Linear
      └─ var-2: Courtyard
   📦 Staff Spaces
      └─ var-1: Compact

📁 Circulation Skeleton (Phase 3 placeholder)
   └─ (not implemented yet)
```

**Info Panel Display:**
```
Zone: Residential Core
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Function: Residential
Strategy: Stacked

Area:
  Net:         2,400 m²
  Circulation: 840 m² (35%)
  Gross:       3,240 m²

Configuration:
  Floors:      4
  Footprint:   600 m² per floor
  Aspect:      0.8 - 1.5

Requirements:
  Daylight:    90% of zone
  Noise:       Quiet
  Can stack:   Yes
  Can split:   Yes

Allowed Room Types:
  • Living/bedroom
  • Bathroom
  • Storage

Estimated Capacity:
  ~80 rooms
```

---

### 2.6 AI Advisory Integration (Week 7)

**Goal:** Let AI suggest zone strategies, but NEVER decide

**Tasks:**
- [ ] AI analyzes brief to suggest logical zones
- [ ] AI recommends circulation ratios by zone type
- [ ] AI suggests adjacency preferences
- [ ] AI identifies stacking opportunities
- [ ] AI flags potential conflicts (noise, access)
- [ ] Display AI suggestions as optional recommendations
- [ ] User must explicitly accept/reject suggestions

**AI MAY:**
- ✅ Propose zone splits
- ✅ Suggest stacking strategies
- ✅ Recommend adjacency patterns
- ✅ Calculate optimal circulation ratios
- ✅ Identify functional conflicts

**AI MUST NOT:**
- ❌ Assign exact room geometry
- ❌ Place zones in building
- ❌ Finalize zone selections
- ❌ Override user choices
- ❌ Generate final layouts

**Technical Implementation:**
```typescript
// AI generates recommendations, not decisions
const aiRecommendation = {
  suggested_zones: [...],
  reasoning: "Based on brief analysis, residential units can be stacked...",
  confidence: 0.85,
  alternatives: [...]
};

// User reviews and accepts/modifies
const finalZones = userReviewZones(aiRecommendation);
```

---

### 2.7 Zone Export & Validation (Week 7)

**Tasks:**
- [ ] Validate all zones have locked variants
- [ ] Check total area matches brief requirements
- [ ] Verify circulation ratios are realistic (15-40%)
- [ ] Validate daylight requirements can be met
- [ ] Check level distribution is buildable
- [ ] Export zone configuration JSON
- [ ] Generate zone summary report
- [ ] Set Phase 2 complete flag

**Validation Rules:**
- All zones must have one locked variant
- Sum of zone net areas ≥ sum of room areas
- Circulation ratios between 15-40%
- Daylight zones have sufficient perimeter potential
- Total floor count is reasonable (typically 1-8 floors)

**Export Format:**
```json
{
  "phase": 2,
  "zones": [
    {
      "id": "zone-residential-core",
      "locked_variant_id": "var-1",
      "variant": {
        "strategy": "stacked",
        "floor_count": 4,
        "target_footprint": 600,
        "gross_area": 3240
      }
    }
  ],
  "metrics": {
    "total_net_area": 3500,
    "total_gross_area": 4725,
    "average_circulation_ratio": 0.35,
    "floor_range": [1, 4]
  }
}
```

---

### Phase 2 Success Criteria

**Must achieve before Phase 3:**
- [ ] All zones derived from brief
- [ ] Each zone has 2-4 valid variants
- [ ] All zones have locked variant selection
- [ ] Visualization clearly shows abstract zones (no rooms)
- [ ] Info panel displays all zone metadata
- [ ] Total capacity matches brief requirements
- [ ] Circulation ratios are validated
- [ ] AI recommendations provided (but not enforced)
- [ ] Export produces valid JSON for Phase 3
- [ ] User understands zones ≠ geometry yet

**What Phase 2 DOES NOT include:**
- ❌ Room placement within zones
- ❌ Exact zone positioning in building
- ❌ Corridor/core design
- ❌ Inter-zone connections
- ❌ Building massing
- ❌ Site placement

**These are Phase 3 & 4 concerns.**

---

## Phase 3: Building Scale (3-4 weeks)

### Goal
Assemble locked groups into multi-floor building with vertical circulation cores.

### 3.1 Core System (Week 8)

**Tasks:**
- [ ] Define CoreNode types (stairs, lifts, services)
- [ ] Implement core placement algorithm
- [ ] Validate core distances (travel distance rules)
- [ ] Ensure vertical continuity across floors
- [ ] Calculate core dimensions from capacity

**Deliverables:**
- Core placement system
- Distance validation
- Core dimension calculator

**Core Types:**
```typescript
const stairCore = {
  type: "stairs",
  width: 2.4, // min stair width
  depth: 3.6, // landing + stair
  capacity: 100, // people
  fireRating: "1-hour"
};
```

**Placement Rules:**
- Max travel distance: 45m to exit
- Min 2 stairs per floor (egress)
- Lifts: 1 per 200 occupants
- Service core: centralized, vertical continuity

---

### 3.2 Single Floor Assembly (Week 9)

**Tasks:**
- [ ] Implement group snapping algorithm
- [ ] Connect groups via access edges
- [ ] Place cores based on group layout
- [ ] Validate no overlaps
- [ ] Check all rooms accessible
- [ ] Optimize overall building footprint

**Deliverables:**
- Single-floor layout assembly
- Group arrangement algorithm
- Core integration
- Validation system

**Assembly Strategy:**
1. Place first group (largest or most constrained)
2. Snap adjacent groups to access edges
3. Insert circulation cores
4. Validate connections and distances
5. Optimize compactness

---

### 3.3 Multi-Floor Stacking (Week 10)

**Tasks:**
- [ ] Implement floor stacking logic
- [ ] Align cores vertically
- [ ] Support varied floor layouts (if groups allow)
- [ ] Calculate building height
- [ ] Validate structural alignment
- [ ] Check facade continuity for daylight rooms

**Deliverables:**
- Multi-floor building assembly
- Vertical core alignment
- Floor variation support
- Building metrics calculator

**Stacking Rules:**
- Cores must align vertically (±0.1m tolerance)
- Groups marked "stackable" can repeat
- Facade orientation consistency
- Structure grid alignment (columns on grid)

---

### 3.4 Building Visualization (Week 11)

**Tasks:**
- [ ] 3D building model rendering
- [ ] Floor switcher UI (view individual floors)
- [ ] Layer toggles:
  - Rooms
  - Groups
  - Cores
  - Circulation
  - Daylight analysis
- [ ] Section views (cut through building)
- [ ] Elevation views (facades)

**Deliverables:**
- Complete 3D building visualization
- Floor navigation
- Layer controls
- Multiple view modes

**View Modes:**
- Plan view (top-down per floor)
- Isometric (3D overview)
- Section (vertical cut)
- Elevation (facade views)

---

## Phase 4: Debug & Analysis Tools (2 weeks)

### Goal
Provide transparency and debugging capabilities for all scales.

### 4.1 Debug Visualizations (Week 12)

**Tasks:**
- [ ] Overlap detection display (show conflicts)
- [ ] Access graph visualization (connectivity)
- [ ] Circulation path highlighting
- [ ] Facade exposure analysis (daylight)
- [ ] Distance measurements
- [ ] Area calculations display

**Deliverables:**
- Comprehensive debug modes
- Problem detection and display
- Analysis overlays

**Debug Modes:**
- **Overlap:** Red highlights for overlapping geometry
- **Access:** Graph showing room → corridor → core paths
- **Circulation:** Heat map of movement efficiency
- **Daylight:** Show facade exposure per room
- **Metrics:** Display areas, distances, ratios

---

### 4.2 Variant Comparison (Week 13)

**Tasks:**
- [ ] Side-by-side scheme comparison
- [ ] Diff highlighting (what changed)
- [ ] Metric comparison table
- [ ] Cost estimation comparison
- [ ] Export comparison report

**Deliverables:**
- Scheme A vs Scheme B comparison
- Quantitative metrics
- Visual diff tool
- Exportable reports

---

## Phase 5: AI Enhancements (Ongoing)

### 5.1 AI-Assisted Suggestions

**Tasks:**
- [ ] AI scoring of room variants (rank by suitability)
- [ ] Group typology recommendations
- [ ] Core placement suggestions
- [ ] Layout optimization hints
- [ ] Building efficiency feedback

**Deliverables:**
- AI suggestions (not auto-applied)
- Scoring and ranking
- Reasoning explanations

**AI Integration Points:**
- Room selection: "This variant optimizes daylight"
- Group assembly: "Double-loaded saves 15% circulation"
- Building layout: "Core position reduces travel distance by 20%"

---

### 5.2 AI Notes & Documentation

**Tasks:**
- [ ] Generate design decision log
- [ ] Create building description
- [ ] Export specifications
- [ ] Compliance check suggestions

**Deliverables:**
- Auto-generated documentation
- Decision tracking
- Specification exports

---

## Technical Architecture

### State Management (Zustand)

```typescript
// stores/roomStore.ts
interface RoomStore {
  rooms: RoomNode[];
  selectedRoom: string | null;
  lockedVariants: Record<string, string>;
  selectRoom: (id: string) => void;
  lockVariant: (roomId: string, variantId: string) => void;
}

// stores/groupStore.ts
interface GroupStore {
  groups: GroupNode[];
  selectedGroup: string | null;
  lockedGroupLayouts: Record<string, string>;
}

// stores/buildingStore.ts
interface BuildingStore {
  building: BuildingLayout;
  currentFloor: number;
  activeLayers: string[];
}

// stores/uiStore.ts
interface UIStore {
  currentPhase: 'room' | 'group' | 'building';
  debugMode: boolean;
  activeDebugLayers: string[];
  viewMode: 'plan' | 'iso' | 'section';
}
```

---

### Component Hierarchy

```
App
├── Header (phase indicator, progress, settings)
│
├── MainLayout (split-panel container)
│   │
│   ├── LeftPanel (30% width, tree navigation)
│   │   └── TreeView
│   │       ├── FolderNode (Rooms)
│   │       │   └── RoomNode[]
│   │       │       └── VariantLeaf[]
│   │       ├── FolderNode (Function Groups) - Phase 2
│   │       │   └── GroupNode[] - placeholder
│   │       └── FolderNode (Building Variants) - Phase 3
│   │           └── BuildingNode[] - placeholder
│   │
│   └── RightPanel (70% width, viewport + info)
│       ├── ViewportContainer (70% height)
│       │   └── ThreeJSCanvas
│       │       ├── Scene (lighting, camera, grid)
│       │       ├── OrbitControls
│       │       └── Content (switches by phase)
│       │           ├── RoomVariant3D (Phase 1)
│       │           ├── GroupLayout3D (Phase 2)
│       │           └── BuildingLayout3D (Phase 3)
│       │
│       └── InfoPanel (30% height)
│           └── InfoFields (name, quantity, sizes, area, notes)
│
└── DebugPanel (overlay, all phases)
```

---

### Data Flow

```
Phase 1: Room Selection
brief-with-variants.json → Room visualization → User selects → locked-variants.json

Phase 2: Group Assembly
locked-variants.json → Group generator → Group visualization → User selects → locked-groups.json

Phase 3: Building Assembly
locked-groups.json → Building generator → Building visualization → User approves → building.json

Export
building.json → Rhino plugin / DXF / IFC / etc.
```

---

## Testing Strategy

### Phase 1 Testing
- [ ] Verify all 147 variants render correctly
- [ ] Test hover/selection interactions
- [ ] Validate lock/unlock functionality
- [ ] Check export format
- [ ] Test with various screen sizes

### Phase 2 Testing
- [ ] Test group layout algorithms on sample groups
- [ ] Verify circulation calculations
- [ ] Check daylight room facade access
- [ ] Validate overlap detection
- [ ] Test 3-5 variants per group

### Phase 3 Testing
- [ ] Test single floor assembly
- [ ] Test multi-floor stacking (2-4 floors)
- [ ] Verify core vertical alignment
- [ ] Check travel distance compliance
- [ ] Test floor navigation UI

### Integration Testing
- [ ] Complete workflow: Brief → Variants → Groups → Building
- [ ] Data persistence across phases
- [ ] Export/import at each phase
- [ ] Performance with large briefs (100+ rooms)

---

## Risk Assessment & Mitigation

### Technical Risks

**Risk 1: Performance with large datasets**
- **Impact:** Lag when rendering 200+ room variants
- **Mitigation:** 
  - Implement instancing for repeated geometries
  - Level of detail (LOD) based on zoom
  - Virtualized lists in UI panels
  - Lazy loading of non-visible floors

**Risk 2: Layout algorithm complexity**
- **Impact:** Difficult to generate valid group layouts
- **Mitigation:**
  - Start with simple templates
  - Use constraint-based solver (e.g., Choco)
  - Allow manual adjustment as fallback
  - Pre-defined group templates for common patterns

**Risk 3: AI cost with large briefs**
- **Impact:** High API costs for 500+ room briefs
- **Mitigation:**
  - Cache common room type variants
  - Skip AI for small utility rooms
  - Batch processing (already implemented)
  - Local fallback generation

**Risk 4: 3D visualization complexity**
- **Impact:** Difficult to understand complex multi-floor buildings
- **Mitigation:**
  - Multiple view modes (plan, iso, section)
  - Progressive disclosure (floor by floor)
  - Layer controls (show/hide elements)
  - Guided navigation (highlights, annotations)

### User Experience Risks

**Risk 1: Overwhelming number of choices**
- **Impact:** Decision fatigue, analysis paralysis
- **Mitigation:**
  - AI scoring/ranking to surface best options
  - "Quick select" mode with defaults
  - Save/load sessions
  - Comparison tools

**Risk 2: Learning curve**
- **Impact:** Users don't understand the interface
- **Mitigation:**
  - Interactive tutorial on first launch
  - Tooltips and help text
  - Sample projects to explore
  - Video walkthroughs

---

## Performance Targets

### Phase 1 (Room Scale)
- Initial load: < 2 seconds
- Variant rendering: < 100ms for 150 variants
- UI interactions: < 50ms response time
- Export: < 1 second

### Phase 2 (Group Scale)
- Group layout generation: < 5 seconds per group
- Visualization update: < 200ms
- Layout comparison: < 100ms

### Phase 3 (Building Scale)
- Building assembly: < 10 seconds for 4-floor building
- Floor switching: < 100ms
- 3D render: 60 FPS with 500+ objects

---

## Deployment Strategy

### Development Environment
- Local dev server (Vite)
- Hot module replacement (HMR)
- Source maps for debugging

### Production Build
- Static site generation
- Asset optimization (tree shaking, minification)
- CDN deployment
- Progressive web app (PWA) support

### Hosting Options
- **Option 1:** Vercel / Netlify (serverless)
- **Option 2:** AWS S3 + CloudFront
- **Option 3:** Self-hosted (Nginx)

---

## Future Enhancements (Phase 6+)

### Collaboration Features
- Multi-user editing
- Comment system
- Version control
- Design review mode

### Advanced AI
- Cost estimation
- Code compliance checking
- Energy analysis
- Structural optimization

### Export Formats
- Rhino .3dm
- AutoCAD .dwg
- IFC (Industry Foundation Classes)
- Revit integration
- PDF reports

### Analysis Tools
- Daylighting simulation
- Circulation analysis
- Space efficiency metrics
- Accessibility compliance

---

## Timeline Summary

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| **Phase 0** | ✅ Complete | Brief parsing, AI variants, grid system |
| **Phase 1** | 2-3 weeks | Room visualization & selection |
| **Phase 2** | 3-4 weeks | Group assembly & layouts |
| **Phase 3** | 3-4 weeks | Building assembly & multi-floor |
| **Phase 4** | 2 weeks | Debug tools & analysis |
| **Phase 5** | Ongoing | AI enhancements |
| **Total** | ~10-13 weeks | Complete MVP |

---

## Success Criteria

### Phase 1 Success
- ✅ All 147 variants displayed correctly
- ✅ User can select and lock all 49 rooms
- ✅ Export produces valid JSON for Phase 2
- ✅ Performance: < 2s load, 60 FPS interaction

### Phase 2 Success
- ✅ Generate 3-5 valid layouts per group
- ✅ No room overlaps
- ✅ All daylight rooms have facade access
- ✅ Circulation within acceptable ratios

### Phase 3 Success
- ✅ Assemble complete multi-floor building
- ✅ Cores aligned vertically
- ✅ Travel distances within limits
- ✅ All rooms accessible

### Overall Success
- ✅ User completes full workflow: Brief → Building
- ✅ Generates buildable layouts (grid-aligned, validated)
- ✅ Maintains human control (user decides, AI suggests)
- ✅ Produces exportable outputs
- ✅ Meets performance targets

---

## Questions for Review

1. **Phasing:** Does the 3-phase approach (Room → Group → Building) make sense, or should we combine any phases?

2. **Group Assembly:** Should we implement automatic grouping (AI suggests groups from brief) or manual grouping (user defines which rooms go together)?

3. **UI Approach:** Preference for panel layout - sidebar vs floating panels vs fullscreen mode switching?

4. **Export Priority:** Which export formats are most critical? Rhino integration? DXF? IFC?

5. **AI Role:** Should AI be more proactive (auto-suggest with user override) or passive (only when user requests)?

6. **Scope Adjustment:** Any features to add, remove, or defer to later phases?

7. **Testing:** Need for formal user testing sessions during development, or iterate based on your feedback?

8. **Performance:** Any specific performance requirements or constraints not covered?

---

**Status:** Ready for review and feedback  
**Next Step:** Your approval/modifications, then begin Phase 1 Week 1
