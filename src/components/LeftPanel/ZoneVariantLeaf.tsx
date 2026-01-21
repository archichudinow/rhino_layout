/**
 * Zone Variant Leaf Component
 * Represents a single zone variant that can be selected
 */

import React from 'react';
import { useZoneStore } from '../../stores/zoneStore';
import type { ProgramZoneNode, ZoneVariant } from '../../core/types';
import './ZoneVariantLeaf.css';

interface ZoneVariantLeafProps {
  zone: ProgramZoneNode;
  variant: ZoneVariant;
}

export const ZoneVariantLeaf: React.FC<ZoneVariantLeafProps> = ({ zone, variant }) => {
  const { selectedVariantId, hoveredZoneId, selectVariant, hoverZone } = useZoneStore();
  
  const isActive = zone.activeVariantId === variant.id;
  const isSelected = selectedVariantId === variant.id;
  const isHovered = hoveredZoneId === zone.id;
  
  const handleClick = () => {
    selectVariant(zone.id, variant.id);
  };
  
  const handleMouseEnter = () => {
    hoverZone(zone.id);
  };
  
  const handleMouseLeave = () => {
    hoverZone(null);
  };
  
  return (
    <div
      className={`zone-variant-leaf ${isSelected ? 'selected' : ''} ${isActive ? 'locked' : ''} ${isHovered ? 'hovered' : ''}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="variant-status">{isActive ? '✓' : '•'}</span>
      <div className="variant-info">
        <div className="variant-name">{variant.strategy}</div>
        <div className="variant-details">
          {variant.floor_count}F × {variant.target_footprint.toFixed(0)}m²
        </div>
      </div>
    </div>
  );
};