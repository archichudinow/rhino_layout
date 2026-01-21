/**
 * Fix small rooms that failed variant generation due to strict min dimension rules
 * Small utility rooms (toilets, storage, etc.) can be smaller than 2.4m
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { snapToGrid, gridArea } from '../core/grid.js';
import type { NormalizedBrief, RoomNode, RoomVariant } from '../core/types.js';

/**
 * Relaxed validation for small utility rooms
 */
function validateSmallRoomVariant(variant: RoomVariant, room: RoomNode): boolean {
  // Check grid alignment
  const widthAligned = Math.abs(variant.width - snapToGrid(variant.width)) < 0.01;
  const depthAligned = Math.abs(variant.depth - snapToGrid(variant.depth)) < 0.01;
  
  if (!widthAligned || !depthAligned) {
    return false;
  }
  
  // Check dimensional constraints
  if (variant.width < room.width_range[0] || variant.width > room.width_range[1]) {
    return false;
  }
  if (variant.depth < room.depth_range[0] || variant.depth > room.depth_range[1]) {
    return false;
  }
  
  // Check area constraints
  if (variant.area < room.area_min || variant.area > room.area_max) {
    return false;
  }
  
  // Check aspect ratio
  const aspectRatio = variant.width / variant.depth;
  const [minRatio, maxRatio] = room.aspect_ratio_range;
  if (aspectRatio < minRatio || aspectRatio > maxRatio) {
    return false;
  }
  
  return true;
}

/**
 * Generate variants for small rooms using simple geometric rules
 */
function generateSmallRoomVariants(room: RoomNode): RoomVariant[] {
  const variants: RoomVariant[] = [];
  const target = room.area_target;
  
  // Try multiple proportions
  const aspectRatios = [1.0, 1.2, 0.8]; // Square, wide, deep
  
  for (const ratio of aspectRatios) {
    // Calculate dimensions based on target area and aspect ratio
    // area = width × depth, and width/depth = ratio
    // So: depth = sqrt(area/ratio), width = depth × ratio
    const depth = Math.sqrt(target / ratio);
    const width = depth * ratio;
    
    // Snap to grid
    const w = snapToGrid(width);
    const d = snapToGrid(depth);
    const area = gridArea(w, d);
    
    // Create variant
    const variant: RoomVariant = {
      id: `${room.id}-var-${variants.length + 1}`,
      width: w,
      depth: d,
      area,
      access_edge: 'north',
      notes: ratio === 1.0 ? 'Square layout - efficient circulation' :
             ratio > 1.0 ? 'Wide layout - flexible arrangement' :
             'Compact layout - space-efficient'
    };
    
    // Only add facade_edge if room requires daylight
    if (room.requires_daylight) {
      variant.facade_edge = 'south';
    }
    
    // Validate with relaxed rules
    if (validateSmallRoomVariant(variant, room)) {
      variants.push(variant);
    }
  }
  
  // If no variants worked, try min/max dimensions
  if (variants.length === 0) {
    const [minW, maxW] = room.width_range;
    const [minD, maxD] = room.depth_range;
    
    // Try combinations
    const combos = [
      [minW, target / minW],
      [maxW, target / maxW],
      [target / minD, minD],
      [target / maxD, maxD],
    ];
    
    for (const [w, d] of combos) {
      const width = snapToGrid(w);
      const depth = snapToGrid(d);
      const area = gridArea(width, depth);
      
      const variant: RoomVariant = {
        id: `${room.id}-var-${variants.length + 1}`,
        width,
        depth,
        area,
        access_edge: 'north',
        notes: 'Optimized for constraints'
      };
      
      if (room.requires_daylight) {
        variant.facade_edge = 'south';
      }
      
      if (validateSmallRoomVariant(variant, room)) {
        variants.push(variant);
        if (variants.length >= 2) break;
      }
    }
  }
  
  return variants;
}

async function main() {
  const inputPath = join(process.cwd(), 'inputs', 'brief-with-variants.json');
  const outputPath = inputPath; // Overwrite the same file
  
  console.log('📄 Reading brief with variants...\n');
  const brief: NormalizedBrief = JSON.parse(readFileSync(inputPath, 'utf-8'));
  
  // Find rooms with no variants
  const roomsWithoutVariants = brief.rooms.filter(r => !r.variants || r.variants.length === 0);
  
  if (roomsWithoutVariants.length === 0) {
    console.log('✅ All rooms already have variants!');
    return;
  }
  
  console.log(`🔧 Found ${roomsWithoutVariants.length} rooms without variants:\n`);
  roomsWithoutVariants.forEach(r => {
    console.log(`   - ${r.name} (${r.area_target}m², width: ${r.width_range[0]}-${r.width_range[1]}m)`);
  });
  console.log('');
  
  // Generate variants for each
  const updatedRooms = brief.rooms.map(room => {
    if (!room.variants || room.variants.length === 0) {
      console.log(`⚙️  Generating variants for: ${room.name}`);
      const variants = generateSmallRoomVariants(room);
      console.log(`   → Generated ${variants.length} variants`);
      variants.forEach(v => {
        console.log(`      ${v.width}m × ${v.depth}m = ${v.area}m²`);
      });
      console.log('');
      
      return {
        ...room,
        variants,
        activeVariantId: variants.length > 0 ? variants[0].id : undefined
      };
    }
    return room;
  });
  
  // Update brief
  const updatedBrief: NormalizedBrief = {
    ...brief,
    rooms: updatedRooms,
    metadata: {
      ...brief.metadata,
      smallRoomsFixedAt: new Date().toISOString(),
      totalVariants: updatedRooms.reduce((sum, r) => sum + (r.variants?.length || 0), 0)
    }
  };
  
  // Save
  writeFileSync(outputPath, JSON.stringify(updatedBrief, null, 2));
  
  console.log('✅ Successfully fixed small rooms!\n');
  console.log('📊 Summary:');
  console.log(`   - Rooms fixed: ${roomsWithoutVariants.length}`);
  console.log(`   - Total variants now: ${updatedBrief.metadata.totalVariants}`);
  console.log(`\n💾 Saved to: ${outputPath}`);
}

main().catch(error => {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
});
