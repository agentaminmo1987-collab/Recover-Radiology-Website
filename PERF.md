# Performance

Measured in a production build (`next build` + `next start`), never in dev.
Numbers below are from a real browser, not estimates.

## Budgets from the brief (§4.5)

| Budget | Target | Measured | Status |
|---|---|---|---|
| Initial JS, gzip, excluding 3D | < 200 KB | **172 KB** | pass, 28 KB headroom |
| CSS, gzip | not specified | 7.8 KB | |
| 3D bundle blocking first paint | must not | not in initial HTML | pass |
| 3D on low power / reduced motion | must be off | tier gate returns 0 | pass |
| Mobile DPR | capped | 1.5 on tiers 1-2, 2.0 on tier 3 | pass |
| Particle count scaled to device | required | stride 4 / 2 / 1 by tier | pass |

## Canvas

Measured on Intel integrated graphics (ANGLE / D3D11), 1265x900 drawing buffer,
tier 3, 65,536 points.

| Scenario | FPS | Worst frame |
|---|---|---|
| Idle, resolved | **60.1** | 16.8 ms |
| Scrolling the full document | **60.0** | 16.9 ms |

The scrolling pass drives resolve, a camera traverse and modality transitions
simultaneously, which is the worst case. No frame exceeded 16.9 ms, so nothing
was dropped at 60 Hz. No context loss.

Integrated Intel graphics is a fair proxy for a mid-tier machine. It is **not** a
proxy for a mid-tier Android, which remains untested. See Not yet measured below.

### Why it holds 60fps

All motion happens in the vertex shader from six uniforms. There is no
per-frame JavaScript touching the 65,536 points: `useFrame` writes uniforms and
the camera, nothing else. The scroll value is damped in a ref rather than React
state, so scrolling never triggers a render.

Depth of field is approximated in-shader by attenuating points away from the
focal plane, rather than by a postprocessing pass. At this scale it is visually
sufficient and costs one `smoothstep`.

## Assets

| Asset | Size |
|---|---|
| Point cloud, `points-torso.bin` | 448 KB raw, **346 KB gzip** |
| Images shipped, all AVIF + WebP | 3.6 MB total |
| Hero plate at 2560px, AVIF | 123 KB |
| Image masters, gitignored, never served | 110 MB |

The point cloud went 1.9 MB to 346 KB in three steps, each measured:

1. **Float32 to quantised Int16 + Uint8**, planar rather than interleaved.
   1875 KB to 448 KB raw. The precision loss is under a pixel at render scale.
2. **Z-order (Morton) sort.** 428 to 412 KB gzip. Array neighbours become
   spatial neighbours, so each plane is locally smooth.
3. **Delta encoding per plane.** 412 to 346 KB gzip. Only works because of
   step 2.

The remaining incompressibility is the per-point jitter that prevents grid
banding, which is genuinely random and should not compress.

Note: the Z-order sort is also what makes runtime downsampling correct. Lower
tiers take every Nth point, and a strided sample of a Z-ordered array still
covers the whole form. A prefix would cover one corner.

## Contrast over the canvas

An automated contrast audit compares text against its CSS background and is
blind to a WebGL canvas painting behind it. So this was measured directly, by
reading the framebuffer under each text block and compositing it over the page
surface:

| Element | Canvas alpha behind it | Effective contrast |
|---|---|---|
| Hero `h1` | 0.000 | **18.64** |
| Hero lead paragraph | 0.000 | **15.52** |

Identical to the contrast over a plain surface, because the point cloud is
sampled from the approved hero plate and inherits its clear left third exactly
where the headline sits. The composition is preserved by construction rather
than by tuning.

## Not yet measured

- **Lighthouse.** Not run. Requires the site on a URL rather than a local
  server, so this lands with the first Vercel preview in Phase E.
- **LCP on a mid-tier Android over 4G.** The §4.5 target is under 2.5 s. The
  local numbers say nothing about this; it needs throttled testing on the
  deployed URL.
- **A real mobile GPU.** Tier gating means most phones get stride 4 (16,384
  points) at DPR 1.5, but that path has been reasoned about, not observed.
- **Static asset compression.** `next start` served the point cloud
  uncompressed at 448 KB. Vercel compresses static assets automatically, so the
  346 KB figure should hold in production. Worth confirming on the preview.
