"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollStage, type Slice } from "@/components/motion/scroll-stage";

/**
 * The reconstruction.
 *
 * One persistent canvas for the whole page, driven by a single scroll value
 * (§5). All motion happens in the vertex shader from a handful of uniforms:
 * there is no per-frame JavaScript touching 65,536 points, which is the only
 * way this holds 60fps on a mid-tier phone.
 *
 * The target positions are sampled from the approved hero plate at build time,
 * so the resolved frame is that image rather than an approximation of it.
 *
 * Decorative. aria-hidden, never the sole carrier of information, and the page
 * reads identically with it removed.
 */

const MODE: Record<NonNullable<Slice> | "base", number> = {
  base: 0,
  ultrasound: 1,
  ct: 2,
  "x-ray": 3,
  interventional: 4,
};

/** Decodes the planar, Z-ordered, delta-encoded binary from build-pointcloud. */
function decode(buf: ArrayBuffer) {
  const count = buf.byteLength / 7;
  const i16 = new Int16Array(buf, 0, count * 3);
  const u8 = new Uint8Array(buf, count * 6, count);

  const undelta = (offset: number) => {
    const out = new Int16Array(count);
    let prev = 0;
    for (let i = 0; i < count; i++) {
      prev = (prev + i16[offset + i]) << 16 >> 16;
      out[i] = prev;
    }
    return out;
  };

  return {
    count,
    xs: undelta(0),
    ys: undelta(count),
    zs: undelta(count * 2),
    bs: u8,
  };
}

const RANGE = 2;

const vertex = /* glsl */ `
  uniform float uResolve;     // 0 scattered, 1 formed
  uniform float uProgress;    // 0..1 document scroll
  uniform float uMode;        // which modality treatment
  uniform float uModeMix;     // 0..1 blend into that treatment
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uCalm;        // 1 in the settle phase: all residual motion stops

  attribute vec3 aTarget;
  attribute vec3 aScatter;
  attribute float aBright;
  attribute float aSeed;

  varying float vBright;
  varying float vFade;
  varying float vDepth;
  varying float vSeed;

  void main() {
    // Per-point stagger. Points resolve over a window rather than in lockstep,
    // which is what makes the form assemble rather than snap.
    float local = clamp((uResolve - aSeed * 0.45) / 0.55, 0.0, 1.0);
    // Strong ease-out: fastest where the eye is, never eases in.
    float e = 1.0 - pow(1.0 - local, 3.0);

    vec3 pos = mix(aScatter, aTarget, e);

    // Residual drift so the resolved state still breathes. Amplitude falls to
    // near zero as it forms, so the final frame is calm.
    float drift = ((1.0 - e) * 0.35 + 0.012) * (1.0 - uCalm * 0.92);
    pos.x += sin(uTime * 0.25 + aSeed * 22.0) * drift * 0.35;
    pos.y += cos(uTime * 0.21 + aSeed * 17.0) * drift * 0.35;

    float fade = 1.0;

    // ULTRASOUND: a scanning cone sweeps and the returning wavefront lifts the
    // surface it passes over.
    if (uMode > 0.5 && uMode < 1.5) {
      float sweep = fract(uTime * 0.16);
      float d = abs(pos.x * 0.5 + 0.5 - sweep);
      float band = smoothstep(0.16, 0.0, d);
      pos.z += band * 0.30 * uModeMix;
      fade = mix(1.0, 0.35 + band * 1.5, uModeMix);
    }

    // CT: points quantise onto discrete slice planes, then the stack rebuilds.
    else if (uMode > 1.5 && uMode < 2.5) {
      float slices = 22.0;
      float q = floor(pos.z * slices + 0.5) / slices;
      pos.z = mix(pos.z, q, uModeMix);
      float band2 = smoothstep(0.5, 0.0, abs(fract(uTime * 0.12) - (pos.z * 0.5 + 0.5)));
      fade = mix(1.0, 0.45 + band2 * 1.2, uModeMix);
    }

    // X-RAY: the volume flattens to a single transmission plane, high contrast.
    else if (uMode > 2.5 && uMode < 3.5) {
      pos.z = mix(pos.z, 0.0, uModeMix);
      fade = mix(1.0, 0.30 + pow(aBright, 1.8) * 2.2, uModeMix);
    }

    // INTERVENTIONAL: a guide line finds a target; everything else recedes.
    else if (uMode > 3.5) {
      vec2 target = vec2(0.18, -0.05);
      float d = distance(pos.xy, target);
      float focus = smoothstep(0.85, 0.10, d);
      fade = mix(1.0, 0.14 + focus * 1.9, uModeMix);
      pos.z += (1.0 - focus) * 0.22 * uModeMix;
    }

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);

    // Depth of field, approximated by attenuating points away from the focal
    // plane. Cheaper than a postprocessing pass and enough at this scale.
    float dof = 1.0 - smoothstep(0.15, 1.5, abs(mv.z + 2.6));

    vBright = aBright;
    vDepth = clamp(pos.z * 1.8 + 0.5, 0.0, 1.0);
    vSeed = aSeed;
    vFade = fade * mix(0.45, 1.0, dof) * (0.25 + e * 0.75);

    gl_Position = projectionMatrix * mv;
    // Small points. The previous size overlapped them into a wash that read as
    // low resolution and blew out to white; detail comes from many small points,
    // not few large ones. Slight per-point variance stops a uniform stipple.
    float variance = 0.72 + aSeed * 0.7;
    gl_PointSize = uSize * uPixelRatio * (0.5 + aBright * 0.7) * variance * (1.0 / -mv.z);
  }
`;

const fragment = /* glsl */ `
  precision mediump float;

  uniform vec3 uDeep;   // brand green, lightened. Back of the volume.
  uniform vec3 uMid;    // brand blue. The body of the cloud.
  uniform vec3 uHot;    // near white. Bright structure at the front.

  varying float vBright;
  varying float vFade;
  varying float vDepth;
  varying float vSeed;

  void main() {
    // Round, soft-edged point. Discarding outside the disc keeps the cloud from
    // reading as a grid of squares.
    vec2 c = gl_PointCoord - 0.5;
    float d = dot(c, c);
    if (d > 0.25) discard;
    float alpha = smoothstep(0.25, 0.03, d);

    // Three-stop ramp across BOTH brand colours rather than one blue fading to
    // white. Depth places a point on the green-to-blue leg, brightness lifts it
    // toward the hot stop, and a per-point offset keeps the ramp from banding
    // into visible bands.
    // Depth drives the ramp, brightness only nudges it. The earlier weighting
    // put nearly every point above 0.5, so the green leg never rendered and the
    // cloud read as a single blue washing to white.
    float t = clamp(vDepth * 0.92 + (vBright - 0.55) * 0.30 + (vSeed - 0.5) * 0.22, 0.0, 1.0);
    vec3 col = t < 0.5
      ? mix(uDeep, uMid, smoothstep(0.0, 0.5, t))
      : mix(uMid, uHot, smoothstep(0.5, 1.0, t) * smoothstep(0.55, 1.0, vBright));

    // Additive blending sums R, G and B independently, so overlapping points
    // converge on white no matter what colour each one is. Hue only survives if
    // each point contributes very little, so the per-point alpha is low and the
    // colour separation has to be carried by many faint points rather than few
    // strong ones.
    gl_FragColor = vec4(col, alpha * vFade * 0.17);
  }
`;

function Points({ tier }: { tier: 1 | 2 | 3 }) {
  const { progress, slice } = useScrollStage();
  const mat = useRef<THREE.ShaderMaterial>(null);
  const [data, setData] = useState<ReturnType<typeof decode> | null>(null);
  const { size } = useThree();

  // Stride, never slice: the array is Z-ordered, so every Nth point still
  // covers the whole form while a prefix would cover one corner.
  const stride = tier === 3 ? 1 : tier === 2 ? 2 : 4;

  useEffect(() => {
    let cancelled = false;
    fetch("/data/points-torso.bin")
      .then((r) => r.arrayBuffer())
      .then((b) => {
        if (!cancelled) setData(decode(b));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const geometry = useMemo(() => {
    if (!data) return null;
    const n = Math.floor(data.count / stride);
    const target = new Float32Array(n * 3);
    const scatter = new Float32Array(n * 3);
    const bright = new Float32Array(n);
    const seed = new Float32Array(n);

    for (let i = 0; i < n; i++) {
      const j = i * stride;
      const x = (data.xs[j] / 32767) * RANGE;
      const y = (data.ys[j] / 32767) * RANGE;
      const z = (data.zs[j] / 32767) * RANGE;
      target[i * 3] = x;
      target[i * 3 + 1] = y;
      target[i * 3 + 2] = z;

      // Scattered start: a loose shell around where the form will RESOLVE, on
      // the right. The earlier version biased this left, which put the
      // unresolved cloud directly behind the headline column and dropped the
      // lead paragraph to 2.31 contrast. The text column is the one place the
      // cloud must never occupy.
      const a = (i / n) * Math.PI * 2 * 7.3;
      const r = 1.1 + ((i * 2654435761) % 1000) / 1000;
      scatter[i * 3] = x * 0.6 + 0.75 + Math.cos(a) * r * 0.5;
      scatter[i * 3 + 1] = y * 0.5 + Math.sin(a) * r * 0.5;
      scatter[i * 3 + 2] = z + (((i * 40503) % 1000) / 1000 - 0.5) * 1.4;

      bright[i] = data.bs[j] / 255;
      seed[i] = ((i * 2246822519) % 1000) / 1000;
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(target, 3));
    g.setAttribute("aTarget", new THREE.BufferAttribute(target, 3));
    g.setAttribute("aScatter", new THREE.BufferAttribute(scatter, 3));
    g.setAttribute("aBright", new THREE.BufferAttribute(bright, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 4);
    return g;
  }, [data, stride]);

  const uniforms = useMemo(
    () => ({
      uResolve: { value: 0 },
      uProgress: { value: 0 },
      uMode: { value: 0 },
      uModeMix: { value: 0 },
      uTime: { value: 0 },
      uSize: { value: 15 },
      uPixelRatio: { value: 1 },
      uCalm: { value: 0 },
      // All three stops come from the measured brand ramps in BRAND.md, so the
      // cloud varies in hue without introducing a colour the brand does not own.
      uDeep: { value: new THREE.Color("#7E9E3C") },  // brand green, chroma preserved
      uMid: { value: new THREE.Color("#8AC2E0") },   // brand blue
      uHot: { value: new THREE.Color("#EFF6FB") },   // rr-blue-100
    }),
    [],
  );

  const group = useRef<THREE.Group>(null);
  const modeMix = useRef(0);
  const modeCur = useRef(0);

  useFrame((state, delta) => {
    const u = mat.current?.uniforms;
    if (!u) return;

    u.uTime.value += Math.min(delta, 0.05);
    u.uProgress.value = progress;

    // Resolve completes over the first ~28% of the document, so the form is
    // whole by the time the reader reaches the services.
    u.uResolve.value = Math.min(1, progress / 0.28);

    const wanted = MODE[slice ?? "base"];
    if (wanted !== modeCur.current) {
      modeMix.current = Math.max(0, modeMix.current - delta * 2.2);
      if (modeMix.current <= 0.001) modeCur.current = wanted;
    } else if (wanted !== 0) {
      modeMix.current = Math.min(1, modeMix.current + delta * 1.6);
    } else {
      modeMix.current = Math.max(0, modeMix.current - delta * 1.8);
    }
    u.uMode.value = modeCur.current;
    u.uModeMix.value = modeMix.current;

    u.uPixelRatio.value = state.gl.getPixelRatio();
    u.uSize.value = size.width < 768 ? 12 : 15;

    // Camera, in three phases. A single monotonic dolly reads as "zooming in"
    // for the whole page and has nowhere to land; §5 asks for the form to be
    // resolved, still and calm by the booking section, so the last phase pulls
    // back out and settles instead of pushing further in.
    const p = progress;
    const smooth = (a: number, b: number, t: number) => {
      const x = Math.min(1, Math.max(0, (t - a) / (b - a)));
      return x * x * (3 - 2 * x);
    };

    // 0.00-0.30  RESOLVE   hold wide while the cloud assembles
    // 0.30-0.68  TRAVERSE  drive through the volume, drifting laterally
    // 0.68-1.00  SETTLE    ease back out to a composed, still framing
    const resolve = smooth(0.0, 0.3, p);
    const traverse = smooth(0.3, 0.68, p);
    const settle = smooth(0.68, 1.0, p);

    const z = 3.35 - resolve * 0.55 - traverse * 1.35 + settle * 1.5;
    const x = traverse * 0.34 - settle * 0.34;
    const y = Math.sin(traverse * Math.PI) * 0.16 * (1 - settle);

    state.camera.position.set(x, y, z);
    state.camera.lookAt(0, 0, 0);

    // Slow yaw through the traverse so it reads as moving THROUGH a volume
    // rather than toward a picture, unwinding to square by the time it settles.
    if (group.current) {
      group.current.rotation.y = traverse * 0.26 * (1 - settle);
      group.current.rotation.z = traverse * 0.05 * (1 - settle);
    }

    // Motion decays to nothing in the settle phase: the CTA sits in stillness.
    u.uCalm.value = settle;
  });

  if (!geometry) return null;

  return (
    <group ref={group}>
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
    </group>
  );
}

export default function Reconstruction({ tier }: { tier: 1 | 2 | 3 }) {
  return (
    <Canvas
      aria-hidden
      // DPR capped: a 3x phone screen would otherwise shade 9x the fragments
      // for no visible gain on a soft point cloud.
      dpr={[1, tier === 3 ? 2 : 1.5]}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
        depth: true,
      }}
      camera={{ fov: 42, position: [0, 0, 3.1], near: 0.1, far: 20 }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Points tier={tier} />
    </Canvas>
  );
}
