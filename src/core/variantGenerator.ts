/**
 * AI-powered room variant generator
 * Uses OpenAI to propose well-proportioned room variants based on best practices
 */

import OpenAI from 'openai';
import { config } from 'dotenv';
import { snapToGrid, gridArea, DIMENSIONS } from './grid.js';
import { validateRoomVariant } from './validators.js';
import type { RoomNode, RoomVariant } from './types.js';

// Load environment variables
config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generate room variants using AI to propose optimal proportions
 */
export async function generateRoomVariants(room: RoomNode): Promise<RoomVariant[]> {
  const prompt = buildVariantPrompt(room);
  
  try {
    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an expert architectural space planner. Propose optimal room proportions based on function, ergonomics, and building standards. All dimensions must be practical and aligned to a 0.1m (100mm) construction grid.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const parsed = JSON.parse(content);
    
    // Process and validate variants
    const variants: RoomVariant[] = [];
    
    for (const v of parsed.variants) {
      // Snap to grid
      const width = snapToGrid(v.width);
      const depth = snapToGrid(v.depth);
      const area = gridArea(width, depth);
      
      // Determine edges based on room requirements
      const facade_edge = room.requires_daylight ? (v.facade_edge || 'south') : undefined;
      const access_edge = v.access_edge || 'north';
      
      const variant: RoomVariant = {
        id: `${room.id}-var-${variants.length + 1}`,
        width,
        depth,
        area,
        facade_edge,
        access_edge,
        notes: v.notes
      };
      
      // Validate variant
      const validation = validateRoomVariant(variant, room);
      if (validation.valid) {
        variants.push(variant);
      } else {
        console.warn(`Variant rejected for ${room.name}:`, validation.errors);
      }
    }
    
    // If AI didn't produce enough valid variants, generate fallback
    if (variants.length < 2) {
      const fallbacks = generateFallbackVariants(room);
      variants.push(...fallbacks);
    }
    
    return variants.slice(0, 4); // Max 4 variants
    
  } catch (error) {
    console.error(`Error generating variants for ${room.name}:`, error);
    // Return fallback variants
    return generateFallbackVariants(room);
  }
}

/**
 * Build prompt for AI variant generation
 */
function buildVariantPrompt(room: RoomNode): string {
  const categoryDesc = {
    client: 'residential/client living space',
    general: 'shared facility/common area',
    supporting: 'back-of-house/support space'
  };

  return `Generate 3-4 optimal room proportion variants for:

**Room:** ${room.name}
**Type:** ${categoryDesc[room.category]}
**Target Area:** ${room.area_target}m² (MUST BE between ${room.area_min}m² and ${room.area_max}m²)
**Quantity Needed:** ${room.quantity}
**Requires Daylight:** ${room.requires_daylight ? 'Yes (needs facade)' : 'No'}
**Notes:** ${room.notes || 'None'}

**STRICT CONSTRAINTS:**
- Width: MUST BE between ${room.width_range[0]}m and ${room.width_range[1]}m
- Depth: MUST BE between ${room.depth_range[0]}m and ${room.depth_range[1]}m
- Area: width × depth MUST equal approximately ${room.area_target}m² (±${(room.area_max - room.area_min)/2}m²)
- Aspect ratio: ${room.aspect_ratio_range[0]} to ${room.aspect_ratio_range[1]}
- ALL dimensions MUST be multiples of 0.1m (e.g., 3.5m, 4.2m, NOT 3.47m)

**IMPORTANT:** Calculate area = width × depth and ensure it's within ${room.area_min}-${room.area_max}m²

**Propose 3-4 variants with these characteristics:**
1. Square/compact (aspect ratio ~1.0)
2. Wide/shallow (aspect ratio >1.1, for facade if daylight needed)
3. Deep/narrow (aspect ratio <0.9, for core access)
4. Balanced mid-option

Return JSON format:
{
  "variants": [
    {
      "width": 4.5,
      "depth": 6.7,
      "notes": "Square layout - efficient circulation",
      "facade_edge": "south",
      "access_edge": "north"
    }
  ]
}

VERIFY each variant: width × depth ≈ ${room.area_target}m² (within ±${(room.area_max - room.area_min)/2}m²)`;
}

/**
 * Generate fallback variants using simple geometric rules
 */
function generateFallbackVariants(room: RoomNode): RoomVariant[] {
  const variants: RoomVariant[] = [];
  const target = room.area_target;
  
  // Variant 1: Square-ish
  const side = Math.sqrt(target);
  const w1 = snapToGrid(side);
  const d1 = snapToGrid(target / w1);
  variants.push(createVariant(room, w1, d1, 'Square layout - efficient circulation'));
  
  // Variant 2: Wide (if daylight needed)
  if (room.requires_daylight) {
    const w2 = snapToGrid(side * 1.4);
    const d2 = snapToGrid(target / w2);
    if (w2 <= room.width_range[1] && d2 >= room.depth_range[0]) {
      variants.push(createVariant(room, w2, d2, 'Wide layout - maximizes facade exposure'));
    }
  }
  
  // Variant 3: Deep/narrow
  const w3 = snapToGrid(side * 0.7);
  const d3 = snapToGrid(target / w3);
  if (w3 >= room.width_range[0] && d3 <= room.depth_range[1]) {
    variants.push(createVariant(room, w3, d3, 'Compact layout - efficient planning'));
  }
  
  return variants.filter(v => {
    const validation = validateRoomVariant(v, room);
    return validation.valid;
  });
}

/**
 * Create a variant with proper structure
 */
function createVariant(
  room: RoomNode, 
  width: number, 
  depth: number, 
  notes: string
): RoomVariant {
  return {
    id: `${room.id}-var-fallback-${Math.random().toString(36).substr(2, 9)}`,
    width: snapToGrid(width),
    depth: snapToGrid(depth),
    area: gridArea(width, depth),
    facade_edge: room.requires_daylight ? 'south' : undefined,
    access_edge: 'north',
    notes
  };
}

/**
 * Batch generate variants for all rooms in a brief
 * Uses parallel requests with concurrency limit to optimize cost and speed
 */
export async function generateAllVariants(
  rooms: RoomNode[],
  onProgress?: (current: number, total: number, roomName: string) => void
): Promise<RoomNode[]> {
  const updatedRooms: RoomNode[] = [];
  const BATCH_SIZE = 5; // Process 5 rooms in parallel
  
  for (let i = 0; i < rooms.length; i += BATCH_SIZE) {
    const batch = rooms.slice(i, i + BATCH_SIZE);
    
    // Process batch in parallel
    const batchResults = await Promise.all(
      batch.map(async (room, batchIndex) => {
        const roomIndex = i + batchIndex;
        
        if (onProgress) {
          onProgress(roomIndex + 1, rooms.length, room.name);
        }
        
        const variants = await generateRoomVariants(room);
        
        return {
          ...room,
          variants,
          activeVariantId: variants.length > 0 ? variants[0].id : undefined
        };
      })
    );
    
    updatedRooms.push(...batchResults);
    
    // Small delay between batches to avoid rate limiting
    if (i + BATCH_SIZE < rooms.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return updatedRooms;
}
