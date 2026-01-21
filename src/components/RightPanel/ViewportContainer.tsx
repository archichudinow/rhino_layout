import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { RoomVariantMesh } from './RoomVariantMesh';
import { ZoneEnvelope } from './ZoneEnvelope3D';
import { useZoneStore } from '../../stores/zoneStore';
import './ViewportContainer.css';

export const ViewportContainer: React.FC = () => {
  const { selectedZoneId, selectedVariantId, getZone, zones } = useZoneStore();
  
  // Determine what to show
  const selectedZone = selectedZoneId ? getZone(selectedZoneId) : null;
  const selectedVariant = selectedZone && selectedVariantId 
    ? selectedZone.variants.find(v => v.id === selectedVariantId)
    : null;
  
  return (
    <div className="viewport-container">
      <Canvas
        orthographic
        camera={{ position: [15, 15, 15], zoom: 40, up: [0, 1, 0] } as any}
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.5} />
        
        {/* Grid helper on ground plane (XZ plane is horizontal by default) */}
        <Grid 
          args={[50, 50]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#e0e0e0"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#999999"
          fadeDistance={100}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid={false}
          position={[0, 0, 0]}
        />
        
        {/* Show selected zone or room */}
        {selectedZone && selectedVariant ? (
          <ZoneEnvelope
            zone={selectedZone}
            variant={selectedVariant}
            isSelected={true}
            isHovered={false}
            showCirculationBuffer={true}
            showElasticIndicators={true}
          />
        ) : (
          <RoomVariantMesh />
        )}
        
        {/* Camera controls - orbit around the scene */}
        <OrbitControls 
          enableRotate={true}
          enablePan={true}
          enableZoom={true}
          target={[0, 0, 0]}
          minZoom={10}
          maxZoom={200}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={5}
          maxDistance={50}
        />
      </Canvas>
      
      <div className="viewport-overlay">
        <div className="viewport-controls">
          <button className="control-btn" title="Reset Camera">↻</button>
          <button className="control-btn" title="Top View">⊤</button>
          <button className="control-btn" title="Isometric">◰</button>
        </div>
      </div>
    </div>
  );
};
