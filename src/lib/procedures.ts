/**
 * Patient information for each interventional procedure.
 *
 * READ THIS BEFORE EDITING.
 *
 * Everything else on this site comes from `clinic.ts`, a closed set of facts
 * verified against the practice. This file is different in kind: it is clinical
 * patient information, and it was NOT supplied by the practice.
 *
 * What is written here is the standard, generic description of each procedure,
 * of the sort published by RANZCR and InsideRadiology. Three rules kept it
 * safe to write:
 *
 * 1. NO NUMBERS. No complication rates, no percentages, no "9 out of 10
 *    patients". Those vary by operator, technique and population, and inventing
 *    one would be fabricating a clinical statistic.
 * 2. NO PRACTICE-SPECIFIC CLAIMS. Nothing about how *this* practice does it,
 *    what *these* radiologists prefer, or what it costs. Anything specific to
 *    Recover Radiology comes from `clinic.ts` or is not stated.
 * 3. RISKS ARE NAMED, NEVER RANKED OR DISMISSED. Listing a risk as "rare" is a
 *    clinical judgement. The pages say what can happen and direct the reader to
 *    the radiologist, who takes consent on the day.
 *
 * `signedOff` gates search indexing, NOT the page itself. Until a radiologist
 * at the practice has read a procedure and it is flipped to true, that page
 * renders and is linked from /interventional so it can be reviewed in place,
 * but carries `noindex` and stays out of the sitemap. Unreviewed clinical
 * content should not be accumulating search impressions. See QUESTIONS.md.
 */

export interface Procedure {
  slug: string;
  /** Matches the `types[].name` entry in clinic.ts exactly. */
  name: string;
  alsoCalled?: string;
  /** One line. Answers "what is this" before anything else. */
  summary: string;
  whatItIs: string;
  /**
   * Which imaging guides the needle, where the practice has told us.
   *
   * Only set when confirmed. Left undefined elsewhere rather than guessed:
   * saying "ultrasound guided" about a procedure done under CT is wrong in a
   * way a patient cannot catch.
   */
  guidance?: string;
  whatItTreats: string[];
  howItIsPerformed: string[];
  duration: string;
  benefits: string[];
  risks: string[];
  aftercare: string[];
  /**
   * False until a radiologist at the practice has read the page.
   * Controls indexing and sitemap inclusion only.
   */
  signedOff: boolean;
}

/** Applies to every procedure on this page, so it is stated once. */
export const PROCEDURE_UNIVERSAL_RISK =
  "Any injection through the skin carries a risk of bleeding, bruising and infection at the site.";

export const procedures: Procedure[] = [
  {
    slug: "cortisone-injection",
    name: "Cortisone Injection",
    alsoCalled: "Corticosteroid injection",
    summary:
      "An anti-inflammatory injection placed precisely into a joint, bursa or tendon sheath using image guidance.",
    whatItIs:
      "Cortisone is a synthetic version of a hormone your body already makes, and it reduces inflammation. It is mixed with a local anaesthetic and placed directly into the inflamed structure. Using ultrasound or CT to guide the needle means the medication reaches the specific space causing the problem rather than the tissue around it.",
    whatItTreats: [
      "Bursitis, including the shoulder and hip",
      "Tendon inflammation and irritation",
      "Joint pain from osteoarthritis",
      "Shoulder impingement",
      "Plantar fasciitis and other foot conditions",
    ],
    howItIsPerformed: [
      "You lie on the examination bed and the area is scanned so the radiologist can see the target.",
      "The skin is cleaned with antiseptic.",
      "Local anaesthetic is used to numb the skin.",
      "The needle is advanced under live image guidance, so its position is watched the whole way in.",
      "The cortisone and anaesthetic mixture is injected once the tip is confirmed to be in the right space.",
    ],
    duration: "Usually 15 to 20 minutes, including preparation.",
    benefits: [
      "Reduces inflammation, and with it the pain that inflammation causes.",
      "Often creates a window of relief in which physiotherapy or rehabilitation becomes possible.",
      "Image guidance means the medication is delivered to the intended structure rather than near it.",
      "The response also carries diagnostic information: relief after an accurately placed injection helps confirm where the pain is coming from.",
    ],
    risks: [
      "A post-injection flare, where pain increases for a day or two before it improves.",
      "A temporary rise in blood sugar, which matters if you have diabetes.",
      "Facial flushing and a feeling of warmth for a short period afterwards.",
      "Thinning or lightening of the skin and the fat just beneath it at the injection site.",
      "Weakening of nearby tendon tissue, which is why repeat injections into the same site are limited.",
      PROCEDURE_UNIVERSAL_RISK,
    ],
    aftercare: [
      "The local anaesthetic wears off after a few hours, and the cortisone itself usually takes several days to take effect.",
      "Rest the area for the remainder of the day rather than testing it.",
      "Tell your referring doctor if you develop increasing pain, redness, swelling or a fever.",
    ],
    signedOff: false,
  },
  {
    slug: "osteoarthritis-injection",
    name: "Osteoarthritis Injection",
    alsoCalled: "Hyaluronic acid injection, or viscosupplementation",
    summary:
      "A course of three injections that supplement the natural lubricating fluid in an arthritic joint.",
    whatItIs:
      "Hyaluronic acid occurs naturally in the fluid inside your joints and gives it its thickness and slipperiness. In an arthritic joint that fluid becomes thinner and less protective. Injecting hyaluronic acid supplements what is already there. It is not a steroid, and it does not work by reducing inflammation, so it suits people for whom a steroid injection is unsuitable or has not helped enough.",
    // Confirmed by the practice 2026-08-12: performed under CT.
    guidance:
      "We perform this under CT guidance. CT shows the needle tip against the bone and the joint space directly, so the medication goes inside the joint rather than into the tissue around it. In an arthritic joint the space is narrowed, and in the hip and shoulder it is deep enough that it cannot be found reliably by feel.",
    // Sites and course confirmed by the practice, 2026-08-12.
    whatItTreats: [
      "Osteoarthritis of the knee",
      "Osteoarthritis of the hip",
      "Osteoarthritis of the shoulder",
      "Smaller synovial joints, where indicated",
      "Joint pain where anti-inflammatory treatment has not given enough relief, or is unsuitable",
    ],
    howItIsPerformed: [
      "You are positioned on the CT scanner and the joint is scanned so the radiologist can plan the path into the joint space.",
      "The skin is cleaned with antiseptic and numbed with local anaesthetic.",
      "The needle is advanced into the joint space, with its position checked on CT as it goes.",
      "The hyaluronic acid is injected.",
      "This is given as a series of three injections, generally two to four weeks apart. All three are part of one course of treatment.",
    ],
    duration:
      "Usually 15 to 20 minutes per injection, across three visits two to four weeks apart.",
    benefits: [
      "Improves lubrication and shock absorption inside the joint.",
      "Relief tends to build gradually across the course and can last for months.",
      "Contains no corticosteroid, so it avoids the effects steroids can have on blood sugar and on nearby tissue.",
      "Can be used in joints other than the knee, including the hip and shoulder.",
    ],
    risks: [
      "Pain, warmth or swelling in the joint for a short period after the injection.",
      "A local reaction to the preparation itself.",
      "It does not work for everyone, and it does not reverse arthritis.",
      PROCEDURE_UNIVERSAL_RISK,
    ],
    aftercare: [
      "Avoid strenuous activity and prolonged weight bearing for the rest of the day.",
      "The effect builds across the course rather than arriving after the first injection, so it is worth completing all three.",
      "Book the next injection in the series before you leave.",
      "Tell your referring doctor if the joint becomes hot, very swollen or increasingly painful.",
    ],
    signedOff: false,
  },
  {
    slug: "hydrodilatation",
    name: "Hydrodilatation",
    alsoCalled: "Hydrodilation, or capsular distension",
    summary:
      "An injection of fluid into the shoulder joint to stretch a capsule that has tightened, used for frozen shoulder.",
    whatItIs:
      "In frozen shoulder the capsule surrounding the joint becomes thickened and contracted, which is what limits the movement and causes the pain. Hydrodilatation injects a volume of fluid, usually saline with local anaesthetic and a steroid, into the joint under pressure. The volume itself stretches the capsule from the inside, while the steroid settles the inflammation. It treats the mechanical problem and the inflammation at once.",
    // Confirmed by the practice 2026-08-12: performed under CT, not ultrasound.
    guidance:
      "We perform this under CT guidance. CT shows the needle tip against the bone and the joint space directly, which confirms the fluid is going inside the capsule rather than around it. That matters here more than in most injections, because the whole effect depends on pressurising the capsule itself.",
    whatItTreats: [
      "Frozen shoulder, also called adhesive capsulitis",
      "Shoulder stiffness and pain where the capsule has tightened",
      "Restricted shoulder movement that has not responded to physiotherapy alone",
    ],
    howItIsPerformed: [
      "You are positioned on the CT scanner and the shoulder is scanned so the radiologist can plan the path to the joint.",
      "The skin is cleaned with antiseptic and numbed with local anaesthetic.",
      "A needle is advanced towards the joint, with its position checked on CT as it goes.",
      "Fluid is injected steadily. You will feel increasing pressure and tightness in the shoulder as the capsule stretches, which is the procedure working rather than a sign of a problem.",
      "The injection stops when the capsule has taken as much volume as it will accept.",
    ],
    duration: "Usually 20 to 30 minutes.",
    benefits: [
      "Stretches the capsule directly, which physiotherapy alone can struggle to achieve while the shoulder is painful.",
      "Combines a mechanical stretch with an anti-inflammatory in a single procedure.",
      "Often creates a window in which physiotherapy becomes effective, so the gain in movement can be built on.",
    ],
    risks: [
      "A feeling of pressure and tightness during the injection, and aching for a day or two afterwards.",
      "A temporary increase in shoulder pain before it improves.",
      "The effects steroids can have, including a temporary rise in blood sugar and facial flushing.",
      "The capsule can tighten again, and more than one treatment is sometimes needed.",
      PROCEDURE_UNIVERSAL_RISK,
    ],
    aftercare: [
      "Arrange transport home. The shoulder will be sore and the arm may feel heavy.",
      "Start moving the shoulder gently as advised rather than resting it completely. The stretch is most useful if it is built on.",
      "Follow up with your physiotherapist. The window this creates is the point of the procedure.",
      "Tell your referring doctor if the shoulder becomes hot, very swollen or increasingly painful.",
    ],
    signedOff: false,
  },
  {
    slug: "fine-needle-aspiration-and-core-biopsy",
    name: "Fine Needle Aspiration and Core Biopsy",
    alsoCalled: "FNA, or image guided biopsy",
    summary:
      "A sample of cells or tissue taken with a needle under image guidance, so a diagnosis can be made from the tissue itself.",
    whatItIs:
      "Imaging can show that something is there and describe it, but some questions can only be answered by looking at the tissue under a microscope. These two procedures take that sample with a needle rather than with surgery. A fine needle aspiration uses a very thin needle to draw out cells or fluid. A core biopsy uses a slightly larger needle to take a small cylinder of tissue, which keeps the tissue's structure intact and so answers more. Which one is used depends on what is being sampled and what the question is. Ultrasound or CT guides the needle throughout, so the sample comes from the right place.",
    whatItTreats: [
      "Establishing what a lump or a mass actually is",
      "Sampling an abnormal lymph node",
      "Sampling a thyroid nodule",
      "Draining and testing a collection of fluid",
    ],
    howItIsPerformed: [
      "The area is scanned so the radiologist can see the target and plan a path to it.",
      "The skin is cleaned with antiseptic and numbed with local anaesthetic.",
      "The needle is advanced under live image guidance, so its tip is watched the whole way in.",
      "For a fine needle aspiration, cells are drawn back through the needle. For a core biopsy, a spring loaded device takes a small core of tissue, which makes a sharp click you will hear.",
      "More than one sample is usually taken, to give the laboratory enough to work with.",
      "The samples go to a pathologist, and the result goes to the doctor who referred you.",
    ],
    duration: "Usually 20 to 30 minutes, including preparation and a short rest afterwards.",
    benefits: [
      "Gives a tissue diagnosis without an operation, a general anaesthetic or a hospital admission.",
      "Image guidance means the sample comes from the part that matters, including targets too small or too deep to feel.",
      "A definite answer often prevents further scans, and sometimes prevents surgery.",
    ],
    risks: [
      "Bruising, and soreness at the site for a few days.",
      "Bleeding, which is why we need to know in advance about blood thinning medication.",
      "An inconclusive sample, which means there was not enough material to answer the question and the procedure may need repeating.",
      "Injury to a structure near the target, which depends on where the sample is being taken from.",
      PROCEDURE_UNIVERSAL_RISK,
    ],
    aftercare: [
      "Arrange transport home, and plan a quiet rest of the day.",
      "Keep the site clean and dry, and avoid strenuous activity or heavy lifting for the rest of the day.",
      "Results go to your referring doctor rather than to you directly, because the conversation about what they mean belongs with the doctor who knows your history. Ask them how long the laboratory usually takes.",
      "Seek medical attention for bleeding that does not settle with pressure, increasing swelling, fever, or increasing pain.",
    ],
    signedOff: false,
  },
  {
    slug: "facet-joint-injection",
    name: "Facet Joint Injection",
    alsoCalled: "Zygapophyseal joint injection",
    summary:
      "An injection into one of the small joints at the back of the spine, guided by imaging.",
    whatItIs:
      "Facet joints are the small paired joints that link each vertebra to the one above and below, and they are a common source of back and neck pain. A mixture of local anaesthetic and a small amount of steroid is placed into the joint itself. These joints are close to important structures and cannot be reliably found by feel, so the needle is guided by imaging throughout.",
    whatItTreats: [
      "Back or neck pain arising from the facet joints",
      "Pain that is worse with extension, twisting or standing",
      "Arthritic change in the facet joints",
    ],
    howItIsPerformed: [
      "You lie face down and the level to be injected is identified on imaging.",
      "The skin is cleaned and numbed with local anaesthetic.",
      "The needle is advanced towards the joint, with its position checked on imaging as it goes.",
      "A small volume of contrast may be used to confirm the needle is in the joint before anything else is injected.",
      "The anaesthetic and steroid mixture is injected.",
    ],
    duration: "Usually 20 to 30 minutes, and longer if several levels are treated.",
    benefits: [
      "Delivers treatment directly to a joint that cannot be reached reliably any other way.",
      "The immediate response to the local anaesthetic helps establish whether that joint is actually the source of your pain.",
      "Where it is the source, the steroid component can give longer relief.",
    ],
    risks: [
      "An increase in pain for a day or two before improvement.",
      "Temporary numbness or heaviness from the local anaesthetic spreading nearby.",
      "The effects steroids can have, including a temporary rise in blood sugar.",
      "Puncture of the covering around the spinal cord, which can cause a headache.",
      PROCEDURE_UNIVERSAL_RISK,
    ],
    aftercare: [
      "Arrange for someone to drive you home. Do not plan to drive yourself.",
      "Rest for the remainder of the day.",
      "Keep a note of how your pain behaves over the first few hours, because the response to the anaesthetic is diagnostically useful and your doctor will ask.",
      "Seek medical attention for a severe headache, fever, or new weakness.",
    ],
    signedOff: false,
  },
  {
    slug: "nerve-root-block",
    name: "Nerve Root Block",
    alsoCalled: "Transforaminal or selective nerve root injection",
    summary:
      "A targeted injection around a single spinal nerve, to treat and to identify the source of nerve pain.",
    whatItIs:
      "When a spinal nerve is compressed or irritated, the pain is often felt down the arm or leg rather than in the back. A nerve root block places local anaesthetic, usually with a small amount of steroid, immediately around one specific nerve where it exits the spine. Because it targets a single nerve, it does two jobs at once: it treats the irritation, and it tells your doctor which nerve is responsible.",
    whatItTreats: [
      "Sciatica and other nerve pain radiating into the leg",
      "Nerve pain radiating into the arm",
      "Nerve irritation from a disc bulge or from narrowing where the nerve exits",
      "Identifying which level is responsible when imaging shows changes at more than one",
    ],
    howItIsPerformed: [
      "You lie face down and the target nerve is located on imaging.",
      "The skin is cleaned and numbed with local anaesthetic.",
      "A fine needle is guided towards the nerve, with its position checked repeatedly on imaging.",
      "Contrast may be injected first to confirm the medication will spread along the nerve as intended.",
      "The anaesthetic, with steroid if used, is injected.",
    ],
    duration: "Usually 20 to 30 minutes.",
    benefits: [
      "Treats one specific nerve rather than the whole area.",
      "The pattern of relief afterwards is strong evidence about which nerve is causing the pain, which matters if surgery is being considered.",
      "Can reduce nerve inflammation enough to avoid or postpone more invasive treatment.",
    ],
    risks: [
      "Temporary weakness, numbness or heaviness in the limb while the anaesthetic is working.",
      "A temporary increase in your usual pain.",
      "The effects steroids can have, including a temporary rise in blood sugar.",
      "Injury to the nerve or to a nearby blood vessel.",
      PROCEDURE_UNIVERSAL_RISK,
    ],
    aftercare: [
      "You must arrange transport home. Your leg or arm may be temporarily weak.",
      "The numbness wears off over several hours. Take care on stairs until it has.",
      "Note when your pain changed and by how much, and tell your referring doctor.",
      "Seek medical attention for weakness that is getting worse rather than better, fever, or loss of bladder or bowel control.",
    ],
    signedOff: false,
  },
  {
    slug: "epidural-injection",
    name: "Epidural Injection",
    alsoCalled: "Epidural steroid injection",
    summary:
      "An injection into the space around the spinal nerves, to settle inflammation causing pain down a limb.",
    whatItIs:
      "The epidural space sits just outside the membrane that surrounds the spinal cord and nerve roots. Placing steroid and local anaesthetic into that space lets the medication bathe the irritated nerves. Unlike a nerve root block, which targets one nerve, an epidural treats a region, so it suits pain arising from more than one level.",
    whatItTreats: [
      "Leg or arm pain from a disc herniation",
      "Pain from spinal canal narrowing",
      "Nerve inflammation affecting more than one level",
    ],
    howItIsPerformed: [
      "You lie face down and the level is identified on imaging.",
      "The skin is cleaned and numbed with local anaesthetic.",
      "The needle is advanced into the epidural space with its position checked on imaging throughout.",
      "Contrast is often used to confirm correct placement before the medication is given.",
      "The steroid and anaesthetic mixture is injected.",
    ],
    duration: "Usually 20 to 30 minutes.",
    benefits: [
      "Treats a region rather than a single nerve, which suits pain coming from more than one level.",
      "Can reduce inflammation enough for rehabilitation to progress.",
      "May delay or avoid the need for surgery.",
    ],
    risks: [
      "Headache, which can follow puncture of the membrane around the spinal cord and is typically worse when upright.",
      "Temporary numbness or weakness in the legs.",
      "A temporary increase in your usual pain.",
      "The effects steroids can have, including a temporary rise in blood sugar.",
      PROCEDURE_UNIVERSAL_RISK,
    ],
    aftercare: [
      "Arrange transport home. You must not drive after this procedure.",
      "Rest for the remainder of the day and get up slowly.",
      "Relief from the steroid usually builds over several days rather than arriving at once.",
      "Seek medical attention for a severe or persistent headache, fever, worsening weakness, or loss of bladder or bowel control.",
    ],
    signedOff: false,
  },
  {
    slug: "medial-branch-block",
    name: "Medial Branch Block",
    summary:
      "A diagnostic injection onto the small nerves that carry pain from the facet joints.",
    // No onward treatment is described here. The practice confirmed on
    // 2026-08-12 that it does not perform radiofrequency ablation, and a page
    // that gestures at a next step we do not offer sets up a conversation the
    // referring doctor then has to unwind.
    whatItIs:
      "Each facet joint gets its sensation from small nerves called medial branches. Placing local anaesthetic onto those nerves temporarily interrupts the pain signal from that joint. This procedure is a test rather than a treatment: if numbing those specific nerves takes your pain away, it establishes that the joint they supply is the source of it. That answer goes back to your referring doctor, who decides what to do with it.",
    whatItTreats: [
      "Confirming that back or neck pain is coming from the facet joints",
      "Identifying which levels are involved, where imaging shows changes at more than one",
      "Answering the question when other treatment has not helped and the source of the pain is still uncertain",
    ],
    howItIsPerformed: [
      "You lie face down and the target points are identified on imaging.",
      "The skin is cleaned and numbed with local anaesthetic.",
      "Fine needles are guided onto the bone at the precise points where the medial branch nerves run.",
      "A very small volume of local anaesthetic is placed at each point. The volume is kept small deliberately, so the result stays specific to those nerves.",
      "More than one level is usually treated in the same sitting.",
    ],
    duration: "Usually 20 to 30 minutes.",
    benefits: [
      "Gives a clear answer about whether the facet joints are the source of the pain.",
      "Narrows down the source of pain that imaging alone cannot settle, which stops further treatment being aimed at the wrong place.",
      "Uses a very small amount of medication.",
    ],
    risks: [
      "Temporary numbness in the area supplied by the nerves.",
      "A short lived increase in pain.",
      "Relief that is brief by design, because this is a diagnostic test and the anaesthetic wears off.",
      PROCEDURE_UNIVERSAL_RISK,
    ],
    aftercare: [
      "Arrange transport home.",
      "Keep a record of your pain over the hours that follow, on a scale you can describe. This record is the result of the test, and your doctor will ask for it.",
      "Resume normal activity as comfort allows, but avoid testing the area hard while it is numb.",
    ],
    signedOff: false,
  },
];

export function getProcedure(slug: string): Procedure | undefined {
  return procedures.find((p) => p.slug === slug);
}

/** Procedures cleared for search indexing. */
export const indexableProcedures = () => procedures.filter((p) => p.signedOff);
