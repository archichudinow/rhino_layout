import OpenAI from 'openai';
import { readFileSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';
import type { NormalizedBrief, RoomNode } from '../core/types.js';
import { snapToGrid, DIMENSIONS } from '../core/grid.js';

// Load environment variables
config();

// Initialize OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Parse architectural brief using OpenAI to extract room requirements
 */
export async function parseBrief(briefPath: string): Promise<NormalizedBrief> {
  console.log('📄 Reading brief from:', briefPath);
  
  const briefContent = readFileSync(briefPath, 'utf-8');
  
  console.log('🤖 Sending to OpenAI for parsing...\n');
  
  const systemPrompt = `You are an architectural programming assistant. Parse the provided facility brief into a structured JSON format.

Extract each room/space with:
- name: clear room name
- quantity: number of instances needed
- area_target: target area in m²
- area_min: minimum acceptable area (use 80% of target if not specified)
- area_max: maximum acceptable area (use 120% of target if not specified)
- category: "client", "general", or "supporting" based on facility type
- requires_daylight: true if room typically needs windows/natural light
- requires_access: true (all rooms need access)
- notes: any special requirements mentioned

Return ONLY valid JSON matching this structure:
{
  "rooms": [
    {
      "name": "...",
      "quantity": 1,
      "area_target": 10,
      "area_min": 8,
      "area_max": 12,
      "category": "client",
      "requires_daylight": true,
      "requires_access": true,
      "notes": "..."
    }
  ]
}

Rules:
- If area appears multiplied (e.g., "30 × 2,400"), use the unit area (30 m²)
- Infer daylight needs based on room function (living spaces, offices need light; storage doesn't)
- Extract notes from descriptions
- Categorize: client facilities = "client", general = "general", supporting/offices = "supporting"`;

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: briefContent }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const parsed = JSON.parse(content);
    
    // Enhance with additional required fields and snap to 0.1m grid
    const rooms: RoomNode[] = parsed.rooms.map((room: any, index: number) => {
      // Snap all areas to grid
      const area_target = snapToGrid(room.area_target);
      const area_min = snapToGrid(room.area_min || room.area_target * 0.8);
      const area_max = snapToGrid(room.area_max || room.area_target * 1.2);
      
      // Derive reasonable dimensional constraints from area, snapped to grid
      const estimatedSide = Math.sqrt(area_target);
      
      // For very small rooms (< 6m²), allow narrower dimensions
      // Absolute minimum: 1.0m to fit 2m² storage closets
      const absoluteMin = area_target < 3 ? 1.0 : (area_target < 6 ? 1.5 : DIMENSIONS.MIN_ROOM_WIDTH);
      
      const width_min = snapToGrid(Math.max(absoluteMin, estimatedSide * 0.7));
      const width_max = snapToGrid(Math.max(estimatedSide * 2.5, width_min + 1));
      const depth_min = snapToGrid(Math.max(absoluteMin, estimatedSide * 0.7));
      const depth_max = snapToGrid(Math.max(estimatedSide * 2.5, depth_min + 1));
      
      return {
        id: `room-${index + 1}`,
        name: room.name,
        area_target,
        area_min,
        area_max,
        
        // Dimensional constraints aligned to grid
        width_range: [width_min, width_max] as [number, number],
        depth_range: [depth_min, depth_max] as [number, number],
        aspect_ratio_range: [0.5, 2.5] as [number, number],
        
        requires_daylight: room.requires_daylight ?? false,
        requires_access: room.requires_access ?? true,
        
        category: room.category || 'general',
        quantity: room.quantity || 1,
        notes: room.notes,
        
        variants: []
      };
    });

    const normalized: NormalizedBrief = {
      rooms,
      metadata: {
        parsedAt: new Date().toISOString(),
        totalRooms: rooms.reduce((sum, r) => sum + r.quantity, 0),
        totalArea: rooms.reduce((sum, r) => sum + (r.area_target * r.quantity), 0)
      }
    };

    return normalized;
    
  } catch (error) {
    console.error('❌ Error parsing brief:', error);
    throw error;
  }
}

/**
 * CLI tool to parse brief and save output
 */
async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY environment variable not set');
    console.error('💡 Set it with: export OPENAI_API_KEY="your-key"');
    process.exit(1);
  }

  const briefPath = join(process.cwd(), 'inputs', 'brief.md');
  const outputPath = join(process.cwd(), 'inputs', 'normalized-brief.json');

  try {
    const normalized = await parseBrief(briefPath);
    
    // Save to file
    const fs = await import('fs/promises');
    await fs.writeFile(outputPath, JSON.stringify(normalized, null, 2));
    
    console.log('✅ Successfully parsed brief!\n');
    console.log('📊 Summary:');
    console.log(`   - Total room types: ${normalized.rooms.length}`);
    console.log(`   - Total room instances: ${normalized.metadata.totalRooms}`);
    console.log(`   - Total area: ${normalized.metadata.totalArea.toFixed(0)} m²`);
    console.log(`\n💾 Saved to: ${outputPath}`);
    
  } catch (error) {
    console.error('❌ Failed to parse brief');
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
