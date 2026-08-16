/**
 * The four kinds of ultrasound, each as its own page.
 *
 * WHY THESE EXIST. Ultrasound is the practice's specialty and it was one page
 * with four bullet points. A patient referred for a shoulder scan and a patient
 * referred for a renal scan have almost nothing in common: different
 * preparation, different questions, different anxieties. One page served
 * neither well, and it competed for a single ranking against clinics with a
 * page per study.
 *
 * WHAT IS SAFE TO WRITE HERE, AND WHAT IS NOT.
 *
 * These are materially lower risk than the interventional procedure pages, and
 * are treated differently on purpose. An interventional page has to state risks
 * and benefits, which is clinical judgement and needs a radiologist. Describing
 * what a musculoskeletal ultrasound looks at does not.
 *
 * So the rule here is narrower rather than gated: every page states what the
 * scan looks at, what it is commonly used for, how to prepare, how long it
 * takes and what it costs. PREPARATION AND DURATION AND BILLING ARE PULLED FROM
 * clinic.ts VERBATIM, because getting preparation wrong costs the patient a
 * second trip. Nothing claims an outcome, a success rate or a comparison.
 *
 * Obstetric is handled with particular care: it is the one ultrasound that is
 * not bulk billed, and that has to be visible before someone books.
 */

export interface UltrasoundType {
  slug: string;
  /** Matches the `types[].name` entry in clinic.ts exactly. */
  name: string;
  /** What patients and referrers actually call it. */
  alsoCalled?: string;
  summary: string;
  whatItIs: string;
  /** Common reasons for referral. Indications, not promises. */
  usedFor: string[];
  whatToExpect: string[];
  /** Preparation label in clinic.ts that applies, so the two cannot drift. */
  preparationLabel: string;
  /** Set only where it differs from the modality default. */
  billingNote?: string;
}

export const ultrasoundTypes: UltrasoundType[] = [
  {
    slug: "musculoskeletal",
    name: "Musculoskeletal",
    alsoCalled: "MSK ultrasound",
    summary:
      "Ultrasound of muscles, tendons, ligaments, bursae and joints, imaged live while you move.",
    whatItIs:
      "Musculoskeletal ultrasound looks at the soft tissue around a joint: the muscles, tendons, ligaments and the small fluid-filled sacs called bursae. Its particular strength is that it is live. The sonographer can move the joint while scanning and watch a tendon glide, catch, or fail to move as it should, which a static image cannot show. It is the reason ultrasound is often the first study for a soft tissue injury even though other imaging exists.",
    usedFor: [
      "Shoulder pain, including rotator cuff tendons and bursitis",
      "Tennis and golfer's elbow, and other tendon problems",
      "Achilles and other tendon injuries",
      "Muscle tears and strains after a sporting injury",
      "Knee, hip, wrist and ankle pain",
      "Plantar fasciitis and other foot conditions",
      "Lumps and swellings in soft tissue",
    ],
    whatToExpect: [
      "You will be asked to expose the area being scanned, so loose clothing helps.",
      "Warm gel is applied to the skin. It is not cold, and it wipes off.",
      "The sonographer will move the joint, or ask you to move it, while scanning. This is deliberate: movement is what makes a tendon problem visible.",
      "Tell the sonographer where it hurts. Pointing at the exact spot genuinely changes what gets scanned.",
    ],
    preparationLabel: "Musculoskeletal, vascular and soft tissue",
  },
  {
    slug: "vascular",
    name: "Vascular",
    alsoCalled: "Doppler ultrasound",
    summary:
      "Ultrasound of blood flow through the arteries and veins, using Doppler to hear and measure it.",
    whatItIs:
      "Vascular ultrasound uses the Doppler effect to measure blood as it moves, rather than only showing the shape of a vessel. That means it can show how fast blood is travelling, in which direction, and whether flow is being restricted. You will usually hear it as well as see it: the pulsing sound during the scan is the blood flow itself.",
    usedFor: [
      "Suspected deep vein thrombosis, a clot in a leg vein",
      "Narrowing of the carotid arteries in the neck",
      "Varicose veins and problems with vein valves",
      "Aneurysm assessment and monitoring",
      "Poor circulation in the legs or arms",
      "Checking blood flow to a transplanted organ",
    ],
    whatToExpect: [
      "The scan can take longer than other ultrasounds, because each vessel is followed along its length.",
      "You will hear the Doppler sound during the scan. It is loud and rhythmic, and it is normal.",
      "For a leg study you may be scanned both lying down and standing.",
      "Loose clothing helps, as the area needs to be exposed.",
    ],
    preparationLabel: "Musculoskeletal, vascular and soft tissue",
  },
  {
    slug: "obstetric",
    name: "Obstetric",
    alsoCalled: "Pregnancy ultrasound",
    summary:
      "Ultrasound in pregnancy, imaged in real time. This is the one ultrasound we do not bulk bill.",
    whatItIs:
      "Obstetric ultrasound images the pregnancy, the developing baby and the surrounding structures. It uses no ionising radiation, which is why it is the standard way to image in pregnancy. What is looked at depends on how many weeks along you are, and your referring doctor will have specified the study on the referral.",
    usedFor: [
      "Confirming a pregnancy and dating it",
      "Checking growth and development",
      "Assessing the placenta and amniotic fluid",
      "Following up a specific concern raised by your doctor",
    ],
    whatToExpect: [
      "Depending on the stage of pregnancy, you may be asked to arrive with a full bladder. Your referral or our clerical team will tell you when you book.",
      "The scan is performed on your abdomen with gel. Some early pregnancy studies are performed internally, and if that applies it will be explained and consented before anything happens.",
      "You are welcome to bring someone with you.",
      "The sonographer performs the scan; the radiologist writes the report. Results go to your referring doctor.",
    ],
    preparationLabel: "Renal and pelvic",
    // The single most important thing to say before someone books one.
    billingNote:
      "Obstetric ultrasound is not bulk billed. Our clerical team will tell you the fee when you book, before you commit to anything.",
  },
  {
    slug: "general",
    name: "General",
    alsoCalled: "Abdominal and pelvic ultrasound",
    summary:
      "Ultrasound of the abdomen, pelvis, thyroid and soft tissues. Often the first study for abdominal pain.",
    whatItIs:
      "General ultrasound covers the organs of the abdomen and pelvis, the thyroid in the neck, and soft tissue anywhere else. It is frequently the first imaging ordered for abdominal pain because it involves no radiation, shows fluid and solid tissue clearly, and answers common questions quickly.",
    usedFor: [
      "Gallstones and gallbladder pain",
      "Kidney stones and kidney function concerns",
      "Liver, spleen and pancreas assessment",
      "Bladder and pelvic organ assessment",
      "Thyroid nodules and neck lumps",
      "Investigating abdominal pain of unclear cause",
    ],
    whatToExpect: [
      "Preparation matters more for this scan than any other. An abdominal study needs fasting; a renal or pelvic study needs a full bladder. Check which applies before you come.",
      "Gel is applied and the probe is pressed against the skin. Some pressure is normal, and tell the sonographer if it hurts.",
      "You may be asked to hold your breath briefly, which moves the organs into a better position.",
    ],
    preparationLabel: "Abdominal",
  },
];

export function getUltrasoundType(slug: string): UltrasoundType | undefined {
  return ultrasoundTypes.find((t) => t.slug === slug);
}
