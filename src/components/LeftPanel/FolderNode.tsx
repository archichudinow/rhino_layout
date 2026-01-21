import React from 'react';
import { useRoomStore } from '../../stores/roomStore';
import './FolderNode.css';

interface FolderNodeProps {
  id: string;
  name: string;
  icon: string;
  expanded: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const FolderNode: React.FC<FolderNodeProps> = ({
  id,
  name,
  icon,
  expanded,
  disabled = false,
  children,
}) => {
  const { toggleFolder } = useRoomStore();
  
  const handleClick = () => {
    if (!disabled) {
      toggleFolder(id);
    }
  };
  
  return (
    <div className={`folder-node ${disabled ? 'disabled' : ''}`}>
      <div 
        className="folder-header"
        onClick={handleClick}
      >
        <span className="folder-chevron">
          {expanded ? '▼' : '▶'}
        </span>
        <span className="folder-icon">{icon}</span>
        <span className="folder-name">{name}</span>
      </div>
      {expanded && (
        <div className="folder-children">
          {children}
        </div>
      )}
    </div>
  );
};
