"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Calm flowing wave field.
 *
 * Replaces the anatomical point cloud. That version read as X-ray particles,
 * which is clinical and slightly sci-fi; the clinic itself is bright, warm and
 * spa-like, so the background should be too.
 *
 * This is a single fullscreen quad with everything happening in one fragment
 * shader: two triangles instead of 300,000 points. It is faster, it needs no
 * asset at all (the 1.5MB point cloud is gone), and smooth interference is far
 * better suited to flowing fields than discrete particles ever were.
 *
 * The motion is a true loop with no start or end, so it never draws attention
 * by resetting. Decorative only: aria-hidden, and the page reads identically
 * without it.
 */

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2  uRes;
  uniform vec3  uBase;    // page surface, so the field dissolves into it
  uniform vec3  uInk;     // brand green, the primary wave
  uniform vec3  uCool;    // brand blue, the secondary wave
  uniform float uStrength;

  varying vec2 vUv;

  // Smooth value noise. Cheap, and gentler than simplex for something this slow.
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    // Quintic, not cubic. Cubic smoothstep leaves a second-derivative
    // discontinuity at cell edges, which is exactly the faceted, blocky look.
    vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),
               mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    // More octaves at a gentler lacunarity: softer, smokier falloff than a few
    // coarse ones doubling each time.
    for (int i = 0; i < 7; i++) { v += a * noise(p); p *= 1.72; a *= 0.58; }
    return v * 0.78;
  }

  void main() {
    vec2 uv = vUv;
    // Correct for aspect so the field never stretches on wide screens.
    vec2 p = (uv - 0.5) * vec2(uRes.x / uRes.y, 1.0);

    // A slow drift downward and to the right. The period is chosen so every
    // term shares a common multiple: the whole field loops seamlessly.
    // Time only. Scroll deliberately does NOT feed into this: the field is a
    // steady ambient loop and must look identical at the top and the bottom of
    // the page. Anything that ties it to scroll makes it appear to accelerate.
    float t = uTime * 0.055;

    // Domain warp. Displacing the sample point by noise is what turns straight
    // wavefronts into flowing, organic fields rather than a striped pattern.
    vec2 q = vec2(fbm(p * 1.15 + vec2(0.0, t)),
                  fbm(p * 1.15 + vec2(5.2, 1.3 - t)));
    vec2 r = vec2(fbm(p * 1.9 + 3.4 * q + vec2(1.7, 9.2) + t * 0.6),
                  fbm(p * 1.9 + 3.4 * q + vec2(8.3, 2.8) - t * 0.4));

    // OCEAN SWELL, not isotropic noise.
    //
    // The previous version was mostly fbm, which is why it read as random
    // smoke: noise has no direction, so nothing travelled. This is a set of
    // parallel wavefronts moving along one axis, which is what gives it a
    // consistent direction of travel and lets it read as swell.
    //
    // Three trains at related wavelengths, the way real swell superposes: a
    // long dominant one, a shorter one, and a small chop. The noise is demoted
    // to a domain warp on the phase, so it undulates the crests rather than
    // replacing them. Direction survives, softness is kept.
    vec2 dir = normalize(vec2(0.86, 0.38));
    float phase = dot(p, dir) * 3.1;
    float warp = (fbm(p * 0.85 + vec2(0.0, t * 0.9)) - 0.5) * 2.6;

    // Gentle breathing in speed and wavelength, the way real swell arrives in
    // sets. Both terms are slow and shallow: the sets take about 40 and 60
    // seconds and vary by well under a quarter, so it reads as alive rather
    // than as something speeding up.
    float sets  = 1.0 + sin(t * 0.42) * 0.16 + sin(t * 0.27 + 1.7) * 0.09;
    float pitch = 1.0 + sin(t * 0.31 + 0.6) * 0.11;

    float travel = t * 2.4 * sets;
    float swell =
        sin(phase * 1.00 * pitch + warp * 1.45 - travel * 1.00) * 0.54
      + sin(phase * 1.87 * pitch + warp * 1.00 - travel * 1.43) * 0.30
      + sin(phase * 3.31 * pitch + warp * 0.62 - travel * 2.05) * 0.16;

    // A slow cross swell, much weaker, so crests are never perfectly parallel.
    float cross = sin(dot(p, normalize(vec2(-0.32, 0.95))) * 2.1 - travel * 0.55) * 0.16;

    float mixed = (swell + cross) * 0.5 + 0.5;
    // A trace of fbm keeps the smoke feel in the troughs without adding chaos.
    mixed = mix(mixed, fbm(p * 1.3 + r * 0.8), 0.16);

    // Broad soft bands. smoothstep rather than a hard step so there is never a
    // visible edge; this has to sit behind text without competing.
    float band = smoothstep(0.18, 0.94, mixed);
    float rim  = smoothstep(0.50, 0.70, mixed) * (1.0 - smoothstep(0.74, 0.98, mixed));

    vec3 col = uBase;
    col = mix(col, uInk,  band * 1.0);
    col = mix(col, uCool, rim  * 0.55);

    // Vignette toward the page colour at the edges, so the field has no frame
    // and simply dissolves into the surface.
    float d = length((uv - vec2(0.62, 0.46)) * vec2(1.15, 1.0));
    float falloff = 1.0 - smoothstep(0.16, 0.95, d);

    // Keep the left column clear for the headline. The copy always wins.
    float clearLeft = smoothstep(0.02, 0.48, uv.x);

    float a = falloff * clearLeft * uStrength;
    gl_FragColor = vec4(mix(uBase, col, a), a);
  }
`;

function Field() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const [tone, setTone] = useState<"light" | "dark">("light");

  useEffect(() => {
    const read = () => {
      const root = getComputedStyle(document.documentElement);
      const hex = (name: string) => root.getPropertyValue(name).trim();
      const lum = (h: string) => {
        const m = h.match(/^#([0-9a-f]{6})$/i);
        if (!m) return 1;
        const n = parseInt(m[1], 16);
        const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((x) => {
          const q = x / 255;
          return q <= 0.03928 ? q / 12.92 : Math.pow((q + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
      };
      setTone(lum(hex("--surface")) > 0.2 ? "light" : "dark");
    };
    read();
    const q = window.matchMedia("(prefers-color-scheme: dark)");
    q.addEventListener("change", read);
    return () => q.removeEventListener("change", read);
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uStrength: { value: 0.5 },
      uBase: { value: new THREE.Color("#FBF9F4") },
      uInk: { value: new THREE.Color("#F8F7ED") },
      uCool: { value: new THREE.Color("#DBDEF6") },
    }),
    [],
  );

  useEffect(() => {
    const u = mat.current?.uniforms;
    if (!u) return;
    if (tone === "light") {
      // Dust 20% and Bloom 20%, straight from the brand tint chart. Both are
      // background tints in the guidelines and neither ever carries type, so
      // using them as a field is exactly what they are for. At 20% they are a
      // whisper rather than a wash, which is the point: calm, not decorated.
      u.uBase.value.set("#FBF9F4");
      // Dust and Bloom at 40%. The 20% tints sat so close to the canvas that
      // the field barely registered; 40% gives it presence while both remain
      // background tints that never carry type.
      u.uInk.value.set("#F1EFDB");  // Dust 40%, the warm body
      u.uCool.value.set("#B6BDEE"); // Bloom 40%, the cool wave
      u.uStrength.value = 1.0;
    } else {
      u.uBase.value.set("#12100D");
      u.uInk.value.set("#2A3320");
      u.uCool.value.set("#8DBAD8"); // Sky, the dark-mode voice
      u.uStrength.value = 0.5;
    }
  }, [tone]);

  useFrame((state, delta) => {
    const u = mat.current?.uniforms;
    if (!u) return;
    u.uTime.value += Math.min(delta, 0.05);
    u.uRes.value.set(state.size.width, state.size.height);
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
        transparent
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function WaveField() {
  return (
    <Canvas
      aria-hidden
      // A fullscreen gradient needs no supersampling; capping DPR here is most
      // of the reason this is cheap on a phone.
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance", depth: false, stencil: false }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Field />
    </Canvas>
  );
}
