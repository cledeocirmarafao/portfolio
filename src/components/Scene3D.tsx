import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function FloatingShape({
  position,
  geometry,
  color,
  speed = 1,
}: {
  position: [number, number, number];
  geometry: "box" | "sphere" | "torus" | "octahedron";
  color: string;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2 * speed;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3 * speed;
    }
  });

  const geometryComponent = useMemo(() => {
    switch (geometry) {
      case "box":
        return <boxGeometry args={[1, 1, 1]} />;
      case "sphere":
        return <sphereGeometry args={[0.7, 16, 16]} />;
      case "torus":
        return <torusGeometry args={[0.6, 0.25, 8, 50]} />;
      case "octahedron":
        return <octahedronGeometry args={[0.8]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  }, [geometry]);

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} position={position}>
        {geometryComponent}
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null);

  const particlesCount = 100;
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#00f5ff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export default function Scene3D() {
  return (
    <div data-testid="scene3d-container" className="absolute inset-0 -z-10">
      <Canvas
        data-testid="scene3d-canvas"
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#ff006e" />
        <pointLight position={[10, -10, 5]} intensity={0.5} color="#00f5ff" />

        <FloatingShape
          position={[3, 1, 0]}
          geometry="octahedron"
          color="#00f5ff"
          speed={0.8}
        />
        <FloatingShape
          position={[-3, -1, -2]}
          geometry="torus"
          color="#ff006e"
          speed={1.2}
        />
        <FloatingShape
          position={[1, -2, -1]}
          geometry="sphere"
          color="#00f5ff"
          speed={1}
        />
        <FloatingShape
          position={[-2, 2, -3]}
          geometry="box"
          color="#ff006e"
          speed={0.6}
        />

        <ParticleField />
      </Canvas>
    </div>
  );
}
