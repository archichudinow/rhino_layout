import { readFileSync } from 'fs';
import { join } from 'path';
import type { NormalizedBrief } from '../core/types.js';
import { validateRoomNode, checkAreaFeasibility } from '../core/validators.js';
import { isOnGrid, formatDimension } from '../core/grid.js';

/**
 * Validate all rooms in normalized brief for grid alignment
 */
function main() {
  const briefPath = join(process.cwd(), 'inputs', 'normalized-brief.json');
  const brief: NormalizedBrief = JSON.parse(readFileSync(briefPath, 'utf-8'));

  console.log('\n🔍 VALIDATING GRID ALIGNMENT (0.1m grid)\n');
  console.log('='.repeat(70));

  let totalErrors = 0;
  let totalWarnings = 0;
  let offGridCount = 0;

  brief.rooms.forEach((room, idx) => {
    const validation = validateRoomNode(room);
    const feasibility = checkAreaFeasibility(room);

    const hasErrors = validation.errors.length > 0 || feasibility.errors.length > 0;
    const hasWarnings = validation.warnings.length > 0 || feasibility.warnings.length > 0;

    if (hasErrors || hasWarnings) {
      console.log(`\n[${idx + 1}] ${room.name}`);
      
      if (validation.errors.length > 0) {
        console.log('  ❌ ERRORS:');
        validation.errors.forEach(err => console.log(`     - ${err}`));
        totalErrors += validation.errors.length;
      }
      
      if (feasibility.errors.length > 0) {
        console.log('  ❌ FEASIBILITY:');
        feasibility.errors.forEach(err => console.log(`     - ${err}`));
        totalErrors += feasibility.errors.length;
      }

      if (validation.warnings.length > 0) {
        console.log('  ⚠️  WARNINGS:');
        validation.warnings.forEach(warn => console.log(`     - ${warn}`));
        totalWarnings += validation.warnings.length;
      }
      
      if (feasibility.warnings.length > 0) {
        feasibility.warnings.forEach(warn => console.log(`     - ${warn}`));
        totalWarnings += feasibility.warnings.length;
      }
    }

    // Check grid alignment
    const allValues = [
      room.area_target,
      room.area_min,
      room.area_max,
      ...room.width_range,
      ...room.depth_range
    ];
    
    const offGrid = allValues.filter(v => !isOnGrid(v));
    if (offGrid.length > 0) {
      offGridCount++;
    }
  });

  console.log('\n' + '='.repeat(70));
  console.log('\n📊 VALIDATION SUMMARY:\n');
  console.log(`   Total rooms:     ${brief.rooms.length}`);
  console.log(`   Off-grid rooms:  ${offGridCount}`);
  console.log(`   Total errors:    ${totalErrors}`);
  console.log(`   Total warnings:  ${totalWarnings}`);

  if (totalErrors === 0 && offGridCount === 0) {
    console.log('\n✅ All dimensions aligned to 0.1m grid!');
  } else if (totalErrors === 0) {
    console.log('\n⚠️  Some rooms off-grid but no critical errors');
  } else {
    console.log('\n❌ Validation failed - re-parse brief to fix');
  }

  // Show grid alignment examples
  console.log('\n📐 SAMPLE DIMENSIONS (first 3 rooms):');
  brief.rooms.slice(0, 3).forEach(room => {
    console.log(`\n   ${room.name}`);
    console.log(`   Area: ${formatDimension(room.area_target)} (${formatDimension(room.area_min)}-${formatDimension(room.area_max)})`);
    console.log(`   Width: ${formatDimension(room.width_range[0])}-${formatDimension(room.width_range[1])}`);
    console.log(`   Depth: ${formatDimension(room.depth_range[0])}-${formatDimension(room.depth_range[1])}`);
  });

  console.log('\n' + '='.repeat(70) + '\n');

  if (totalErrors > 0) {
    process.exit(1);
  }
}

main();
