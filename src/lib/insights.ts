/**
 * Insights.
 *
 * WHY THESE ARE SAFE TO WRITE, when the placeholder that used to sit here said
 * nothing could be.
 *
 * That earlier rule was right about the wrong thing. It said no article could
 * be drafted from general knowledge, because a statement about imaging on a
 * clinic's own website reads as that clinic's clinical advice. True, and it
 * still governs anything that describes a condition, an outcome or a treatment
 * decision.
 *
 * These articles are not that. They are about PROFESSIONS, REGULATION AND
 * FUNDING: who is qualified to do what, who registers them, how Medicare pays,
 * what happens to a report. All publicly documented, none of it a clinical
 * claim about a patient, and none of it something a radiologist needs to sign.
 *
 * THE LINE, held on every article below:
 *   - Explaining that ultrasound shows soft tissue moving is fine.
 *   - Explaining what your shoulder pain means is not, and appears nowhere.
 *   - "Your doctor may request" is fine. "You should ask for" is not.
 *
 * Regulatory facts were verified against ASAR, the Medical Radiation Practice
 * Board of Australia and RANZCR rather than written from memory, because a
 * clinic publishing the wrong registration body for its own staff is worse than
 * publishing nothing.
 *
 * Deliberately not stated anywhere: how long a referral stays valid. It varies
 * by referrer type and item, it is the detail most often got wrong online, and
 * getting it wrong here would send someone away for a scan they cannot claim.
 * Every article points at the clerical team for that instead.
 */

export type Block =
  | { h: string }
  | { p: string }
  | { ul: string[] }
  | { note: string };

export interface Post {
  slug: string;
  title: string;
  /** Used as the meta description, so it is written to be quoted. */
  excerpt: string;
  /** ISO date, or null while unpublished. */
  publishedAt: string | null;
  readingMinutes: number;
  /** Placeholders never render as real articles. */
  placeholder: boolean;
  /** Grouping on the index. */
  category:
    | "The team"
    | "Costs and Medicare"
    | "Before your scan"
    | "For referrers";
  body: Block[];
  /**
   * Written for doctors rather than patients. Changes the register and adds a
   * banner, because a patient landing on a page of hazard ratios needs to know
   * immediately that it was not written for them.
   */
  audience?: "referrers";
  /** Full citations, rendered as a reference list. */
  references?: string[];
  /**
   * False until a radiologist has read it. Same gate as the procedure pages:
   * the article renders and is linked so it can be reviewed in place, but stays
   * out of search. Anything citing clinical evidence gets this.
   */
  signedOff?: boolean;
}

const REFERRAL_NOTE =
  "Referral rules differ by who wrote the referral and what is being requested. Call us on 08 7081 3078 and our clerical team will check yours before you come in.";

export const posts: Post[] = [
  /* ------------------------------------------------------------- the team */
  {
    slug: "what-does-a-sonographer-do",
    title: "What does a sonographer do?",
    excerpt:
      "The person holding the probe during your ultrasound is a sonographer. What they train in, who accredits them in Australia, and what they scan.",
    publishedAt: "2026-08-17",
    readingMinutes: 4,
    category: "The team",
    placeholder: false,
    body: [
      { p: "If you have had an ultrasound, the person who scanned you was almost certainly a sonographer. They are not the doctor who writes your report, and they are not the radiographer who does your X-ray. It is a distinct profession with its own training and its own accreditation, and it is worth understanding, because ultrasound depends on the operator more than any other kind of imaging." },

      { h: "What they actually do" },
      { p: "A sonographer performs the scan. They choose the probe, set the machine, find the structure your doctor asked about, and capture the images the radiologist will report from." },
      { p: "The part that surprises people is how much judgement that involves. An ultrasound image is made live, in real time, and it only exists while the probe is in the right place at the right angle. Nobody can go back later and re-take a view that was never captured. So the sonographer is making decisions the whole way through: what to look at, what to compare it against, what to move, and when something unexpected deserves a closer look." },
      { p: "That is why a sonographer will often ask you where it hurts and then press exactly there, or ask you to lift your arm while they scan. They are not being thorough for its own sake. Movement is frequently the thing that makes a problem visible." },

      { h: "How you become one in Australia" },
      { p: "Sonography is a postgraduate profession. The usual path is a degree first, most often in medical imaging, medical radiation science or another health science, followed by a postgraduate qualification in medical ultrasound." },
      { p: "The postgraduate stage is done while working. Student sonographers train in a clinic or hospital under supervision, scanning real patients, while completing coursework. It is a long road: several years of undergraduate study, then a further postgraduate qualification alongside supervised practice." },

      { h: "Who accredits them" },
      { p: "In Australia, sonographers are accredited by the Australian Sonographer Accreditation Registry, known as ASAR. Accreditation with ASAR is what allows a sonographer to work, and Medicare benefits for ultrasound depend on the scan being performed by an accredited sonographer." },
      { p: "This is different from how radiographers are regulated, which is a common source of confusion. Sonographers are accredited through ASAR rather than registered with AHPRA. Qualifications earned overseas are not automatically recognised and have to be assessed before someone can practise here." },
      { p: "Accredited sonographers also have to keep up continuing professional development to stay on the registry. It is not a qualification you earn once and keep regardless." },

      { h: "What they scan" },
      { ul: [
        "Musculoskeletal: muscles, tendons, ligaments, bursae and joints. Shoulders, elbows, knees, ankles and hips.",
        "Vascular: blood flow through arteries and veins, using Doppler to measure speed and direction.",
        "Obstetric: pregnancy and fetal development.",
        "General: abdomen and pelvis, including gallbladder, liver, kidneys and bladder, plus the thyroid and soft tissue lumps.",
      ]},
      { p: "Many sonographers develop a subspecialty. Musculoskeletal work in particular rewards it, because recognising a partial tendon tear depends on having seen a great many normal tendons first." },

      { h: "Why it matters who scans you" },
      { p: "For most imaging, the machine largely determines the image quality. Ultrasound is the exception. The same patient, the same machine and the same question can produce a scan that answers it or one that does not, depending on who is holding the probe and what they thought to look at." },
      { note: "At Recover Radiology, ultrasound is performed by five sonographers with over fifty years of combined experience between them, several of them musculoskeletal specialists." },
    ],
  },

  {
    slug: "what-does-a-radiographer-do",
    title: "What does a radiographer do?",
    excerpt:
      "Radiographers perform X-rays and CT scans. What they train in, why they are registered with AHPRA, and how they keep your radiation dose down.",
    publishedAt: "2026-08-17",
    readingMinutes: 4,
    category: "The team",
    placeholder: false,
    body: [
      { p: "If you have had an X-ray or a CT scan, a radiographer performed it. They are sometimes called medical imaging technologists, and they are the people who position you, operate the equipment and produce the images your radiologist reports from." },

      { h: "What they actually do" },
      { p: "Most of the skill in radiography is positioning. The same X-ray of the same wrist can answer the question clearly or be almost useless depending on the angle, and the difference is often a few degrees of rotation. A radiographer knows which views a particular clinical question needs and how to get them from a patient who is in pain and cannot move easily." },
      { p: "They also manage the dose. Radiation is not something you get a fixed amount of; the radiographer chooses the settings, and those settings determine both the image quality and the exposure. Getting a diagnostic image at the lowest reasonable dose is a genuine skill and it is the core of the job." },
      { p: "And they explain what is about to happen. For a lot of patients the radiographer is the person who actually talks them through the scan." },

      { h: "How you become one in Australia" },
      { p: "Radiography is an undergraduate profession. The usual path is a three or four year degree in medical imaging or medical radiation science, which includes substantial clinical placement in hospitals and practices alongside the coursework." },
      { p: "Graduates then complete a supervised period of practice before achieving general registration." },

      { h: "Who registers them" },
      { p: "Radiographers are registered health practitioners. They are registered with the Medical Radiation Practice Board of Australia, which sits under AHPRA, the same national scheme that registers doctors, nurses and physiotherapists." },
      { p: "That means a radiographer has a registration you can look up, has to meet the Board's standards, and has to complete continuing professional development each year. Working with ionising radiation also requires a state radiation use licence on top of registration." },
      { note: "This is the key difference from sonographers, who are accredited through ASAR rather than registered with AHPRA. Both are properly credentialled; the mechanisms are just different." },

      { h: "What they operate" },
      { ul: [
        "General X-ray: bones, chests and joints. Fast, and often the first imaging requested.",
        "CT: cross sectional imaging rebuilt into a detailed volume, including studies with contrast.",
        "Some radiographers also qualify in sonography or nuclear medicine, holding both credentials.",
      ]},

      { h: "The dose question" },
      { p: "Patients ask about radiation more than any other subject, and it is a fair question. The principle radiographers work to is ALARA: As Low As Reasonably Achievable. The dose should be the smallest that still produces an image capable of answering the clinical question, because an image too poor to interpret has exposed someone for nothing." },
      { p: "It is also worth knowing that ultrasound uses no ionising radiation at all. That is one of the reasons a doctor may request ultrasound rather than X-ray or CT for soft tissue problems and in pregnancy." },
    ],
  },

  {
    slug: "radiographer-radiologist-sonographer",
    title: "Radiographer, radiologist, sonographer: what is the difference?",
    excerpt:
      "Three similar sounding titles for three different jobs. Who performs your scan, who interprets it, and who you actually get your results from.",
    publishedAt: "2026-08-17",
    readingMinutes: 4,
    category: "The team",
    placeholder: false,
    body: [
      { p: "These three titles get mixed up constantly, including by people who work in health. They are three different professions with different training, different regulators and different jobs, and the distinction genuinely matters when you are trying to work out who can tell you what." },

      { h: "The short version" },
      { ul: [
        "A radiographer performs your X-ray or CT scan.",
        "A sonographer performs your ultrasound.",
        "A radiologist is a doctor who interprets the images and writes the report.",
      ]},
      { p: "Put simply: radiographers and sonographers make the images. Radiologists read them." },

      { h: "The radiologist is the doctor" },
      { p: "This is the part most people are surprised by. A radiologist is a specialist medical doctor. They complete a medical degree, then internship and residency like any other doctor, then at least five years of further specialist training in radiology before becoming a Fellow of the Royal Australian and New Zealand College of Radiologists, which is where the letters FRANZCR come from." },
      { p: "They are usually not the person you meet. While you are being scanned, the radiologist is likely elsewhere in the building reading other studies. The exception is an image guided procedure, such as a cortisone injection, where the radiologist performs it themselves." },

      { h: "Why the training differs so much" },
      { p: "The three roles are solving different problems. Making a good image is a practical, technical and physical skill: positioning, equipment, dose, and in ultrasound, live decision making with a probe. Interpreting an image is a medical one, requiring the anatomy, pathology and clinical reasoning of a doctor to say what a finding means for a particular patient." },
      { p: "That division is also why nobody scanning you will tell you your results. It is not evasiveness or policy for its own sake. A sonographer can see something on the screen, but the diagnosis is the radiologist's to make and the explanation is your referring doctor's to give, in the context of everything else they know about you." },

      { h: "Who regulates whom" },
      { ul: [
        "Radiographers: registered with the Medical Radiation Practice Board of Australia, under AHPRA.",
        "Sonographers: accredited by the Australian Sonographer Accreditation Registry, ASAR.",
        "Radiologists: registered medical practitioners under AHPRA, with specialist recognition through RANZCR.",
      ]},

      { h: "So who do I ask about my results?" },
      { p: "Your referring doctor. The radiologist's report goes to whoever referred you, and they will discuss it with you alongside your history, your examination and anything else being investigated. That is the conversation where a result actually means something." },
      { note: "At Recover Radiology, ultrasound reports reach your referring doctor within 24 to 48 hours." },
    ],
  },

  /* --------------------------------------------------- costs and medicare */
  {
    slug: "how-bulk-billing-works",
    title: "How does bulk billing work for scans?",
    excerpt:
      "What bulk billing actually means, why some scans are bulk billed and others are not, and how to find out what you will pay before you book.",
    publishedAt: "2026-08-17",
    readingMinutes: 5,
    category: "Costs and Medicare",
    placeholder: false,
    body: [
      { p: "Cost is the question people most want answered and least want to ask. It is worth understanding how it works, because bulk billing is often described as though it is all or nothing, and it is not." },

      { h: "What bulk billing means" },
      { p: "Medicare pays a set benefit for a large number of medical services, including most diagnostic imaging. Each service has an item number in the Medicare Benefits Schedule and each item number has a benefit attached to it." },
      { p: "When a practice bulk bills, it accepts that Medicare benefit as full payment. Medicare is billed directly, you pay nothing, and there is no invoice to chase and no rebate to claim back. You sign to say the service was provided and that is the end of it." },
      { p: "When a practice does not bulk bill for a service, you pay their fee and Medicare pays you back its benefit. The difference between the two is the gap, and it is yours to cover." },

      { h: "Why some scans are not bulk billed" },
      { p: "Two things decide it." },
      { p: "The first is whether Medicare pays a benefit for that service at all. Some imaging attracts no Medicare benefit, in which case bulk billing is not possible regardless of the practice's policy." },
      { p: "The second is whether the practice chooses to bulk bill that item. Practices set this per service, which is why a clinic can genuinely say most services are bulk billed while still charging for a few." },
      { note: "At Recover Radiology, most services are bulk billed. Obstetric scans and some interventional procedures are the exceptions. Our clerical team will tell you the fee when you book, before you commit to anything." },

      { h: "What affects your eligibility" },
      { ul: [
        "A valid referral. Medicare benefits for imaging require one.",
        "What the referral asks for. The requested study has to match a Medicare item.",
        "A valid Medicare card. Without one there is no benefit to bill.",
        "Concession or DVA status, which can change what is covered.",
      ]},

      { h: "If your scan relates to a claim" },
      { p: "Work injuries and motor vehicle accidents are handled differently. Imaging for an accepted work injury claim is billed to ReturnToWorkSA rather than to Medicare, and imaging related to a motor vehicle accident claim is billed to that claim. In both cases there is normally nothing for you to pay on the day, but you will need your claim number, and for a work injury your employer's details." },

      { h: "The one question worth asking" },
      { p: "Before you book anything, ask: is this specific scan bulk billed, and if not, what will it cost me? Any practice should be able to tell you before you attend, and being told a figure afterwards is not good enough." },
      { p: REFERRAL_NOTE },
    ],
  },

  {
    slug: "do-i-need-a-referral-for-a-scan",
    title: "Do I need a referral for a scan?",
    excerpt:
      "Short answer: yes, for anything you want Medicare to pay for. Who can write one, why it is required, and what makes a good referral.",
    publishedAt: "2026-08-17",
    readingMinutes: 3,
    category: "Costs and Medicare",
    placeholder: false,
    body: [
      { p: "Yes. To have a scan performed and claimed through Medicare you need a referral. This is a Medicare requirement rather than a practice preference, and no imaging clinic can waive it." },

      { h: "Who can write one" },
      { p: "Your GP is the most common source. Specialists refer for imaging too, and depending on the study, so can some other health practitioners, including physiotherapists and chiropractors for certain examinations." },
      { p: "What a particular referrer can request, and what Medicare benefit applies, varies by the type of referrer and the study being requested. If you are being referred by anyone other than a doctor it is worth checking before you attend." },

      { h: "Why it is required" },
      { p: "A scan is not a general check. It is performed to answer a specific clinical question, and the question shapes the study: which area, which views, whether contrast is needed, which protocol the radiologist selects." },
      { p: "Without a referral there is no question to answer, and the radiologist is reporting into a vacuum. It is also the mechanism that gets your result back to someone who can act on it." },

      { h: "What makes a good referral" },
      { p: "If you are a patient, you cannot control this, but it is useful to know what helps, because you can mention things your doctor may not have written down." },
      { ul: [
        "Your symptoms and how long you have had them.",
        "A provisional diagnosis, if your doctor has one.",
        "The specific clinical question. What are we trying to find out?",
        "Any previous imaging of the same area, and where it was done.",
      ]},
      { p: "The more of that is present, the more precisely the study can be tailored. A referral that says only the body part gets a standard study; one that says what is suspected and why gets a study aimed at it." },

      { h: "Bring it with you" },
      { p: "Bring the referral itself and your Medicare card. If you have a concession or DVA card, bring that too, because it can change what is covered. If your scan relates to a work injury or a motor vehicle accident, bring your claim number." },
      { p: REFERRAL_NOTE },
    ],
  },

  /* -------------------------------------------------- before your scan */
  {
    slug: "what-happens-to-your-images",
    title: "What happens to your images after the scan?",
    excerpt:
      "Where your images go, who reads them, how long a report takes, and why nobody will give you a result on the day.",
    publishedAt: "2026-08-17",
    readingMinutes: 3,
    category: "Before your scan",
    placeholder: false,
    body: [
      { p: "You have been scanned, someone has said thank you, and you have gone home with no idea what was found. This is the part of imaging that patients find most frustrating, and it helps to know what is actually happening in the meantime." },

      { h: "The images go to a radiologist" },
      { p: "As soon as your scan is finished the images are available to the reporting radiologist. With digital imaging there is no processing step; they are on the radiologist's workstation almost immediately." },
      { p: "The radiologist then reviews them properly. That means looking systematically at everything captured, not only the area of concern, comparing against previous imaging where it exists, and writing a report that answers the question your referrer asked." },

      { h: "The report goes to your referring doctor" },
      { p: "The report is sent to whoever referred you. It does not come to you directly, and that is deliberate." },
      { p: "A radiology report is written for a clinician. It is technical, it often describes incidental findings of no consequence, and it can read alarmingly to someone without the context to interpret it. Your referring doctor has that context: your history, your examination, what else is being investigated, and what a particular finding means for you specifically." },
      { note: "At Recover Radiology, ultrasound reports reach your referring doctor within 24 to 48 hours." },

      { h: "Why the sonographer will not tell you" },
      { p: "People often ask the person scanning them whether everything looks fine, and are met with something non-committal. It is not evasion." },
      { p: "The sonographer or radiographer is not the person who makes the diagnosis. That is the radiologist's role, and communicating it is your referring doctor's. Someone offering a partial answer mid-scan, before the study is complete and before anyone has compared it with your history, would risk being wrong in a way that is genuinely harmful." },

      { h: "What you should do" },
      { p: "Book a follow up with your referring doctor when you book the scan, or shortly after. The result is only useful in that conversation, and having the appointment already made means you are not waiting twice." },
    ],
  },

  {
    slug: "imaging-for-a-work-injury",
    title: "Getting a scan for a work injury in South Australia",
    excerpt:
      "How imaging works under a ReturnToWorkSA claim: what to bring, who pays, and what happens if your claim has not been accepted yet.",
    publishedAt: "2026-08-17",
    readingMinutes: 3,
    category: "Costs and Medicare",
    placeholder: false,
    body: [
      { p: "If you have been hurt at work in South Australia and your doctor has referred you for imaging, the process is slightly different from an ordinary scan. It is not complicated, but knowing it in advance saves a phone call and sometimes a wasted trip." },

      { h: "Who pays" },
      { p: "Imaging for an accepted work injury claim is billed to ReturnToWorkSA rather than to Medicare. There is normally nothing for you to pay on the day." },
      { p: "The same principle applies to a motor vehicle accident: imaging related to the claim is billed to that claim." },

      { h: "What to bring" },
      { ul: [
        "Your referral.",
        "Your claim number.",
        "Your employer's details.",
        "Your Medicare card, as a fallback if the claim does not cover the scan.",
        "Any previous imaging of the same area.",
      ]},

      { h: "If your claim has not been accepted yet" },
      { p: "This is the common complication. If a claim is still being determined, billing it is not straightforward, and the arrangement needs to be sorted out before you attend rather than at the front desk." },
      { p: "Call the practice and explain the situation. It is a routine question and reception deal with it regularly, but it is much easier to resolve on the phone than with you standing at the counter." },

      { h: "What gets scanned" },
      { p: "That depends entirely on your referral. Work injuries are frequently musculoskeletal, so ultrasound and X-ray are common, and ultrasound in particular is useful for soft tissue because it shows tendons and muscles while they move." },
      { p: "Where imaging shows a problem that image guided injection can help, that can often be arranged at the same practice, which saves a further referral and another wait." },
      { note: "Recover Radiology bills ReturnToWorkSA directly for accepted claims, and motor vehicle accident imaging is billed to the claim. Call 08 7081 3078 if you are unsure whether your claim covers the scan." },
    ],
  },

  /* ------------------------------------------------------- for referrers */
  {
    slug: "osteoarthritis-injections-evidence",
    title: "CT guided hyaluronic acid injections for osteoarthritis",
    excerpt:
      "For referring doctors: the evidence on intra-articular hyaluronic acid, dosing, radiation dose under CT guidance, and what the published data does and does not show.",
    publishedAt: "2026-08-17",
    readingMinutes: 7,
    category: "For referrers",
    placeholder: false,
    audience: "referrers",
    // Clinical evidence. Not indexed until a radiologist has read it.
    signedOff: false,
    body: [
      { p: "Intra-articular hyaluronic acid is the most referred CT guided procedure at this practice. This note sets out how it is performed here, what the published evidence supports, and where that evidence is contested, so a referring doctor can weigh it rather than take a supplier's word for it." },

      { h: "What it is" },
      { p: "Hyaluronic acid is a naturally occurring component of synovial fluid and gives it its viscosity and elasticity. In an osteoarthritic joint the concentration and molecular weight of endogenous hyaluronan fall, and the fluid loses much of its lubricating and shock absorbing capacity." },
      { p: "Viscosupplementation replaces it. It is not a corticosteroid and does not act primarily by suppressing inflammation, which is why it is often considered where a steroid injection is unsuitable, has been used repeatedly, or has given only short lived relief." },
      { p: "It is a non-surgical option for symptomatic osteoarthritis in synovial joints. Knees and hips are the most commonly treated." },

      { h: "How it is performed here" },
      { ul: [
        "Under low dose CT guidance, which confirms intra-articular placement rather than relying on landmarks.",
        "Typical radiation dose at this practice is 0.1 to 0.3 mSv per procedure. For comparison, a standard chest X-ray is approximately 0.1 mSv.",
        "CT guidance is particularly useful in deep or small joints, and in the arthritic joint where the space is narrowed.",
      ]},
      { p: "Accurate placement matters more than it might appear. An injection intended for the joint space that is delivered into surrounding soft tissue is not the treatment that was studied, and image guidance is what removes that variable." },

      { h: "Dosing and frequency" },
      { ul: [
        "A course consists of three injections, administered one to two weeks apart.",
        "Each joint can be treated up to twice per year.",
        "Courses for the same joint should be spaced at least six months apart.",
        "Multiple joints can be treated, with each joint assessed independently.",
      ]},

      { h: "Aftercare" },
      { ul: [
        "Rest the treated joint for 48 hours.",
        "Avoid high impact or strenuous activity during that period. For a lower limb injection, no running or jogging for 48 hours.",
      ]},

      { h: "Risks" },
      { ul: [
        "Temporary joint pain or stiffness, usually resolving within 48 hours.",
        "Localised bruising at the injection site.",
        "Infection risk less than 0.1 percent.",
      ]},
      { p: "As with any image guided injection, patients on anticoagulants need to be identified at booking rather than on the day." },

      { h: "The evidence: delay to total knee replacement" },
      { p: "The most cited work is a retrospective analysis of a large United States health claims database covering approximately 79 million patients. It identified 182,022 patients with knee osteoarthritis who went on to total knee replacement, of whom 50,349 had received at least one course of hyaluronic acid and 131,673 had not." },
      { p: "Mean time to total knee replacement was 601.8 days in the hyaluronic acid cohort against 270.3 days in the non-user cohort, a difference of roughly eleven months. The difference was statistically significant." },
      { p: "The association was dose dependent. Mean days to replacement rose with each additional course:" },
      { ul: [
        "No hyaluronic acid: 270.3 days",
        "One course: 513.7 days",
        "Two courses: 741.7 days",
        "Three courses: 945.6 days",
        "Four courses: 1,085.1 days",
        "Five or more courses: 1,306.0 days",
      ]},

      { h: "The evidence: analgesic use" },
      { p: "A separate analysis looked at prescription pain medication and corticosteroid injection use in patients receiving bio-fermentation derived hyaluronic acid as part of multimodal pain management." },
      { ul: [
        "Mean monthly opioid prescriptions per user fell from 0.60 to 0.43.",
        "Mean opioid days supplied fell from 10.1 to 6.0 days per month per user.",
        "Patients were free of prescription pain medication for 71 percent of the time afterwards, against 53 percent during the preceding multimodal treatment period.",
        "The proportion receiving corticosteroid injections fell from 53.8 percent to 29.6 percent.",
      ]},

      { h: "What this evidence does not establish" },
      { p: "This matters more than the figures above, and it is why the numbers are presented with their study design attached." },
      { ul: [
        "Both are retrospective analyses of administrative claims data, not randomised controlled trials. They demonstrate association, not causation.",
        "Patients who receive hyaluronic acid may differ systematically from those who do not, in disease severity, comorbidity, willingness to pursue treatment and access to care. Claims data captures those imperfectly.",
        "A delay to arthroplasty is not by itself a clinical benefit. Whether delay serves a particular patient depends on their age, function and disease trajectory.",
        "Guideline positions on intra-articular hyaluronic acid differ between bodies and have changed over time. Some do not recommend it routinely for knee osteoarthritis.",
      ]},
      { p: "The honest summary is that the observational evidence is substantial and consistent in direction, the randomised evidence is more mixed, and the decision belongs with the treating doctor and the patient rather than with the imaging practice performing the injection." },

      { h: "Referring" },
      { p: "Procedures are performed on dedicated procedure days each fortnight, so booking ahead is necessary. Specify the joint and the side, and note any anticoagulant therapy on the referral." },
      { note: "Call 08 7081 3078 to discuss a patient, or to arrange electronic ordering for your practice." },
    ],
    references: [
      "Altman R, Lim S, Steen RG, Dasa V. Hyaluronic Acid Injections Are Associated with Delay of Total Knee Replacement Surgery in Patients with Knee Osteoarthritis: Evidence from a Large U.S. Health Claims Database. PLoS One. 2015;10(12):e0145776. A correction was subsequently published: PLoS One. 2016;11(1):e0148591.",
      "Nicholls M, Niazi F, Nelson WW, Lau E, Kurtz SM, Ong KL. Changes in prescription pain medication and intra-articular corticosteroid utilisation after bio-fermentation derived hyaluronic acid use in patients undergoing multimodal pain management.",
    ],
  },

  {
    slug: "why-ultrasound-for-soft-tissue-injuries",
    title: "Why ultrasound for a soft tissue injury?",
    excerpt:
      "Why a doctor may request ultrasound rather than an X-ray for a muscle or tendon problem, and what makes it different from other imaging.",
    publishedAt: "2026-08-17",
    readingMinutes: 4,
    category: "Before your scan",
    placeholder: false,
    body: [
      { p: "If you have hurt a shoulder or an Achilles and been sent for an ultrasound, it can seem like the wrong tool. X-rays are what most people associate with injury. There are good reasons a doctor may request ultrasound instead, and they are worth understanding." },

      { h: "X-rays are for bone" },
      { p: "X-ray works by passing radiation through the body, and dense structures absorb more of it. That makes bone show clearly, which is why X-ray answers questions about fractures and joint spaces well." },
      { p: "Soft tissue does not have that density difference. A tendon, a muscle and the fluid around them are broadly similar on an X-ray, so a torn rotator cuff and an intact one can look much the same. The injury is often not in the tissue X-ray shows best." },

      { h: "Ultrasound shows soft tissue, and shows it moving" },
      { p: "Ultrasound works on reflected sound rather than radiation, and soft tissue reflects it differently depending on structure. Tendons, muscles, ligaments and the fluid-filled bursae around joints are all distinguishable." },
      { p: "The more important difference is that ultrasound is live. The sonographer can move your joint while scanning and watch what happens: whether a tendon glides, catches, or does not move as it should. A structure can look normal at rest and clearly abnormal in motion, and a static image cannot show that at all." },
      { p: "It is also why the sonographer will ask you to point at exactly where it hurts, then scan that spot while moving the joint. It is not thoroughness for its own sake." },

      { h: "The practical advantages" },
      { ul: [
        "No ionising radiation at all.",
        "Both sides can be compared in the same appointment, which is often how a subtle abnormality becomes obvious.",
        "It is usually quick, and most appointments are finished within thirty minutes.",
        "Where treatment is appropriate, the same imaging can guide an injection to exactly the right spot.",
      ]},

      { h: "It is not always the answer" },
      { p: "Ultrasound has real limits. It does not see through bone, so it cannot assess structures inside a joint the way other imaging can, and it does not answer every question about deeper tissue." },
      { p: "Which study you need is your referring doctor's decision, made with everything they know about your case. Sometimes it is ultrasound, sometimes X-ray, sometimes both, and sometimes something else entirely." },
      { note: "Musculoskeletal ultrasound depends heavily on who performs it, because the image is made live. At Recover Radiology it is performed by specialist musculoskeletal sonographers." },
    ],
  },
];

/** Everything renderable, including evidence articles awaiting sign-off. */
export const publishedPosts = () =>
  posts
    .filter((p) => !p.placeholder && p.publishedAt)
    .sort((a, b) => (a.publishedAt! < b.publishedAt! ? 1 : -1));

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

/**
 * Cleared for search. An article citing clinical evidence is held back until a
 * radiologist has read it, exactly like the procedure pages: it renders and is
 * linked so it can be reviewed in place, but does not accumulate impressions.
 */
export const indexablePosts = () =>
  publishedPosts().filter((p) => p.signedOff !== false);

/** Categories in reading order, for grouping the index. */
export const POST_CATEGORIES = [
  "The team",
  "Costs and Medicare",
  "Before your scan",
] as const;
