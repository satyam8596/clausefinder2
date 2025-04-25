'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';

const NeuralConnection = ({ startPoint, endPoint, color }: { startPoint: [number, number, number], endPoint: [number, number, number], color: string }) => {
  const curveRef = useRef<THREE.Line>(null);
  const tempVec = new THREE.Vector3();
  
  useFrame(({ clock }) => {
    if (curveRef.current) {
      // Make the connection pulsate
      const time = clock.getElapsedTime();
      const scale = 1 + Math.sin(time * 3) * 0.2;
      curveRef.current.scale.set(1, 1, scale);
      
      // Add some movement to the midpoint
      const material = curveRef.current.material as THREE.LineBasicMaterial;
      material.opacity = 0.5 + Math.sin(time * 2) * 0.3;
    }
  });

  // Create a curved path between points
  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(...startPoint),
    new THREE.Vector3(
      (startPoint[0] + endPoint[0]) / 2,
      (startPoint[1] + endPoint[1]) / 2 + 0.5,
      (startPoint[2] + endPoint[2]) / 2 + 0.3
    ),
    new THREE.Vector3(...endPoint)
  );

  const points = curve.getPoints(20);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <line ref={curveRef} geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={0.7} linewidth={2} />
    </line>
  );
};

const BrainModel = () => {
  const brainRef = useRef<THREE.Group>(null);
  
  // Create brain hemispheres
  const leftHemisphere = useRef<THREE.Mesh>(null);
  const rightHemisphere = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (brainRef.current) {
      // Gentle rotation
      brainRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.2;
    }
    
    if (leftHemisphere.current && rightHemisphere.current) {
      // Subtle pulsing effect
      const pulse = Math.sin(clock.getElapsedTime() * 1.5) * 0.03;
      leftHemisphere.current.scale.set(1 + pulse, 1 + pulse, 1 + pulse);
      rightHemisphere.current.scale.set(1 + pulse, 1 + pulse, 1 + pulse);
    }
  });

  // Connection points
  const connections = [
    { start: [-0.5, 0.3, 0.2], end: [0.6, 0.5, 0.3], color: '#4338CA' },
    { start: [0.4, -0.2, 0.4], end: [-0.3, 0.4, 0.5], color: '#059669' },
    { start: [-0.6, -0.3, 0.3], end: [0.5, -0.4, 0.2], color: '#EA580C' },
    { start: [0.1, 0.6, 0.2], end: [-0.2, -0.5, 0.1], color: '#D97706' },
    { start: [-0.4, 0.1, 0.5], end: [0.3, 0.2, 0.3], color: '#4F46E5' },
  ];

  return (
    <group ref={brainRef}>
      {/* Left hemisphere */}
      <mesh ref={leftHemisphere} position={[-0.3, 0, 0]}>
        <sphereGeometry args={[0.7, 32, 32, 0, Math.PI]} />
        <meshStandardMaterial 
          color="#f1f5f9" 
          roughness={0.3} 
          metalness={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Right hemisphere */}
      <mesh ref={rightHemisphere} position={[0.3, 0, 0]}>
        <sphereGeometry args={[0.7, 32, 32, 0, Math.PI, 0, Math.PI]} />
        <meshStandardMaterial 
          color="#f1f5f9" 
          roughness={0.3} 
          metalness={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Neural connections */}
      {connections.map((conn, i) => (
        <NeuralConnection 
          key={i} 
          startPoint={conn.start as [number, number, number]} 
          endPoint={conn.end as [number, number, number]} 
          color={conn.color} 
        />
      ))}
      
      {/* Central core - represents the AI */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#4338CA" emissive="#4338CA" emissiveIntensity={0.5} />
        </mesh>
      </Float>
    </group>
  );
};

const BrainAnalysis3D = () => {
  return (
    <div className="h-[400px] w-full">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 4], fov: 45 }}
      >
        <color attach="background" args={['transparent']} />
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
        />
        <PresentationControls
          global
          rotation={[0, 0, 0]}
          polar={[-0.3, 0.3]}
          azimuth={[-0.5, 0.5]}
          config={{ mass: 2, tension: 400 }}
          snap={{ mass: 4, tension: 300 }}
        >
          <BrainModel />
        </PresentationControls>
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default BrainAnalysis3D; 