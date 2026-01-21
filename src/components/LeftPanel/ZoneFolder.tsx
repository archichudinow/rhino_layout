/**
 * Zone Folder Component
 * Displays a collapsible folder containing zone variants
 */

import React, { useState } from 'react';
import { useZoneStore } from '../../stores/zoneStore';
import { ZoneVariantLeaf } from './ZoneVariantLeaf';
import type { ProgramZoneNode } from '../../core/types';
import './ZoneFolder.css';

interface ZoneFolderProps {
  zone: ProgramZoneNode;
}

export const ZoneFolder: React.FC<ZoneFolderProps> = ({ zone }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const selectedZoneId = useZoneStore(state => state.selectedZoneId);
  const isSelected = selectedZoneId === zone.id;
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Function type emoji
  const getFunctionEmoji = (type: string) => {
    switch (type) {
      case 'residential': return '🏠';
      case 'shared': return '👥';
      case 'services': return '🏢';
      case 'staff': return '💼';
      case 'support': return '🔧';
      default: return '📦';
    }
  };
  
  return (
    <div className={`zone-folder ${isSelected ? 'selected' : ''}`}>
      <div className="zone-folder-header" onClick={toggleExpand}>
        <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
        <span className="zone-icon">{getFunctionEmoji(zone.function_type)}</span>
        <span className="zone-name">{zone.name}</span>
        <span className="zone-variant-count">({zone.variants.length})</span>
      </div>
      
      {isExpanded && (
        <div className="zone-variants">
          {zone.variants.map((variant) => (
            <ZoneVariantLeaf
              key={variant.id}
              zone={zone}
              variant={variant}
            />
          ))}
        </div>
      )}
    </div>
  );
};