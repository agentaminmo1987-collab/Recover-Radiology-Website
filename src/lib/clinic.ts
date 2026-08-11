/**
 * Verified business facts for Recover Radiology.
 *
 * Every value here was extracted from the live site and confirmed. Nothing in
 * this file may be altered, embellished or rounded, and nothing may be added
 * without a source. Clinical copy in particular is a closed set: if a component
 * needs a fact that is not here, it gets a marked placeholder and a line in
 * QUESTIONS.md, never an invention.
 */

export const clinic = {
  name: "Recover Radiology",
  tagline: "Forming your road to recovery",

  address: {
    line1: "Suite 1-3, 1-7 Doctors Road",
    suburb: "Morphett Vale",
    state: "SA",
    postcode: "5162",
    country: "AU",
    full: "Suite 1-3, 1-7 Doctors Road, Morphett Vale SA 5162",
  },

  geo: { lat: -35.136102, lng: 138.525344 },

  phone: { display: "08 7081 3078", href: "tel:+61870813078" },
  fax: { display: "08 7093 7169" },

  hours: {
    display: "Monday to Friday, 8:30am to 5:30pm",
    opens: "08:30",
    closes: "17:30",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const,
  },

  serviceArea: "Adelaide's southern suburbs",
  referrerPortal: "https://pacs.recoverradiology.com.au/Portal/app#/",
  instagram: "https://instagram.com/recoverradiology",
} as const;

/** Report turnaround, stated on the existing site for ultrasound. */
export const REPORT_TURNAROUND = "24 to 48 hours";

export type ModalitySlug = "ultrasound" | "ct" | "x-ray" | "interventional";

export interface Modality {
  slug: ModalitySlug;
  name: string;
  /** One line, patient facing. Voice: answer the question first. */
  summary: string;
  duration: string;
  bulkBilled: "yes" | "mostly" | "exceptions";
  bulkBilledNote?: string;
  types: { name: string; detail: string }[];
  preparation: { label: string; instruction: string }[];
  /** Safety or limitation the patient must know before attending. */
  mustKnow?: string;
}

export const modalities: Modality[] = [
  {
    slug: "ultrasound",
    name: "Ultrasound",
    summary:
      "Sound waves build a live image. No radiation, and most appointments are finished inside 30 minutes.",
    duration: "Most appointments 30 minutes or less",
    bulkBilled: "exceptions",
    bulkBilledNote: "Obstetric scans are not bulk billed.",
    types: [
      {
        name: "Musculoskeletal",
        detail:
          "Sporting injuries, overuse conditions, muscle tears and joint inflammation.",
      },
      {
        name: "Vascular",
        detail:
          "Blood flow in arteries and veins, including narrowing, blockages, clots and aneurysms.",
      },
      {
        name: "Obstetric",
        detail:
          "Pregnancy and fetal development, imaged in real time. Not bulk billed.",
      },
      {
        name: "General",
        detail:
          "Abdomen, pelvis, thyroid and soft tissues. Used for gallstones, kidney issues and similar.",
      },
    ],
    preparation: [
      {
        label: "Musculoskeletal, vascular and soft tissue",
        instruction: "Wear loose comfortable clothing. No other preparation needed.",
      },
      {
        label: "Renal and pelvic",
        instruction:
          "Drink one litre of water one hour before your appointment and arrive with a full bladder.",
      },
      {
        label: "Abdominal",
        instruction: "Fast from food and drink for six hours beforehand.",
      },
      {
        label: "If you smoke",
        instruction: "Avoid smoking for six hours before an abdominal scan.",
      },
    ],
  },
  {
    slug: "ct",
    name: "CT",
    summary:
      "A series of cross sections rebuilt into a detailed volume, at the lowest radiation dose consistent with image quality.",
    duration: "About 15 minutes, or 30 minutes with contrast",
    bulkBilled: "mostly",
    types: [
      { name: "CT Angiogram", detail: "Blood vessels." },
      { name: "CT Head", detail: "Brain and skull." },
      { name: "CT Spine", detail: "Cervical, thoracic and lumbar spine." },
      { name: "CT Neck", detail: "Soft tissues of the neck." },
      { name: "CT Abdomen", detail: "Abdominal organs." },
      { name: "CT Extremity", detail: "Arms, legs, hands and feet." },
    ],
    preparation: [
      {
        label: "If your scan uses contrast",
        instruction:
          "You will complete a contrast questionnaire beforehand so we can check for anything that would make contrast unsuitable.",
      },
      {
        label: "Time to allow",
        instruction:
          "A standard scan takes about 15 minutes. With contrast allow 30 minutes, which includes preparation and monitoring.",
      },
    ],
  },
  {
    slug: "x-ray",
    name: "X-ray",
    summary:
      "Digital X-ray, walk in during business hours. No appointment needed and usually same day.",
    duration: "5 to 10 minutes, longer for multiple views",
    bulkBilled: "yes",
    types: [
      {
        name: "Walk in",
        detail:
          "No appointment needed during business hours, and usually completed the same day.",
      },
      {
        name: "Digital imaging",
        detail:
          "Images are available to your radiologist immediately after the examination.",
      },
    ],
    preparation: [
      {
        label: "Before you attend",
        instruction:
          "Remove any metal from the area being imaged, including jewellery.",
      },
      {
        label: "Radiation",
        instruction:
          "We work to the ALARA principle, As Low As Reasonably Achievable, so the dose is kept to the minimum needed for a diagnostic image.",
      },
    ],
    mustKnow:
      "Tell our staff in advance if you are or might be pregnant. This is the main limitation on X-ray.",
  },
  {
    slug: "interventional",
    name: "Interventional procedures",
    summary:
      "Image guided injections and blocks, performed by experienced radiologists on dedicated procedure days each fortnight.",
    duration: "Varies by procedure. Some require a short observation period",
    bulkBilled: "exceptions",
    bulkBilledNote: "Some interventional procedures are not bulk billed.",
    types: [
      { name: "Cortisone Injection", detail: "" },
      { name: "Euflexxa Injection", detail: "" },
      { name: "Facet Joint Injection", detail: "" },
      { name: "Nerve Root Block", detail: "" },
      { name: "Epidural Injection", detail: "" },
      { name: "Medial Branch Block", detail: "" },
    ],
    preparation: [
      {
        label: "Getting home",
        instruction:
          "Some procedures require a short observation period afterwards. Arrange transport home rather than planning to drive yourself.",
      },
      {
        label: "Scheduling",
        instruction:
          "These are performed on dedicated procedure days each fortnight, so booking ahead is necessary.",
      },
    ],
  },
];

/**
 * Billing. This is the highest anxiety topic on the site and the most
 * compliance sensitive section. The exceptions are stated in the same visual
 * block as the reassurance, never in a footnote.
 */
export const billing = {
  headline: "Most services are bulk billed.",
  exceptions:
    "Obstetric scans and some interventional procedures are the exceptions.",
  whatBulkBilledMeans:
    "Bulk billed means we bill Medicare directly. There is no gap fee and nothing for you to pay.",
  eligibility:
    "Eligibility depends on the type of scan, the details on your referral, and a valid Medicare or Concession Card.",
  cases: [
    {
      who: "Concession card holders",
      detail:
        "Most services are bulk billed where the referral meets MBS criteria.",
    },
    {
      who: "DVA White Card",
      detail:
        "Covers only services related to the approved conditions listed on the card.",
    },
    {
      who: "Private patients",
      detail:
        "Full payment is due at the time of your examination. Our staff lodge the Medicare rebate electronically and it is paid into your nominated account.",
    },
    {
      who: "Private health insurance",
      detail:
        "Only covers imaging performed as an admitted hospital patient, so it does not apply to scans here.",
    },
  ],
  payment: "We accept EFTPOS and credit card. We do not accept AMEX.",
  feesNote: "Our clerical team will tell you the fee when you book.",
} as const;

/**
 * Team. No surnames, photos or qualifications are published for most staff and
 * none may be invented. Khoa Le is the only person named with a speciality on
 * the existing site.
 */
export const team = {
  practiceManager: { name: "Emily", role: "Practice Manager" },
  clericalLead: { name: "Ashleigh", role: "Clerical Lead" },
  clerical: [{ name: "Chilali" }, { name: "Melanie" }],
  sonographers: [{ name: "Matt" }, { name: "David" }, { name: "Laura" }],
  chiefSonographer: {
    name: "Khoa Le",
    role: "Chief Sonographer",
    speciality: "Vascular",
  },
  combinedExperience: "25 years of combined experience",
  sonographerCount: 3,
} as const;

/** What a referrer should include. Improves protocol selection. */
export const referrerGuidance = [
  "Symptoms and their duration",
  "Provisional diagnosis",
  "The specific clinical question you need answered",
] as const;
