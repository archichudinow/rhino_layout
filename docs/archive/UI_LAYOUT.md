# UI Layout Specification

## Phase 1: Room Scale Interface

### Overview

Two-column split-panel design for room variant selection.

```
┌─────────────────────────────────────────────────────────┐
│  Left Panel (30%)      │  Right Panel (70%)             │
│  ──────────────────    │  ──────────────────────        │
│  📁 Rooms              │  ┌──────────────────────┐      │
│    └─ Living/bedroom   │  │                      │      │
│        ├─ var-1        │  │   Three.js Viewport  │      │
│        ├─ var-2 ✓      │  │   (3D Preview)       │      │
│        └─ var-3        │  │                      │      │
│    └─ Shared living    │  │   • White background │      │
│        ├─ var-1        │  │   • Orbit controls   │      │
│        └─ var-2        │  │   • Highlighted      │      │
│  📁 Function Groups    │  │     facade_edge      │      │
│    └─ (placeholder)    │  │   • Highlighted      │      │
│  📁 Building Variants  │  │     access_edge      │      │
│    └─ (placeholder)    │  └──────────────────────┘      │
│                        │  ┌──────────────────────┐      │
│                        │  │  Info Panel          │      │
│                        │  │  • Name              │      │
│                        │  │  • Quantity          │      │
│                        │  │  • Sizes (W×D)       │      │
│                        │  │  • Area              │      │
│                        │  │  • Notes             │      │
│                        │  └──────────────────────┘      │
└─────────────────────────────────────────────────────────┘
```

---

## Left Panel (30% width)

### Nested Folder Tree Structure

**Purpose:** Navigate and select rooms/variants using hierarchical tree navigation

**Structure:**
```
📁 Rooms (root folder, always visible)
  ├─ 📄 Room Name 1
  │   ├─ ✓ variant-1 (locked)
  │   ├─ • variant-2 (available)
  │   └─ • variant-3 (available)
  ├─ 📄 Room Name 2
  │   ├─ ✓ variant-1 (locked)
  │   └─ • variant-2 (available)
  └─ ...

📁 Function Groups (Phase 2 placeholder)
  └─ (disabled/grayed out)

📁 Building Variants (Phase 3 placeholder)
  └─ (disabled/grayed out)
```

**Interactions:**
- Click folder icon → expand/collapse
- Click variant leaf → load in 3D viewport + show details in info panel
- Checkmark (✓) appears when variant is locked
- Selected variant is highlighted in tree
- Keyboard navigation: arrow keys to move, Enter to select, Space to lock

**Visual States:**
- **Default:** Gray text, regular weight
- **Hovered:** Blue highlight, cursor pointer
- **Selected:** Blue background, white text
- **Locked:** Checkmark icon, green accent

---

## Right Panel Top (70% height)

### Three.js 3D Viewport

**Purpose:** Preview selected room variant in 3D with edge highlighting

**Features:**
- **White background** for clean architectural presentation
- **Orbit controls** (rotate, pan, zoom)
- **Room rectangle** rendered as 2D shape in 3D space
- **facade_edge** highlighted (thicker red line)
- **access_edge** highlighted (dashed green line)
- **Grid reference** at 0.1m intervals (subtle gray)
- **Billboard label** showing dimensions (width × depth)

**Camera:**
- Orthographic projection (architectural view)
- Default: top-down view (plan)
- Can orbit to isometric angles

**Rendering:**
- Room surface: light gray fill (#F0F0F0)
- facade_edge: red solid line, 3px width (#E74C3C)
- access_edge: green dashed line, 2px width (#2ECC71)
- Other edges: dark gray solid line, 1px width (#333333)

**Controls:**
- Left click drag: rotate/orbit
- Right click drag: pan
- Scroll: zoom
- Double-click: reset camera to default

---

## Right Panel Bottom (30% height)

### Info Panel

**Purpose:** Display detailed information about selected variant

**Fields displayed:**
1. **Name:** Room name + variant ID
   - Example: "Living/bedroom 1-bed incl. bathroom (var-2)"
   
2. **Quantity:** Number of instances needed in building
   - Example: "80 units"
   
3. **Sizes:** Width × Depth in meters
   - Example: "3.8m × 7.9m"
   
4. **Area:** Total area in square meters
   - Example: "30.0m²"
   
5. **Notes:** AI-generated notes describing the variant
   - Example: "Wide/shallow layout - maximizes facade exposure"

**Layout:**
- Clean table/grid layout
- Labels in regular weight, left-aligned
- Values in bold, right-aligned
- White background
- Light gray borders between fields
- Scrollable if content overflows

**Actions:**
- **Lock button:** Large prominent button at bottom
  - Unlocked state: Blue "Lock Variant" button
  - Locked state: Green "Unlock Variant" button
- Keyboard shortcut: Space bar to toggle lock

---

## Responsive Behavior

### Desktop (≥1920px)
- Left panel: 30% width (576px)
- Right panel: 70% width (1344px)
- Info panel: 30% height (~300px)
- Viewport: 70% height (~700px)

### Laptop (1280px - 1920px)
- Maintain 30/70 split
- Scale fonts appropriately
- Reduce 3D grid density

### Tablet (768px - 1280px)
- Left panel: 35% width
- Right panel: 65% width
- Consider collapsible left panel

### Mobile (<768px)
- Not supported in Phase 1
- Consider stacked layout in future

---

## Future Phases

### Phase 2: Function Groups
- Left panel: Function Groups folder becomes active
- Shows grouped rooms with circulation
- Similar tree structure: groups → variants → rooms

### Phase 3: Building Scale
- Left panel: Building Variants folder becomes active
- Shows multi-floor assemblies
- Tree structure: buildings → floors → groups → rooms

---

## Technical Stack

- **Tree Component:** Custom React component or library (react-arborist)
- **3D Viewport:** react-three-fiber + drei
- **State Management:** Zustand
- **Styling:** CSS Modules or Tailwind CSS
- **Icons:** Emoji or lucide-react

---

## Accessibility

- Keyboard navigation throughout
- ARIA labels for screen readers
- Focus indicators on all interactive elements
- Color contrast meets WCAG AA standards
- Resizable panels (future enhancement)
