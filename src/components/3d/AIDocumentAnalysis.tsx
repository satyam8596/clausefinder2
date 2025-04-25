'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';

const AIScanner = () => {
  const scannerRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (scannerRef.current) {
      const time = clock.getElapsedTime();
      // Scan up and down the document
      scannerRef.current.position.y = Math.sin(time * 0.5) * 1;
      
      // Glow effect
      const material = scannerRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.5 + Math.sin(time * 2) * 0.3;
    }
  });
  
  return (
    <mesh ref={scannerRef} position={[0, 0, 0.05]} rotation={[0, 0, 0]}>
      <planeGeometry args={[1.5, 0.05]} />
      <meshStandardMaterial 
        color="#4338CA" 
        emissive="#4338CA"
        emissiveIntensity={0.5}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
};

const HighlightedText = ({ position, width, color }: { position: [number, number, number], width: number, color: string }) => {
  const highlightRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (highlightRef.current) {
      const time = clock.getElapsedTime();
      const material = highlightRef.current.material as THREE.MeshStandardMaterial;
      // Pulse opacity
      material.opacity = 0.3 + Math.sin(time * 2 + position[1] * 5) * 0.2;
    }
  });
  
  return (
    <mesh ref={highlightRef} position={position}>
      <planeGeometry args={[width, 0.08]} />
      <meshStandardMaterial 
        color={color} 
        transparent
        opacity={0.5}
      />
    </mesh>
  );
};

const DocumentWithAI = () => {
  const documentRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (documentRef.current) {
      // Subtle floating effect
      documentRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.05;
      // Gentle rotation
      documentRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.1;
    }
  });
  
  // Create text highlights with different colors representing different clause types
  const highlights = [
    { position: [0, 0.8, 0.02], width: 1.2, color: '#ef4444' },  // Red for high risk
    { position: [0.2, 0.4, 0.02], width: 0.8, color: '#f97316' }, // Orange for medium risk
    { position: [-0.3, 0, 0.02], width: 1.0, color: '#22c55e' },  // Green for low risk
    { position: [0.1, -0.4, 0.02], width: 0.7, color: '#3b82f6' }, // Blue for information
    { position: [-0.2, -0.8, 0.02], width: 0.9, color: '#a855f7' }, // Purple for commitments
  ];
  
  return (
    <group ref={documentRef}>
      {/* Document base */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[1.5, 2.2]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} />
      </mesh>
      
      {/* Document content lines */}
      {Array.from({ length: 18 }).map((_, i) => (
        <mesh key={i} position={[0, 1 - i * 0.12, 0.01]}>
          <planeGeometry args={[1.3, 0.03]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>
      ))}
      
      {/* Highlighted text */}
      {highlights.map((highlight, i) => (
        <HighlightedText 
          key={i} 
          position={highlight.position as [number, number, number]} 
          width={highlight.width} 
          color={highlight.color} 
        />
      ))}
      
      {/* AI Scanner */}
      <AIScanner />
      
      {/* AI Processing indicator */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[0.9, 0, 0.1]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial 
            color="#4338CA" 
            emissive="#4338CA"
            emissiveIntensity={0.5}
          />
        </mesh>
      </Float>
    </group>
  );
};

const AIDocumentAnalysis = () => {
  return (
    <div className="h-[450px] w-full">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 3], fov: 45 }}
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
          <DocumentWithAI />
        </PresentationControls>
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default AIDocumentAnalysis; 