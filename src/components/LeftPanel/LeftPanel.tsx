import React, { useEffect, useState } from 'react';
import { useRoomStore } from '../../stores/roomStore';
import { useZoneStore } from '../../stores/zoneStore';
import { TreeView } from './TreeView';
import { ZoneFolder } from './ZoneFolder';
import briefData from '../../../inputs/brief-with-variants.json';
import './LeftPanel.css';

export const LeftPanel: React.FC = () => {
  const { loadRooms, getProgress, exportPreferences } = useRoomStore();
  const zones = useZoneStore(state => state.zones);
  const progress = getProgress();
  const [activeTab, setActiveTab] = useState<'rooms' | 'zones'>('zones');
  
  useEffect(() => {
    // Load room data on mount
    loadRooms(briefData.rooms as any);
  }, [loadRooms]);
  
  return (
    <div className="left-panel">
      <div className="panel-header">
        <h2>Layout Library</h2>
        
        {/* Tab selector */}
        <div className="tab-selector">
          <button
            className={`tab-button ${activeTab === 'rooms' ? 'active' : ''}`}
            onClick={() => setActiveTab('rooms')}
          >
            🏠 Rooms ({briefData.rooms.length})
          </button>
          <button
            className={`tab-button ${activeTab === 'zones' ? 'active' : ''}`}
            onClick={() => setActiveTab('zones')}
          >
            📦 Zones ({zones.length})
          </button>
        </div>
        
        {activeTab === 'rooms' && (
          <div className="progress-indicator">
            <span className="stat-item">✓ {progress.preferred} preferred</span>
            <span className="stat-item">✗ {progress.disliked} disliked</span>
            <span className="stat-item">{progress.reviewed} / {progress.total} reviewed</span>
          </div>
        )}
        
        {activeTab === 'zones' && (
          <div className="progress-indicator">
            <span className="stat-item">Total: {zones.reduce((sum, z) => sum + z.target_area_net * (1 + z.circulation_ratio), 0).toFixed(0)} m²</span>
          </div>
        )}
        
        <button 
          className="export-button"
          onClick={exportPreferences}
          title="Export preferences to JSON"
        >
          📥 Export
        </button>
      </div>
      <div className="panel-content">
        {activeTab === 'rooms' && <TreeView />}
        {activeTab === 'zones' && (
          <div className="zones-view">
            {zones.length === 0 ? (
              <div className="empty-state">
                <p>No zones loaded yet.</p>
                <p className="hint">Run: npm run generate-zones</p>
              </div>
            ) : (
              zones.map(zone => (
                <ZoneFolder key={zone.id} zone={zone} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
