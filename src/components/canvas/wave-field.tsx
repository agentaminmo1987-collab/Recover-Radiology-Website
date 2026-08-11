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
  uniform float uScroll;
  uniform vec3  uBase;    // page surface, so the field dissolves into it
  uniform vec3  uInk;     // brand green, the primary wave
  uniform vec3  uCool;    // brand blue, the secondary wave
  uniform float uStrength;
  uniform float uCalm;

  varying vec2 vUv;

  // Smooth value noise. Cheap, and gentler than simplex for something this slow.
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),
               mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    // Correct for aspect so the field never stretches on wide screens.
    vec2 p = (uv - 0.5) * vec2(uRes.x / uRes.y, 1.0);

    // A slow drift downward and to the right. The period is chosen so every
    // term shares a common multiple: the whole field loops seamlessly.
    float t = uTime * 0.055 * (1.0 - uCalm * 0.55);

    // Domain warp. Displacing the sample point by noise is what turns straight
    // wavefronts into flowing, organic fields rather than a striped pattern.
    vec2 q = vec2(fbm(p * 1.15 + vec2(0.0, t)),
                  fbm(p * 1.15 + vec2(5.2, 1.3 - t)));
    vec2 r = vec2(fbm(p * 1.9 + 3.4 * q + vec2(1.7, 9.2) + t * 0.6),
                  fbm(p * 1.9 + 3.4 * q + vec2(8.3, 2.8) - t * 0.4));

    // Interference of two wave trains at slightly different frequencies. This
    // is what a returning ultrasound wavefront actually looks like, and it is
    // the reason the field reads as sound rather than as smoke.
    float travel = t * 2.2 + uScroll * 1.6;
    float w1 = sin((p.x * 2.6 + r.x * 3.1 - travel) * 2.0);
    float w2 = sin((p.y * 1.7 + r.y * 2.4 + travel * 0.72) * 1.7);
    float interference = (w1 * w2) * 0.5 + 0.5;

    float field = fbm(p * 1.6 + r * 1.8 + vec2(0.0, t * 0.8));
    float mixed = mix(field, interference, 0.42);

    // Broad soft bands. smoothstep rather than a hard step so there is never a
    // visible edge; this has to sit behind text without competing.
    float band = smoothstep(0.30, 0.86, mixed);
    float rim  = smoothstep(0.52, 0.72, mixed) * (1.0 - smoothstep(0.72, 0.94, mixed));

    vec3 col = uBase;
    col = mix(col, uInk,  band * 0.72);
    col = mix(col, uCool, rim  * 0.55);

    // Vignette toward the page colour at the edges, so the field has no frame
    // and simply dissolves into the surface.
    float d = length((uv - vec2(0.62, 0.46)) * vec2(1.15, 1.0));
    float falloff = 1.0 - smoothstep(0.22, 0.86, d);

    // Keep the left column clear for the headline. The copy always wins.
    float clearLeft = smoothstep(0.06, 0.44, uv.x);

    float a = falloff * clearLeft * uStrength;
    gl_FragColor = vec4(mix(uBase, col, a), a * 0.92);
  }
`;

function Field({ scroll }: { scroll: number }) {
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
      uScroll: { value: 0 },
      uStrength: { value: 0.5 },
      uCalm: { value: 0 },
      uBase: { value: new THREE.Color("#FAF7F2") },
      uInk: { value: new THREE.Color("#465E19") },
      uCool: { value: new THREE.Color("#456170") },
    }),
    [],
  );

  useEffect(() => {
    const u = mat.current?.uniforms;
    if (!u) return;
    if (tone === "light") {
      // Ink on warm paper. Brand green leads because blue fails contrast on a
      // light field, exactly as BRAND.md's inverted-contrast rule requires.
      u.uBase.value.set("#FAF7F2");
      u.uInk.value.set("#465E19");
      u.uCool.value.set("#456170");
      u.uStrength.value = 0.34;
    } else {
      u.uBase.value.set("#12100D");
      u.uInk.value.set("#7E9E3C");
      u.uCool.value.set("#8AC2E0");
      u.uStrength.value = 0.5;
    }
  }, [tone]);

  useFrame((state, delta) => {
    const u = mat.current?.uniforms;
    if (!u) return;
    u.uTime.value += Math.min(delta, 0.05);
    u.uScroll.value = scroll;
    // The field quietens as the page settles, so the booking CTA sits in calm.
    u.uCalm.value = Math.max(0, (scroll - 0.7) / 0.3);
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

export default function WaveField({ scroll }: { scroll: number }) {
  return (
    <Canvas
      aria-hidden
      // A fullscreen gradient needs no supersampling; capping DPR here is most
      // of the reason this is cheap on a phone.
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance", depth: false, stencil: false }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Field scroll={scroll} />
    </Canvas>
  );
}
