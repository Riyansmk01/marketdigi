"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Sparkles, MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";

function SingleRing({
  radius = 1.2,
  tube = 0.12,
  color = "#D4AF37",
  position = [0, 0, 0] as [number, number, number],
  rotation = [0, 0, 0] as [number, number, number],
  hasDiamond = false,
}) {
  const meshRef = useRef<THREE.Group>(null);

  return (
    <group ref={meshRef} position={position} rotation={rotation}>
      {/* Golden Band */}
      <mesh castShadow receiveShadow>
        <torusGeometry args={[radius, tube, 32, 64]} />
        <meshStandardMaterial
          color={color}
          metalness={0.95}
          roughness={0.15}
          emissive="#2a1e05"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Diamond setting if applicable */}
      {hasDiamond && (
        <group position={[0, radius + tube, 0]}>
          {/* Prong base */}
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.16, 0.12, 0.15, 8]} />
            <meshStandardMaterial color={color} metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Diamond gem */}
          <mesh position={[0, 0.22, 0]}>
            <octahedronGeometry args={[0.22, 2]} />
            <meshPhysicalMaterial
              color="#ffffff"
              transmission={0.9}
              opacity={1}
              transparent
              roughness={0.05}
              ior={2.4}
              reflectivity={0.9}
              clearcoat={1}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}

function InterlockingRings() {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
      groupRef.current.rotation.x = Math.sin(timeRef.current * 0.5) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
      <group ref={groupRef}>
        {/* Ring 1 - Groom Ring (Slightly larger, sleek) */}
        <SingleRing
          radius={1.3}
          tube={0.14}
          color="#E6CA65"
          position={[-0.45, 0, 0]}
          rotation={[Math.PI / 3, Math.PI / 6, 0]}
        />
        {/* Ring 2 - Bride Ring (With diamond solitaire) */}
        <SingleRing
          radius={1.15}
          tube={0.1}
          color="#F5D77F"
          position={[0.45, 0.1, 0.2]}
          rotation={[Math.PI / 4, -Math.PI / 5, Math.PI / 6]}
          hasDiamond={true}
        />
      </group>
    </Float>
  );
}

export default function WeddingRingsScene() {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 8, 5]} intensity={2.5} color="#fff8e7" castShadow />
        <pointLight position={[-4, -3, -2]} intensity={1.5} color="#ffd700" />
        <pointLight position={[3, 3, 2]} intensity={2} color="#ffffff" />
        <spotLight position={[0, 5, 2]} angle={0.4} penumbra={1} intensity={2} color="#ffe8b8" />

        <InterlockingRings />

        {/* Romantic golden ambient sparkles */}
        <Sparkles count={40} scale={6} size={3} speed={0.4} color="#f9e29c" opacity={0.7} />
        <Sparkles count={25} scale={8} size={2} speed={0.2} color="#ffffff" opacity={0.5} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.7}
          minPolarAngle={Math.PI / 3}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}
