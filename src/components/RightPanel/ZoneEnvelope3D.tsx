/**
 * 3D Zone Envelope Visualization
 * 
 * Renders program zones as translucent volumes with:
 * - Color by function type
 * - Height based on floor count
 * - Circulation buffer visualization
 * - Elastic property indicators
 */

import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import type { ProgramZoneNode, ZoneVariant } from '../../core/types';

interface ZoneEnvelopeProps {
  zone: ProgramZoneNode;
  variant: ZoneVariant;
  isSelected: boolean;
  isHovered: boolean;
  showCirculationBuffer?: boolean;
  showElasticIndicators?: boolean;
}

const FUNCTION_COLORS = {
  residential: '#4A90E2',   // Blue
  shared: '#7ED321',        // Green
  services: '#F5A623',      // Orange
  staff: '#9013FE',         // Purple
  support: '#B8B8B8'        // Gray
};

const FLOOR_HEIGHT = 3.0; // meters

export function ZoneEnvelope({
  zone,
  variant,
  isSelected,
  isHovered,
  showCirculationBuffer = true,
  showElasticIndicators = true
}: ZoneEnvelopeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const pulseRef = useRef(0);
  
  // Calculate dimensions from variant
  const width = Math.sqrt(variant.target_footprint * variant.preferred_aspect_ratio);
  const depth = variant.target_footprint / width;
  const height = variant.floor_count * FLOOR_HEIGHT;
  
  // Calculate circulation buffer dimensions
  const bufferRatio = zone.circulation_ratio;
  const bufferWidth = width * (1 + bufferRatio * 0.5);
  const bufferDepth = depth * (1 + bufferRatio * 0.5);
  
  // Get color
  const color = FUNCTION_COLORS[zone.function_type];
  const opacity = isSelected ? 0.6 : isHovered ? 0.4 : 0.3;
  
  // Animate pulse for elastic zones
  useFrame((state) => {
    if (zone.can_stretch || zone.can_split || zone.can_stack) {
      pulseRef.current = Math.sin(state.clock.elapsedTime * 2) * 0.05 + 1;
    }
  });
  
  return (
    <group ref={groupRef} position={[0, height / 2, 0]}>
      {/* Main zone volume */}
      <mesh>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={opacity}
        />
      </mesh>
      
      {/* Circulation buffer (outer halo) */}
      {showCirculationBuffer && bufferRatio > 0 && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[bufferWidth, height, bufferDepth]} />
          <meshStandardMaterial
            color={color}
            transparent
            opacity={0.1}
            wireframe={true}
          />
        </mesh>
      )}
      
      {/* Floor plates visualization */}
      {variant.floor_count > 1 && (
        <>
          {Array.from({ length: variant.floor_count - 1 }).map((_, i) => {
            const floorY = (-height / 2) + (i + 1) * FLOOR_HEIGHT;
            return (
              <mesh key={i} position={[0, floorY, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[width * 0.9, depth * 0.9]} />
                <meshBasicMaterial
                  color={color}
                  transparent
                  opacity={0.15}
                  side={THREE.DoubleSide}
                />
              </mesh>
            );
          })}
        </>
      )}
      
      {/* Zone label */}
      <Text
        position={[0, height / 2 + 1.5, 0]}
        fontSize={0.8}
        color={isSelected || isHovered ? '#ffffff' : color}
        anchorX="center"
        anchorY="bottom"
      >
        {zone.name}
      </Text>
      
      {/* Zone details label */}
      <Text
        position={[0, height / 2 + 0.8, 0]}
        fontSize={0.4}
        color="#999999"
        anchorX="center"
        anchorY="bottom"
      >
        {variant.strategy} • {variant.floor_count}F • {variant.target_footprint.toFixed(0)}m²
      </Text>
    </group>
  );
}

export default ZoneEnvelope;