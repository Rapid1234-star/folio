import React from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import TraceParticles from "./TraceParticles";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export default function CyberGlobeScene({
  isTerminalMode,
  isMobile,
}: {
  isTerminalMode: boolean;
  isMobile: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <Canvas
      camera={{ position: [0, 0, 600], fov: 75, near: 0.1, far: 2000 }}
      dpr={[1, 1.5]}
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
      }}
      scene={{ background: new THREE.Color("#050a05") }}
    >
      <fogExp2 attach="fog" color="#050a05" density={0.0008} />

      <TraceParticles
        isTerminalMode={isTerminalMode}
        isMobile={isMobile}
        prefersReducedMotion={prefersReducedMotion}
      />

      {!prefersReducedMotion && (
        <EffectComposer multisampling={0}>
          <Bloom
            luminanceThreshold={0.55}
            luminanceSmoothing={0.7}
            intensity={0.45}
            mipmapBlur
          />
        </EffectComposer>
      )}
    </Canvas>
  );
}
