# AI Room Variant Generator

## Overview

Uses OpenAI **GPT-3.5-Turbo** with **batch processing** to propose **3-4 optimal room proportion variants** for each room based on:
- Architectural best practices
- Room function and ergonomics
- Daylight requirements
- Circulation patterns
- Construction standards

**Performance:** ~36 seconds for 49 rooms (batch size: 5 parallel requests)  
**Cost:** ~$0.03 per complete brief (~10x cheaper than GPT-4o)

## Why AI-Generated Variants?

Instead of brute-force generating all possible dimension combinations, we use AI to propose **smart, well-considered options**:

✅ **Quality over Quantity:** 3-4 thoughtful variants vs. hundreds of random combinations  
✅ **Context-Aware:** Considers room type (bedroom vs office vs storage)  
✅ **Best Practices:** Follows architectural standards and ergonomics  
✅ **Explainable:** Each variant includes reasoning notes  
✅ **Grid-Aligned:** All dimensions snapped to 0.1m grid  

## Generated Variant Types

The AI typically proposes variants with different characteristics:

1. **Square/Compact Layout**
   - Aspect ratio ~1.0
   - Efficient circulation
   - Flexible furniture arrangement
   - Example: 5.5m × 5.5m

2. **Wide/Shallow Layout**
   - Aspect ratio >1.1
   - Maximizes facade exposure (for daylight)
   - Good for open-plan spaces
   - Example: 8m × 6m

3. **Deep/Narrow Layout**
   - Aspect ratio <0.9
   - Efficient core access
   - Good for corridors, linear spaces
   - Example: 4m × 7.5m

4. **Balanced Mid-Option**
   - Aspect ratio ~1.2-0.8
   - Compromise between extremes
   - Versatile for various uses
   - Example: 6m × 5m

## Results Summary

**Current Brief (49 room types):**
```
Model: GPT-3.5-Turbo (batch processing)
Total variants generated: 147
Average per room: 3.0
Success rate: 86% (42/49 rooms)
Time: 36 seconds (vs 274s sequential)
Cost: ~$0.03 per run (vs ~$0.30 with GPT-4o)

Aspect Ratio Distribution:
- Square (0.9-1.1): 32%
- Wide (>1.1):      30%
- Deep (<0.9):      37%
```

**Failed Rooms (7):**
- Very small utility rooms (2m² storage, toilets)
- AI proposals often below 2.4m minimum buildable size
- Fallback variants generated automatically

## Usage

### Generate Variants
```bash
npm run generate-variants
```

**Process:**
1. Reads `inputs/normalized-brief.json`
2. For each room, sends AI prompt with constraints
3. Validates proposed variants (grid alignment, constraints)
4. Falls back to geometric variants if AI proposals fail
5. Saves to `inputs/brief-with-variants.json`

**Time:** ~36 seconds for 49 rooms (batch processing, 5 parallel)  
**Cost:** ~$0.03 per run with GPT-3.5-Turbo

### View Variants
```bash
npm run view-variants
```

Shows statistics, distribution, and sample variants by category.

## Example Output

### Living/Bedroom (30m²)
```
1. 5.5m × 5.5m = 30.3m² [ratio: 1.00]
   → Square/compact layout, efficient use of space
   
2. 4m × 7.5m = 30m² [ratio: 0.53]
   → Deep/narrow layout, efficient core access
   
3. 6m × 5m = 30m² [ratio: 1.20]
   → Balanced mid-option, good facade exposure
```

### Office (12m²)
```
1. 3.2m × 3.2m = 10.2m² [ratio: 1.00]
   → Square layout for central desk
   
2. 4.8m × 2.5m = 12m² [ratio: 1.92]
   → Wide/shallow, maximizes daylight
   
3. 2.6m × 4.8m = 12.5m² [ratio: 0.54]
   → Deep/narrow for linear workspace
```

## AI Prompt Strategy

The system sends detailed context to OpenAI:

**Room Information:**
- Name, type, category
- Target area (min/max tolerance)
- Quantity needed
- Daylight requirements
- Functional notes

**Constraints:**
- Width/depth ranges
- Aspect ratio preferences
- 0.1m grid requirement

**Request:**
- 3-4 variants with different characteristics
- Practical dimensions for construction
- Consider furniture, circulation, doors
- Explain reasoning for each variant

## Validation Pipeline

Each AI-proposed variant goes through validation:

1. **Grid Snapping:** Round to 0.1m increments
2. **Constraint Check:** Width/depth within ranges
3. **Area Validation:** Within min/max tolerance
4. **Aspect Ratio:** Check if within preferences
5. **Minimum Size:** At least 2.4m × 2.4m (or smaller for utility rooms)

**Rejected variants** trigger fallback generation using geometric rules.

## Fallback Generation

If AI fails or produces invalid variants, the system generates fallbacks:

```typescript
// Square-ish variant
width = √area
depth = area / width

// Wide variant (if daylight needed)
width = √area × 1.4
depth = area / width

// Narrow variant
width = √area × 0.7
depth = area / width
```

All fallbacks also validated and grid-snapped.

## Benefits for Phase 1

### User Selection
- Small, manageable set of options (not overwhelming)
- Each variant has clear rationale
- Easy to compare trade-offs

### 3D Visualization
- Only need to render 3-4 variants per room
- Can show side-by-side comparisons
- Labels explain the reasoning

### Quality Assurance
- AI considers functional requirements
- Follows architectural standards
- Produces buildable dimensions

## Future Enhancements

**Phase 2+:**
- Use variant notes in group assembly
- Prefer certain aspect ratios for grouping
- Learn from user selections (feedback loop)
- Adjust proposals based on site constraints

**AI Integration:**
- Cache common room type proposals
- Fine-tune prompts based on validation results
- Add building code compliance checks
- Consider cultural/regional preferences

---

**Status:** ✅ Implemented and tested on 49 room types  
**Next:** Use variants in Phase 1 3D visualization & selection UI
