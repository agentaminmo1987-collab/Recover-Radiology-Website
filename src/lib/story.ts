import {
  CAPACITY,
  REPORT_TURNAROUND,
  SAME_DAY,
  billing,
  clinic,
  modalities,
} from "@/lib/clinic";

/**
 * The scroll story on the home page: one knee, shown the way each scanner sees
 * it, with the booking card at the end.
 *
 * COPY RULES. Every sentence here is assembled from `clinic.ts`, which is the
 * closed fact set. Nothing is new clinical claim. The three things that are new
 * are the callout labels on the illustration, and each is marked TO CONFIRM
 * because it is plain-language anatomy pointing at a generated picture.
 *
 * NOT BEFORE AND AFTER. The sequence is "see inside", never injured then
 * healed. AHPRA section 133 bans before and after imagery, so the knee is the
 * same knee in every stage and the last stage is simply the sculpture again.
 *
 * THE PICTURES ARE ILLUSTRATIONS. They were generated (Higgsfield, 2026-11-26)
 * and are not scans of anyone. See public/img/story/README.md.
 */

const modality = (slug: string) => {
  const m = modalities.find((x) => x.slug === slug);
  if (!m) throw new Error(`story.ts: no modality "${slug}" in clinic.ts`);
  return m;
};

const ultrasound = modality("ultrasound");
const xray = modality("x-ray");
const ct = modality("ct");

export interface StoryCallout {
  label: string;
  /** Where the leader line ends, as a percentage of the figure box. */
  x: number;
  y: number;
  /** Which side of the figure the label sits on. */
  side: "left" | "right";
}

export interface StoryStage {
  id: string;
  /** Short name for the progress dots. */
  dot: string;
  eyebrow: string;
  heading: string;
  body: string[];
  /** `dark` stages carry white type and the glass button. */
  tone: "light" | "dark";
  /** Flat ground behind the stage, sampled from the still itself. */
  bg: string;
  still: string;
  alt: string;
  callouts: StoryCallout[];
  link?: { href: string; label: string };
  booking?: boolean;
}

export const storyStages: StoryStage[] = [
  {
    id: "recover",
    dot: "Start",
    eyebrow: `${clinic.address.suburb} ${clinic.address.state}`,
    heading: clinic.tagline,
    body: [
      `Ultrasound, CT, X-ray and image guided procedures in ${clinic.address.suburb}. Most services are bulk billed, and your report reaches your doctor within ${REPORT_TURNAROUND}.`,
    ],
    tone: "light",
    bg: "#f3efe3",
    still: "knee-1-form",
    alt: "Illustration: a plaster sculpture of a bent knee.",
    callouts: [],
    booking: true,
  },
  {
    id: "ultrasound",
    dot: "Ultrasound",
    eyebrow: "Ultrasound",
    heading: "A live image, built from sound.",
    body: [
      ultrasound.summary,
      `${CAPACITY.ultrasoundRooms} ultrasound rooms and 5 sonographers. ${SAME_DAY.short}`,
    ],
    tone: "dark",
    bg: "#485825",
    still: "knee-2-ultrasound",
    alt: "Illustration: the same knee made translucent, showing the tendons, ligaments and muscle inside.",
    // TO CONFIRM (Amin): plain-language anatomy labels on a generated picture.
    callouts: [
      { label: "Tendons", x: 62, y: 33, side: "right" },
      { label: "Ligaments", x: 43, y: 45, side: "left" },
      { label: "Muscle", x: 38, y: 68, side: "left" },
    ],
    link: { href: "/ultrasound", label: "About ultrasound" },
  },
  {
    id: "x-ray",
    dot: "X-ray",
    eyebrow: "X-ray",
    heading: "Digital X-ray, usually same day.",
    body: [
      "Booking ahead gives you the shortest wait, and we accept walk-ins during business hours.",
      `${xray.duration}.`,
    ],
    tone: "dark",
    bg: "#161311",
    still: "knee-3-xray",
    alt: "Illustration: the same knee drawn as an X-ray, showing the bones and the joint between them.",
    // TO CONFIRM (Amin): plain-language anatomy labels on a generated picture.
    callouts: [
      { label: "Thigh bone", x: 47, y: 24, side: "left" },
      { label: "Kneecap", x: 68, y: 41, side: "right" },
      { label: "Shin bone", x: 50, y: 66, side: "left" },
    ],
    link: { href: "/x-ray", label: "About X-ray" },
  },
  {
    id: "ct",
    dot: "CT",
    eyebrow: "CT",
    heading: "Cross sections, rebuilt in detail.",
    body: [ct.summary, `${ct.duration}.`],
    tone: "dark",
    bg: "#4a59cb",
    still: "knee-4-ct",
    alt: "Illustration: the same knee separated into horizontal slices, the way a CT scan images it.",
    // TO CONFIRM (Amin): wording taken from the CT summary in clinic.ts.
    callouts: [
      { label: "One cross section", x: 66, y: 30, side: "right" },
      { label: "Rebuilt into a volume", x: 36, y: 62, side: "left" },
    ],
    link: { href: "/ct", label: "About CT" },
  },
  {
    id: "book",
    dot: "Book",
    eyebrow: "Book your scan",
    heading: billing.headline,
    // The exception sits in the same block as the claim, never apart from it.
    body: [billing.exceptions, SAME_DAY.short],
    tone: "light",
    bg: "#e1f0f0",
    still: "knee-5-whole",
    alt: "Illustration: the plaster sculpture of the knee, whole again.",
    callouts: [],
    booking: true,
  },
];
