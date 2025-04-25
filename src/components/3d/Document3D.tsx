'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, PresentationControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Simplified document model component
const DocumentModel = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1,
        0.1
      );
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        Math.sin(state.clock.getElapsedTime() * 0.2) * 0.05 - 0.2,
        0.1
      );
    }
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      {/* Document base */}
      <boxGeometry args={[2.8, 3.5, 0.1]} />
      <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
      
      {/* Document details */}
      <group position={[0, 0, 0.051]}>
        {/* Title area */}
        <mesh position={[0, 1.3, 0]}>
          <planeGeometry args={[2, 0.4]} />
          <meshStandardMaterial color="#4338CA" />
        </mesh>
        
        {/* Text lines */}
        {[...Array(8)].map((_, i) => (
          <mesh key={i} position={[0, 0.8 - i * 0.3, 0]}>
            <planeGeometry args={[2.4, 0.1]} />
            <meshStandardMaterial color="#e2e8f0" />
          </mesh>
        ))}
        
        {/* Signature line */}
        <mesh position={[-0.6, -1.4, 0]}>
          <planeGeometry args={[1, 0.1]} />
          <meshStandardMaterial color="#4338CA" opacity={0.7} transparent />
        </mesh>
      </group>
    </mesh>
  );
};

const Document3D = () => {
  return (
    <div className="h-[400px] w-full">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5], fov: 45 }}
      >
        <color attach="background" args={['transparent']} />
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <PresentationControls
          global
          rotation={[0, 0, 0]}
          polar={[-0.3, 0.3]}
          azimuth={[-0.5, 0.5]}
          config={{ mass: 2, tension: 400 }}
          snap={{ mass: 4, tension: 300 }}
        >
          <DocumentModel />
        </PresentationControls>
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default Document3D;