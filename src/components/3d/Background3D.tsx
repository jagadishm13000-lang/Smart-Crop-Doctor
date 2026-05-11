import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, PerspectiveCamera, Environment, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function FloatingCrop() {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = Math.cos(t / 4) / 8;
    meshRef.current.rotation.y = Math.sin(t / 4) / 8;
    meshRef.current.position.y = (1 + Math.sin(t / 1.5)) / 10;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <MeshDistortMaterial
          color="#10b981"
          speed={3}
          distort={0.4}
          radius={1}
          emissive="#064e3b"
        />
      </mesh>
    </Float>
  );
}

function ParticleField() {
  const count = 2000;
  const positions = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
  }

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#2dd4bf" transparent opacity={0.6} />
    </points>
  );
}

export default function Background3D() {
  return (
    <div className="fixed inset-0 -z-10 bg-slate-950">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#10b981" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#06b6d4" />
        <FloatingCrop />
        <ParticleField />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
