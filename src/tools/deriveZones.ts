/**
 * PHASE 2: Zone Derivation Tool
 * 
 * Analyzes normalized brief to identify logical program zones.
 */

import type { RoomNode, ProgramZoneNode, ZoneVariant } from '../core/types';

interface ZoneCluster {
  name: string;
  functionType: 'residential' | 'shared' | 'services' | 'staff' | 'support';
  rooms: RoomNode[];
  totalRooms: number;
  totalArea: number;
  avgDaylightRequirement: number;
  canStack: boolean;
  canSplit: boolean;
}

/**
 * Derive program zones from normalized room data
 */
export function deriveZones(rooms: RoomNode[]): ProgramZoneNode[] {
  console.log('🔍 Analyzing brief to derive program zones...');
  
  // Step 1: Cluster rooms by function
  const clusters = clusterRoomsByFunction(rooms);
  
  // Step 2: Create zone nodes from clusters
  const zones: ProgramZoneNode[] = clusters.map((cluster, index) => {
    const circulationRatio = estimateCirculationRatio(cluster.functionType, cluster.totalRooms);
    const allowedLevels = determineAllowedLevels(cluster);
    const roomCategories = extractRoomCategories(cluster.rooms);
    
    const zoneBase: Omit<ProgramZoneNode, 'variants' | 'activeVariantId'> = {
      id: `zone-${index + 1}`,
      name: cluster.name,
      function_type: cluster.functionType,
      target_area_net: cluster.totalArea,
      area_min: cluster.totalArea * 0.9,
      area_max: cluster.totalArea * 1.1,
      circulation_ratio: circulationRatio,
      allowed_levels: allowedLevels,
      preferred_level: determinePreferredLevel(cluster, allowedLevels),
      daylight_ratio: cluster.avgDaylightRequirement,
      noise_tolerance: determineNoiseTolerance(cluster.functionType),
      allowed_room_categories: roomCategories,
      can_stretch: cluster.totalRooms < 20,
      can_split: cluster.totalRooms > 30,
      can_stack: cluster.canStack,
      notes: generateZoneNotes(cluster)
    };
    
    return generateZoneVariants(zoneBase);
  });
  
  console.log(`✅ Created ${zones.length} program zones`);
  zones.forEach(zone => {
    const gross = zone.target_area_net * (1 + zone.circulation_ratio);
    console.log(`   📦 ${zone.name}: ${zone.target_area_net.toFixed(0)}m² net + ${(gross - zone.target_area_net).toFixed(0)}m² circ = ${gross.toFixed(0)}m² gross`);
  });
  
  return zones;
}

/**
 * Cluster rooms into functional groups
 */
function clusterRoomsByFunction(rooms: RoomNode[]): ZoneCluster[] {
  const clusters: ZoneCluster[] = [];
  
  // Group by category first
  const byCategory = rooms.reduce((acc, room) => {
    if (!acc[room.category]) acc[room.category] = [];
    acc[room.category].push(room);
    return acc;
  }, {} as Record<string, RoomNode[]>);
  
  // Client facilities - split into residential core and shared
  if (byCategory.client) {
    // Separate high-quantity residential units from shared spaces
    const residentialUnits = byCategory.client.filter(r => 
      r.quantity >= 20 || r.name.toLowerCase().includes('bedroom') || r.name.toLowerCase().includes('living')
    );
    
    const sharedSpaces = byCategory.client.filter(r => 
      r.quantity < 20 && (r.name.toLowerCase().includes('shared') || 
      r.name.toLowerCase().includes('dining') || 
      r.name.toLowerCase().includes('kitchen') ||
      r.name.toLowerCase().includes('relaxation'))
    );
    
    if (residentialUnits.length > 0) {
      const totalRooms = residentialUnits.reduce((sum, r) => sum + r.quantity, 0);
      const totalArea = residentialUnits.reduce((sum, r) => sum + r.area_target * r.quantity, 0);
      const avgDaylight = residentialUnits.reduce((sum, r) => sum + (r.requires_daylight ? 1 : 0), 0) / residentialUnits.length;
      
      clusters.push({
        name: 'Residential Core',
        functionType: 'residential',
        rooms: residentialUnits,
        totalRooms,
        totalArea,
        avgDaylightRequirement: avgDaylight,
        canStack: totalRooms > 20,
        canSplit: totalRooms > 50
      });
    }
    
    if (sharedSpaces.length > 0) {
      const totalRooms = sharedSpaces.reduce((sum, r) => sum + r.quantity, 0);
      const totalArea = sharedSpaces.reduce((sum, r) => sum + r.area_target * r.quantity, 0);
      const avgDaylight = sharedSpaces.reduce((sum, r) => sum + (r.requires_daylight ? 1 : 0), 0) / sharedSpaces.length;
      
      clusters.push({
        name: 'Shared Facilities',
        functionType: 'shared',
        rooms: sharedSpaces,
        totalRooms,
        totalArea,
        avgDaylightRequirement: avgDaylight,
        canStack: false,
        canSplit: totalRooms > 15
      });
    }
  }
  
  // General facilities
  if (byCategory.general && byCategory.general.length > 0) {
    const totalRooms = byCategory.general.reduce((sum, r) => sum + r.quantity, 0);
    const totalArea = byCategory.general.reduce((sum, r) => sum + r.area_target * r.quantity, 0);
    const avgDaylight = byCategory.general.reduce((sum, r) => sum + (r.requires_daylight ? 1 : 0), 0) / byCategory.general.length;
    
    clusters.push({
      name: 'General Facilities',
      functionType: 'services',
      rooms: byCategory.general,
      totalRooms,
      totalArea,
      avgDaylightRequirement: avgDaylight,
      canStack: false,
      canSplit: totalRooms > 20
    });
  }
  
  // Supporting facilities - split staff offices from services
  if (byCategory.supporting) {
    const staffRooms = byCategory.supporting.filter(r =>
      r.name.toLowerCase().includes('office') ||
      r.name.toLowerCase().includes('staff') ||
      r.name.toLowerCase().includes('manager')
    );
    
    const serviceRooms = byCategory.supporting.filter(r =>
      !r.name.toLowerCase().includes('office') &&
      !r.name.toLowerCase().includes('staff') &&
      !r.name.toLowerCase().includes('manager')
    );
    
    if (staffRooms.length > 0) {
      const totalRooms = staffRooms.reduce((sum, r) => sum + r.quantity, 0);
      const totalArea = staffRooms.reduce((sum, r) => sum + r.area_target * r.quantity, 0);
      const avgDaylight = staffRooms.reduce((sum, r) => sum + (r.requires_daylight ? 1 : 0), 0) / staffRooms.length;
      
      clusters.push({
        name: 'Staff Spaces',
        functionType: 'staff',
        rooms: staffRooms,
        totalRooms,
        totalArea,
        avgDaylightRequirement: avgDaylight,
        canStack: false,
        canSplit: false
      });
    }
    
    if (serviceRooms.length > 0) {
      const totalRooms = serviceRooms.reduce((sum, r) => sum + r.quantity, 0);
      const totalArea = serviceRooms.reduce((sum, r) => sum + r.area_target * r.quantity, 0);
      const avgDaylight = serviceRooms.reduce((sum, r) => sum + (r.requires_daylight ? 1 : 0), 0) / serviceRooms.length;
      
      clusters.push({
        name: 'Support Services',
        functionType: 'support',
        rooms: serviceRooms,
        totalRooms,
        totalArea,
        avgDaylightRequirement: avgDaylight,
        canStack: false,
        canSplit: totalRooms > 20
      });
    }
  }
  
  return clusters;
}

/**
 * Generate variants for a single zone
 */
export function generateZoneVariants(
  zone: Omit<ProgramZoneNode, 'variants' | 'activeVariantId'>
): ProgramZoneNode {
  const variants: ZoneVariant[] = [];
  const grossArea = zone.target_area_net * (1 + zone.circulation_ratio);
  
  // Generate variants based on zone capabilities
  if (zone.can_stack) {
    // Stacked strategy - multiple identical floors
    for (const floorCount of [3, 4, 5]) {
      if (zone.allowed_levels.includes(floorCount)) {
        const footprint = zone.target_area_net / floorCount;
        const aspectRatio = calculateOptimalAspectRatio(footprint, 'stacked');
        
        variants.push({
          id: `var-stacked-${floorCount}f`,
          target_footprint: footprint,
          floor_count: floorCount,
          aspect_ratio_range: [aspectRatio * 0.8, aspectRatio * 1.2],
          preferred_aspect_ratio: aspectRatio,
          total_gross_area: grossArea,
          estimated_room_count: Math.floor(zone.target_area_net / 30), // Rough estimate
          strategy: 'stacked',
          notes: `${floorCount} floors, ${footprint.toFixed(0)}m² per floor`
        });
      }
    }
  }
  
  // Compact strategy - minimize footprint
  if (zone.allowed_levels.length > 1) {
    const maxFloors = Math.max(...zone.allowed_levels);
    const footprint = zone.target_area_net / maxFloors;
    const aspectRatio = 1.0; // Square for compact
    
    variants.push({
      id: 'var-compact',
      target_footprint: footprint,
      floor_count: maxFloors,
      aspect_ratio_range: [0.8, 1.2],
      preferred_aspect_ratio: aspectRatio,
      total_gross_area: grossArea,
      estimated_room_count: Math.floor(zone.target_area_net / 30),
      strategy: 'compact',
      notes: `Minimize footprint, ${maxFloors} floors`
    });
  }
  
  // Linear strategy - elongated single or dual level
  const linearFloors = Math.min(2, Math.max(...zone.allowed_levels));
  const linearFootprint = zone.target_area_net / linearFloors;
  variants.push({
    id: 'var-linear',
    target_footprint: linearFootprint,
    floor_count: linearFloors,
    aspect_ratio_range: [2.0, 3.5],
    preferred_aspect_ratio: 2.5,
    total_gross_area: grossArea,
    estimated_room_count: Math.floor(zone.target_area_net / 30),
    strategy: 'linear',
    notes: `Maximize facade, ${linearFloors} floor(s)`
  });
  
  // Split strategy if zone can be divided
  if (zone.can_split) {
    const splitFloors = zone.preferred_level;
    const footprint = zone.target_area_net / splitFloors;
    
    variants.push({
      id: 'var-split',
      target_footprint: footprint,
      floor_count: splitFloors,
      aspect_ratio_range: [1.2, 2.0],
      preferred_aspect_ratio: 1.5,
      total_gross_area: grossArea,
      estimated_room_count: Math.floor(zone.target_area_net / 30),
      strategy: 'split',
      notes: `Divide into 2-3 buildings, ${splitFloors} floors each`
    });
  }
  
  return {
    ...zone,
    variants,
    activeVariantId: variants[0]?.id
  };
}

/**
 * Determine allowed number of levels for a zone
 */
function determineAllowedLevels(cluster: ZoneCluster): number[] {
  if (cluster.functionType === 'residential' && cluster.totalRooms > 30) {
    return [3, 4, 5]; // High-rise residential
  }
  if (cluster.functionType === 'shared' || cluster.functionType === 'services') {
    return [1, 2]; // Ground + first floor
  }
  if (cluster.functionType === 'staff' || cluster.functionType === 'support') {
    return [1, 2]; // Low-rise
  }
  return [1, 2, 3];
}

/**
 * Determine preferred floor count
 */
function determinePreferredLevel(cluster: ZoneCluster, allowedLevels: number[]): number {
  if (cluster.functionType === 'residential' && cluster.totalRooms > 50) {
    return 4; // Prefer 4 floors for large residential
  }
  return allowedLevels[Math.floor(allowedLevels.length / 2)] || 1;
}

/**
 * Calculate optimal aspect ratio for a strategy
 */
function calculateOptimalAspectRatio(footprint: number, strategy: string): number {
  if (strategy === 'stacked') return 1.0; // Square for efficiency
  if (strategy === 'linear') return 2.5; // Long and narrow
  if (strategy === 'compact') return 1.0; // Square
  return 1.5; // Default
}

/**
 * Estimate circulation ratio based on function type
 */
function estimateCirculationRatio(functionType: string, roomCount: number): number {
  if (functionType === 'residential') return 0.35; // 35% for corridors/stairs
  if (functionType === 'shared') return 0.25; // 25% for open plans
  if (functionType === 'services') return 0.30; // 30% for public access
  if (functionType === 'staff') return 0.20; // 20% for office layouts
  if (functionType === 'support') return 0.25; // 25% for service access
  return 0.30;
}

/**
 * Determine noise tolerance
 */
function determineNoiseTolerance(functionType: string): 'quiet' | 'moderate' | 'noisy' {
  if (functionType === 'residential') return 'quiet';
  if (functionType === 'staff') return 'quiet';
  if (functionType === 'shared') return 'moderate';
  if (functionType === 'services') return 'moderate';
  return 'moderate';
}

/**
 * Extract unique room categories from cluster
 */
function extractRoomCategories(rooms: RoomNode[]): string[] {
  const categories = new Set<string>();
  rooms.forEach(room => {
    // Extract category from room name
    const name = room.name.toLowerCase();
    if (name.includes('bedroom') || name.includes('living')) categories.add('bedroom');
    if (name.includes('bathroom')) categories.add('bathroom');
    if (name.includes('kitchen')) categories.add('kitchen');
    if (name.includes('dining')) categories.add('dining');
    if (name.includes('office')) categories.add('office');
    if (name.includes('storage')) categories.add('storage');
    if (name.includes('lounge') || name.includes('relaxation')) categories.add('lounge');
    if (name.includes('meeting')) categories.add('meeting');
  });
  return Array.from(categories);
}

/**
 * Generate descriptive notes for zone
 */
function generateZoneNotes(cluster: ZoneCluster): string {
  const notes: string[] = [];
  notes.push(`Contains ${cluster.totalRooms} rooms across ${cluster.rooms.length} types`);
  notes.push(`Total net area: ${cluster.totalArea.toFixed(0)}m²`);
  if (cluster.avgDaylightRequirement > 0.7) {
    notes.push('High daylight requirement');
  }
  return notes.join('. ');
}
