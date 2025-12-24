"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function ParticleSystem() {
  const ref = useRef<THREE.Points>(null);

  // Enhanced particle system with more particles and better distribution
  const particles = useMemo(() => {
    const temp = new Float32Array(5000 * 3);
    let seed = 12345;
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    
    for (let i = 0; i < 5000; i++) {
      // Create more spread out particles with depth
      temp[i * 3] = (random() - 0.5) * 15;
      temp[i * 3 + 1] = (random() - 0.5) * 15;
      temp[i * 3 + 2] = (random() - 0.5) * 15;
    }
    return temp;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 20;
      ref.current.rotation.y -= delta / 25;
      ref.current.rotation.z -= delta / 30;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 6]}>
      <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#00d4ff"
          size={0.015}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.8}
        />
      </Points>
    </group>
  );
}

// Add floating geometric shapes
function FloatingShapes() {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={meshRef}>
      <mesh position={[3, 2, -2]}>
        <octahedronGeometry args={[0.3]} />
        <meshBasicMaterial color="#00f5ff" transparent opacity={0.3} wireframe />
      </mesh>
      <mesh position={[-3, -2, -1]}>
        <tetrahedronGeometry args={[0.4]} />
        <meshBasicMaterial color="#0099ff" transparent opacity={0.2} wireframe />
      </mesh>
      <mesh position={[2, -3, -3]}>
        <icosahedronGeometry args={[0.25]} />
        <meshBasicMaterial color="#33aaff" transparent opacity={0.4} wireframe />
      </mesh>
    </group>
  );
}

export default function Background3D() {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-blue-950 to-slate-900" />
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-transparent via-cyan-950/10 to-transparent animate-pulse" />
      
      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ParticleSystem />
        <FloatingShapes />
        <ambientLight intensity={0.1} />
      </Canvas>
      
      {/* Grid overlay effect */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 245, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 245, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>
    </div>
  );
}