/**
 * Core data structures for the procedural layout generator
 */

export interface RoomNode {
  id: string;
  name: string;
  
  // Area constraints
  area_target: number;
  area_min: number;
  area_max: number;
  
  // Dimensional constraints
  width_range: [number, number];
  depth_range: [number, number];
  aspect_ratio_range: [number, number];
  
  // Functional requirements
  requires_daylight: boolean;
  requires_access: boolean;
  
  // Metadata
  category: 'client' | 'general' | 'supporting';
  quantity: number;
  notes?: string;
  
  // Visual
  color?: string;
  
  // Variants
  variants: RoomVariant[];
  activeVariantId?: string;
}

export interface RoomVariant {
  id: string;
  width: number;
  depth: number;
  area: number;
  
  // Edges for connectivity
  facade_edge?: 'north' | 'south' | 'east' | 'west';
  access_edge?: 'north' | 'south' | 'east' | 'west';
  
  notes?: string;
}

/**
 * LEVEL 2: Program Zones (Elastic Clusters)
 * 
 * Zones represent functional intentions WITHOUT room geometry.
 * They are abstract containers that can stretch, split, or stack.
 * 
 * IMPORTANT:
 * - Zones DO NOT contain room geometry yet
 * - Zones DO NOT have fixed positions
 * - Zones may stretch, split, or stack across floors
 */
export interface ProgramZoneNode {
  id: string;
  name: string;
  function_type: 'residential' | 'shared' | 'services' | 'staff' | 'support';
  
  // Area constraints (net usable area, excluding circulation)
  target_area_net: number;
  area_min: number;
  area_max: number;
  
  // Circulation buffer (added on top of net area)
  circulation_ratio: number; // 0.20 = 20% circulation buffer
  
  // Multi-floor capability
  allowed_levels: number[]; // e.g., [1, 2, 3] means zone can be 1, 2, or 3 floors
  preferred_level: number;
  
  // Functional requirements
  daylight_ratio: number; // 0.0 to 1.0 (% of zone area needing facade access)
  noise_tolerance: 'quiet' | 'moderate' | 'noisy';
  
  // Room type compatibility (NOT specific room instances)
  allowed_room_categories: string[]; // e.g., ['bedroom', 'living_room', 'kitchen']
  
  // Elastic properties
  can_stretch: boolean;  // Can zone elongate?
  can_split: boolean;    // Can zone divide into sub-zones?
  can_stack: boolean;    // Can zone exist on multiple floors?
  
  // Adjacency preferences (for Phase 3)
  prefers_adjacent_to?: string[]; // IDs of other zones
  must_avoid?: string[];          // IDs of zones to separate from
  
  // Variants (different zoning strategies)
  variants: ZoneVariant[];
  activeVariantId?: string;
  
  notes?: string;
}

/**
 * Zone Variant represents a specific strategy for organizing a zone
 * WITHOUT assigning exact room positions or dimensions
 */
export interface ZoneVariant {
  id: string;
  
  // Abstract envelope (intention, not geometry)
  target_footprint: number;  // Area per floor (m²)
  floor_count: number;       // How many levels this variant uses
  
  // Proportions (aspect ratio range, not exact dimensions)
  aspect_ratio_range: [number, number]; // e.g., [0.5, 2.0]
  preferred_aspect_ratio: number;
  
  // Capacity
  total_gross_area: number;  // Net area + circulation
  estimated_room_count: number;
  
  // Strategy description
  strategy: 'compact' | 'linear' | 'courtyard' | 'split' | 'stacked';
  
  notes?: string;
}

/**
 * LEGACY: GroupNode (Phase 4 - Room Fitting)
 * 
 * This represents actual room placement within zones.
 * NOT used until Phase 4 when we convert abstract zones into concrete geometry.
 * Kept here for future reference but not implemented yet.
 */
export interface GroupNode {
  id: string;
  name: string;
  roomIds: string[];
  
  groupType: 'single-loaded' | 'double-loaded' | 'clustered';
  circulation_ratio: number;
  
  variants: GroupVariant[];
  activeVariantId?: string;
}

export interface GroupVariant {
  id: string;
  envelope: {
    width: number;
    depth: number;
    area: number;
  };
  roomLayouts: RoomLayout[];
  circulation_area: number;
  
  access_edges: string[];
  facade_edges: string[];
  
  notes?: string;
}

export interface RoomLayout {
  roomId: string;
  variantId: string;
  position: { x: number; y: number };
  rotation: number;
}

export interface CoreNode {
  id: string;
  type: 'stairs' | 'lift' | 'services';
  position: { x: number; y: number };
  width: number;
  depth: number;
}

export interface BuildingLayout {
  id: string;
  name: string;
  floors: FloorLayout[];
  cores: CoreNode[];
}

export interface FloorLayout {
  level: number;
  groupIds: string[];
  groupVariantIds: string[];
}

/**
 * Normalized brief data structure from AI parsing
 */
export interface NormalizedBrief {
  rooms: RoomNode[];
  metadata: {
    projectName?: string;
    parsedAt: string;
    totalRooms: number;
    totalArea: number;
  };
}
