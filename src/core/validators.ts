/**
 * Validation functions for room dimensions and layouts
 */

import { snapToGrid, isOnGrid, gridArea, DIMENSIONS } from './grid.js';
import type { RoomNode, RoomVariant } from './types.js';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate room node constraints
 */
export function validateRoomNode(room: RoomNode): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check grid alignment
  if (!isOnGrid(room.area_target)) {
    errors.push(`area_target ${room.area_target} is not aligned to 0.1m grid`);
  }
  if (!isOnGrid(room.area_min)) {
    errors.push(`area_min ${room.area_min} is not aligned to 0.1m grid`);
  }
  if (!isOnGrid(room.area_max)) {
    errors.push(`area_max ${room.area_max} is not aligned to 0.1m grid`);
  }

  // Check ranges
  if (!isOnGrid(room.width_range[0]) || !isOnGrid(room.width_range[1])) {
    errors.push('width_range not aligned to grid');
  }
  if (!isOnGrid(room.depth_range[0]) || !isOnGrid(room.depth_range[1])) {
    errors.push('depth_range not aligned to grid');
  }

  // Check logical constraints
  if (room.area_min > room.area_target) {
    errors.push('area_min cannot be greater than area_target');
  }
  if (room.area_max < room.area_target) {
    errors.push('area_max cannot be less than area_target');
  }
  if (room.width_range[0] > room.width_range[1]) {
    errors.push('width_range min cannot be greater than max');
  }
  if (room.depth_range[0] > room.depth_range[1]) {
    errors.push('depth_range min cannot be greater than max');
  }

  // Check minimum dimensions
  if (room.width_range[0] < DIMENSIONS.MIN_ROOM_WIDTH) {
    warnings.push(`Minimum width ${room.width_range[0]}m is below recommended ${DIMENSIONS.MIN_ROOM_WIDTH}m`);
  }
  if (room.depth_range[0] < DIMENSIONS.MIN_ROOM_DEPTH) {
    warnings.push(`Minimum depth ${room.depth_range[0]}m is below recommended ${DIMENSIONS.MIN_ROOM_DEPTH}m`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate room variant dimensions
 */
export function validateRoomVariant(variant: RoomVariant, room: RoomNode): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check grid alignment
  if (!isOnGrid(variant.width)) {
    errors.push(`Width ${variant.width} is not aligned to 0.1m grid`);
  }
  if (!isOnGrid(variant.depth)) {
    errors.push(`Depth ${variant.depth} is not aligned to 0.1m grid`);
  }
  if (!isOnGrid(variant.area)) {
    errors.push(`Area ${variant.area} is not aligned to 0.1m grid`);
  }

  // Check dimensional constraints
  if (variant.width < room.width_range[0] || variant.width > room.width_range[1]) {
    errors.push(`Width ${variant.width}m outside range [${room.width_range[0]}, ${room.width_range[1]}]`);
  }
  if (variant.depth < room.depth_range[0] || variant.depth > room.depth_range[1]) {
    errors.push(`Depth ${variant.depth}m outside range [${room.depth_range[0]}, ${room.depth_range[1]}]`);
  }

  // Check area calculation
  const calculatedArea = gridArea(variant.width, variant.depth);
  if (Math.abs(calculatedArea - variant.area) > 0.01) {
    errors.push(`Area mismatch: ${variant.area}m² stated, ${calculatedArea}m² calculated`);
  }

  // Check area constraints
  if (variant.area < room.area_min || variant.area > room.area_max) {
    errors.push(`Area ${variant.area}m² outside range [${room.area_min}, ${room.area_max}]`);
  }

  // Check aspect ratio
  const aspectRatio = variant.width / variant.depth;
  const [minRatio, maxRatio] = room.aspect_ratio_range;
  if (aspectRatio < minRatio || aspectRatio > maxRatio) {
    warnings.push(`Aspect ratio ${aspectRatio.toFixed(2)} outside preferred range [${minRatio}, ${maxRatio}]`);
  }

  // Check minimum dimensions
  if (variant.width < DIMENSIONS.MIN_ROOM_WIDTH || variant.depth < DIMENSIONS.MIN_ROOM_DEPTH) {
    errors.push(`Dimensions below minimum buildable size (${DIMENSIONS.MIN_ROOM_WIDTH}m × ${DIMENSIONS.MIN_ROOM_DEPTH}m)`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Check if area target is achievable within dimensional constraints
 */
export function checkAreaFeasibility(room: RoomNode): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const [minWidth, maxWidth] = room.width_range;
  const [minDepth, maxDepth] = room.depth_range;

  const minPossibleArea = gridArea(minWidth, minDepth);
  const maxPossibleArea = gridArea(maxWidth, maxDepth);

  if (room.area_target < minPossibleArea) {
    errors.push(`Target area ${room.area_target}m² too small for width/depth ranges (min possible: ${minPossibleArea}m²)`);
  }

  if (room.area_target > maxPossibleArea) {
    errors.push(`Target area ${room.area_target}m² too large for width/depth ranges (max possible: ${maxPossibleArea}m²)`);
  }

  if (room.area_min > maxPossibleArea || room.area_max < minPossibleArea) {
    errors.push('Area constraints incompatible with dimensional constraints');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
