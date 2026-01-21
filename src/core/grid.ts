/**
 * Grid System - Foundational dimensional rules
 * 
 * ALL dimensions in the application must align to a 0.1m (100mm) grid.
 * This ensures:
 * - Predictable, buildable dimensions
 * - Avoids floating point precision issues
 * - Aligns with standard construction practices
 * - Simplifies validation and comparison
 */

// Core grid unit: 0.1 meter (100mm)
export const GRID_UNIT = 0.1;

/**
 * Snap a value to the nearest grid unit
 * @param value - Value in meters
 * @returns Value snapped to 0.1m grid
 */
export function snapToGrid(value: number): number {
  const snapped = Math.round(value / GRID_UNIT) * GRID_UNIT;
  // Fix floating point precision (e.g., 5.6000000000000005 -> 5.6)
  return Math.round(snapped * 10) / 10;
}

/**
 * Snap to grid and ensure minimum value
 * @param value - Value in meters
 * @param min - Minimum allowed value (will be snapped to grid)
 * @returns Value snapped to grid, at least min
 */
export function snapToGridMin(value: number, min: number): number {
  const snappedMin = snapToGrid(min);
  const snapped = snapToGrid(value);
  return Math.max(snapped, snappedMin);
}

/**
 * Snap to grid with min/max constraints
 * @param value - Value in meters
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns Value snapped to grid within [min, max]
 */
export function snapToGridRange(value: number, min: number, max: number): number {
  const snappedMin = snapToGrid(min);
  const snappedMax = snapToGrid(max);
  const snapped = snapToGrid(value);
  return Math.max(snappedMin, Math.min(snapped, snappedMax));
}

/**
 * Check if a value is aligned to grid
 * @param value - Value to check
 * @param tolerance - Tolerance for floating point comparison (default: 0.001)
 * @returns True if value is on grid
 */
export function isOnGrid(value: number, tolerance: number = 0.001): boolean {
  const snapped = snapToGrid(value);
  return Math.abs(value - snapped) < tolerance;
}

/**
 * Generate a range of values on grid
 * @param min - Minimum value
 * @param max - Maximum value
 * @param step - Step size in grid units (default: 1 = 0.1m)
 * @returns Array of values from min to max, stepped by grid units
 */
export function gridRange(min: number, max: number, step: number = 1): number[] {
  const snappedMin = snapToGrid(min);
  const snappedMax = snapToGrid(max);
  const stepSize = step * GRID_UNIT;
  
  const values: number[] = [];
  for (let v = snappedMin; v <= snappedMax; v += stepSize) {
    values.push(snapToGrid(v)); // Ensure precision
  }
  return values;
}

/**
 * Calculate area snapped to grid (width × depth)
 * @param width - Width in meters
 * @param depth - Depth in meters
 * @returns Area in m², calculated from grid-aligned dimensions
 */
export function gridArea(width: number, depth: number): number {
  const w = snapToGrid(width);
  const d = snapToGrid(depth);
  return snapToGrid(w * d);
}

/**
 * Format dimension for display (removes trailing zeros)
 * @param value - Value in meters
 * @returns Formatted string (e.g., "3.5m" not "3.50m")
 */
export function formatDimension(value: number): string {
  const snapped = snapToGrid(value);
  return `${snapped.toFixed(1).replace(/\.0$/, '')}m`;
}

/**
 * Validate that all values in an array are on grid
 * @param values - Array of values to check
 * @returns Object with validation result and any off-grid values
 */
export function validateGridAlignment(values: number[]): {
  valid: boolean;
  offGrid: number[];
} {
  const offGrid = values.filter(v => !isOnGrid(v));
  return {
    valid: offGrid.length === 0,
    offGrid
  };
}

/**
 * Common dimension presets (all on 0.1m grid)
 */
export const DIMENSIONS = {
  // Minimum dimensions
  MIN_ROOM_WIDTH: 2.4,      // 2.4m minimum room width
  MIN_ROOM_DEPTH: 2.4,      // 2.4m minimum room depth
  MIN_CORRIDOR: 1.2,        // 1.2m minimum corridor
  MIN_DOOR: 0.9,            // 0.9m minimum door
  
  // Standard increments (in grid units, multiply by GRID_UNIT)
  SMALL_STEP: 5,            // 0.5m steps for small adjustments
  STANDARD_STEP: 10,        // 1.0m steps for standard rooms
  LARGE_STEP: 20,           // 2.0m steps for large spaces
  
  // Typical ranges
  TYPICAL_WIDTH: [3.0, 6.0] as [number, number],
  TYPICAL_DEPTH: [3.0, 6.0] as [number, number],
  TYPICAL_CEILING: 2.7,     // 2.7m typical ceiling height
} as const;
