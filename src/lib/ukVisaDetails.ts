// Comprehensive UK visa guidance data — authentic, detailed info for each visa type

export interface VisaDetailSection {
  title: string;
  content: string;
}

export interface VisaEligibilityCriterion {
  label: string;
  detail: string;
  mandatory: boolean;
}

export interface VisaStep {
  step: number;
  title: string;
  description: string;
  duration?: string;
}

export interface VisaFee {
  item: string;
  amount: string;
  note?: string;
}

export interface VisaDetailData {
  id: string;
  name: string;
  officialName: string;
  icon: string;
  summary: string;
  processingTime: string;
  validityPeriod: string;
  overview: string[];
  eligibility: VisaEligibilityCriterion[];
  applicationSteps: VisaStep[];
  fees: VisaFee[];
  totalEstimatedCost: string;
  documents: { name: string; detail: string }[];
  importantNotes: string[];
  officialLink: string;
  faqs: { q: string; a: string }[];
}

export const UK_VISA_DETAILS: Record<string, VisaDetailData> = {
  study: {
    id: "study",
    name: "Student Visa (Tier 4)",
    officialName: "Student Route — formerly Tier 4 (General)",
    icon: "📚",
    summary: "The UK Student visa allows you to study a full-time course at a licensed institution in the United Kingdom. It replaced the Tier 4 (General) student visa in 2020.",
    processingTime: "3–6 weeks (standard), 5 working days (priority)",
    validityPeriod: "Duration of course + wrap-up period (up to 4 months after course end)",
    overview: [
      "You must have an unconditional offer of a place on a course from a licensed student sponsor, evidenced by a Confirmation of Acceptance for Studies (CAS).",
      "The course must be at RQF level 6 or above (degree-level) for most applicants, or RQF level 3–5 at an institution with a track record of compliance.",
      "You can work up to 20 hours per week during term time and full-time during official vacation periods. Some courses (such as foundation programmes) may have more restrictive work permissions.",
      "After completing your degree, you can switch to the Graduate Route visa, which allows 2 years of unrestricted work (3 years for PhD graduates) without needing employer sponsorship.",
      "Your dependants (spouse/partner and children under 18) can join you if you are studying a postgraduate course of 9 months or more at an institution with a track record of compliance.",
    ],
    eligibility: [
      { label: "Confirmation of Acceptance for Studies (CAS)", detail: "A unique reference number issued by your licensed sponsor institution. Each CAS is valid for 6 months and can only be used once. Your institution will issue this after you accept your unconditional offer.", mandatory: true },
      { label: "English language proficiency", detail: "You must prove English at minimum CEFR B2 level (equivalent to IELTS 5.5–6.5 depending on the course). Accepted tests include IELTS for UKVI, PTE Academic, LanguageCert, Trinity ISE. Some nationalities are exempt.", mandatory: true },
      { label: "Financial requirements", detail: "You must show you can cover tuition fees for the first year (or full course if shorter) PLUS living costs: £1,334/month for up to 9 months if studying in London, or £1,023/month outside London. Funds must be held for 28 consecutive days ending no more than 31 days before your application.", mandatory: true },
      { label: "Age requirement", detail: "You must be at least 16 years old. If under 18, you need parental consent and must have suitable care arrangements in the UK.", mandatory: true },
      { label: "TB test certificate", detail: "Required if you are from a listed country (includes India, Pakistan, Bangladesh, Nigeria, China, Philippines, and others). The test must be done at an approved clinic in your country.", mandatory: false },
      { label: "ATAS certificate", detail: "Academic Technology Approval Scheme clearance is required for certain postgraduate courses in sensitive subjects (e.g., nuclear physics, aerospace engineering, advanced materials). Your CAS will state if ATAS is needed. Apply at least 6 weeks before your visa application.", mandatory: false },
      { label: "Credibility interview", detail: "UKVI may conduct a credibility interview to assess whether you are a genuine student. This can be done at the visa application centre or over the phone. Be prepared to explain your course choice, career plans, and why you chose the UK.", mandatory: false },
    ],
    applicationSteps: [
      { step: 1, title: "Receive your offer & accept it", description: "Apply to UK universities through UCAS (undergraduate) or directly (postgraduate). Once you receive an unconditional offer, accept it and pay any required deposit.", duration: "2–6 months" },
      { step: 2, title: "Get your CAS number", description: "Your institution issues a CAS after you accept the offer and meet all conditions. This contains your personal details, course information, and any fees paid. Check all details are correct.", duration: "1–4 weeks" },
      { step: 3, title: "Prepare your documents", description: "Gather all required documents: valid passport, CAS, financial evidence (28-day bank statements), IELTS/PTE results, TB test (if applicable), ATAS certificate (if applicable).", duration: "2–4 weeks" },
      { step: 4, title: "Apply online", description: "Complete the online application on the UK government website (gov.uk). Pay the visa fee (£490) and the Immigration Health Surcharge (£776/year). Book your biometrics appointment.", duration: "1–2 hours" },
      { step: 5, title: "Attend biometrics appointment", description: "Visit your nearest visa application centre (VFS Global or TLScontact) to provide your fingerprints and photograph. Bring your passport and supporting documents.", duration: "1 day" },
      { step: 6, title: "Wait for decision", description: "Standard processing takes 3–6 weeks. Priority service (5 working days) costs an additional £500. Super priority (next working day) costs £1,000 where available.", duration: "3–6 weeks" },
      { step: 7, title: "Receive your visa & travel", description: "If approved, you'll receive a vignette (sticker) in your passport valid for 90 days. Within 10 days of arriving in the UK, collect your Biometric Residence Permit (BRP) from the specified post office.", duration: "Before course start" },
    ],
    fees: [
      { item: "Visa application fee", amount: "£490", note: "Non-refundable" },
      { item: "Immigration Health Surcharge (IHS)", amount: "£776 per year", note: "Covers NHS access; pro-rated for courses shorter/longer than 1 year" },
      { item: "Priority processing (optional)", amount: "£500", note: "Decision within 5 working days" },
      { item: "Super priority (optional)", amount: "£1,000", note: "Decision next working day; limited availability" },
      { item: "TB test (if required)", amount: "£50–£150", note: "Varies by country" },
      { item: "IELTS for UKVI test", amount: "£170–£195", note: "Required if English proficiency not otherwise proven" },
      { item: "Biometrics enrolment", amount: "Included", note: "Part of the application process" },
    ],
    totalEstimatedCost: "£1,266 – £2,471 (visa fees only, excluding tuition)",
    documents: [
      { name: "Valid passport", detail: "Must have at least one blank page. Validity should extend beyond your intended stay. If you have an old passport with previous visas, bring that too." },
      { name: "CAS reference number", detail: "The 14-character alphanumeric reference number from your sponsor. Your CAS will also contain details of any qualifications your sponsor has checked." },
      { name: "Financial evidence", detail: "Bank statements or building society passbook showing funds held for 28 consecutive days. The 28-day period must end no more than 31 days before your application date. If using a student loan or official sponsor, provide the loan/sponsor letter." },
      { name: "English language test result", detail: "IELTS for UKVI, PTE Academic UKVI, LanguageCert, or Trinity ISE. The test must have been taken within 2 years of your application date. Test Reference Number (TRN) must be provided." },
      { name: "Academic certificates & transcripts", detail: "Original degree certificates, diplomas, and academic transcripts. If not in English, provide certified translations." },
      { name: "TB test certificate", detail: "From an approved clinic in your country. Valid for 6 months from the date of the test. Required for nationals of listed countries." },
      { name: "Passport photographs", detail: "Biometric passport-sized photos meeting UK specifications: 45mm x 35mm, white background, neutral expression." },
      { name: "Consent letter (if under 18)", detail: "Written consent from parent/legal guardian confirming they approve of your travel, living, and care arrangements in the UK." },
    ],
    importantNotes: [
      "You can apply up to 6 months before your course start date (if applying from outside the UK).",
      "You must not travel to the UK before the start date shown on your visa vignette.",
      "The Graduate Route visa (2-year post-study work) is available after successful completion of a degree. You must apply before your Student visa expires.",
      "If you are refused, you will receive a written explanation. You can reapply with stronger evidence but there is no formal right of appeal from outside the UK.",
      "Working restrictions: 20 hours/week during term, full-time during vacation. You cannot be self-employed or fill a permanent full-time vacancy.",
      "Your sponsor has a duty to report if you miss 10 or more expected contacts. This could lead to your visa being curtailed.",
    ],
    officialLink: "https://www.gov.uk/student-visa",
    faqs: [
      { q: "Can I work while studying?", a: "Yes. Most students can work up to 20 hours per week during term time and full-time during official vacation periods. Some courses at lower levels may have more restrictive or no work permissions." },
      { q: "Can I bring my family?", a: "Dependants can accompany you if you are studying a postgraduate course of 9+ months at an institution with a track record of compliance. Each dependant pays their own visa fee and IHS." },
      { q: "What happens if my visa application is refused?", a: "You will receive a written refusal letter explaining the reasons. You can reapply immediately with additional evidence addressing the refusal reasons. There is no formal appeal right when applying from outside the UK." },
      { q: "Can I switch from Student visa to a work visa?", a: "Yes. You can switch to the Skilled Worker visa from within the UK if you receive a job offer from a licensed sponsor. You can also switch to the Graduate Route after completing your degree." },
      { q: "Do I need to show funds if my sponsor has paid all fees?", a: "If your CAS confirms that all tuition and accommodation fees are paid, you only need to show living cost funds. If your government or an international scholarship body is funding you, an official letter confirming this is sufficient." },
    ],
  },

  work: {
    id: "work",
    name: "Skilled Worker Visa",
    officialName: "Skilled Worker visa — replaced Tier 2 (General) in December 2020",
    icon: "💼",
    summary: "The Skilled Worker visa lets you come to or stay in the UK to do an eligible job with an approved employer. You must have a job offer from a UK employer that holds a valid sponsor licence.",
    processingTime: "3–8 weeks (standard), 5 working days (priority)",
    validityPeriod: "Up to 5 years (can extend and switch to ILR after 5 years)",
    overview: [
      "You need a job offer from a UK employer who holds a valid sponsor licence. The employer will issue you a Certificate of Sponsorship (CoS) with details of the role and salary.",
      "The job must be at a minimum skill level of RQF 3 (A-level equivalent) and appear on the list of eligible occupations. Most professional, managerial, and technical roles qualify.",
      "Since April 2024, the general salary threshold is £38,700 per year (or the going rate for the specific occupation, whichever is higher). Reduced thresholds apply for shortage occupations, new entrants, and some other categories.",
      "You can work for your sponsor, do voluntary work, and travel in and out of the UK. You can bring your partner and children as dependants.",
      "After 5 continuous years on a Skilled Worker visa, you can apply for Indefinite Leave to Remain (settlement) if you meet salary and other requirements.",
    ],
    eligibility: [
      { label: "Job offer from licensed sponsor", detail: "The employer must hold a valid Skilled Worker sponsor licence. You can check the register of licensed sponsors on gov.uk. The job must be genuine and not created to facilitate your immigration.", mandatory: true },
      { label: "Certificate of Sponsorship (CoS)", detail: "Your employer assigns you a CoS — a virtual document with a unique reference number. It contains details of the job, salary, working hours, and SOC code. There are two types: Defined CoS (for applicants outside the UK) and Undefined CoS (for switching within the UK).", mandatory: true },
      { label: "Salary requirement", detail: "General threshold: £38,700/year or the going rate for the occupation (whichever is higher). New entrants (under 26, recent graduates, postdoctoral positions): 70% of the going rate. Shortage occupation: reduced going rate applies. Health and education roles may have different thresholds.", mandatory: true },
      { label: "English language (B1 level)", detail: "Equivalent to IELTS 4.0 in each component. You can prove this through a SELT test (IELTS for UKVI Life Skills), a degree taught in English, or nationality of a majority English-speaking country.", mandatory: true },
      { label: "Maintenance funds", detail: "You must have at least £1,270 in your bank account for 28 consecutive days (unless your sponsor certifies maintenance on your CoS — known as 'A-rated sponsor' certification).", mandatory: true },
      { label: "Criminal record certificate", detail: "Required for certain roles, particularly in education, healthcare, and social care. Your employer or the Home Office will advise if this applies to your role.", mandatory: false },
    ],
    applicationSteps: [
      { step: 1, title: "Secure a job offer", description: "Find an eligible role with a licensed sponsor employer. Use the gov.uk register to verify the employer holds a valid sponsor licence. Agree salary and terms.", duration: "Varies" },
      { step: 2, title: "Employer assigns CoS", description: "Your employer requests a CoS from UKVI. For applicants outside the UK, this is a 'Defined CoS' which must be allocated. Processing can take days to weeks.", duration: "1–4 weeks" },
      { step: 3, title: "Apply online", description: "Complete the online application on gov.uk. Pay the visa fee and Immigration Health Surcharge. Select your biometrics appointment date.", duration: "1–2 hours" },
      { step: 4, title: "Attend biometrics", description: "Visit the visa application centre to provide fingerprints and photograph. Bring all supporting documents.", duration: "1 day" },
      { step: 5, title: "Receive decision", description: "Standard: 3–8 weeks. Priority: 5 working days (£500 extra). Super priority: next working day (£1,000 extra). If approved, you receive a 90-day vignette.", duration: "3–8 weeks" },
      { step: 6, title: "Travel & collect BRP", description: "Travel to the UK within your vignette validity. Collect your BRP from the designated post office within 10 days of arrival.", duration: "Within 90 days" },
    ],
    fees: [
      { item: "Visa application fee (up to 3 years)", amount: "£719", note: "For stays of 3 years or less" },
      { item: "Visa application fee (over 3 years)", amount: "£1,420", note: "For stays of more than 3 years" },
      { item: "Immigration Health Surcharge", amount: "£1,035 per year", note: "Covers full NHS access" },
      { item: "Priority processing (optional)", amount: "£500" },
      { item: "Super priority (optional)", amount: "£1,000" },
      { item: "Certificate of Sponsorship", amount: "Paid by employer", note: "Employer pays £239 per CoS" },
      { item: "Immigration Skills Charge", amount: "£364–£1,000/year", note: "Paid by employer (not the worker)" },
    ],
    totalEstimatedCost: "£1,754 – £3,455 (visa + IHS for applicant only)",
    documents: [
      { name: "Valid passport", detail: "Must be valid for the duration of your planned stay." },
      { name: "Certificate of Sponsorship reference number", detail: "Provided by your employer. Contains your job details, salary, and SOC code." },
      { name: "English language evidence", detail: "IELTS Life Skills B1, or degree certificate from an English-taught programme, or passport from a majority English-speaking country." },
      { name: "Bank statements", detail: "Showing at least £1,270 held for 28 consecutive days (unless sponsor certifies maintenance)." },
      { name: "Criminal record certificate", detail: "If applying for work in healthcare, education, or social care. Must be from every country you've lived in for 12+ months in the last 10 years." },
      { name: "TB test certificate", detail: "Required for nationals of listed countries." },
    ],
    importantNotes: [
      "You cannot switch employers without applying for a new visa with a new CoS from your new employer.",
      "The salary must meet both the general threshold AND the going rate for your specific occupation SOC code.",
      "Since April 2024, the minimum salary threshold increased from £26,200 to £38,700. Check the latest rates on gov.uk.",
      "You can do supplementary employment (up to 20 hours/week) in the same SOC code as your main job, or in a shortage occupation, without additional sponsorship.",
      "Time spent on a Skilled Worker visa counts towards the 5-year qualifying period for ILR (settlement).",
    ],
    officialLink: "https://www.gov.uk/skilled-worker-visa",
    faqs: [
      { q: "Can I change jobs on a Skilled Worker visa?", a: "Yes, but you must apply for a new visa with a new CoS from your new employer before you start working for them. You cannot work for the new employer until the new visa is approved." },
      { q: "What is the Immigration Skills Charge?", a: "This is a fee paid by your employer — not you. It is £364/year for small or charitable employers, or £1,000/year for medium and large employers." },
      { q: "Can I apply for permanent residence?", a: "Yes. After 5 continuous years on a Skilled Worker visa, you can apply for Indefinite Leave to Remain (ILR). You must meet the salary requirement and pass the Life in the UK test." },
      { q: "What if I lose my job?", a: "If your employment ends, your employer must report it to the Home Office. You typically have 60 days (or until your visa expires, whichever is shorter) to find a new sponsor or leave the UK." },
    ],
  },

  pr: {
    id: "pr",
    name: "Indefinite Leave to Remain (ILR)",
    officialName: "Indefinite Leave to Remain — also known as 'settlement' or 'permanent residence'",
    icon: "🏡",
    summary: "ILR gives you the right to live and work in the UK permanently without any immigration restrictions. It is the step before applying for British citizenship.",
    processingTime: "6 months (standard), 1 working day (super priority, if eligible)",
    validityPeriod: "Indefinite (but can be lost if you spend more than 2 continuous years outside the UK)",
    overview: [
      "ILR removes all conditions on your stay. You can work without restriction, access public funds, and live in the UK permanently.",
      "To apply, you must have completed a continuous qualifying period on an eligible visa — typically 5 years on a work visa (Skilled Worker, Health and Care Worker, Innovator, etc.).",
      "You must meet the knowledge of language and life requirement by passing the Life in the UK test and proving English at B1 level.",
      "Once you have ILR, you can apply for British citizenship after 12 months, provided you meet the residence and other requirements.",
      "ILR is granted via a Biometric Residence Permit (BRP) or digital status. It does not expire, but you must not be absent from the UK for more than 2 continuous years or it may be revoked.",
    ],
    eligibility: [
      { label: "5 years continuous residence", detail: "You must have lived in the UK continuously for 5 years on a qualifying visa. Absences of up to 180 days per 12-month period are allowed. Longer absences may break your continuous residence unless there are exceptional circumstances.", mandatory: true },
      { label: "Current qualifying visa", detail: "You must hold a valid visa that leads to settlement (Skilled Worker, Health and Care Worker, Global Talent, Innovator Founder, etc.). Not all visa types lead to ILR — for example, Student visas do not.", mandatory: true },
      { label: "Life in the UK test", detail: "A 24-question multiple-choice test about British history, culture, traditions, and the UK political system. You need 75% (18/24) to pass. The test costs £50 and can be taken at over 30 centres across the UK. You can retake it as many times as needed.", mandatory: true },
      { label: "English language B1", detail: "CEFR B1 level — equivalent to IELTS 4.0 in speaking and listening. Can be proven through IELTS Life Skills B1, a degree taught or researched in English, or nationality of a majority English-speaking country.", mandatory: true },
      { label: "Salary requirement", detail: "For Skilled Worker route: your current salary must meet the applicable threshold (£38,700 or the going rate for your occupation). Some concessions exist for Health and Care workers and certain other categories.", mandatory: true },
      { label: "Good character", detail: "No unspent criminal convictions. No breaches of immigration law. No involvement in war crimes, terrorism, or other serious offences. Repeated minor offences (such as traffic violations) may also affect your application.", mandatory: true },
    ],
    applicationSteps: [
      { step: 1, title: "Check your eligibility", description: "Verify you have completed 5 years continuous residence on a qualifying visa. Check your absence history — you must not have exceeded 180 days in any 12-month period.", duration: "Self-assessment" },
      { step: 2, title: "Pass the Life in the UK test", description: "Book and pass the test at an approved centre. It covers British values, history, traditions, and everyday life. Study using the official handbook 'Life in the United Kingdom: A Guide for New Residents'.", duration: "2–8 weeks preparation" },
      { step: 3, title: "Prove English language", description: "Take IELTS Life Skills B1 (speaking and listening only), or submit evidence of an English-taught degree, or prove you are a national of a majority English-speaking country.", duration: "1–2 weeks" },
      { step: 4, title: "Gather documents", description: "Compile 5 years of evidence: payslips, P60s, tax returns, BRPs for all previous visas, employer letters, absence records.", duration: "2–4 weeks" },
      { step: 5, title: "Apply online and pay", description: "Submit the online application on gov.uk. Pay the fee (£2,885). Book a biometrics appointment at a UKVCAS centre.", duration: "1–2 hours" },
      { step: 6, title: "Biometrics & document submission", description: "Attend your appointment. You can use the UK Immigration: ID Check app to submit biometrics from your phone if you have a chipped passport.", duration: "1 day" },
      { step: 7, title: "Wait for decision", description: "Standard processing: up to 6 months. Super priority (1 working day): £800 extra, appointment at a premium centre.", duration: "Up to 6 months" },
    ],
    fees: [
      { item: "ILR application fee", amount: "£2,885", note: "Per applicant" },
      { item: "Super priority service (optional)", amount: "£800", note: "Decision within 1 working day" },
      { item: "Life in the UK test", amount: "£50", note: "Can retake multiple times" },
      { item: "IELTS Life Skills B1 (if needed)", amount: "£150", note: "Speaking and listening test only" },
      { item: "Biometrics enrolment", amount: "Included" },
    ],
    totalEstimatedCost: "£2,935 – £3,885 (per applicant)",
    documents: [
      { name: "Current BRP", detail: "Your current Biometric Residence Permit or digital immigration status evidence." },
      { name: "Valid passport", detail: "Current passport plus any expired passports covering the 5-year qualifying period." },
      { name: "Life in the UK test pass certificate", detail: "The unique reference number from your pass notification." },
      { name: "English language evidence", detail: "IELTS Life Skills B1 certificate, or qualifying degree certificate, or passport from English-speaking country." },
      { name: "Employment evidence", detail: "P60s for each tax year, payslips (at least 6 months of recent payslips), employment contracts, employer letters confirming salary and role." },
      { name: "Absence record", detail: "A full record of all trips outside the UK during the 5-year period, including dates and destinations." },
      { name: "Criminal record declaration", detail: "You must declare any criminal convictions anywhere in the world." },
    ],
    importantNotes: [
      "If you leave the UK for more than 2 continuous years after getting ILR, your ILR will lapse. You would need to apply for a Returning Resident visa.",
      "ILR gives you access to public funds (benefits, housing support, etc.) that were previously restricted.",
      "After 12 months with ILR, you can apply for British citizenship (naturalisation) — fee is £1,580.",
      "Your dependants (partner and children) can apply for ILR at the same time if they have also completed 5 years.",
      "If your application is refused, you have a right of appeal in most circumstances.",
    ],
    officialLink: "https://www.gov.uk/indefinite-leave-to-remain",
    faqs: [
      { q: "Can I apply for citizenship after ILR?", a: "Yes. You can apply for British citizenship (naturalisation) 12 months after receiving ILR. You must meet residence requirements and pass the Life in the UK test (if not already passed). The fee is £1,580." },
      { q: "What if I fail the Life in the UK test?", a: "You can retake it as many times as needed. Each attempt costs £50. You must pass before submitting your ILR application." },
      { q: "Does my ILR expire?", a: "No, ILR does not expire. However, it can lapse if you spend more than 2 continuous years outside the UK. It can also be revoked if you obtained it through deception." },
      { q: "Can my employer help with ILR?", a: "Your employer does not need to sponsor your ILR application, but they will need to provide employment evidence (letters, payslips, P60s) to support it." },
    ],
  },

  tourist: {
    id: "tourist",
    name: "Standard Visitor Visa",
    officialName: "Standard Visitor visa — for tourism, business, study (up to 6 months), and medical treatment",
    icon: "✈️",
    summary: "The Standard Visitor visa allows you to visit the UK for up to 6 months for tourism, visiting family or friends, attending business meetings, or short courses of study.",
    processingTime: "3 weeks (standard), 5 working days (priority)",
    validityPeriod: "6 months (single/multiple entry), 2/5/10-year long-term options available",
    overview: [
      "The Standard Visitor visa covers most short visits to the UK: tourism, visiting family, attending conferences, business meetings, receiving private medical treatment, and short courses of up to 6 months.",
      "You cannot work (paid or unpaid) in the UK on this visa. However, you can attend business meetings, conferences, and sign deals.",
      "You cannot study a course longer than 6 months. For longer courses, you need a Student visa.",
      "Some nationalities do not need a visa for visits of up to 6 months (e.g., EU/EEA citizens, US, Canadian, Australian nationals). Check if you need a visa on gov.uk.",
      "Long-term visit visas (2, 5, or 10 years) allow multiple visits but each stay must not exceed 6 months. You cannot live in the UK by making repeated short visits.",
    ],
    eligibility: [
      { label: "Valid passport", detail: "Must be valid for the duration of your planned stay.", mandatory: true },
      { label: "Genuine visitor intent", detail: "You must intend to leave the UK at the end of your visit. You must not intend to live in the UK through repeated visits. Immigration officers may ask about your plans.", mandatory: true },
      { label: "Sufficient funds", detail: "You must be able to support yourself (and any dependants) during your stay without accessing public funds. Bank statements, payslips, or sponsor letters are accepted.", mandatory: true },
      { label: "Return/onward ticket", detail: "Evidence of a booked return flight or onward travel is strongly recommended, though not always mandatory.", mandatory: false },
      { label: "Accommodation arrangements", detail: "Proof of where you will stay — hotel booking, or invitation letter from the person you are visiting with their address and immigration status.", mandatory: true },
      { label: "Ties to home country", detail: "Evidence that you have reason to return: employment, property ownership, family responsibilities, ongoing education.", mandatory: true },
    ],
    applicationSteps: [
      { step: 1, title: "Check if you need a visa", description: "Some nationalities are visa-exempt for visits up to 6 months. Check on gov.uk using the 'Check if you need a UK visa' tool.", duration: "5 minutes" },
      { step: 2, title: "Complete online application", description: "Fill in the online application form on gov.uk. Answer questions about your travel history, purpose of visit, financial situation, and accommodation plans.", duration: "30–60 minutes" },
      { step: 3, title: "Pay the fee", description: "Pay the visa fee online. Standard 6-month visa: £115. Longer-term visas cost more.", duration: "5 minutes" },
      { step: 4, title: "Book and attend biometrics", description: "Book an appointment at your nearest visa application centre (VFS Global or TLScontact). Provide fingerprints and a photo. Submit your passport and documents.", duration: "1 day" },
      { step: 5, title: "Receive decision", description: "Standard processing: 3 weeks. Priority (5 working days): £500 extra. Your passport will be returned with the visa vignette if approved.", duration: "3 weeks" },
    ],
    fees: [
      { item: "Standard Visitor visa (6 months)", amount: "£115", note: "Single or multiple entry" },
      { item: "Long-term visa (2 years)", amount: "£400", note: "Multiple entry, max 6 months per visit" },
      { item: "Long-term visa (5 years)", amount: "£771", note: "Multiple entry" },
      { item: "Long-term visa (10 years)", amount: "£963", note: "Multiple entry" },
      { item: "Priority processing (optional)", amount: "£500", note: "Decision within 5 working days" },
      { item: "Super priority (optional)", amount: "£1,000", note: "Decision next working day" },
    ],
    totalEstimatedCost: "£115 – £1,963 (depending on visa duration and priority)",
    documents: [
      { name: "Valid passport", detail: "Must have at least one blank page. Bring old passports showing previous travel history." },
      { name: "Financial evidence", detail: "Last 6 months of bank statements. Payslips or employment letter showing salary. If someone else is paying for your trip, their financial evidence plus a sponsor letter." },
      { name: "Accommodation proof", detail: "Hotel booking confirmation, or invitation letter from host in the UK including their full address, contact details, and immigration status." },
      { name: "Travel itinerary", detail: "Flight booking (return trip recommended), and a brief outline of planned activities during your visit." },
      { name: "Employment/study proof", detail: "Letter from employer confirming your role, salary, and approved leave dates. Or university enrolment letter if you are a student." },
      { name: "Invitation letter (if visiting someone)", detail: "From the person inviting you, stating your relationship, their address, their immigration status, and how long you plan to stay." },
    ],
    importantNotes: [
      "You cannot work (paid or unpaid), access public funds, or register with a GP for NHS treatment (except emergencies).",
      "You can receive private medical treatment, but you must declare this in your application and show you can pay for it.",
      "If you are refused entry at the UK border, you may be returned to your home country on the next available flight.",
      "Making repeated short visits that amount to 'living' in the UK can lead to refusal of entry or future visa applications.",
      "If you overstay your visa even by 1 day, it can affect future UK visa applications for up to 10 years.",
    ],
    officialLink: "https://www.gov.uk/standard-visitor",
    faqs: [
      { q: "Can I extend my visit?", a: "In most cases, no. You must leave the UK before your visa expires. Extensions are only granted in exceptional circumstances (e.g., medical emergency)." },
      { q: "Can I study on a Visitor visa?", a: "You can take a short course of study (up to 6 months) or a recreational course. You cannot study at a state-funded school or enrol in a course longer than 6 months." },
      { q: "Do I need travel insurance?", a: "It is not mandatory but strongly recommended. The NHS may charge for treatment, and having insurance shows you are prepared." },
      { q: "Can I attend a job interview?", a: "Yes. You can attend interviews and meetings, but you cannot start working until you have the appropriate work visa." },
    ],
  },
};
