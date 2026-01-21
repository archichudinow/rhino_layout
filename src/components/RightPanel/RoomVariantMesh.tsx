import React, { useMemo } from 'react';
import { useRoomStore } from '../../stores/roomStore';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

export const RoomVariantMesh: React.FC = () => {
  const { rooms, selectedRoomId, selectedVariantId } = useRoomStore();
  
  const selectedData = useMemo(() => {
    if (!selectedRoomId || !selectedVariantId) return null;
    
    const room = rooms.find(r => r.id === selectedRoomId);
    if (!room) return null;
    
    const variant = room.variants?.find(v => v.id === selectedVariantId);
    if (!variant) return null;
    
    return { room, variant };
  }, [rooms, selectedRoomId, selectedVariantId]);
  
  if (!selectedData) {
    return (
      <Text
        position={[0, 2, 0]}
        fontSize={0.8}
        color="#95a5a6"
        anchorX="center"
        anchorY="middle"
      >
        Select a room variant from the left panel
      </Text>
    );
  }
  
  const { variant } = selectedData;
  const width = variant.width;
  const depth = variant.depth;
  
  // Create rectangle geometry
  const shape = new THREE.Shape();
  shape.moveTo(-width / 2, -depth / 2);
  shape.lineTo(width / 2, -depth / 2);
  shape.lineTo(width / 2, depth / 2);
  shape.lineTo(-width / 2, depth / 2);
  shape.closePath();
  
  // Determine which edges are facade and access
  const facadeEdge = variant.facade_edge || 'south';
  const accessEdge = variant.access_edge || 'north';
  
  return (
    <group position={[0, 0, 0]}>
      {/* Room surface - horizontal on XZ plane (Y=0.01 is ground level) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <shapeGeometry args={[shape]} />
        <meshStandardMaterial 
          color="#f0f0f0" 
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Edges on horizontal plane */}
      <RoomEdges 
        width={width} 
        depth={depth} 
        facadeEdge={facadeEdge}
        accessEdge={accessEdge}
      />
      
      {/* Label above the room - billboard style, always facing camera */}
      <Text
        position={[0, 2, 0]}
        fontSize={0.5}
        color="#2c3e50"
        anchorX="center"
        anchorY="middle"
      >
        {`${width}m × ${depth}m\n${variant.area}m²`}
      </Text>
    </group>
  );
};

interface RoomEdgesProps {
  width: number;
  depth: number;
  facadeEdge: string;
  accessEdge: string;
}

const RoomEdges: React.FC<RoomEdgesProps> = ({ width, depth, facadeEdge, accessEdge }) => {
  const edges = useMemo(() => {
    const halfW = width / 2;
    const halfD = depth / 2;
    const y = 0.02; // Slightly above the surface (ground level is y=0)
    
    // Edges on XZ plane (horizontal floor)
    // North: +Z, South: -Z, East: +X, West: -X
    return {
      north: { start: [-halfW, y, halfD], end: [halfW, y, halfD] },
      south: { start: [-halfW, y, -halfD], end: [halfW, y, -halfD] },
      east: { start: [halfW, y, -halfD], end: [halfW, y, halfD] },
      west: { start: [-halfW, y, -halfD], end: [-halfW, y, halfD] },
    };
  }, [width, depth]);
  
  return (
    <>
      {Object.entries(edges).map(([direction, { start, end }]) => {
        const isFacade = direction === facadeEdge;
        const isAccess = direction === accessEdge;
        
        let color = '#333333';
        let lineWidth = 2;
        
        if (isFacade) {
          color = '#e74c3c'; // Red for facade
          lineWidth = 4;
        } else if (isAccess) {
          color = '#2ecc71'; // Green for access
          lineWidth = 3;
        }
        
        const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        return (
          <primitive key={direction} object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color, linewidth: lineWidth }))} />
        );
      })}
    </>
  );
};
