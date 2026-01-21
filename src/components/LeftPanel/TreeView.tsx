import React from 'react';
import { useRoomStore } from '../../stores/roomStore';
import { FolderNode } from './FolderNode';
import { RoomNode } from './RoomNode';
import './TreeView.css';

export const TreeView: React.FC = () => {
  const { rooms, expandedFolders } = useRoomStore();
  const isRoomsFolderExpanded = expandedFolders.has('rooms');
  
  return (
    <div className="tree-view">
      <FolderNode 
        id="rooms" 
        name="Rooms" 
        expanded={isRoomsFolderExpanded}
        icon="📁"
      >
        {isRoomsFolderExpanded && rooms.map((room) => (
          <RoomNode key={room.id} room={room} />
        ))}
      </FolderNode>
      
      <FolderNode 
        id="function-groups" 
        name="Function Groups" 
        expanded={false}
        disabled
        icon="📁"
      >
        <div className="placeholder-node">Phase 2</div>
      </FolderNode>
      
      <FolderNode 
        id="building-variants" 
        name="Building Variants" 
        expanded={false}
        disabled
        icon="📁"
      >
        <div className="placeholder-node">Phase 3</div>
      </FolderNode>
    </div>
  );
};
