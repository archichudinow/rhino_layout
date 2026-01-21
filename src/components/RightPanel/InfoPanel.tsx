import React, { useMemo } from 'react';
import { useRoomStore } from '../../stores/roomStore';
import { useZoneStore } from '../../stores/zoneStore';
import './InfoPanel.css';

export const InfoPanel: React.FC = () => {
  const { 
    rooms, 
    selectedRoomId, 
    selectedVariantId: roomVariantId, 
    variantPreferences,
    setPreference
  } = useRoomStore();
  
  const {
    selectedZoneId,
    selectedVariantId: zoneVariantId,
    getZone,
    lockVariant
  } = useZoneStore();
  
  // Check if we're showing zone or room info
  const selectedZone = selectedZoneId ? getZone(selectedZoneId) : null;
  const selectedZoneVariant = selectedZone && zoneVariantId
    ? selectedZone.variants.find(v => v.id === zoneVariantId)
    : null;
  
  const selectedRoomData = useMemo(() => {
    if (!selectedRoomId || !roomVariantId) return null;
    
    const room = rooms.find(r => r.id === selectedRoomId);
    if (!room) return null;
    
    const variant = room.variants?.find(v => v.id === roomVariantId);
    if (!variant) return null;
    
    return { room, variant };
  }, [rooms, selectedRoomId, roomVariantId]);
  
  // Show zone info if zone is selected
  if (selectedZone && selectedZoneVariant) {
    const isLocked = selectedZone.activeVariantId === selectedZoneVariant.id;
    const grossArea = selectedZone.target_area_net * (1 + selectedZone.circulation_ratio);
    const circulationArea = grossArea - selectedZone.target_area_net;
    
    return (
      <div className="info-panel">
        <div className="info-header">
          <h3>Zone Details</h3>
          <button 
            className={`lock-button ${isLocked ? 'locked' : ''}`}
            onClick={() => lockVariant(selectedZone.id, selectedZoneVariant.id)}
            title={isLocked ? "This variant is locked" : "Lock this variant"}
          >
            {isLocked ? '🔒 Locked' : '🔓 Lock'}
          </button>
        </div>
        
        <div className="info-content">
          <div className="info-field">
            <span className="field-label">Zone</span>
            <span className="field-value">{selectedZone.name}</span>
          </div>
          
          <div className="info-field">
            <span className="field-label">Function Type</span>
            <span className="field-value">{selectedZone.function_type}</span>
          </div>
          
          <div className="info-field">
            <span className="field-label">Strategy</span>
            <span className="field-value">{selectedZoneVariant.strategy}</span>
          </div>
          
          <div className="info-group">
            <h4>Area Breakdown</h4>
            <div className="info-field">
              <span className="field-label">Net Usable</span>
              <span className="field-value">{selectedZone.target_area_net.toFixed(0)} m²</span>
            </div>
            <div className="info-field">
              <span className="field-label">Circulation</span>
              <span className="field-value">{circulationArea.toFixed(0)} m² ({(selectedZone.circulation_ratio * 100).toFixed(0)}%)</span>
            </div>
            <div className="info-field">
              <span className="field-label">Gross Total</span>
              <span className="field-value total">{grossArea.toFixed(0)} m²</span>
            </div>
          </div>
          
          <div className="info-group">
            <h4>Configuration</h4>
            <div className="info-field">
              <span className="field-label">Floors</span>
              <span className="field-value">{selectedZoneVariant.floor_count}</span>
            </div>
            <div className="info-field">
              <span className="field-label">Footprint/Floor</span>
              <span className="field-value">{selectedZoneVariant.target_footprint.toFixed(0)} m²</span>
            </div>
            <div className="info-field">
              <span className="field-label">Aspect Ratio</span>
              <span className="field-value">{selectedZoneVariant.preferred_aspect_ratio.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="info-group">
            <h4>Requirements</h4>
            <div className="info-field">
              <span className="field-label">Daylight</span>
              <span className="field-value">{(selectedZone.daylight_ratio * 100).toFixed(0)}% of zone</span>
            </div>
            <div className="info-field">
              <span className="field-label">Noise Tolerance</span>
              <span className="field-value">{selectedZone.noise_tolerance}</span>
            </div>
            <div className="info-field">
              <span className="field-label">Estimated Rooms</span>
              <span className="field-value">~{selectedZoneVariant.estimated_room_count}</span>
            </div>
          </div>
          
          <div className="info-group">
            <h4>Elastic Properties</h4>
            <div className="info-field">
              <span className="field-label">Can Stretch</span>
              <span className="field-value">{selectedZone.can_stretch ? '✅ Yes' : '❌ No'}</span>
            </div>
            <div className="info-field">
              <span className="field-label">Can Split</span>
              <span className="field-value">{selectedZone.can_split ? '✅ Yes' : '❌ No'}</span>
            </div>
            <div className="info-field">
              <span className="field-label">Can Stack</span>
              <span className="field-value">{selectedZone.can_stack ? '✅ Yes' : '❌ No'}</span>
            </div>
          </div>
          
          <div className="info-group">
            <h4>Allowed Room Types</h4>
            <div className="room-categories">
              {selectedZone.allowed_room_categories.map(cat => (
                <span key={cat} className="category-tag">{cat}</span>
              ))}
            </div>
          </div>
          
          {selectedZone.notes && (
            <div className="info-group ai-reasoning">
              <h4>🤖 AI Reasoning</h4>
              <p className="ai-explanation">{selectedZone.notes}</p>
            </div>
          )}
          
          {selectedZoneVariant.notes && (
            <div className="info-group variant-strategy">
              <h4>Strategy: {selectedZoneVariant.strategy}</h4>
              <p className="strategy-explanation">{selectedZoneVariant.notes}</p>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Show room info if room is selected
  // Show room info if room is selected
  if (selectedRoomData) {
    const { room, variant } = selectedRoomData;
    const preference = variantPreferences[variant.id];
    
    const handlePreference = (pref: 'preferred' | 'disliked' | null) => {
      setPreference(variant.id, pref);
    };
    
    return (
      <div className="info-panel">
        <div className="info-header">
          <h3>Variant Details</h3>
          <div className="header-actions">
            <button 
              className={`pref-icon-btn like ${preference === 'preferred' ? 'active' : ''}`}
              onClick={() => handlePreference(preference === 'preferred' ? null : 'preferred')}
              title="Mark as preferred variant"
            >
              👍
            </button>
            <button 
              className={`pref-icon-btn dislike ${preference === 'disliked' ? 'active' : ''}`}
              onClick={() => handlePreference(preference === 'disliked' ? null : 'disliked')}
              title="Mark as unsuitable variant"
            >
              👎
            </button>
          </div>
        </div>
        
        <div className="info-content">
          <div className="info-field">
            <span className="field-label">Name</span>
            <span className="field-value">{room.name}</span>
          </div>
          
          <div className="info-field">
            <span className="field-label">Variant ID</span>
            <span className="field-value">{variant.id}</span>
          </div>
          
          <div className="info-field">
            <span className="field-label">Quantity</span>
            <span className="field-value">{room.quantity} units</span>
          </div>
          
          <div className="info-field">
            <span className="field-label">Sizes</span>
            <span className="field-value dimensions">
              {variant.width}m × {variant.depth}m
            </span>
          </div>
          
          <div className="info-field">
            <span className="field-label">Area</span>
            <span className="field-value">{variant.area}m²</span>
          </div>
          
          <div className="info-field">
            <span className="field-label">Facade Edge</span>
            <span className="field-value edge-badge facade">
              {variant.facade_edge || 'N/A'}
            </span>
          </div>
          
          <div className="info-field">
            <span className="field-label">Access Edge</span>
            <span className="field-value edge-badge access">
              {variant.access_edge || 'N/A'}
            </span>
          </div>
          
          <div className="info-field full-width">
            <span className="field-label">Notes</span>
            <span className="field-value notes">{variant.notes || 'No notes available'}</span>
          </div>
          
          <div className="info-field full-width">
            <span className="field-label">Category</span>
            <span className={`field-value category-badge ${room.category}`}>
              {room.category}
            </span>
          </div>
          
          {room.requires_daylight && (
            <div className="info-field full-width">
              <span className="field-value daylight-indicator">
                ☀️ Requires daylight
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Show empty state if nothing is selected
  return (
    <div className="info-panel">
      <div className="info-empty-state">
        <div className="empty-icon">📄</div>
        <p>No selection</p>
        <p className="empty-hint">Click on a variant in the left panel to view details</p>
      </div>
    </div>
  );
};
