'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Environment, Float, RoundedBox } from '@react-three/drei';

const ClauseHighlight = ({ position, text, color }: { position: [number, number, number], text: string, color: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() + position[0]) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      {/* Clauses */}
      <RoundedBox args={[text.length * 0.12 + 0.3, 0.35, 0.05]} radius={0.05} smoothness={3}>
        <meshStandardMaterial color={color} transparent opacity={0.9} />
      </RoundedBox>
      <Text
        position={[0, 0, 0.03]}
        fontSize={0.15}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {text}
      </Text>
    </mesh>
  );
};

const DocumentWithClauses = () => {
  const docRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (docRef.current) {
      docRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  return (
    <group ref={docRef}>
      {/* Document base */}
      <mesh receiveShadow position={[0, 0, -0.1]}>
        <planeGeometry args={[3, 4]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Document content */}
      {[...Array(12)].map((_, i) => (
        <mesh key={i} position={[0, 1.7 - i * 0.3, -0.09]}>
          <planeGeometry args={[2.6, 0.12]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>
      ))}
      
      {/* Clauses */}
      <Float speed={1.5}>
        <ClauseHighlight position={[-1.2, 0.8, 0.1]} text="Liability" color="#4338CA" />
      </Float>
      
      <Float speed={2} rotationIntensity={0.2}>
        <ClauseHighlight position={[0.8, 0.2, 0.2]} text="Termination" color="#EA580C" />
      </Float>
      
      <Float speed={1.8} rotationIntensity={0.3}>
        <ClauseHighlight position={[-0.6, -0.5, 0.3]} text="Payment Terms" color="#059669" />
      </Float>
      
      <Float speed={1.3} rotationIntensity={0.2}>
        <ClauseHighlight position={[1, -1.1, 0.15]} text="Warranties" color="#D97706" />
      </Float>
    </group>
  );
};

const ClauseAnimation = () => {
  return (
    <div className="h-[400px] w-full">
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <DocumentWithClauses />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default ClauseAnimation; 