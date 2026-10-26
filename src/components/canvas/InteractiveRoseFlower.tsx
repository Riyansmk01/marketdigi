"use client";

import dynamic from "next/dynamic";
import React from "react";

const InteractiveScene = dynamic(
  () =>
    import("@react-three/fiber").then((mod) => {
      const { Canvas, useFrame } = mod;
      const { Float, Sparkles, OrbitControls } = require("@react-three/drei");
      const THREE = require("three");

      function SingleBloomingRose() {
        const groupRef = React.useRef<any>(null);
        const timeRef = React.useRef(0);

        useFrame((_, delta) => {
          timeRef.current += delta;
          if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.45;
            groupRef.current.rotation.z = Math.sin(timeRef.current * 0.4) * 0.1;
          }
        });

        // Generate procedural rose spiral layers
        const petalLayers = [
          { count: 4, radius: 0.15, height: 0.1, color: "#BE185D", scale: 0.8 },
          { count: 6, radius: 0.32, height: 0.05, color: "#E11D48", scale: 1.1 },
          { count: 8, radius: 0.52, height: -0.05, color: "#FB7185", scale: 1.35 },
          { count: 10, radius: 0.75, height: -0.15, color: "#FDA4AF", scale: 1.55 },
        ];

        return (
          <Float speed={3} rotationIntensity={0.4} floatIntensity={0.7}>
            <group ref={groupRef}>
              {/* Golden Center */}
              <mesh position={[0, 0.15, 0]}>
                <sphereGeometry args={[0.12, 16, 16]} />
                <meshStandardMaterial color="#FCD34D" roughness={0.3} metalness={0.4} />
              </mesh>

              {petalLayers.map((layer, lIdx) =>
                Array.from({ length: layer.count }).map((_, pIdx) => {
                  const angle = (pIdx / layer.count) * Math.PI * 2 + lIdx * 0.35;
                  return (
                    <mesh
                      key={`${lIdx}-${pIdx}`}
                      position={[
                        Math.sin(angle) * layer.radius,
                        layer.height,
                        Math.cos(angle) * layer.radius,
                      ]}
                      rotation={[0.85 + lIdx * 0.12, angle, 0]}
                      scale={[layer.scale, layer.scale * 1.2, layer.scale]}
                    >
                      <sphereGeometry args={[0.26, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
                      <meshStandardMaterial
                        color={layer.color}
                        side={THREE.DoubleSide}
                        roughness={0.35}
                        emissive="#9F1239"
                        emissiveIntensity={0.06}
                      />
                    </mesh>
                  );
                })
              )}

              {/* Stem & Leaves */}
              <mesh position={[0, -0.6, 0]}>
                <cylinderGeometry args={[0.04, 0.04, 0.9, 12]} />
                <meshStandardMaterial color="#15803D" roughness={0.6} />
              </mesh>

              {[0.5, 2.6].map((rot, i) => (
                <mesh key={`stem-leaf-${i}`} position={[0.2 * (i === 0 ? 1 : -1), -0.45, 0]} rotation={[0.4, rot, 0.3]} scale={[0.5, 1, 0.3]}>
                  <sphereGeometry args={[0.25, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.4]} />
                  <meshStandardMaterial color="#22C55E" roughness={0.5} side={THREE.DoubleSide} />
                </mesh>
              ))}
            </group>
          </Float>
        );
      }

      return function Scene() {
        return (
          <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
            <Canvas camera={{ position: [0, 0, 3.6], fov: 45 }} gl={{ antialias: true, alpha: true }}>
              <ambientLight intensity={1.5} />
              <directionalLight position={[4, 5, 4]} intensity={2.2} color="#FFF1F2" />
              <pointLight position={[-3, -2, 2]} intensity={1.5} color="#FB7185" />
              <SingleBloomingRose />
              <Sparkles count={30} scale={4} size={2.5} color="#FDA4AF" opacity={0.7} />
              <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
            </Canvas>
          </div>
        );
      };
    }),
  { ssr: false }
);

export default function InteractiveRoseFlower() {
  return (
    <div className="w-full h-64 md:h-72 relative my-4">
      <InteractiveScene />
    </div>
  );
}
