import { create } from 'zustand';
import type { RoomNode } from '../core/types';

type VariantPreference = 'preferred' | 'disliked' | null;

interface RoomSelectionState {
  // Data
  rooms: RoomNode[];
  
  // Selection state
  selectedRoomId: string | null;
  selectedVariantId: string | null;
  hoveredVariantId: string | null;
  
  // Variant preferences (variantId -> preference)
  variantPreferences: Record<string, VariantPreference>;
  
  // Expanded state for tree navigation
  expandedFolders: Set<string>;
  expandedRooms: Set<string>;
  
  // Actions
  loadRooms: (rooms: RoomNode[]) => void;
  selectVariant: (roomId: string, variantId: string) => void;
  hoverVariant: (variantId: string | null) => void;
  setPreference: (variantId: string, preference: VariantPreference) => void;
  toggleFolder: (folderId: string) => void;
  toggleRoom: (roomId: string) => void;
  exportPreferences: () => void;
  
  // Computed
  getProgress: () => { reviewed: number; preferred: number; disliked: number; total: number };
}

export const useRoomStore = create<RoomSelectionState>((set, get) => ({
  // Initial state
  rooms: [],
  selectedRoomId: null,
  selectedVariantId: null,
  hoveredVariantId: null,
  variantPreferences: {},
  expandedFolders: new Set(['rooms']), // 'rooms' folder expanded by default
  expandedRooms: new Set(),
  
  // Actions
  loadRooms: (rooms) => set({ rooms }),
  
  selectVariant: (roomId, variantId) => set({
    selectedRoomId: roomId,
    selectedVariantId: variantId,
  }),
  
  hoverVariant: (variantId) => set({
    hoveredVariantId: variantId,
  }),
  
  setPreference: (variantId, preference) => set((state) => {
    if (preference === null) {
      const { [variantId]: _, ...rest } = state.variantPreferences;
      return { variantPreferences: rest };
    }
    return {
      variantPreferences: {
        ...state.variantPreferences,
        [variantId]: preference,
      },
    };
  }),
  
  toggleFolder: (folderId) => set((state) => {
    const newExpanded = new Set(state.expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    return { expandedFolders: newExpanded };
  }),
  
  toggleRoom: (roomId) => set((state) => {
    const newExpanded = new Set(state.expandedRooms);
    if (newExpanded.has(roomId)) {
      newExpanded.delete(roomId);
    } else {
      newExpanded.add(roomId);
    }
    return { expandedRooms: newExpanded };
  }),
  
  getProgress: () => {
    const state = get();
    const prefs = Object.values(state.variantPreferences);
    return {
      reviewed: prefs.length,
      preferred: prefs.filter(p => p === 'preferred').length,
      disliked: prefs.filter(p => p === 'disliked').length,
      total: state.rooms.reduce((sum, room) => sum + (room.variants?.length || 0), 0),
    };
  },
  
  exportPreferences: () => {
    const state = get();
    const progress = get().getProgress();
    
    // Build room summary with preferences
    const roomSummary = state.rooms.map(room => ({
      id: room.id,
      name: room.name,
      quantity: room.quantity,
      variants: room.variants?.map(v => ({
        id: v.id,
        width: v.width,
        depth: v.depth,
        area: v.area,
        preference: state.variantPreferences[v.id] || null,
      })) || [],
    }));
    
    const exportData = {
      timestamp: new Date().toISOString(),
      stats: {
        totalRooms: state.rooms.length,
        totalVariants: progress.total,
        reviewed: progress.reviewed,
        preferred: progress.preferred,
        disliked: progress.disliked,
      },
      variantPreferences: state.variantPreferences,
      roomSummary,
    };
    
    // Create download
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `variant-preferences-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
}));
