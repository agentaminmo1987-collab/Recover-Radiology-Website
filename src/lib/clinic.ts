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

  /**
   * Taken from the practice's own Google Business Profile on 2026-08-12, not
   * from geocoding the address string. The previous pair was about 59 metres
   * north of the real pin, which on a road of medical suites is the difference
   * between arriving and driving past.
   */
  geo: { lat: -35.1366346, lng: 138.5252586 },

  /**
   * Links to the Google Business Profile itself rather than dropping a pin at
   * coordinates. The listing carries the hours, the photos and the directions
   * button, and it is the record Google already trusts.
   *
   * `cid` is the listing's own identifier, so this survives the practice moving
   * suite or Google adjusting the pin. Verified 2026-08-12 as resolving to
   * "Recover Radiology, Suite 1-3 1/7 Doctors Rd, Morphett Vale SA 5162".
   *
   * NOTE: the listing carries a star rating. Nothing from it may be reproduced
   * on this site. AHPRA section 133 prohibits using testimonials or ratings to
   * advertise a regulated health service, and quoting your own Google score is
   * exactly that.
   */
  mapsUrl: "https://maps.google.com/?cid=10215540237414592139",

  phone: { display: "08 7081 3078", href: "tel:+61870813078" },
  fax: { display: "08 7093 7169" },

  hours: {
    display: "Monday to Friday, 8:30am to 5:30pm",
    opens: "08:30",
    closes: "17:30",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const,
  },

  serviceArea: "Adelaide's southern suburbs",

  /**
   * Neighbouring suburbs, for local search.
   *
   * GEOGRAPHY, NOT A CLAIM. These are the suburbs adjacent to Morphett Vale in
   * Adelaide's south. Listing them says only "we are near you", which is a
   * verifiable fact about a map, not an assertion about the practice.
   *
   * They belong in `areaServed` and in a visible line on the contact page.
   * They do NOT belong in page titles: a title stuffed with suburb names is
   * the doorway pattern Google demotes, and it would push the actual service
   * out of the 60 characters a title gets to show.
   *
   * NOTE FOR THE PRACTICE: this list was derived from the map, not supplied.
   * Prune anything you do not consider your catchment. QUESTIONS.md.
   */
  nearbySuburbs: [
    "Reynella",
    "Old Reynella",
    "Woodcroft",
    "Hackham",
    "Christie Downs",
    "Christies Beach",
    "Noarlunga",
    "Port Noarlunga",
    "Seaford",
    "Happy Valley",
    "Aberfoyle Park",
    "Flagstaff Hill",
    "Huntfield Heights",
  ] as const,
  referrerPortal: "https://pacs.recoverradiology.com.au/Portal/app#/",
  instagram: "https://instagram.com/recoverradiology",
} as const;

/** Report turnaround, stated on the existing site for ultrasound. */
export const REPORT_TURNAROUND = "24 to 48 hours";

/**
 * Same day appointments. Confirmed by the practice 2026-08-17.
 *
 * A distinct fact from the X-ray walk-in, and a stronger one. Walk-in applies
 * to X-ray only; this says an appointment for any service can often be had the
 * same day. The two are stated together wherever both are relevant, because a
 * patient reading "walk in" for X-ray reasonably assumes everything else is a
 * wait.
 *
 * BY PHONE, DELIBERATELY. The enquiry form is answered by clerical staff during
 * business hours, so promising same day through it would set up a failure the
 * practice cannot control. Every mention of this points at the phone number.
 */
/**
 * Musculoskeletal specialisation. Confirmed by the practice 2026-08-17.
 *
 * STRATEGICALLY THE MOST IMPORTANT FACT ON THIS PAGE. The competitor at
 * Morphett Vale is a general bulk billed imaging network with five sites, more
 * pages and seven named radiologists. Fighting them on "bulk billed imaging
 * near me" is a fight on their ground.
 *
 * This is different ground, and it is ground the practice already owns: the
 * name is Recover, the tagline is about recovery, the interventional list is a
 * pain management suite, the billing already covers ReturnToWorkSA and motor
 * vehicle claims, and the sonographers and a radiologist are MSK specialists.
 * Nobody else in the suburb can say that sentence.
 *
 * NOT A SUPERLATIVE. "Specialist" here describes a field of practice, which is
 * a statement of fact, not a claim of superiority. It stays that way: no "best",
 * no "leading", no comparison to anyone.
 */
export const MSK = {
  sonographers: "Specialist musculoskeletal sonographers",
  radiologist: "A musculoskeletal specialist radiologist",
  short: "Specialist musculoskeletal sonographers and an MSK specialist radiologist.",
} as const;

/**
 * Scan capability. Confirmed by the practice 2026-08-17.
 *
 * Every sonographer here is qualified across every study type, including the
 * complex ones. That is a scheduling fact as much as a clinical one: a practice
 * where only one person can do shear wave has a bottleneck on shear wave, and a
 * referrer feels that as a wait. Five interchangeable sonographers across four
 * rooms is why the availability claim holds.
 *
 * Named individually because "complex scans" means nothing to a GP deciding
 * where to send someone, and these are the studies they would otherwise assume
 * they need a tertiary centre for.
 */
export const SCAN_CAPABILITY = {
  claim:
    "All five sonographers are qualified across every ultrasound type we offer, including the complex studies.",
  complex: [
    "Endometriosis assessment",
    "Shear wave elastography",
    "Advanced vascular studies",
    "Female pelvic imaging",
    "Musculoskeletal",
    "Obstetric",
  ],
} as const;

/**
 * Injury and recovery. The positioning, expressed as data.
 *
 * Every entry below is assembled from facts already in this file: the
 * musculoskeletal ultrasound types, the interventional procedure list, the
 * ReturnToWorkSA and motor vehicle billing cases, the MSK specialisation. None
 * of it is new clinical claim. What is new is saying it in one place, in the
 * language of the person it is for.
 *
 * THE POINT. The practice is called Recover, the tagline is about recovery, the
 * interventional list is a pain management suite, and the sonographers are MSK
 * specialists. A patient could not tell any of that from the website, which
 * meant the name was doing no work on any page.
 *
 * WHO IT IS FOR, in the practice's own framing: not the elite athlete, who is
 * already served. The person who hurt their back at work, the weekend
 * footballer, the tradesperson whose shoulder has stopped working.
 */
/**
 * How the practice started. Confirmed 2026-08-17.
 *
 * The most useful thing on the referrer page, because it answers the question a
 * GP is actually asking, which is not "are you any good" but "do you understand
 * how my day works". A practice that began inside an urgent care clinic has
 * already had to answer that.
 */
/**
 * Ultrasound capacity. Confirmed by the practice 2026-08-17.
 *
 * THE STRONGEST REFERRER ARGUMENT ON THE SITE, and it was nowhere.
 *
 * A GP does not choose an imaging provider on quality claims, which every
 * provider makes and none can prove in a brochure. They choose on whether the
 * patient in front of them can actually be seen. Bulk billed ultrasound
 * commonly runs two to four weeks, which means a GP either delays management or
 * sends the patient somewhere they will pay.
 *
 * Four rooms and five sonographers is the answer to that, and it is a capital
 * fact rather than an adjective: it is either true or it is not, and it cannot
 * be claimed by a practice that has not spent the money.
 *
 * The wait figure is stated as a market condition, not as a claim about any
 * named competitor.
 */
export const CAPACITY = {
  ultrasoundRooms: 4,
  marketWait: "two to four weeks",
  urgentUltrasound: "Generally same day",
  routineUltrasound: "Typically within a couple of days",
  urgentReport: "Same day",
  routineReport: REPORT_TURNAROUND,
} as const;

/**
 * How referring works. Confirmed by the practice 2026-08-17.
 *
 * The operational difference, and the one a GP feels immediately: the practice
 * chases the patient rather than the other way round. A referral handed over at
 * the end of a consult usually sits in a bag for a week before anyone rings.
 * Here it becomes a phone call the same day.
 *
 * That reverses who carries the follow-up. The GP stops wondering whether the
 * patient ever booked, and the report comes back sooner because the scan
 * happened sooner.
 */
export const REFERRING = {
  steps: [
    {
      h: "Send it electronically",
      p: "We can set your practice up to order imaging electronically, so the referral reaches us the moment you write it rather than travelling in the patient's pocket.",
    },
    {
      h: "We call the patient the same day",
      p: "Your patient does not have to remember to ring us. We contact them the same day to get the appointment booked while it is still front of mind.",
    },
    {
      h: "Scanned as soon as we can fit them",
      p: "Urgent ultrasound is generally same day and routine is typically within a couple of days, because we run four ultrasound rooms rather than one.",
    },
    {
      h: "Report back to you sooner",
      p: "Urgent reports come back the same day and routine ultrasound reports within 24 to 48 hours. The scan happening sooner is what makes the report arrive sooner.",
    },
  ],
  outcome:
    "Less waiting for everyone, and faster care. You stop wondering whether the patient ever booked, and you get the answer while the consult is still recent.",
} as const;

export const ORIGIN = {
  short:
    "We began providing on site imaging for the Morphett Vale urgent care clinic.",
  long:
    "Recover Radiology started by providing imaging on site for the urgent care clinic at Morphett Vale. That is a setting where imaging has to be immediate and uncomplicated, because the patient is in front of the doctor now and the answer changes what happens next. The practice was built around that expectation and it still sets how we work.",
} as const;

export const RECOVERY = {
  /** Plain-language problems, each answerable by something already offered. */
  reasons: [
    {
      title: "Hurt at work",
      body: "Back, shoulder, knee or wrist injuries from lifting, repetition or a single bad day. We bill ReturnToWorkSA directly for accepted claims.",
    },
    {
      title: "Sporting and weekend injuries",
      body: "Muscle tears, tendon problems and joint injuries. Ultrasound shows soft tissue moving, which is often what a static image cannot answer.",
    },
    {
      title: "Pain that has not settled",
      body: "Long standing back, neck, hip, knee or shoulder pain. Imaging first, and image guided injections where they are indicated.",
    },
    {
      title: "After a car accident",
      body: "Imaging related to a motor vehicle accident claim is billed to the claim. Bring your claim number.",
    },
  ],
} as const;

export const SAME_DAY = {
  claim: "Same day appointments",
  short: "Same day appointments are often available. Call us to book one.",
  long:
    "Same day appointments are often available across our services. They are booked over the phone rather than through the form, so call us and our clerical team will find you the earliest time.",
} as const;

export type ModalitySlug = "ultrasound" | "ct" | "x-ray" | "interventional";

export interface Modality {
  slug: ModalitySlug;
  name: string;
  /**
   * The booking CTA label, written out per modality rather than composed.
   *
   * "Book a" plus the name gives "Book a X-ray" and "Book a Interventional
   * procedures". The article and the number both change with the noun, so the
   * whole phrase is authored.
   */
  bookLabel: string;
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
    bookLabel: "Book an ultrasound",
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
    bookLabel: "Book a CT scan",
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
    mustKnow:
      "Tell our staff if you have had a reaction to contrast before, or if you have kidney problems, before a CT with contrast. This is the main limitation on CT.",
  },
  {
    slug: "x-ray",
    name: "X-ray",
    bookLabel: "Book an X-ray",
    summary:
      "Digital X-ray, usually same day. Booking ahead gives you the shortest wait, and we accept walk-ins during business hours.",
    duration: "5 to 10 minutes, longer for multiple views",
    bulkBilled: "yes",
    types: [
      {
        name: "Booked or walk in",
        detail:
          "Booking ahead means the shortest wait. We also accept walk-ins during business hours, usually same day.",
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
    bookLabel: "Book a procedure",
    summary:
      "Image guided injections and blocks, performed by experienced radiologists on dedicated procedure days each fortnight.",
    duration: "Varies by procedure. Some require a short observation period",
    bulkBilled: "exceptions",
    bulkBilledNote: "Some interventional procedures are not bulk billed.",
    types: [
      { name: "Cortisone Injection", detail: "" },
      // Named by what it treats, not by brand. Confirmed by the practice
      // 2026-08-12: the previous "Euflexxa" entry was a product name, and a
      // patient searching for help with an arthritic knee does not search for
      // it.
      { name: "Osteoarthritis Injection", detail: "" },
      { name: "Hydrodilatation", detail: "" },
      { name: "Facet Joint Injection", detail: "" },
      { name: "Nerve Root Block", detail: "" },
      { name: "Epidural Injection", detail: "" },
      { name: "Medial Branch Block", detail: "" },
      { name: "Fine Needle Aspiration and Core Biopsy", detail: "" },
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
    mustKnow:
      "Tell our staff if you are taking any blood thinning medication when you book. This is the main limitation on interventional procedures, and we need to know in advance rather than on the day.",
  },
];

/** The safety line for a modality, so pages can repeat it without restating it. */
export function getModalityMustKnow(slug: ModalitySlug): string | undefined {
  return modalities.find((m) => m.slug === slug)?.mustKnow;
}

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
      who: "Work injuries",
      detail:
        "We bill ReturnToWorkSA directly for accepted claims. Bring your claim number and your employer's details.",
    },
    {
      who: "Motor vehicle accidents",
      detail:
        "Imaging related to a motor vehicle accident claim is billed to the claim. Bring your claim number.",
    },
  ],
  payment: "We accept EFTPOS and credit card. We do not accept AMEX.",
  feesNote: "Our clerical team will tell you the fee when you book.",
} as const;

/**
 * Team. No surnames, photos or qualifications are published for most staff and
 * none may be invented.
 *
 * The former Chief Sonographer was removed on 2026-08-12 when the practice
 * confirmed they had left. Named individuals are a liability as much as an
 * asset: the moment someone leaves, every page naming them is wrong. Anything
 * here that is a headcount or a total survives staff turnover; anything that is
 * a name does not.
 */
export const team = {
  practiceManager: { name: "Emily", role: "Practice Manager" },
  clericalLead: { name: "Ashleigh", role: "Clerical Lead" },
  clerical: [{ name: "Chilali" }, { name: "Melanie" }],
  /**
   * All five named and titled, completed 2026-08-17.
   *
   * A Chief Sonographer and four Senior Sonographers, confirmed directly by the
   * practice rather than inferred. It was worth asking: "senior" was initially
   * stated only alongside two of the names, and promoting the other two on a
   * loose reading would have been inventing a colleague's title in public.
   *
   * This is a strong line on its own. Five sonographers, none of them junior,
   * over fifty years between them, several MSK specialists, led by the Head
   * Sonographer at the Royal Adelaide.
   *
   * NAMING RULE, set by the practice 2026-08-17: the two leads carry surnames,
   * everyone else is a first name. Danny and Marko were briefly published with
   * surnames and had them removed.
   *
   * This resolves the inconsistency the other way from the suggestion made
   * earlier, and it is the better answer. Surnames on the leads mark the two
   * roles a patient or a referrer might want to look up; first names everywhere
   * else keeps the page warm rather than corporate, and gives the team less
   * exposure than a full roster of searchable names.
   */
  sonographers: [
    // Confirmed 2026-08-17. The single strongest credibility fact the practice
    // has, and it was not on the website at all.
    //
    // Head Sonographer at the Royal Adelaide Hospital, SA's tertiary referral
    // hospital, and Chief Sonographer here. That is a statement of positions
    // held, which is verifiable fact rather than a superlative, so it is safe
    // under AHPRA section 133 in a way that "expert" or "leading" would not be.
    //
    // CONSENT REQUIRED BEFORE THIS PUBLISHES. Naming someone's other employer
    // on a commercial site needs that person's agreement, and some hospitals
    // have policies about staff using the affiliation commercially. Flagged in
    // QUESTIONS.md; the field is here so it is ready, not so it ships unasked.
    {
      name: "Matt Le",
      role: "Chief Sonographer",
      // Stated quietly, as lines under a name. Not badges, not a callout.
      // Each is a position held or an award received, which is verifiable fact
      // rather than a superlative, so it sits inside AHPRA section 133 where
      // "expert" or "leading" would not.
      //
      // ON THE AWARD: the ASA article supplied by the practice features
      // Matthew Le among its 2025 award recipients but does not name which
      // award, and it is not independently verifiable online. Published on the
      // practice's statement. Worth keeping the ASA confirmation on file.
      credentials: [
        "ASA Sonographer of the Year, 2025",
        "Head Sonographer, Royal Adelaide Hospital",
      ],
    },
    { name: "David", role: "Senior Sonographer" },
    { name: "Laura", role: "Senior Sonographer" },
    { name: "Danny", role: "Senior Sonographer" },
    { name: "Marko", role: "Senior Sonographer" },
  ],
  /** Confirmed by the practice, 2026-08-12. They run X-ray and CT. */
  radiographers: [
    // Chief Radiographer, confirmed 2026-08-17.
    { name: "Marlon Ledesma", role: "Chief Radiographer" },
    { name: "Yasna", role: "Senior Radiographer" },
  ],
  /**
   * Re-confirmed by the practice 2026-08-17 as over 50 years across the five
   * sonographers. The previous figure, 25 years, was supplied when the team was
   * understood to be three, and was left unscaled until the practice gave a new
   * number rather than being adjusted by arithmetic.
   *
   * `display` is the short form for a figure in a stat row; `sentence` is the
   * clause form for running prose. Both live here so a change lands in one
   * place: the team page previously hardcoded "25 years" in its stat row while
   * reading the sentence form from this file, which is exactly how a fact ends
   * up stale in one place and current in another.
   */
  combinedExperience: "over 50 years of combined experience",
  combinedExperienceDisplay: "50+ years",
  sonographerCount: 5,
  radiographerCount: 2,
} as const;

/** What a referrer should include. Improves protocol selection. */
export const referrerGuidance = [
  "Symptoms and their duration",
  "Provisional diagnosis",
  "The specific clinical question you need answered",
] as const;
