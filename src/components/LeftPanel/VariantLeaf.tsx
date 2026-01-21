import React from 'react';
import { useRoomStore } from '../../stores/roomStore';
import type { RoomNode, RoomVariant } from '../../core/types';
import './VariantLeaf.css';

interface VariantLeafProps {
  variant: RoomVariant;
  room: RoomNode;
}

export const VariantLeaf: React.FC<VariantLeafProps> = ({ variant, room }) => {
  const { 
    selectedVariantId, 
    variantPreferences,
    selectVariant, 
    hoverVariant 
  } = useRoomStore();
  
  const isSelected = selectedVariantId === variant.id;
  const preference = variantPreferences[variant.id];
  
  const handleClick = () => {
    selectVariant(room.id, variant.id);
  };
  
  const handleMouseEnter = () => {
    hoverVariant(variant.id);
  };
  
  const handleMouseLeave = () => {
    hoverVariant(null);
  };
  
  // Extract variant number from ID (e.g., "room-1-var-2" -> "2")
  const variantNumber = variant.id.match(/var-(\d+)/)?.[1] || 
                        variant.id.match(/fallback-(\w+)/)?.[1]?.substring(0, 3) || '?';
  
  let preferenceClass = '';
  let preferenceIcon = null;
  if (preference === 'preferred') {
    preferenceClass = 'preferred';
    preferenceIcon = <span className="variant-preference">👍</span>;
  } else if (preference === 'disliked') {
    preferenceClass = 'disliked';
    preferenceIcon = <span className="variant-preference">👎</span>;
  }
  
  return (
    <div 
      className={`variant-leaf ${isSelected ? 'selected' : ''} ${preferenceClass}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="variant-bullet">•</span>
      <span className="variant-label">
        variant-{variantNumber}
      </span>
      <span className="variant-dimensions">
        {variant.width}×{variant.depth}m
      </span>
      {preferenceIcon}
    </div>
  );
};
