import type { CSSProperties } from "react";
import { clinic } from "@/lib/clinic";
import { storyStages, type StoryStage } from "@/lib/story";
import { ButtonLink, CallButton } from "@/components/ui";
import { ScrollStoryDriver } from "@/components/scroll-story-driver";

/**
 * The scroll story. One object, pinned, that changes as the page scrolls:
 * a knee as a sculpture, then as ultrasound, X-ray and CT see it, then the
 * booking card.
 *
 * SERVER RENDERED, AND COMPLETE WITHOUT JAVASCRIPT. Every stage is a real
 * <article> with its heading, copy, links and a still picture. With scripting
 * off, or under reduced motion, they simply stack as five full bands. The
 * pinned version is a CSS layout that only applies under
 * `@media (scripting: enabled) and (prefers-reduced-motion: no-preference)`,
 * so there is no class to toggle and nothing shifts when the script arrives.
 *
 * The client driver only does three things: fades the copy for the stage in
 * view, paints the frame for the scroll position into the canvas, and sets the
 * ground colour to the one sampled from that frame.
 */

const SIZES = "(min-width: 1024px) 46vw, 60vw";

function Still({ stage, first }: { stage: StoryStage; first: boolean }) {
  const base = `/img/story/${stage.still}`;
  return (
    <picture>
      <source
        type="image/avif"
        srcSet={`${base}-480.avif 480w, ${base}-800.avif 800w, ${base}-1270.avif 1270w`}
        sizes={SIZES}
      />
      <img
        data-story-still
        className="story-still"
        src={`${base}-800.webp`}
        srcSet={`${base}-480.webp 480w, ${base}-800.webp 800w, ${base}-1270.webp 1270w`}
        sizes={SIZES}
        width={1270}
        height={1925}
        alt={stage.alt}
        // The first still is the largest paint on the page. The rest are below
        // it in the stacked layout and behind it in the pinned one.
        loading={first ? "eager" : "lazy"}
        fetchPriority={first ? "high" : "auto"}
        decoding={first ? "sync" : "async"}
      />
    </picture>
  );
}

function Stage({ stage, index }: { stage: StoryStage; index: number }) {
  const first = index === 0;
  const Heading = first ? "h1" : "h2";
  return (
    <article
      id={`story-${stage.id}`}
      data-story-panel
      data-tone={stage.tone}
      className="story-panel"
      style={{ "--story-bg": stage.bg } as CSSProperties}
    >
      <div className="story-figure">
        <Still stage={stage} first={first} />
        {stage.callouts.length > 0 ? (
          <ul data-story-callouts className="story-callouts">
            {stage.callouts.map((c) => (
              <li
                key={c.label}
                className={`story-callout story-callout--${c.side}`}
                style={{ "--x": `${c.x}%`, "--y": `${c.y}%` } as CSSProperties}
              >
                <span>{c.label}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div data-story-copy className="story-copy">
        <p className="story-eyebrow">{stage.eyebrow}</p>
        <Heading className="story-heading">
          {stage.heading.split(/(X-ray)/).map((part, i) =>
            part === "X-ray" ? (
              <span key={i} className="nowrap">
                {part}
              </span>
            ) : (
              part
            ),
          )}
        </Heading>
        {stage.body.map((line) => (
          <p key={line} className="story-body">
            {line}
          </p>
        ))}

        {stage.booking ? (
          <>
            <div className="story-actions">
              <ButtonLink href="/contact" size="lg" echo>
                Book a scan
              </ButtonLink>
              {/* The fixed booking bar already carries the number on a phone,
                  so a second call button there only pushes the copy down. */}
              <CallButton variant="ghost" className="max-sm:hidden" />
            </div>
            {!first ? (
              <p className="story-meta tabular">
                {clinic.address.full}
                <br />
                {clinic.hours.display}
              </p>
            ) : null}
          </>
        ) : null}

        {stage.link ? (
          <div className="story-actions">
            <ButtonLink
              href={stage.link.href}
              size="lg"
              variant="ghost"
              className="btn-glass"
            >
              {stage.link.label}
              <span aria-hidden>&rarr;</span>
            </ButtonLink>
          </div>
        ) : null}
      </div>
    </article>
  );
}

export function ScrollStory() {
  return (
    <section
      data-story
      aria-label="What each scan shows"
      className="story"
      style={{ "--story-count": storyStages.length } as CSSProperties}
    >
      <div data-story-stage className="story-stage">
        {storyStages.map((stage, i) => (
          <Stage key={stage.id} stage={stage} index={i} />
        ))}
        <ScrollStoryDriver
          stages={storyStages.map((s) => ({
            id: s.id,
            dot: s.dot,
            bg: s.bg,
            tone: s.tone,
          }))}
        />
      </div>
    </section>
  );
}
