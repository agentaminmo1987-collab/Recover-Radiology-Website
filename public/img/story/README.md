# Scroll story images

Everything in this folder is a **generated illustration**, not a scan of a
person and not a photograph of the clinic.

| | |
|---|---|
| Made with | Higgsfield, 2026-11-26. Stills: GPT Image 2.6. Clips: Seedance 2.5, start and end frame. |
| Subject | One plaster sculpture of a knee, shown as a form, as ultrasound, X-ray and CT see it, then whole again. |
| Placeholder | `true`. Swap for commissioned 3D or real, consented imaging if the practice ever wants to. |
| Alt text | Every still's alt starts with "Illustration:" so nobody reads it as a clinical image. |
| Not before and after | The sequence is "see inside". It never shows injured then healed. |

## Files

- `knee-N-*.{avif,webp}`: the five stage stills, at 480, 800 and 1270 wide.
- `frames-lg/`, `frames-sm/`: 48 frames from each of the four morph clips,
  drawn to a canvas as the page scrolls. About 1.3 MB and 0.8 MB in total.
  Loaded after the page is idle, never under reduced motion, Save-Data or 2G.

## Rebuilding

Masters live in `public/img/_raw/story` (gitignored): `s1.png` to `s5.png` and
`c1.mp4` to `c4.mp4`. They also sit in the Higgsfield account history.

```bash
node scripts/build-story-frames.mjs
```

That rewrites this folder and `src/lib/story-frames.json`, which holds the
ground colour sampled from the edge of every frame.

## Open

- The callout labels (Tendons, Ligaments, Muscle, Thigh bone, Kneecap, Shin
  bone) are plain-language anatomy pointing at a generated picture. They are
  marked TO CONFIRM in `src/lib/story.ts` and listed in QUESTIONS.md item 25.
