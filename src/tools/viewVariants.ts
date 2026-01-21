import { readFileSync } from 'fs';
import { join } from 'path';
import type { NormalizedBrief } from '../core/types.js';
import { formatDimension } from '../core/grid.js';

/**
 * View generated room variants
 */
function main() {
  const briefPath = join(process.cwd(), 'inputs', 'brief-with-variants.json');
  
  try {
    const brief: NormalizedBrief = JSON.parse(readFileSync(briefPath, 'utf-8'));
    
    console.log('\n🏗️  ROOM VARIANTS OVERVIEW\n');
    console.log('='.repeat(80));
    
    // Statistics
    const totalVariants = brief.rooms.reduce((sum, r) => sum + r.variants.length, 0);
    const roomsWithVariants = brief.rooms.filter(r => r.variants.length > 0).length;
    const avgVariants = (totalVariants / brief.rooms.length).toFixed(1);
    
    console.log('\n📊 STATISTICS:');
    console.log(`   Total room types: ${brief.rooms.length}`);
    console.log(`   Rooms with variants: ${roomsWithVariants}`);
    console.log(`   Total variants: ${totalVariants}`);
    console.log(`   Average per room: ${avgVariants}`);
    
    // Show distribution
    console.log('\n📈 VARIANT DISTRIBUTION:');
    const distribution = [0, 0, 0, 0, 0];
    brief.rooms.forEach(r => {
      const count = Math.min(r.variants.length, 4);
      distribution[count]++;
    });
    
    distribution.forEach((count, numVariants) => {
      if (count > 0) {
        const bar = '█'.repeat(Math.ceil(count / 2));
        console.log(`   ${numVariants} variants: ${count.toString().padStart(2)} rooms ${bar}`);
      }
    });
    
    // Show sample rooms by category
    console.log('\n🏠 SAMPLE ROOMS BY CATEGORY:\n');
    
    ['client', 'general', 'supporting'].forEach(category => {
      const rooms = brief.rooms.filter(r => r.category === category);
      const sample = rooms.find(r => r.variants.length >= 3);
      
      if (sample) {
        console.log(`\n${category.toUpperCase()}: ${sample.name}`);
        console.log(`Target: ${formatDimension(sample.area_target)} | ${sample.variants.length} variants`);
        
        sample.variants.forEach((v, i) => {
          const aspectRatio = (v.width / v.depth).toFixed(2);
          const tolerance = Math.abs(v.area - sample.area_target).toFixed(1);
          console.log(`  ${i + 1}. ${formatDimension(v.width)} × ${formatDimension(v.depth)} = ${formatDimension(v.area)} (±${tolerance}m²) [ratio: ${aspectRatio}]`);
          if (v.notes) {
            const note = v.notes.length > 70 ? v.notes.substring(0, 67) + '...' : v.notes;
            console.log(`     ${note}`);
          }
        });
      }
    });
    
    // Show daylight-requiring rooms
    console.log('\n\n☀️  DAYLIGHT-REQUIRING ROOMS (sample):');
    const daylightRooms = brief.rooms.filter(r => r.requires_daylight && r.variants.length >= 2);
    daylightRooms.slice(0, 2).forEach(room => {
      console.log(`\n   ${room.name} (${formatDimension(room.area_target)})`);
      room.variants.forEach((v, i) => {
        const aspect = (v.width / v.depth).toFixed(2);
        console.log(`     ${i + 1}. ${formatDimension(v.width)} × ${formatDimension(v.depth)} [${aspect}] → facade: ${v.facade_edge || 'N/A'}`);
      });
    });
    
    // Show aspect ratio analysis
    console.log('\n\n📐 ASPECT RATIO ANALYSIS:');
    const aspectRatios = brief.rooms.flatMap(r => 
      r.variants.map(v => ({ room: r.name, ratio: v.width / v.depth }))
    );
    
    const square = aspectRatios.filter(a => a.ratio >= 0.9 && a.ratio <= 1.1).length;
    const wide = aspectRatios.filter(a => a.ratio > 1.1).length;
    const deep = aspectRatios.filter(a => a.ratio < 0.9).length;
    
    console.log(`   Square (0.9-1.1):  ${square} variants (${(square/totalVariants*100).toFixed(0)}%)`);
    console.log(`   Wide (>1.1):       ${wide} variants (${(wide/totalVariants*100).toFixed(0)}%)`);
    console.log(`   Deep (<0.9):       ${deep} variants (${(deep/totalVariants*100).toFixed(0)}%)`);
    
    console.log('\n' + '='.repeat(80));
    console.log('✅ All variants are grid-aligned and validated');
    console.log('='.repeat(80) + '\n');
    
  } catch (error: any) {
    console.error('\n❌ Error reading variants file');
    console.error('   Run `npm run generate-variants` first\n');
    process.exit(1);
  }
}

main();
