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
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      scene={{
        background: new THREE.Color(
          isTerminalMode ? "#020402" : "#050a08",
        ),
      }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.15;
        gl.domElement.setAttribute("role", "img");
        gl.domElement.setAttribute(
          "aria-label",
          "Interactive ambient particle field — move your pointer to connect nodes",
        );
      }}
    >
      <fogExp2
        attach="fog"
        color={isTerminalMode ? "#020402" : "#050a08"}
        density={0.00055}
      />

      <TraceParticles
        isTerminalMode={isTerminalMode}
        isMobile={isMobile}
        prefersReducedMotion={prefersReducedMotion}
      />

      {!prefersReducedMotion && (
        <EffectComposer multisampling={0}>
          <Bloom
            luminanceThreshold={0.45}
            luminanceSmoothing={0.65}
            intensity={isTerminalMode ? 0.55 : 0.58}
            mipmapBlur
          />
        </EffectComposer>
      )}
    </Canvas>
  );
}
