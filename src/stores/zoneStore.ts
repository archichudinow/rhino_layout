/**
 * Zone selection state management
 */

import { create } from 'zustand';
import type { ProgramZoneNode } from '../core/types';

interface ZoneSelectionState {
  zones: ProgramZoneNode[];
  selectedZoneId: string | null;
  selectedVariantId: string | null;
  hoveredZoneId: string | null;
  
  // Actions
  setZones: (zones: ProgramZoneNode[]) => void;
  selectZone: (zoneId: string | null) => void;
  selectVariant: (zoneId: string, variantId: string) => void;
  hoverZone: (zoneId: string | null) => void;
  lockVariant: (zoneId: string, variantId: string) => void;
  
  // Getters
  getZone: (zoneId: string) => ProgramZoneNode | undefined;
  getActiveVariant: (zoneId: string) => any | undefined;
}

export const useZoneStore = create<ZoneSelectionState>((set, get) => ({
  zones: [],
  selectedZoneId: null,
  selectedVariantId: null,
  hoveredZoneId: null,
  
  setZones: (zones) => set({ zones }),
  
  selectZone: (zoneId) => {
    if (zoneId === null) {
      set({ selectedZoneId: null, selectedVariantId: null });
      return;
    }
    
    const zone = get().zones.find(z => z.id === zoneId);
    if (zone) {
      set({
        selectedZoneId: zoneId,
        selectedVariantId: zone.activeVariantId || zone.variants[0]?.id || null
      });
    }
  },
  
  selectVariant: (zoneId, variantId) => {
    set({ selectedZoneId: zoneId, selectedVariantId: variantId });
  },
  
  hoverZone: (zoneId) => set({ hoveredZoneId: zoneId }),
  
  lockVariant: (zoneId, variantId) => {
    set((state) => ({
      zones: state.zones.map(zone =>
        zone.id === zoneId
          ? { ...zone, activeVariantId: variantId }
          : zone
      )
    }));
  },
  
  getZone: (zoneId) => {
    return get().zones.find(z => z.id === zoneId);
  },
  
  getActiveVariant: (zoneId) => {
    const zone = get().zones.find(z => z.id === zoneId);
    if (!zone) return undefined;
    
    const variantId = zone.activeVariantId || zone.variants[0]?.id;
    return zone.variants.find(v => v.id === variantId);
  }
}));