/**
 * AI Zone Advisory System
 * 
 * Uses OpenAI to propose intelligent zoning strategies based on:
 * - Real architectural patterns
 * - Functional relationships
 * - Circulation efficiency
 * - Building typology best practices
 */

import OpenAI from 'openai';
import type { RoomNode, ProgramZoneNode, ZoneVariant } from '../core/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

interface AIZoneRecommendation {
  zones: {
    name: string;
    function_type: 'residential' | 'shared' | 'services' | 'staff' | 'support';
    reasoning: string;
    room_types: string[];
    suggested_variants: {
      strategy: string;
      floors: number;
      reasoning: string;
    }[];
  }[];
  adjacency_recommendations: {
    zone1: string;
    zone2: string;
    relationship: 'must_be_adjacent' | 'should_be_adjacent' | 'can_be_separate' | 'must_avoid';
    reasoning: string;
  }[];
  overall_strategy: string;
}

/**
 * Get AI recommendations for zone organization
 */
export async function getZoneRecommendations(rooms: RoomNode[]): Promise<AIZoneRecommendation> {
  console.log('🤖 Requesting AI zone recommendations...');
  
  // Prepare room summary
  const roomSummary = rooms.map(r => ({
    name: r.name,
    category: r.category,
    quantity: r.quantity,
    area: r.area_target,
    requires_daylight: r.requires_daylight,
    notes: r.notes
  }));
  
  const totalRooms = rooms.reduce((sum, r) => sum + r.quantity, 0);
  const totalArea = rooms.reduce((sum, r) => sum + r.area_target * r.quantity, 0);
  
  const prompt = `You are an experienced architect analyzing a building program to propose intelligent zoning strategies.

BUILDING PROGRAM:
- Total rooms: ${totalRooms}
- Total area: ${totalArea.toFixed(0)} m²
- Room types: ${rooms.length}

ROOM BREAKDOWN:
${JSON.stringify(roomSummary, null, 2)}

TASK:
Propose 2-3 smart functional zones based on real architectural experience. For EACH zone:

1. Identify logical groupings (not just by category, but by functional relationships)
2. Explain WHY these rooms belong together
3. Suggest 2-3 strategic variants (NOT all possibilities - only architecturally meaningful ones)
4. Recommend circulation ratios based on building typology
5. Identify adjacency requirements

IMPORTANT PRINCIPLES:
- Focus on quality over quantity (2-3 well-reasoned strategies, not all combinations)
- Consider real-world architectural patterns (residential towers, ground-floor amenities, etc.)
- Think about circulation efficiency and access hierarchy
- Consider daylight requirements and building orientation
- Propose stacking strategies based on structural/MEP logic

Return a JSON object with this structure:
{
  "zones": [
    {
      "name": "Zone Name",
      "function_type": "residential|shared|services|staff|support",
      "reasoning": "Why these rooms belong together (architectural logic)",
      "room_types": ["list of room names"],
      "suggested_variants": [
        {
          "strategy": "strategy name",
          "floors": 4,
          "reasoning": "Why this makes sense architecturally"
        }
      ]
    }
  ],
  "adjacency_recommendations": [
    {
      "zone1": "Zone 1",
      "zone2": "Zone 2",
      "relationship": "must_be_adjacent|should_be_adjacent|can_be_separate|must_avoid",
      "reasoning": "Why this relationship matters"
    }
  ],
  "overall_strategy": "High-level architectural strategy for this building"
}

Focus on ARCHITECTURAL INTELLIGENCE, not just mathematical combinations.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert architect specializing in building organization and spatial planning. You provide thoughtful, experience-based recommendations.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });
    
    const content = response.choices[0].message.content;
    if (!content) throw new Error('No response from AI');
    
    const recommendation = JSON.parse(content) as AIZoneRecommendation;
    
    console.log('✅ AI recommendations received');
    console.log(`   Zones proposed: ${recommendation.zones.length}`);
    console.log(`   Adjacency rules: ${recommendation.adjacency_recommendations.length}`);
    
    return recommendation;
    
  } catch (error) {
    console.error('❌ AI recommendation failed:', error);
    throw error;
  }
}

/**
 * Apply AI recommendations to generate zones with better variants
 */
export function applyAIRecommendations(
  rooms: RoomNode[],
  aiRec: AIZoneRecommendation
): ProgramZoneNode[] {
  console.log('🔧 Applying AI recommendations to zone generation...');
  
  const zones: ProgramZoneNode[] = aiRec.zones.map((zoneRec, index) => {
    // Find rooms that match this zone
    const zoneRooms = rooms.filter(room => 
      zoneRec.room_types.some(type => 
        room.name.toLowerCase().includes(type.toLowerCase()) ||
        type.toLowerCase().includes(room.name.toLowerCase().split(' ')[0])
      )
    );
    
    // Calculate areas
    const totalRooms = zoneRooms.reduce((sum, r) => sum + r.quantity, 0);
    const totalArea = zoneRooms.reduce((sum, r) => sum + r.area_target * r.quantity, 0);
    const avgDaylight = zoneRooms.reduce((sum, r) => sum + (r.requires_daylight ? 1 : 0), 0) / zoneRooms.length;
    
    // Estimate circulation based on function type
    const circulationRatio = estimateCirculation(zoneRec.function_type, totalRooms);
    
    // Extract room categories
    const categories = extractCategories(zoneRooms);
    
    // Generate variants from AI suggestions (2-3 only!)
    const variants: ZoneVariant[] = zoneRec.suggested_variants.map(varRec => {
      const footprint = totalArea / varRec.floors;
      const aspectRatio = determineAspectRatio(varRec.strategy);
      const grossArea = totalArea * (1 + circulationRatio);
      
      return {
        id: `var-${varRec.strategy.toLowerCase().replace(/\s+/g, '-')}`,
        target_footprint: footprint,
        floor_count: varRec.floors,
        aspect_ratio_range: [aspectRatio * 0.8, aspectRatio * 1.2],
        preferred_aspect_ratio: aspectRatio,
        total_gross_area: grossArea,
        estimated_room_count: totalRooms,
        strategy: mapStrategy(varRec.strategy),
        notes: varRec.reasoning
      };
    });
    
    // Determine elastic properties
    const canStack = totalRooms > 20 && zoneRec.function_type === 'residential';
    const canSplit = totalRooms > 30;
    const canStretch = totalRooms < 20;
    
    // Find allowed levels from variants
    const allowedLevels = [...new Set(variants.map(v => v.floor_count))].sort();
    
    return {
      id: `zone-${index + 1}`,
      name: zoneRec.name,
      function_type: zoneRec.function_type,
      target_area_net: totalArea,
      area_min: totalArea * 0.9,
      area_max: totalArea * 1.1,
      circulation_ratio: circulationRatio,
      allowed_levels: allowedLevels,
      preferred_level: variants[0]?.floor_count || allowedLevels[0] || 1,
      daylight_ratio: avgDaylight,
      noise_tolerance: determineNoise(zoneRec.function_type),
      allowed_room_categories: categories,
      can_stretch: canStretch,
      can_split: canSplit,
      can_stack: canStack,
      prefers_adjacent_to: findAdjacentZones(zoneRec.name, aiRec.adjacency_recommendations, 'adjacent'),
      must_avoid: findAdjacentZones(zoneRec.name, aiRec.adjacency_recommendations, 'avoid'),
      variants,
      activeVariantId: variants[0]?.id,
      notes: zoneRec.reasoning
    };
  });
  
  console.log(`✅ Created ${zones.length} zones with AI-guided variants`);
  return zones;
}

// Helper functions
function estimateCirculation(type: string, roomCount: number): number {
  if (type === 'residential') return 0.35;
  if (type === 'shared') return 0.25;
  if (type === 'services') return 0.30;
  if (type === 'staff') return 0.20;
  return 0.25;
}

function determineAspectRatio(strategy: string): number {
  const s = strategy.toLowerCase();
  if (s.includes('tower') || s.includes('compact')) return 1.0;
  if (s.includes('linear') || s.includes('bar')) return 2.5;
  if (s.includes('courtyard')) return 1.5;
  return 1.3;
}

function mapStrategy(aiStrategy: string): 'compact' | 'linear' | 'courtyard' | 'split' | 'stacked' {
  const s = aiStrategy.toLowerCase();
  if (s.includes('tower') || s.includes('vertical')) return 'stacked';
  if (s.includes('compact')) return 'compact';
  if (s.includes('linear') || s.includes('bar')) return 'linear';
  if (s.includes('courtyard')) return 'courtyard';
  if (s.includes('split') || s.includes('wing')) return 'split';
  return 'compact';
}

function determineNoise(type: string): 'quiet' | 'moderate' | 'noisy' {
  if (type === 'residential' || type === 'staff') return 'quiet';
  return 'moderate';
}

function extractCategories(rooms: RoomNode[]): string[] {
  const cats = new Set<string>();
  rooms.forEach(r => {
    const name = r.name.toLowerCase();
    if (name.includes('bedroom') || name.includes('living')) cats.add('bedroom');
    if (name.includes('bathroom')) cats.add('bathroom');
    if (name.includes('kitchen')) cats.add('kitchen');
    if (name.includes('office')) cats.add('office');
    if (name.includes('storage')) cats.add('storage');
  });
  return Array.from(cats);
}

function findAdjacentZones(
  zoneName: string,
  adjacencies: AIZoneRecommendation['adjacency_recommendations'],
  type: 'adjacent' | 'avoid'
): string[] {
  return adjacencies
    .filter(adj => {
      const isRelevant = adj.zone1 === zoneName || adj.zone2 === zoneName;
      if (!isRelevant) return false;
      
      if (type === 'adjacent') {
        return adj.relationship === 'must_be_adjacent' || adj.relationship === 'should_be_adjacent';
      } else {
        return adj.relationship === 'must_avoid';
      }
    })
    .map(adj => adj.zone1 === zoneName ? adj.zone2 : adj.zone1);
}