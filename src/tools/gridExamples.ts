import { snapToGrid, gridRange, gridArea, formatDimension, DIMENSIONS } from '../core/grid';

/**
 * Example: Generating room variants on grid
 */
function exampleRoomVariants() {
  const targetArea = 30; // 30m² room
  
  console.log('🏠 ROOM VARIANT GENERATION EXAMPLE\n');
  console.log('Target Area:', formatDimension(targetArea));
  
  // Generate width options in 0.5m steps
  const widths = gridRange(3.5, 7.0, 5); // 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0
  
  console.log('\n📏 Width options (0.5m steps):');
  console.log(widths.map(w => formatDimension(w)).join(', '));
  
  // Generate variants
  console.log('\n🎯 Generated Variants:\n');
  
  widths.forEach((width, i) => {
    const depth = snapToGrid(targetArea / width);
    const actualArea = gridArea(width, depth);
    const tolerance = Math.abs(actualArea - targetArea);
    
    if (tolerance <= 3) { // Within 3m² tolerance
      console.log(`   Variant ${i + 1}: ${formatDimension(width)} × ${formatDimension(depth)} = ${formatDimension(actualArea)}`);
    }
  });
}

/**
 * Example: Grid snapping
 */
function exampleGridSnapping() {
  console.log('\n\n⚡ GRID SNAPPING EXAMPLES\n');
  
  const testValues = [3.14159, 5.67, 2.44, 10.99, 1.23];
  
  testValues.forEach(value => {
    const snapped = snapToGrid(value);
    console.log(`   ${value.toFixed(3)}m → ${formatDimension(snapped)}`);
  });
}

/**
 * Example: Area calculations
 */
function exampleAreaCalculation() {
  console.log('\n\n📐 AREA CALCULATION EXAMPLES\n');
  
  const rooms = [
    { width: 3.7, depth: 4.2 },
    { width: 5.5, depth: 6.8 },
    { width: 2.4, depth: 3.0 }
  ];
  
  rooms.forEach(room => {
    const area = gridArea(room.width, room.depth);
    const w = snapToGrid(room.width);
    const d = snapToGrid(room.depth);
    console.log(`   ${formatDimension(w)} × ${formatDimension(d)} = ${formatDimension(area)}`);
  });
}

/**
 * Example: Constants
 */
function exampleConstants() {
  console.log('\n\n🔧 DIMENSIONAL CONSTANTS\n');
  console.log(`   Min room width: ${formatDimension(DIMENSIONS.MIN_ROOM_WIDTH)}`);
  console.log(`   Min room depth: ${formatDimension(DIMENSIONS.MIN_ROOM_DEPTH)}`);
  console.log(`   Min corridor: ${formatDimension(DIMENSIONS.MIN_CORRIDOR)}`);
  console.log(`   Typical ceiling: ${formatDimension(DIMENSIONS.TYPICAL_CEILING)}`);
  console.log(`   Grid unit: ${DIMENSIONS.STANDARD_STEP * 0.1}m steps (standard)`);
}

// Run examples
console.log('═'.repeat(70));
console.log('GRID SYSTEM EXAMPLES - 0.1m (100mm) Grid');
console.log('═'.repeat(70));

exampleRoomVariants();
exampleGridSnapping();
exampleAreaCalculation();
exampleConstants();

console.log('\n' + '═'.repeat(70));
console.log('✅ All operations maintain 0.1m grid alignment');
console.log('═'.repeat(70) + '\n');
