import { readFileSync } from 'fs';
import { join } from 'path';
import type { NormalizedBrief } from '../core/types.js';

/**
 * Display summary statistics of parsed brief
 */
function main() {
  const briefPath = join(process.cwd(), 'inputs', 'normalized-brief.json');
  const brief: NormalizedBrief = JSON.parse(readFileSync(briefPath, 'utf-8'));

  console.log('\n📊 NORMALIZED BRIEF SUMMARY\n');
  console.log('=' .repeat(70));
  
  // Category breakdown
  const categories = {
    client: brief.rooms.filter(r => r.category === 'client'),
    general: brief.rooms.filter(r => r.category === 'general'),
    supporting: brief.rooms.filter(r => r.category === 'supporting')
  };

  console.log('\n📂 BY CATEGORY:');
  Object.entries(categories).forEach(([cat, rooms]) => {
    const totalArea = rooms.reduce((sum, r) => sum + r.area_target * r.quantity, 0);
    const totalRooms = rooms.reduce((sum, r) => sum + r.quantity, 0);
    console.log(`   ${cat.toUpperCase().padEnd(12)} ${totalRooms.toString().padStart(3)} rooms  ${totalArea.toFixed(0).padStart(6)} m²`);
  });

  // Daylight requirements
  const daylightRooms = brief.rooms.filter(r => r.requires_daylight);
  const daylightCount = daylightRooms.reduce((sum, r) => sum + r.quantity, 0);
  const daylightArea = daylightRooms.reduce((sum, r) => sum + r.area_target * r.quantity, 0);

  console.log('\n☀️  DAYLIGHT REQUIREMENTS:');
  console.log(`   Rooms needing daylight: ${daylightCount}/${brief.metadata.totalRooms} (${(daylightCount/brief.metadata.totalRooms*100).toFixed(0)}%)`);
  console.log(`   Daylight area: ${daylightArea.toFixed(0)} m² (${(daylightArea/brief.metadata.totalArea*100).toFixed(0)}%)`);

  // Largest rooms
  console.log('\n📏 TOP 5 LARGEST ROOMS:');
  const sortedByArea = [...brief.rooms].sort((a, b) => b.area_target - a.area_target);
  sortedByArea.slice(0, 5).forEach(room => {
    const totalArea = room.area_target * room.quantity;
    console.log(`   ${room.name.padEnd(45)} ${room.area_target.toString().padStart(4)} m² × ${room.quantity.toString().padStart(2)} = ${totalArea.toFixed(0).padStart(5)} m²`);
  });

  // Most numerous
  console.log('\n🔢 MOST NUMEROUS ROOMS:');
  const sortedByQty = [...brief.rooms].sort((a, b) => b.quantity - a.quantity);
  sortedByQty.slice(0, 5).forEach(room => {
    console.log(`   ${room.quantity.toString().padStart(3)}× ${room.name}`);
  });

  console.log('\n' + '='.repeat(70));
  console.log(`✅ ${brief.rooms.length} room types | ${brief.metadata.totalRooms} total rooms | ${brief.metadata.totalArea.toFixed(0)} m² total\n`);
}

main();
