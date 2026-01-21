import { readFileSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';
import type { NormalizedBrief } from '../core/types.js';
import { generateAllVariants } from '../core/variantGenerator.js';
import { formatDimension } from '../core/grid.js';

// Load environment variables
config();

/**
 * Generate room variants for all rooms in the brief
 */
async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY environment variable not set');
    process.exit(1);
  }

  const briefPath = join(process.cwd(), 'inputs', 'normalized-brief.json');
  const outputPath = join(process.cwd(), 'inputs', 'brief-with-variants.json');

  console.log('📄 Reading normalized brief...\n');
  const brief: NormalizedBrief = JSON.parse(readFileSync(briefPath, 'utf-8'));

  console.log(`🤖 Generating variants for ${brief.rooms.length} room types...\n`);
  console.log('Using OpenAI to propose optimal proportions based on:');
  console.log('  - Room function and type');
  console.log('  - Daylight requirements');
  console.log('  - Ergonomics and circulation');
  console.log('  - Construction best practices');
  console.log('  - 0.1m grid alignment\n');
  console.log('='.repeat(70));

  const startTime = Date.now();
  let processedCount = 0;

  const roomsWithVariants = await generateAllVariants(
    brief.rooms,
    (current, total, roomName) => {
      processedCount = current;
      const progress = ((current / total) * 100).toFixed(0);
      process.stdout.write(`\r[${progress}%] ${current}/${total} - ${roomName.substring(0, 40).padEnd(40)} `);
    }
  );

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log('\n' + '='.repeat(70));
  
  // Update brief with variants
  const updatedBrief: NormalizedBrief = {
    ...brief,
    rooms: roomsWithVariants,
    metadata: {
      ...brief.metadata,
      variantsGeneratedAt: new Date().toISOString(),
      totalVariants: roomsWithVariants.reduce((sum, r) => sum + r.variants.length, 0)
    }
  };

  // Save to file
  const fs = await import('fs/promises');
  await fs.writeFile(outputPath, JSON.stringify(updatedBrief, null, 2));

  console.log('\n✅ Successfully generated variants!\n');
  console.log('📊 Summary:');
  console.log(`   - Room types processed: ${processedCount}`);
  console.log(`   - Total variants: ${updatedBrief.metadata.totalVariants}`);
  console.log(`   - Average per room: ${(updatedBrief.metadata.totalVariants / processedCount).toFixed(1)}`);
  console.log(`   - Time elapsed: ${elapsed}s`);
  console.log(`\n💾 Saved to: ${outputPath}`);

  // Show sample variants
  console.log('\n📐 SAMPLE VARIANTS (first 3 rooms):\n');
  roomsWithVariants.slice(0, 3).forEach(room => {
    console.log(`${room.name} (${formatDimension(room.area_target)}):`);
    room.variants.forEach((v, i) => {
      const aspectRatio = (v.width / v.depth).toFixed(2);
      console.log(`  ${i + 1}. ${formatDimension(v.width)} × ${formatDimension(v.depth)} = ${formatDimension(v.area)} (ratio: ${aspectRatio})`);
      if (v.notes) {
        console.log(`     → ${v.notes}`);
      }
    });
    console.log('');
  });

  console.log('='.repeat(70) + '\n');
}

main().catch(error => {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
});
