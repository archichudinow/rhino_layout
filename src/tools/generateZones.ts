/**
 * Generate program zones from normalized brief
 * Uses AI advisory system to propose 2-3 smart strategies (not all combinations)
 */

import fs from 'fs';
import path from 'path';
import { deriveZones } from '../tools/deriveZones';
import { getZoneRecommendations, applyAIRecommendations } from '../tools/aiZoneAdvisor';
import type { NormalizedBrief, ProgramZoneNode } from '../core/types';

async function main() {
  console.log('🏗️  PROGRAM ZONE GENERATOR (AI-Guided)\n');
  console.log('='.repeat(80) + '\n');
  
  // Load normalized brief
  const briefPath = path.join(process.cwd(), 'inputs', 'normalized-brief.json');
  const brief: NormalizedBrief = JSON.parse(fs.readFileSync(briefPath, 'utf-8'));
  
  console.log(`📊 INPUT: ${brief.rooms.length} room types, ${brief.metadata.totalRooms} total rooms\n`);
  
  // Get AI recommendations
  console.log('🤖 Requesting AI architectural recommendations...\n');
  const aiRecommendations = await getZoneRecommendations(brief.rooms);
  
  console.log('📝 AI STRATEGY:');
  console.log(`   ${aiRecommendations.overall_strategy}\n`);
  
  // Apply AI recommendations to generate zones
  const zones = applyAIRecommendations(brief.rooms, aiRecommendations);
  
  // Fallback to algorithmic if AI fails
  // const zones = deriveZones(brief.rooms);
  
  // Display zone summary
  console.log('\n' + '='.repeat(80));
  console.log('📦 PROGRAM ZONES GENERATED\n');
  
  zones.forEach((zone, index) => {
    console.log(`${index + 1}. ${zone.name.toUpperCase()}`);
    console.log(`   Function: ${zone.function_type}`);
    console.log(`   Net area: ${zone.target_area_net.toFixed(0)} m²`);
    console.log(`   Circulation: ${(zone.circulation_ratio * 100).toFixed(0)}% (${(zone.target_area_net * zone.circulation_ratio).toFixed(0)} m²)`);
    console.log(`   Gross area: ${(zone.target_area_net * (1 + zone.circulation_ratio)).toFixed(0)} m²`);
    console.log(`   Floors: ${zone.allowed_levels.join(', ')} (preferred: ${zone.preferred_level})`);
    console.log(`   Daylight: ${(zone.daylight_ratio * 100).toFixed(0)}%`);
    console.log(`   Room categories: ${zone.allowed_room_categories.join(', ')}`);
    console.log(`   Elastic: stretch=${zone.can_stretch}, split=${zone.can_split}, stack=${zone.can_stack}`);
    console.log(`   🤖 AI Reasoning: ${zone.notes}`);
    console.log(`   Variants: ${zone.variants.length} AI-proposed strategies`);
    
    zone.variants.forEach(variant => {
      const width = Math.sqrt(variant.target_footprint * variant.preferred_aspect_ratio);
      const depth = variant.target_footprint / width;
      console.log(`      • ${variant.strategy}: ${variant.floor_count}F × ${variant.target_footprint.toFixed(0)}m²/floor (~${width.toFixed(0)}×${depth.toFixed(0)}m)`);
      console.log(`        → ${variant.notes}`);
    });
    
    console.log('');
  });
  
  // Display adjacency recommendations
  if (aiRecommendations.adjacency_recommendations.length > 0) {
    console.log('='.repeat(80));
    console.log('🔗 ADJACENCY RECOMMENDATIONS (AI)\n');
    
    aiRecommendations.adjacency_recommendations.forEach(adj => {
      const emoji = adj.relationship === 'must_be_adjacent' ? '⚠️' :
                    adj.relationship === 'should_be_adjacent' ? '✓' :
                    adj.relationship === 'must_avoid' ? '❌' : 'ℹ️';
      console.log(`   ${emoji} ${adj.zone1} ↔ ${adj.zone2}`);
      console.log(`      ${adj.relationship.replace(/_/g, ' ').toUpperCase()}`);
      console.log(`      → ${adj.reasoning}\n`);
    });
  }
  
  // Calculate totals
  const totalNet = zones.reduce((sum, z) => sum + z.target_area_net, 0);
  const totalGross = zones.reduce((sum, z) => sum + z.target_area_net * (1 + z.circulation_ratio), 0);
  const avgCirculation = zones.reduce((sum, z) => sum + z.circulation_ratio, 0) / zones.length;
  
  console.log('='.repeat(80));
  console.log('📊 SUMMARY STATISTICS\n');
  console.log(`   Total zones: ${zones.length}`);
  console.log(`   Total net area: ${totalNet.toFixed(0)} m²`);
  console.log(`   Total circulation: ${(totalGross - totalNet).toFixed(0)} m² (${(avgCirculation * 100).toFixed(1)}% avg)`);
  console.log(`   Total gross area: ${totalGross.toFixed(0)} m²`);
  console.log(`   Total variants: ${zones.reduce((sum, z) => sum + z.variants.length, 0)}`);
  
  // Save to file
  const outputPath = path.join(process.cwd(), 'inputs', 'zone-variants.json');
  const output = {
    phase: 2,
    generated_at: new Date().toISOString(),
    ai_strategy: aiRecommendations.overall_strategy,
    adjacency_rules: aiRecommendations.adjacency_recommendations,
    zones,
    metadata: {
      zone_count: zones.length,
      total_net_area: totalNet,
      total_gross_area: totalGross,
      average_circulation_ratio: avgCirculation,
      total_variants: zones.reduce((sum, z) => sum + z.variants.length, 0),
      generation_method: 'ai_guided'
    }
  };
  
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`\n✅ Saved to: ${outputPath}`);
}

main().catch(console.error);