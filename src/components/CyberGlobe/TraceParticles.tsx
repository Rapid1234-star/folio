import React, { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState } from "../../utils/scrollState";
import { mousePosition } from "../../utils/mousePosition";

const SPREAD = 800;
const NOISE = 400;
const FRICTION = 0.93;

// Interaction radius — kept strictly small
const CONNECTION_RADIUS = 75;

// MASSIVE buffer limit.
// The flicker was caused because the center of your particle cloud is very dense.
// If there were 151 particles in range, it cut off at 150, and as particles drifted,
// they fought for those 150 slots, causing rapid flickering.
// 2000 guarantees every single particle in range gets drawn, meaning zero cutoffs.
const MAX_LINES = 2000; 

export default function TraceParticles({
  isTerminalMode,
  isMobile,
  prefersReducedMotion,
}: {
  isTerminalMode: boolean;
  isMobile: boolean;
  prefersReducedMotion: boolean;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef  = useRef<THREE.Group>(null);
  const linesRef  = useRef<THREE.LineSegments>(null);
  const { viewport } = useThree();

  const PARTICLE_COUNT = isMobile ? 1500 : 4500;

  // Pre-allocated GPU buffers — absolutely no garbage collection jank
  const linePosBuffer = useMemo(() => new Float32Array(MAX_LINES * 2 * 3), []);
  const lineColBuffer = useMemo(() => new Float32Array(MAX_LINES * 2 * 3), []);

  // Smooth lerped mouse — buttery smooth cursor tracking
  const smoothMouse = useMemo(() => new THREE.Vector3(), []);
  const rawMouse    = useMemo(() => new THREE.Vector3(), []);

  const { fieldPositions, originalPositions, velocityArray, phaseArray, baseColorArray } =
    useMemo(() => {
      const fPos   = new Float32Array(PARTICLE_COUNT * 3);
      const oPos   = new Float32Array(PARTICLE_COUNT * 3);
      const vPos   = new Float32Array(PARTICLE_COUNT * 3);
      const phases = new Float32Array(PARTICLE_COUNT);
      const colors = new Float32Array(PARTICLE_COUNT * 3);

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const x = (Math.random() - 0.5) * (SPREAD + Math.random() * NOISE);
        const y = (Math.random() - 0.5) * (SPREAD + Math.random() * NOISE);
        const z = (Math.random() - 0.5) * (SPREAD + Math.random() * NOISE);
        fPos[i*3]=x; fPos[i*3+1]=y; fPos[i*3+2]=z;
        oPos[i*3]=x; oPos[i*3+1]=y; oPos[i*3+2]=z;
        phases[i] = Math.random() * Math.PI * 2;

        const cr = Math.random();
        if      (cr < 0.7)  { colors[i*3]=0;    colors[i*3+1]=0.30; colors[i*3+2]=0.06; }
        else if (cr < 0.9)  { colors[i*3]=0;    colors[i*3+1]=0.55; colors[i*3+2]=0.12; }
        else if (cr < 0.98) { colors[i*3]=0;    colors[i*3+1]=0.50; colors[i*3+2]=0.60; }
        else                { colors[i*3]=0.35; colors[i*3+1]=0.65; colors[i*3+2]=0.45; }
      }
      return { fieldPositions:fPos, originalPositions:oPos, velocityArray:vPos, phaseArray:phases, baseColorArray:colors };
    }, [PARTICLE_COUNT]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(fieldPositions), 3));
    geo.setAttribute("color",    new THREE.BufferAttribute(new Float32Array(baseColorArray), 3));
    return geo;
  }, [fieldPositions, baseColorArray]);

  const material = useMemo(() =>
    new THREE.PointsMaterial({
      size: isMobile ? 1.2 : 1.5,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
      vertexColors: true,
    }), [isMobile]);

  const linesGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(linePosBuffer, 3);
    const colAttr = new THREE.BufferAttribute(lineColBuffer, 3);
    posAttr.setUsage(THREE.DynamicDrawUsage);
    colAttr.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute("position", posAttr);
    geo.setAttribute("color",    colAttr);
    geo.setDrawRange(0, 0);
    return geo;
  }, [linePosBuffer, lineColBuffer]);

  const linesMaterial = useMemo(() =>
    new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }), []);

  useFrame((state, delta) => {
    const scrollP    = scrollState.get();
    const dt         = Math.min(delta, 0.05) * 60;
    const pointerOn  = mousePosition.isOnScreen && !isTerminalMode;
    const canAnimate = !prefersReducedMotion;

    if (groupRef.current) {
      groupRef.current.rotation.y += (canAnimate ? 0.0008 : 0.00015) * dt;
      groupRef.current.rotation.x  = scrollP * 0.5;
      groupRef.current.updateMatrixWorld();

      if (pointerOn) {
        const ndcX = (mousePosition.x / window.innerWidth)  * 2 - 1;
        const ndcY = -(mousePosition.y / window.innerHeight) * 2 + 1;
        rawMouse.set((ndcX * viewport.width) / 2, (ndcY * viewport.height) / 2, 0);
        groupRef.current.worldToLocal(rawMouse);
        // Buttery lerp — smooths out erratic mouse movements
        smoothMouse.lerp(rawMouse, 0.12);
      }
    }

    const posAttr = geometry.attributes.position;
    const pos     = posAttr.array as Float32Array;

    // --- Physics ---
    // PHYSICS REMOVED: To guarantee ZERO flickering/jitter, the particles no longer
    // get pushed or pulled by the mouse. They simply float gracefully. This means their
    // distance to the cursor changes purely naturally, guaranteeing a perfectly smooth fade.
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3;
      const ox = originalPositions[idx], oy = originalPositions[idx+1], oz = originalPositions[idx+2];
      const cx = pos[idx],              cy = pos[idx+1],              cz = pos[idx+2];
      let vx = velocityArray[idx], vy = velocityArray[idx+1], vz = velocityArray[idx+2];

      // Ambient natural drift
      const drift = canAnimate ? Math.sin(state.clock.elapsedTime * 0.5 + phaseArray[i]) * 0.004 : 0;
      vx += (ox - cx) * 0.018 * dt + drift;
      vy += (oy - cy) * 0.018 * dt + Math.cos(phaseArray[i]) * drift * 0.6;
      vz += (oz - cz) * 0.018 * dt;

      vx *= FRICTION; vy *= FRICTION; vz *= FRICTION;
      velocityArray[idx]   = vx;
      velocityArray[idx+1] = vy;
      velocityArray[idx+2] = vz;
      pos[idx]   = cx + vx;
      pos[idx+1] = cy + vy;
      pos[idx+2] = cz + vz;
    }
    posAttr.needsUpdate = true;

    // --- Draw Lines ---
    // Pure, math-based distance fading. 
    // Because physics aren't forcefully jerking the particles around, 
    // the distance always changes perfectly smoothly.
    if (canAnimate && pointerOn) {
      let lineCount = 0;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        // Massive buffer protects against dense cluster cutoffs
        if (lineCount >= MAX_LINES) break;

        const idx = i * 3;
        const px = pos[idx], py = pos[idx+1], pz = pos[idx+2];
        const dx = px - smoothMouse.x;
        const dy = py - smoothMouse.y;
        const dz = pz - smoothMouse.z;
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

        if (dist < CONNECTION_RADIUS) {
          // Intensity is squared (2.0) for an extremely soft, buttery edge.
          // At exactly 75px, intensity is exactly 0.0. No popping.
          const intensity = Math.pow(1.0 - (dist / CONNECTION_RADIUS), 2.0);
          
          // The gradient: Bright at particle, dim at cursor
          const pR = 0.18 * intensity * 4.5;
          const pG = 1.00 * intensity * 4.5;
          const pB = 0.38 * intensity * 4.5;

          const cR = pR * 0.15;
          const cG = pG * 0.15;
          const cB = pB * 0.15;

          const base = lineCount * 6;
          // Cursor vertex
          linePosBuffer[base]   = smoothMouse.x;
          linePosBuffer[base+1] = smoothMouse.y;
          linePosBuffer[base+2] = smoothMouse.z;
          lineColBuffer[base]   = cR; lineColBuffer[base+1] = cG; lineColBuffer[base+2] = cB;
          // Particle vertex
          linePosBuffer[base+3] = px;
          linePosBuffer[base+4] = py;
          linePosBuffer[base+5] = pz;
          lineColBuffer[base+3] = pR; lineColBuffer[base+4] = pG; lineColBuffer[base+5] = pB;

          lineCount++;
        }
      }

      const posAttrL = linesGeometry.attributes.position as THREE.BufferAttribute;
      const colAttrL = linesGeometry.attributes.color    as THREE.BufferAttribute;
      posAttrL.needsUpdate = true;
      colAttrL.needsUpdate = true;
      linesGeometry.setDrawRange(0, lineCount * 2);
    } else {
      linesGeometry.setDrawRange(0, 0);
    }

    if (pointsRef.current) {
      const mat = pointsRef.current.material as THREE.PointsMaterial;
      mat.opacity = isTerminalMode ? 0.04 : 0.22;
    }
  });

  return (
    <group ref={groupRef}>
      <points      ref={pointsRef} geometry={geometry}      material={material}      />
      <lineSegments ref={linesRef}  geometry={linesGeometry} material={linesMaterial} />
    </group>
  );
}
