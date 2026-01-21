import React from 'react';
import { useRoomStore } from '../../stores/roomStore';
import { VariantLeaf } from './VariantLeaf';
import type { RoomNode as RoomNodeType } from '../../core/types';
import './RoomNode.css';

interface RoomNodeProps {
  room: RoomNodeType;
}

export const RoomNode: React.FC<RoomNodeProps> = ({ room }) => {
  const { expandedRooms, toggleRoom, variantPreferences } = useRoomStore();
  const isExpanded = expandedRooms.has(room.id);
  
  // Check if any variant in this room has a preference
  const hasPreferred = room.variants?.some(v => variantPreferences[v.id] === 'preferred');
  
  const handleClick = () => {
    toggleRoom(room.id);
  };
  
  return (
    <div className="room-node">
      <div 
        className={`room-header ${hasPreferred ? 'has-preferred' : ''}`}
        onClick={handleClick}
      >
        <span className="room-chevron">
          {isExpanded ? '▼' : '▶'}
        </span>
        <span className="room-icon">📄</span>
        <span className="room-name">{room.name}</span>
        {hasPreferred && <span className="preferred-indicator">★</span>}
      </div>
      {isExpanded && (
        <div className="room-variants">
          {room.variants && room.variants.length > 0 ? (
            room.variants.map((variant) => (
              <VariantLeaf 
                key={variant.id} 
                variant={variant} 
                room={room}
              />
            ))
          ) : (
            <div className="no-variants">No variants available</div>
          )}
        </div>
      )}
    </div>
  );
};
