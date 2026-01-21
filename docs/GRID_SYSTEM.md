# Grid System - 0.1m Foundational Rule

## Overview

**All dimensions in the Rhino Layout Generator are snapped to a 0.1m (100mm) grid.**

This foundational rule ensures:
- ✅ Predictable, buildable dimensions
- ✅ Avoids floating point precision issues  
- ✅ Aligns with standard construction practices (100mm module)
- ✅ Simplifies validation and comparison logic
- ✅ Enables efficient variant generation

## Implementation

### Core Constants
```typescript
export const GRID_UNIT = 0.1; // 100mm
```

### Snapping Functions

All dimensional values are processed through `snapToGrid()`:
```typescript
snapToGrid(3.14159) // → 3.1m
snapToGrid(5.67)    // → 5.7m
snapToGrid(2.44)    // → 2.4m
```

### Validation

The system validates that all dimensions are grid-aligned:
```bash
npm run validate-grid
```

**Current Status:** ✅ All 49 room types validated (184 instances, 4,257m²)

## Application Across Scales

### Room Scale (Grain)
- Area targets: snapped to 0.1m²
- Width/depth ranges: snapped to 0.1m
- All generated variants: grid-aligned dimensions

### Group Scale (Mid)
- Group envelopes: grid-aligned
- Circulation areas: calculated from grid dimensions
- Room positions: snapped to grid

### Building Scale (Macro)
- Floor-to-floor heights: grid-aligned
- Core dimensions: grid-aligned
- Building footprint: grid-aligned

## Special Cases

### Small Rooms (< 6m²)
For storage, toilets, and utility spaces:
- Minimum dimension: **1.0m** (for 2m² closets)
- Still maintains 0.1m grid alignment
- Example: `1.0m × 2.0m = 2.0m²` ✓

### Standard Rooms (≥ 6m²)
- Minimum dimension: **2.4m** (buildable room size)
- Typical increment: **1.0m** steps
- Example: `3.0m × 4.5m = 13.5m²` ✓

## Usage in Code

### Snapping Values
```typescript
import { snapToGrid } from './core/grid';

const width = snapToGrid(userInput);
const area = snapToGrid(width * depth);
```

### Generating Ranges
```typescript
import { gridRange } from './core/grid';

// Generate options: 3.0, 3.5, 4.0, 4.5, 5.0
const widthOptions = gridRange(3.0, 5.0, 5); // step = 5 grid units = 0.5m
```

### Formatting Display
```typescript
import { formatDimension } from './core/grid';

formatDimension(3.0) // → "3m"
formatDimension(3.5) // → "3.5m"
formatDimension(3.1) // → "3.1m"
```

## Benefits for Phase 1+

### Room Variant Generation
- Generate variants in clean 0.5m or 1.0m steps
- Example: 3.0m, 3.5m, 4.0m, 4.5m, 5.0m
- No arbitrary decimals like 3.73m or 4.21m

### Three.js Visualization  
- Clean coordinates for geometry
- Easier snapping and alignment
- Predictable bounding boxes

### User Selection
- Dimensions easy to read and compare
- "5.5m × 6.0m" vs "5.473m × 6.219m"
- Professional presentation

## Testing

### Validation Tools
```bash
# Parse brief with grid snapping
npm run parse-brief

# Validate all dimensions
npm run validate-grid

# View statistics
npm run summarize-brief
```

### Example Output
```
✅ All dimensions aligned to 0.1m grid!

📐 SAMPLE DIMENSIONS:
   Living/bedroom: 30m² (24m²-36m²)
   Width: 3.8m-13.7m  ← Clean 0.1m increments
   Depth: 3.8m-13.7m  ← No floating point errors
```

---

**Status:** ✅ Implemented and validated across all parsed brief data  
**Next:** Use in Phase 1 room variant generator
