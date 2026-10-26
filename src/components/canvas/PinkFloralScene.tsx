"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Sparkles } from "@react-three/drei";
import * as THREE from "three";

// A single realistic curved pink flower petal
function Petal({
  rotation,
  position,
  scale = [1, 1, 1] as [number, number, number],
  color = "#F472B6",
}: {
  rotation: [number, number, number];
  position: [number, number, number];
  scale?: [number, number, number];
  color?: string;
}) {
  return (
    <mesh position={position} rotation={rotation} scale={scale} castShadow receiveShadow>
      <sphereGeometry args={[0.35, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
      <meshStandardMaterial
        color={color}
        roughness={0.4}
        metalness={0.08}
        side={THREE.DoubleSide}
        emissive="#BE185D"
        emissiveIntensity={0.08}
      />
    </mesh>
  );
}

// Full 3D Blooming Pink Rose
function PinkRose({
  position = [0, 0, 0] as [number, number, number],
  scale = 1,
  rotation = [0, 0, 0] as [number, number, number],
  mainColor = "#FB7185", // Rose pink
}) {
  const petals = useMemo(() => {
    const list: {
      pos: [number, number, number];
      rot: [number, number, number];
      scale: [number, number, number];
      color: string;
    }[] = [];

    // Inner layer (tight bud)
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      list.push({
        pos: [Math.sin(angle) * 0.12, 0.08, Math.cos(angle) * 0.12],
        rot: [0.65, angle, 0],
        scale: [0.85, 1.1, 0.85],
        color: "#F43F5E", // Deep pink center
      });
    }

    // Mid layer (blooming)
    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 2 + 0.3;
      list.push({
        pos: [Math.sin(angle) * 0.28, 0.02, Math.cos(angle) * 0.28],
        rot: [0.95, angle, 0],
        scale: [1.2, 1.25, 1.15],
        color: mainColor,
      });
    }

    // Outer layer (open soft blush petals)
    for (let i = 0; i < 9; i++) {
      const angle = (i / 9) * Math.PI * 2 + 0.6;
      list.push({
        pos: [Math.sin(angle) * 0.46, -0.06, Math.cos(angle) * 0.46],
        rot: [1.25, angle, 0],
        scale: [1.45, 1.35, 1.35],
        color: "#FDA4AF", // Soft pastel pink
      });
    }

    return list;
  }, [mainColor]);

  return (
    <group position={position} scale={scale} rotation={rotation}>
      {/* Flower center pistil */}
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#FCD34D" roughness={0.6} />
      </mesh>

      {/* Petals */}
      {petals.map((p, idx) => (
        <Petal
          key={idx}
          position={p.pos}
          rotation={p.rot}
          scale={p.scale}
          color={p.color}
        />
      ))}

      {/* Green Leaves underneath */}
      {[0, 2.1, 4.2].map((ang, i) => (
        <mesh
          key={`leaf-${i}`}
          position={[Math.sin(ang) * 0.5, -0.15, Math.cos(ang) * 0.5]}
          rotation={[1.3, ang, 0.2]}
          scale={[0.7, 1.3, 0.4]}
        >
          <sphereGeometry args={[0.2, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial color="#4ADE80" roughness={0.5} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

// Floating 3D Pink Sakura / Petal Particle
function FloatingPinkPetal({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const rotSpeed = useMemo(() => ({
    x: (Math.random() - 0.5) * 1.5,
    y: (Math.random() - 0.5) * 1.5,
    z: (Math.random() - 0.5) * 1.5,
  }), []);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * rotSpeed.x;
      meshRef.current.rotation.y += delta * rotSpeed.y;
      meshRef.current.rotation.z += delta * rotSpeed.z;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={[0.25, 0.35, 0.2]}>
      <sphereGeometry args={[0.3, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.4]} />
      <meshStandardMaterial
        color="#F472B6"
        side={THREE.DoubleSide}
        roughness={0.4}
        emissive="#BE185D"
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}

// Interlocking Golden Rings nestled in the floral bed
function GoldenRings() {
  return (
    <group position={[0, 0.2, 0]}>
      {/* Ring 1 - Groom Ring */}
      <mesh position={[-0.4, 0.1, 0.1]} rotation={[Math.PI / 3, Math.PI / 6, 0]}>
        <torusGeometry args={[0.85, 0.08, 32, 64]} />
        <meshStandardMaterial
          color="#F5D061"
          metalness={0.95}
          roughness={0.15}
          emissive="#78350F"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Ring 2 - Bride Solitaire Ring */}
      <group position={[0.35, 0.18, 0.2]} rotation={[Math.PI / 4, -Math.PI / 5, Math.PI / 6]}>
        <mesh>
          <torusGeometry args={[0.78, 0.07, 32, 64]} />
          <meshStandardMaterial
            color="#FCE794"
            metalness={0.95}
            roughness={0.15}
            emissive="#78350F"
            emissiveIntensity={0.15}
          />
        </mesh>
        {/* Diamond Solitaire */}
        <mesh position={[0, 0.85, 0]}>
          <octahedronGeometry args={[0.18, 2]} />
          <meshPhysicalMaterial
            color="#FFFFFF"
            transmission={0.9}
            roughness={0.05}
            ior={2.4}
            reflectivity={0.9}
            clearcoat={1}
          />
        </mesh>
      </group>
    </group>
  );
}

// Main 3D Floral Arrangement
function FloralArrangement() {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(timeRef.current * 0.25) * 0.35;
      groupRef.current.rotation.x = Math.sin(timeRef.current * 0.2) * 0.08;
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={0.3} floatIntensity={0.6}>
      <group ref={groupRef}>
        {/* Center Golden Rings */}
        <GoldenRings />

        {/* 3D Pink Flowers Bouquet Base */}
        {/* Center Large Pink Rose */}
        <PinkRose position={[0, -0.4, 0]} scale={1.25} mainColor="#F43F5E" />

        {/* Left Blush Pink Rose */}
        <PinkRose
          position={[-1.25, -0.3, 0.3]}
          scale={0.95}
          rotation={[0.3, 0.4, -0.2]}
          mainColor="#FB7185"
        />

        {/* Right Sakura Blossom Rose */}
        <PinkRose
          position={[1.25, -0.25, 0.2]}
          scale={1.0}
          rotation={[0.2, -0.5, 0.2]}
          mainColor="#F472B6"
        />

        {/* Rear Deep Rose */}
        <PinkRose
          position={[0.2, 0.5, -0.6]}
          scale={0.85}
          rotation={[-0.4, 0.2, 0]}
          mainColor="#E11D48"
        />

        {/* Floating 3D Pink Petals in Orbit */}
        <FloatingPinkPetal position={[-1.6, 0.8, 0.5]} />
        <FloatingPinkPetal position={[1.5, 0.9, -0.3]} />
        <FloatingPinkPetal position={[-0.8, 1.2, -0.6]} />
        <FloatingPinkPetal position={[0.9, -0.8, 0.8]} />
        <FloatingPinkPetal position={[-1.2, -0.7, -0.5]} />
      </group>
    </Float>
  );
}

export default function PinkFloralScene() {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0.4, 4.8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={1.4} />
        {/* Warm romantic rose lighting */}
        <directionalLight position={[5, 8, 5]} intensity={2.6} color="#FFF1F2" />
        <pointLight position={[-4, 3, 2]} intensity={2.0} color="#F472B6" />
        <pointLight position={[4, -2, 2]} intensity={1.8} color="#FDA4AF" />
        <spotLight position={[0, 6, 3]} angle={0.5} penumbra={1} intensity={2.5} color="#FFE4E6" />

        <FloralArrangement />

        {/* Magical Pink & Golden Sparkles */}
        <Sparkles count={50} scale={6.5} size={3.5} speed={0.4} color="#F472B6" opacity={0.8} />
        <Sparkles count={35} scale={8} size={2.5} speed={0.25} color="#FDE047" opacity={0.6} />

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
