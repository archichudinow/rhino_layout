import { useEffect } from 'react';
import { MainLayout } from './components/MainLayout';
import { useZoneStore } from './stores/zoneStore';
import './App.css';

// Import zone data
import zoneData from '../inputs/zone-variants.json';

function App() {
  const setZones = useZoneStore(state => state.setZones);
  
  // Load zones on mount
  useEffect(() => {
    if (zoneData && zoneData.zones) {
      setZones(zoneData.zones);
      console.log(`✅ Loaded ${zoneData.zones.length} program zones`);
    }
  }, [setZones]);
  
  return (
    <div className="App">
      <header className="app-header">
        <h1>Rhino Layout Generator</h1>
        <div className="phase-indicator">
          <span className="phase-badge">Phase 1: Room Scale</span>
          <span className="phase-badge active">Phase 2: Program Zones</span>
          <span className="phase-badge">Phase 3: Circulation</span>
        </div>
      </header>
      <MainLayout />
    </div>
  );
}

export default App;
