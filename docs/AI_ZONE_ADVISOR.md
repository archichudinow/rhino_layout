# AI Zone Advisor System

## Problem Statement

The **algorithmic approach** to zone generation creates too many variants:
- ❌ Generates ALL possible combinations (15+ variants per project)
- ❌ No architectural reasoning behind choices
- ❌ User overwhelmed with options
- ❌ No guidance on what works in real architecture

## Solution: AI-Guided Generation

Instead of exhaustive combinatorics, use **AI to propose 2-3 smart strategies** based on real architectural experience.

## What AI Does

### ✅ Suggests Logical Groupings
AI analyzes room relationships and proposes functional zones based on:
- How spaces are used together (e.g., bedrooms + bathrooms)
- Access hierarchy (public → semi-private → private)
- MEP/structural efficiency
- Real-world building typologies

### ✅ Recommends Circulation Ratios
Instead of fixed percentages, AI considers:
- Building type (residential tower vs. office)
- Zone accessibility requirements
- Corridor vs. open-plan strategies
- Emergency egress patterns

### ✅ Proposes Adjacency Patterns
AI identifies critical relationships:
- **Must be adjacent**: Kitchen ↔ Dining, Bedroom ↔ Bathroom
- **Should be adjacent**: Living ↔ Terrace, Office ↔ Meeting Rooms
- **Can be separate**: Storage ↔ Shared Facilities
- **Must avoid**: Noisy ↔ Quiet zones

### ✅ Identifies Stacking Opportunities
AI suggests vertical organization based on:
- Repetitive residential floors above ground-level amenities
- Services/MEP on specific levels
- Structural core strategies
- Access/circulation logic

## AI Advisor Output

```typescript
interface AIZoneRecommendation {
  zones: {
    name: string;                          // "Residential Tower Core"
    function_type: string;                 // "residential"
    reasoning: string;                     // WHY these rooms belong together
    room_types: string[];                  // Specific rooms in this zone
    suggested_variants: [                  // Only 2-3 smart strategies!
      {
        strategy: "Vertical Stacking",     // Strategy name
        floors: 8,                         // Proposed floor count
        reasoning: "Efficient for 100+ units, typical tower logic"
      }
    ]
  }[];
  
  adjacency_recommendations: [
    {
      zone1: "Residential Core",
      zone2: "Shared Amenities",
      relationship: "should_be_adjacent",
      reasoning: "Direct access for residents from lobby"
    }
  ];
  
  overall_strategy: string;                // High-level architectural concept
}
```

## Generation Flow

```
Normalized Brief (184 rooms)
         ↓
   🤖 AI Advisor
         ↓
   2-3 Smart Zones + 2-3 Variants Each
         ↓
   6-9 Total Options (not 15+!)
         ↓
   User selects best fit
```

## Implementation

### Tools

**`/src/tools/aiZoneAdvisor.ts`**
- `getZoneRecommendations()` - Calls OpenAI GPT-3.5-Turbo with architectural prompt
- `applyAIRecommendations()` - Converts AI suggestions into ProgramZoneNode structures

**`/src/tools/generateZones.ts`**
- Updated to use AI advisor by default
- Falls back to algorithmic if AI fails

### UI Integration

**Info Panel** - Displays AI reasoning:
- 🤖 **AI Reasoning**: Why this zone was created
- **Strategy**: Why this variant makes architectural sense

**Generation Output**:
```bash
npm run generate-zones

🤖 AI STRATEGY:
   Vertical residential tower with ground-level shared amenities,
   service zones distributed for efficiency, support spaces consolidated.

📦 ZONES:
   1. RESIDENTIAL TOWER CORE (3,942 m²)
      🤖 Reasoning: High quantity of units suggests efficient vertical stacking
      Variants:
         • stacked: 8F × 493m²/floor
           → Standard residential tower, efficient core layout
         • compact: 6F × 657m²/floor
           → More generous floor plates for larger units
```

## Benefits

### Quality over Quantity
- 6-9 well-reasoned options vs. 15+ random combinations
- Each variant has **architectural justification**

### Real Architectural Intelligence
- Based on building typology precedents
- Considers circulation, structure, MEP
- Reflects real-world design decisions

### Better UX
- Less overwhelming for users
- Clear explanations for each choice
- Easier to compare meaningful alternatives

## Cost Consideration

**OpenAI API Call**: ~$0.001 per generation (GPT-3.5-Turbo)
- Cheap enough to run on every project
- Can cache results if brief unchanged
- Much better ROI than generating useless variants

## Future Enhancements

1. **Style-based variants**: "Modernist tower" vs. "Courtyard typology"
2. **Site context**: AI considers site constraints (shape, orientation, neighbors)
3. **Budget awareness**: Circulation efficiency affects cost
4. **Regulatory compliance**: Zoning codes, fire egress, accessibility
5. **User feedback loop**: Learn from user selections to improve recommendations

## Comparison

| Approach | Variants | Quality | Reasoning | User Experience |
|----------|----------|---------|-----------|-----------------|
| **Algorithmic** | 15+ | Mixed | None | Overwhelming |
| **AI-Guided** | 6-9 | High | Architectural | Clear + Useful |

---

**Conclusion**: AI doesn't replace human architects — it **proposes smart starting points** based on collective architectural knowledge, letting designers focus on refinement rather than exhaustive exploration.
