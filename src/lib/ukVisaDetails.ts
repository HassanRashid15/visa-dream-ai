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
  comprehensiveOverview?: string;
  practiceFeatures?: { title: string; description: string; action: string; link: string }[];
  eligibility: VisaEligibilityCriterion[];
  applicationSteps: VisaStep[];
  fees: VisaFee[];
  totalEstimatedCost: string;
  documents: { name: string; detail: string; status?: "required" | "optional" | "depends" }[];
  importantNotes: string[];
  officialLink: string;
  officialResources?: { title: string; url: string; description: string }[];
  faqs: { q: string; a: string }[];
  gallery?: { url: string; caption: string }[];
  videos?: { title: string; description: string; youtubeId: string }[];
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
    comprehensiveOverview: "The UK Student visa is the primary pathway for international students to pursue their education in the United Kingdom. This visa replaced the Tier 4 (General) student visa in 2020 as part of the UK's streamlined immigration system. It allows you to study full-time at a licensed educational institution, including universities, colleges, and some private schools. The visa is designed for students undertaking courses at RQF level 6 or above (degree-level) or RQF level 3-5 at institutions with a proven track record. Key benefits include the ability to work part-time during term time (up to 20 hours per week), full-time during vacations, and the opportunity to switch to the Graduate Route visa after completing your degree, which provides 2 years of unrestricted work (3 years for PhD graduates). The visa also allows you to bring dependants if you're studying a postgraduate course of 9 months or more at a compliant institution.",
    overview: [
      "You must have an unconditional offer of a place on a course from a licensed student sponsor, evidenced by a Confirmation of Acceptance for Studies (CAS).",
      "The course must be at RQF level 6 or above (degree-level) for most applicants, or RQF level 3–5 at an institution with a track record of compliance.",
      "You can work up to 20 hours per week during term time and full-time during official vacation periods. Some courses (such as foundation programmes) may have more restrictive work permissions.",
      "After completing your degree, you can switch to the Graduate Route visa, which allows 2 years of unrestricted work (3 years for PhD graduates) without needing employer sponsorship.",
      "Your dependants (spouse/partner and children under 18) can join you if you are studying a postgraduate course of 9 months or more at an institution with a track record of compliance.",
    ],
    eligibility: [
      { label: "Confirmation of Acceptance for Studies (CAS)", detail: "A unique reference number issued by your licensed sponsor institution. Each CAS is valid for 6 months and can only be used once. Your institution will issue this after you accept your unconditional offer. Example: CAS number GBR123456789012 from University of Manchester for Computer Science MSc.", mandatory: true },
      { label: "English language proficiency", detail: "You must prove English at minimum CEFR B2 level (equivalent to IELTS 5.5–6.5 depending on the course). Accepted tests include IELTS for UKVI, PTE Academic, LanguageCert, Trinity ISE. Some nationalities are exempt. Example: IELTS Academic score of 6.5 overall with 6.0 in each component for a Master's degree.", mandatory: true },
      { label: "Financial requirements", detail: "You must show you can cover tuition fees for the first year (or full course if shorter) PLUS living costs: £1,334/month for up to 9 months if studying in London, or £1,023/month outside London. Funds must be held for 28 consecutive days ending no more than 31 days before your application. Example: For a £20,000 tuition fee course in London, show £20,000 + £12,008 (9 months) = £32,008 total.", mandatory: true },
      { label: "Age requirement", detail: "You must be at least 16 years old. If under 18, you need parental consent and must have suitable care arrangements in the UK. Example: 17-year-old student needs signed consent letter and homestay arrangement confirmation.", mandatory: true },
      { label: "TB test certificate", detail: "Required if you are from a listed country (includes India, Pakistan, Bangladesh, Nigeria, China, Philippines, and others). The test must be done at an approved clinic in your country. Example: TB test certificate from approved clinic in Mumbai, valid until December 2024.", mandatory: false },
      { label: "ATAS certificate", detail: "Academic Technology Approval Scheme clearance is required for certain postgraduate courses in sensitive subjects (e.g., nuclear physics, aerospace engineering, advanced materials). Your CAS will state if ATAS is needed. Apply at least 6 weeks before your visa application. Example: ATAS certificate for PhD in Nuclear Engineering at Imperial College.", mandatory: false },
      { label: "Credibility interview", detail: "UKVI may conduct a credibility interview to assess whether you are a genuine student. This can be done at the visa application centre or over the phone. Be prepared to explain your course choice, career plans, and why you chose the UK. Example: Interview questions about why you chose this specific university and how the degree helps your career goals.", mandatory: false },
    ],
    applicationSteps: [
      { step: 1, title: "Receive your offer & accept it", description: "Apply to UK universities through UCAS (undergraduate) or directly (postgraduate). Once you receive an unconditional offer, accept it and pay any required deposit. Example: Apply to 5 universities through UCAS, receive unconditional offer from University of Edinburgh, pay £2,000 deposit.", duration: "2–6 months" },
      { step: 2, title: "Get your CAS number", description: "Your institution issues a CAS after you accept the offer and meet all conditions. This contains your personal details, course information, and any fees paid. Check all details are correct. Example: University issues CAS GBR123456789012 confirming your place and £2,000 deposit payment.", duration: "1–4 weeks" },
      { step: 3, title: "Prepare your documents", description: "Gather all required documents: valid passport, CAS, financial evidence (28-day bank statements), IELTS/PTE results, TB test (if applicable), ATAS certificate (if applicable). Example: Compile passport, CAS, bank statements showing £35,000, IELTS certificate, TB test certificate.", duration: "2–4 weeks" },
      { step: 4, title: "Apply online", description: "Complete the online application on the UK government website (gov.uk). Pay the visa fee (£490) and the Immigration Health Surcharge (£776/year). Book your biometrics appointment. Example: Fill application form, pay £490 + £1,552 IHS (2-year course), book VFS appointment.", duration: "1–2 hours" },
      { step: 5, title: "Attend biometrics appointment", description: "Visit your nearest visa application centre (VFS Global or TLScontact) to provide your fingerprints and photograph. Bring your passport and supporting documents. Example: Visit VFS Delhi centre on July 15 with all documents.", duration: "1 day" },
      { step: 6, title: "Wait for decision", description: "Standard processing takes 3–6 weeks. Priority service (5 working days) costs an additional £500. Super priority (next working day) costs £1,000 where available. Example: Decision received after 4 weeks, passport returned with visa vignette.", duration: "3–6 weeks" },
      { step: 7, title: "Receive your visa & travel", description: "If approved, you'll receive a vignette (sticker) in your passport valid for 90 days. Within 10 days of arriving in the UK, collect your Biometric Residence Permit (BRP) from the specified post office. Example: Arrive September 1, collect BRP from designated Post Office on September 5.", duration: "Before course start" },
    ],
    fees: [
      { item: "Visa application fee", amount: "£490", note: "Non-refundable. Example: Paid during online application process" },
      { item: "Immigration Health Surcharge (IHS)", amount: "£776 per year", note: "Covers NHS access; pro-rated for courses shorter/longer than 1 year. Example: 2-year Master's = £1,552 total" },
      { item: "Priority processing (optional)", amount: "£500", note: "Decision within 5 working days. Example: Pay extra for faster decision" },
      { item: "Super priority (optional)", amount: "£1,000", note: "Decision next working day; limited availability. Example: Available in major cities only" },
      { item: "TB test (if required)", amount: "£50–£150", note: "Varies by country. Example: £85 at approved clinic in Mumbai" },
      { item: "IELTS for UKVI test", amount: "£170–£195", note: "Required if English proficiency not otherwise proven. Example: £185 for IELTS Academic UKVI" },
      { item: "Biometrics enrolment", amount: "Included", note: "Part of the application process at visa centre" },
    ],
    totalEstimatedCost: "£1,266 – £2,471 (visa fees only, excluding tuition)",
    documents: [
      { name: "Valid passport", detail: "Must have at least one blank page. Validity should extend beyond your intended stay. If you have an old passport with previous visas, bring that too. Example: Passport valid until December 2026 for 2-year course starting September 2024." },
      { name: "CAS reference number", detail: "The 14-character alphanumeric reference number from your sponsor. Your CAS will also contain details of any qualifications your sponsor has checked. Example: CAS GBR123456789012 from University of Bristol." },
      { name: "Financial evidence", detail: "Bank statements or building society passbook showing funds held for 28 consecutive days. The 28-day period must end no more than 31 days before your application date. If using a student loan or official sponsor, provide the loan/sponsor letter. Example: Statements showing £35,000 balance from June 1-28, 2024." },
      { name: "English language test result", detail: "IELTS for UKVI, PTE Academic UKVI, LanguageCert, or Trinity ISE. The test must have been taken within 2 years of your application date. Test Reference Number (TRN) must be provided. Example: IELTS UKVI certificate with TRN 1234567890, score 6.5 overall." },
      { name: "Academic certificates & transcripts", detail: "Original degree certificates, diplomas, and academic transcripts. If not in English, provide certified translations. Example: Bachelor's degree certificate and transcripts with certified translation if needed." },
      { name: "TB test certificate", detail: "From an approved clinic in your country. Valid for 6 months from the date of the test. Required for nationals of listed countries. Example: TB certificate from approved clinic, valid until March 2025." },
      { name: "Passport photographs", detail: "Biometric passport-sized photos meeting UK specifications: 45mm x 35mm, white background, neutral expression. Example: 2 recent photos taken at professional studio." },
      { name: "Consent letter (if under 18)", detail: "Written consent from parent/legal guardian confirming they approve of your travel, living, and care arrangements in the UK. Example: Signed letter from both parents with contact details." },
    ],
    importantNotes: [
      "You can apply up to 6 months before your course start date (if applying from outside the UK). Example: Course starts September 1, you can apply from March 1 onwards.",
      "You must not travel to the UK before the start date shown on your visa vignette. Example: If your visa is valid from September 1-30, you cannot arrive before September 1.",
      "The Graduate Route visa (2-year post-study work) is available after successful completion of a degree. You must apply before your Student visa expires. Example: Complete degree in June 2026, apply for Graduate Route before September 2026.",
      "If you are refused, you will receive a written explanation. You can reapply with stronger evidence but there is no formal right of appeal from outside the UK. Example: Refused due to insufficient funds, reapply with additional financial evidence.",
      "Working restrictions: 20 hours/week during term, full-time during vacation. You cannot be self-employed or fill a permanent full-time vacancy. Example: During term, work 15 hours/week in campus library; during summer, work full-time at internship.",
      "Your sponsor has a duty to report if you miss 10 or more expected contacts. This could lead to your visa being curtailed. Example: Missing multiple classes without explanation could be reported to UKVI.",
      "ATAS certificate can take 6-8 weeks to process, apply early if your course requires it. Example: Apply for ATAS in April if your course starts in September.",
    ],
    officialLink: "https://www.gov.uk/student-visa",
    officialResources: [
      {
        title: "Register of Licensed Student Sponsors",
        url: "https://www.gov.uk/government/publications/register-of-licensed-sponsors-students",
        description: "Official list of UK educational institutions licensed to sponsor international students."
      },
      {
        title: "Student Visa Guide",
        url: "https://www.gov.uk/student-visa",
        description: "Complete guide to Student visa requirements, application process, and rules."
      },
      {
        title: "Student Visa Financial Requirements",
        url: "https://www.gov.uk/student-visa/money-youll-need",
        description: "Detailed information about financial requirements and acceptable evidence."
      },
      {
        title: "UKVI Application Centres",
        url: "https://www.gov.uk/find-a-uk-visa-application-centre",
        description: "Locate your nearest visa application centre for biometrics and document submission."
      },
      {
        title: "Student Work Permissions",
        url: "https://www.gov.uk/student-visa/working",
        description: "Information about working while studying and switching to work visas after graduation."
      },
      {
        title: "Graduate Route Visa",
        url: "https://www.gov.uk/graduate-route",
        description: "Details about the 2-year post-study work visa available after completing your degree."
      }
    ],
    faqs: [
      { q: "Can I work while studying?", a: "Yes. Most students can work up to 20 hours per week during term time and full-time during official vacation periods. Some courses at lower levels may have more restrictive or no work permissions." },
      { q: "Can I bring my family?", a: "Dependants can accompany you if you are studying a postgraduate course of 9+ months at an institution with a track record of compliance. Each dependant pays their own visa fee and IHS." },
      { q: "What happens if my visa application is refused?", a: "You will receive a written refusal letter explaining the reasons. You can reapply immediately with additional evidence addressing the refusal reasons. There is no formal appeal right when applying from outside the UK." },
      { q: "Can I switch from Student visa to a work visa?", a: "Yes. You can switch to the Skilled Worker visa from within the UK if you receive a job offer from a licensed sponsor. You can also switch to the Graduate Route after completing your degree." },
      { q: "Do I need to show funds if my sponsor has paid all fees?", a: "If your CAS confirms that all tuition and accommodation fees are paid, you only need to show living cost funds. If your government or an international scholarship body is funding you, an official letter confirming this is sufficient." },
    ],
    gallery: [
      { url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=500&fit=crop&auto=format", caption: "Historic UK university campus" },
      { url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=500&fit=crop&auto=format", caption: "Modern lecture halls and libraries" },
      { url: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&h=500&fit=crop&auto=format", caption: "Vibrant international student life" },
      { url: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=500&fit=crop&auto=format", caption: "Iconic London — study, explore, thrive" },
    ],
    videos: [
      { title: "UK Student Visa — Step by Step", description: "Official walkthrough of the Student Route application.", youtubeId: "Z5wW6KRH7Vo" },
      { title: "Life as an International Student in the UK", description: "Real student stories from UK universities.", youtubeId: "2hcS6MTMtAk" },
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
    comprehensiveOverview: "The UK Skilled Worker visa is the primary pathway for qualified professionals to work in the United Kingdom. Designed to attract talent from around the world, this visa replaced the Tier 2 (General) work visa in December 2020 as part of the UK's new points-based immigration system. The visa allows you to work for a UK employer who has been approved by the Home Office as a sponsor, stay for up to 5 years initially with options to extend, and eventually apply for permanent residence (Indefinite Leave to Remain) after 5 continuous years. This visa is ideal for professionals in fields like technology, engineering, healthcare, education, finance, and many other skilled occupations. The system operates on a points-based assessment where you need at least 70 points: 50 points for mandatory requirements (job offer, sponsor licence, appropriate skill level) and 20 points for tradeable requirements (salary, English language, education).",
    practiceFeatures: [
      {
        title: "Eligibility Calculator",
        description: "Calculate your points and check if you meet the Skilled Worker visa requirements instantly.",
        action: "Calculate My Score",
        link: "/pre-check/uk?visa=work"
      },
      {
        title: "Salary Calculator",
        description: "Check if your job offer meets the salary threshold and going rate requirements.",
        action: "Check Salary",
        link: "/tools/salary-calculator"
      },
      {
        title: "Sponsor Licence Checker",
        description: "Verify if your employer holds a valid Skilled Worker sponsor licence.",
        action: "Check Employer",
        link: "/tools/sponsor-checker"
      },
      {
        title: "Document Preparation Guide",
        description: "Get a personalized checklist of all documents you need for your application.",
        action: "Get Checklist",
        link: "/tools/document-checklist"
      },
      {
        title: "English Language Test Prep",
        description: "Practice for your IELTS Life Skills B1 test with sample questions and tips.",
        action: "Start Practice",
        link: "/practice/ielts-b1"
      },
      {
        title: "Application Timeline Planner",
        description: "Create a personalized timeline for your visa application journey.",
        action: "Plan Timeline",
        link: "/tools/timeline-planner"
      }
    ],
    overview: [
      "You need a job offer from a UK employer who holds a valid sponsor licence. The employer will issue you a Certificate of Sponsorship (CoS) with details of the role and salary.",
      "The job must be at a minimum skill level of RQF 3 (A-level equivalent) and appear on the list of eligible occupations. Most professional, managerial, and technical roles qualify.",
      "Since April 2024, the general salary threshold is £38,700 per year (or the going rate for the specific occupation, whichever is higher). Reduced thresholds apply for shortage occupations, new entrants, and some other categories.",
      "You can work for your sponsor, do voluntary work, and travel in and out of the UK. You can bring your partner and children as dependants.",
      "After 5 continuous years on a Skilled Worker visa, you can apply for Indefinite Leave to Remain (settlement) if you meet salary and other requirements.",
      "The visa replaced the old Tier 2 (General) work visa in December 2020 as part of the UK's new points-based immigration system.",
      "You must score at least 70 points to qualify: 50 points for mandatory requirements (job offer, sponsor licence, appropriate skill level) and 20 points for tradeable requirements (salary, English language, education).",
    ],
    eligibility: [
      { label: "Job offer from licensed sponsor", detail: "The employer must hold a valid Skilled Worker sponsor licence. You can check the register of licensed sponsors on gov.uk. The job must be genuine and not created to facilitate your immigration. Example: Software Developer at Tech Corp Ltd, which holds a valid sponsor licence.", mandatory: true },
      { label: "Certificate of Sponsorship (CoS)", detail: "Your employer assigns you a CoS — a virtual document with a unique reference number. It contains details of the job, salary, working hours, and SOC code. There are two types: Defined CoS (for applicants outside the UK) and Undefined CoS (for switching within the UK). Example: CoS reference number starts with 'Z' followed by 8 digits.", mandatory: true },
      { label: "Salary requirement", detail: "General threshold: £38,700/year or the going rate for the occupation (whichever is higher). New entrants (under 26, recent graduates, postdoctoral positions): 70% of the going rate. Shortage occupation: reduced going rate applies. Health and education roles may have different thresholds. Example: For Software Engineers (SOC 2131), the going rate is £37,908, so you'd need £38,700 (higher of the two).", mandatory: true },
      { label: "English language (B1 level)", detail: "Equivalent to IELTS 4.0 in each component. You can prove this through a SELT test (IELTS for UKVI Life Skills), a degree taught in English, or nationality of a majority English-speaking country. Example: IELTS Life Skills B1 test score of 4.0 in speaking and listening, or a Bachelor's degree from a UK university.", mandatory: true },
      { label: "Maintenance funds", detail: "You must have at least £1,270 in your bank account for 28 consecutive days (unless your sponsor certifies maintenance on your CoS — known as 'A-rated sponsor' certification). Example: Bank statements showing £1,500 balance from January 1-28, 2024.", mandatory: true },
      { label: "Criminal record certificate", detail: "Required for certain roles, particularly in education, healthcare, and social care. Your employer or the Home Office will advise if this applies to your role. Example: If working as a teacher, you need certificates from all countries lived in for 12+ months in the last 10 years.", mandatory: false },
    ],
    applicationSteps: [
      { step: 1, title: "Secure a job offer", description: "Find an eligible role with a licensed sponsor employer. Use the gov.uk register to verify the employer holds a valid sponsor licence. Agree salary and terms. Example: Apply for Senior Developer position at FinTech company, confirm they have sponsor licence and salary meets £38,700 threshold.", duration: "Varies" },
      { step: 2, title: "Employer assigns CoS", description: "Your employer requests a CoS from UKVI. For applicants outside the UK, this is a 'Defined CoS' which must be allocated. Processing can take days to weeks. Example: Employer receives CoS reference Z12345678 with job details and salary information.", duration: "1–4 weeks" },
      { step: 3, title: "Apply online", description: "Complete the online application on gov.uk. Pay the visa fee and Immigration Health Surcharge. Select your biometrics appointment date. Example: Fill out form, pay £719 fee + £1,035 IHS, book appointment at VFS centre.", duration: "1–2 hours" },
      { step: 4, title: "Attend biometrics", description: "Visit the visa application centre to provide fingerprints and photograph. Bring all supporting documents. Example: Visit VFS Global centre with passport, CoS details, bank statements, English test certificate.", duration: "1 day" },
      { step: 5, title: "Receive decision", description: "Standard: 3–8 weeks. Priority: 5 working days (£500 extra). Super priority: next working day (£1,000 extra). If approved, you receive a 90-day vignette. Example: Decision received after 4 weeks, passport returned with visa vignette valid from June 1 to August 30, 2024.", duration: "3–8 weeks" },
      { step: 6, title: "Travel & collect BRP", description: "Travel to the UK within your vignette validity. Collect your BRP from the designated post office within 10 days of arrival. Example: Arrive July 15, collect BRP from designated Post Office on July 18.", duration: "Within 90 days" },
    ],
    fees: [
      { item: "Visa application fee (up to 3 years)", amount: "£719", note: "For stays of 3 years or less. Example: 2-year visa contract = £719" },
      { item: "Visa application fee (over 3 years)", amount: "£1,420", note: "For stays of more than 3 years. Example: 5-year visa contract = £1,420" },
      { item: "Immigration Health Surcharge", amount: "£1,035 per year", note: "Covers full NHS access. Example: 3-year visa = £3,105 total IHS" },
      { item: "Priority processing (optional)", amount: "£500", note: "Decision within 5 working days instead of 3-8 weeks" },
      { item: "Super priority (optional)", amount: "£1,000", note: "Decision next working day where available" },
      { item: "Certificate of Sponsorship", amount: "Paid by employer", note: "Employer pays £239 per CoS - not charged to employee" },
      { item: "Immigration Skills Charge", amount: "£364–£1,000/year", note: "Paid by employer: £364 for small/charitable sponsors, £1,000 for medium/large sponsors" },
    ],
    totalEstimatedCost: "£1,754 – £3,455 (visa + IHS for applicant only)",
    documents: [
      { name: "Valid passport", detail: "Must be valid for the duration of your planned stay. Example: Passport valid until December 2025 for a 3-year visa starting July 2024." },
      { name: "Certificate of Sponsorship reference number", detail: "Provided by your employer. Contains your job details, salary, and SOC code. Example: CoS number Z12345678 from your employer's sponsor licence." },
      { name: "English language evidence", detail: "IELTS Life Skills B1, or degree certificate from an English-taught programme, or passport from a majority English-speaking country. Example: IELTS Life Skills B1 certificate with TRN 1234567890." },
      { name: "Bank statements", detail: "Showing at least £1,270 held for 28 consecutive days (unless sponsor certifies maintenance). Example: Statements from HSBC showing £2,000 balance from January 1-28, 2024." },
      { name: "Criminal record certificate", detail: "If applying for work in healthcare, education, or social care. Must be from every country you've lived in for 12+ months in the last 10 years. Example: Police clearance certificate from India if lived there for 2 years in 2015-2017." },
      { name: "TB test certificate", detail: "Required for nationals of listed countries. Example: TB test certificate from approved clinic in India, valid for 6 months from test date." },
    ],
    importantNotes: [
      "You cannot switch employers without applying for a new visa with a new CoS from your new employer. Example: If you want to move from Company A to Company B, Company B must issue a new CoS and you must apply again.",
      "The salary must meet both the general threshold AND the going rate for your specific occupation SOC code. Example: For Software Engineers, you need at least £38,700 (general) AND £37,908 (going rate) = £38,700 required.",
      "Since April 2024, the minimum salary threshold increased from £26,200 to £38,700. Check the latest rates on gov.uk. Example: A job offer at £35,000 would no longer qualify under the new rules.",
      "You can do supplementary employment (up to 20 hours/week) in the same SOC code as your main job, or in a shortage occupation, without additional sponsorship. Example: A Software Engineer can do freelance coding projects up to 20 hours/week.",
      "Time spent on a Skilled Worker visa counts towards the 5-year qualifying period for ILR (settlement). Example: After 5 years continuous residence, you can apply for permanent residence.",
      "If you lose your job, you have 60 days to find a new sponsor or leave the UK. Your employer must report the job ending to the Home Office within 10 working days.",
      "You can bring dependants (partner and children under 18) if your job pays at least £38,700 or meets the going rate for your occupation, whichever is higher.",
    ],
    officialLink: "https://www.gov.uk/skilled-worker-visa",
    officialResources: [
      {
        title: "Register of Licensed Sponsors",
        url: "https://www.gov.uk/government/publications/register-of-licensed-sponsors-workers",
        description: "Official list of UK employers with valid sponsor licences. Search by company name, location, or industry."
      },
      {
        title: "SOC Code Occupation Tables",
        url: "https://www.gov.uk/government/publications/soc-code-occupation-tables",
        description: "Standard Occupational Classification codes with corresponding going rates for each occupation."
      },
      {
        title: "Immigration Health Surcharge Calculator",
        url: "https://www.gov.uk/immigration-health-surcharge",
        description: "Calculate your IHS payment based on visa duration and dependants."
      },
      {
        title: "UKVI Application Centres",
        url: "https://www.gov.uk/find-a-uk-visa-application-centre",
        description: "Locate your nearest visa application centre for biometrics and document submission."
      },
      {
        title: "Points-Based System Overview",
        url: "https://www.gov.uk/guidance/points-based-immigration-system",
        description: "Complete guide to the UK's points-based immigration system and how points are calculated."
      },
      {
        title: "Visa Processing Times",
        url: "https://www.gov.uk/government/publications/visa-processing-times-applications-outside-the-uk",
        description: "Current visa processing times for applications made from outside the UK."
      }
    ],
    faqs: [
      { q: "Can I change jobs on a Skilled Worker visa?", a: "Yes, but you must apply for a new visa with a new CoS from your new employer before you start working for them. You cannot work for the new employer until the new visa is approved. Example: If you want to move from TechCo to FinanceCorp, FinanceCorp must provide a new CoS and you must submit a fresh visa application." },
      { q: "What is the Immigration Skills Charge?", a: "This is a fee paid by your employer — not you. It is £364/year for small or charitable employers, or £1,000/year for medium and large employers. Example: For a 3-year contract with a medium-sized company, your employer pays £3,000 in Skills Charge." },
      { q: "Can I apply for permanent residence?", a: "Yes. After 5 continuous years on a Skilled Worker visa, you can apply for Indefinite Leave to Remain (ILR). You must meet the salary requirement and pass the Life in the UK test. Example: Arrive July 2024, apply for ILR in July 2029 if you meet all requirements." },
      { q: "What if I lose my job?", a: "If your employment ends, your employer must report it to the Home Office. You typically have 60 days (or until your visa expires, whichever is shorter) to find a new sponsor or leave the UK. Example: If your job ends on May 1, you have until July 1 to find a new sponsored role." },
      { q: "What occupations are eligible?", a: "Jobs at RQF level 3 or above (A-level equivalent) that appear on the eligible occupations list. Examples: Software developers, engineers, doctors, teachers, accountants, managers, chefs (in certain establishments), and many other professional roles." },
      { q: "Can my family join me?", a: "Yes, your partner and children under 18 can apply as dependants if your job meets the salary threshold. Each dependant pays their own visa fee (£719 for up to 3 years) and IHS (£776 per year)." },
      { q: "What is the going rate for my occupation?", a: "The going rate varies by occupation and is set by the Home Office. For example: Software Engineer £37,908, Mechanical Engineer £28,500, Marketing Manager £31,500. Check the official SOC code tables on gov.uk for your specific role." },
    ],
    gallery: [
      { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=500&fit=crop&auto=format", caption: "Modern UK office spaces" },
      { url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=500&fit=crop&auto=format", caption: "Collaborative work culture" },
      { url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=500&fit=crop&auto=format", caption: "London — a global business hub" },
      { url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=500&fit=crop&auto=format", caption: "Skilled professionals across industries" },
    ],
    videos: [
      { title: "Skilled Worker Visa Explained", description: "Eligibility, salary thresholds, and sponsorship.", youtubeId: "wWJ1lJXX-Yk" },
      { title: "Working in the UK as a Foreigner", description: "What life on a Skilled Worker visa really looks like.", youtubeId: "bgCZWY8e9KE" },
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
    comprehensiveOverview: "Indefinite Leave to Remain (ILR) is the ultimate goal for most long-term migrants to the UK, representing permanent residence status. This grants you the right to live, work, and study in the UK without any immigration restrictions or time limits. ILR is the final step before you can apply for British citizenship, which you can do after holding ILR for 12 months. To qualify, you typically need 5 continuous years of residence on a qualifying visa such as Skilled Worker, Health and Care Worker, or other work visas. Key benefits include unrestricted access to the job market, eligibility for public funds and benefits, no visa renewal requirements, and the ability to travel freely in and out of the UK. However, ILR can be lost if you spend more than 2 continuous years outside the UK or if obtained through deception. The application requires passing the Life in the UK test and proving English language proficiency at B1 level, along with demonstrating good character and meeting salary requirements if coming from a work visa route.",
    overview: [
      "ILR removes all conditions on your stay. You can work without restriction, access public funds, and live in the UK permanently.",
      "To apply, you must have completed a continuous qualifying period on an eligible visa — typically 5 years on a work visa (Skilled Worker, Health and Care Worker, Innovator, etc.).",
      "You must meet the knowledge of language and life requirement by passing the Life in the UK test and proving English at B1 level.",
      "Once you have ILR, you can apply for British citizenship after 12 months, provided you meet the residence and other requirements.",
      "ILR is granted via a Biometric Residence Permit (BRP) or digital status. It does not expire, but you must not be absent from the UK for more than 2 continuous years or it may be revoked.",
    ],
    eligibility: [
      { label: "5 years continuous residence", detail: "You must have lived in the UK continuously for 5 years on a qualifying visa. Absences of up to 180 days per 12-month period are allowed. Longer absences may break your continuous residence unless there are exceptional circumstances. Example: Arrived July 2019 on Skilled Worker visa, apply for ILR in July 2024 with no absences over 180 days in any year.", mandatory: true },
      { label: "Current qualifying visa", detail: "You must hold a valid visa that leads to settlement (Skilled Worker, Health and Care Worker, Global Talent, Innovator Founder, etc.). Not all visa types lead to ILR — for example, Student visas do not. Example: Currently on Skilled Worker visa as Senior Software Developer.", mandatory: true },
      { label: "Life in the UK test", detail: "A 24-question multiple-choice test about British history, culture, traditions, and the UK political system. You need 75% (18/24) to pass. The test costs £50 and can be taken at over 30 centres across the UK. You can retake it as many times as needed. Example: Test passed on June 15, 2024, with score of 20/24.", mandatory: true },
      { label: "English language B1", detail: "CEFR B1 level — equivalent to IELTS 4.0 in speaking and listening. Can be proven through IELTS Life Skills B1, a degree taught or researched in English, or nationality of a majority English-speaking country. Example: IELTS Life Skills B1 certificate with 4.5 in speaking and listening.", mandatory: true },
      { label: "Salary requirement", detail: "For Skilled Worker route: your current salary must meet the applicable threshold (£38,700 or the going rate for your occupation). Some concessions exist for Health and Care workers and certain other categories. Example: Software Engineer earning £45,000/year exceeds the £38,700 threshold.", mandatory: true },
      { label: "Good character", detail: "No unspent criminal convictions. No breaches of immigration law. No involvement in war crimes, terrorism, or other serious offences. Repeated minor offences (such as traffic violations) may also affect your application. Example: Clean criminal record, no immigration violations.", mandatory: true },
    ],
    applicationSteps: [
      { step: 1, title: "Check your eligibility", description: "Verify you have completed 5 years continuous residence on a qualifying visa. Check your absence history — you must not have exceeded 180 days in any 12-month period. Example: Review travel records from July 2019 to July 2024, confirm all absences under 180 days.", duration: "Self-assessment" },
      { step: 2, title: "Pass the Life in the UK test", description: "Book and pass the test at an approved centre. It covers British values, history, traditions, and everyday life. Study using the official handbook 'Life in the United Kingdom: A Guide for New Residents'. Example: Book test for June 15, study 4 weeks, pass with 20/24.", duration: "2–8 weeks preparation" },
      { step: 3, title: "Prove English language", description: "Take IELTS Life Skills B1 (speaking and listening only), or submit evidence of an English-taught degree, or prove you are a national of a majority English-speaking country. Example: Take IELTS Life Skills B1 test on July 1, receive results July 8.", duration: "1–2 weeks" },
      { step: 4, title: "Gather documents", description: "Compile 5 years of evidence: payslips, P60s, tax returns, BRPs for all previous visas, employer letters, absence records. Example: Collect 60 monthly payslips, 5 P60s, 5 tax returns, all BRP cards.", duration: "2–4 weeks" },
      { step: 5, title: "Apply online and pay", description: "Submit the online application on gov.uk. Pay the fee (£2,885). Book a biometrics appointment at a UKVCAS centre. Example: Complete application July 20, pay fee, book appointment for July 25.", duration: "1–2 hours" },
      { step: 6, title: "Biometrics & document submission", description: "Attend your appointment. You can use the UK Immigration: ID Check app to submit biometrics from your phone if you have a chipped passport. Example: Attend UKVCAS centre Manchester, submit fingerprints and documents.", duration: "1 day" },
      { step: 7, title: "Wait for decision", description: "Standard processing: up to 6 months. Super priority (1 working day): £800 extra, appointment at a premium centre. Example: Decision received January 15, ILR granted.", duration: "Up to 6 months" },
    ],
    fees: [
      { item: "ILR application fee", amount: "£2,885", note: "Per applicant. Example: Paid during online application" },
      { item: "Super priority service (optional)", amount: "£800", note: "Decision within 1 working day. Example: Pay extra for decision by next day" },
      { item: "Life in the UK test", amount: "£50", note: "Can retake multiple times. Example: Paid at test centre booking" },
      { item: "IELTS Life Skills B1 (if needed)", amount: "£150", note: "Speaking and listening test only. Example: Paid when booking test" },
      { item: "Biometrics enrolment", amount: "Included", note: "Part of application fee" },
    ],
    totalEstimatedCost: "£2,935 – £3,885 (per applicant)",
    documents: [
      { name: "Current BRP", detail: "Your current Biometric Residence Permit or digital immigration status evidence. Example: BRP card expiring December 2024." },
      { name: "Valid passport", detail: "Current passport plus any expired passports covering the 5-year qualifying period. Example: Current passport issued 2020, old passport 2015-2020." },
      { name: "Life in the UK test pass certificate", detail: "The unique reference number from your pass notification. Example: Test pass certificate with reference LITUK123456789." },
      { name: "English language evidence", detail: "IELTS Life Skills B1 certificate, or qualifying degree certificate, or passport from English-speaking country. Example: IELTS Life Skills B1 certificate dated July 2024." },
      { name: "Employment evidence", detail: "P60s for each tax year, payslips (at least 6 months of recent payslips), employment contracts, employer letters confirming salary and role. Example: 5 P60s (2019-2024), 12 recent payslips, employment contract." },
      { name: "Absence record", detail: "A full record of all trips outside the UK during the 5-year period, including dates and destinations. Example: Holiday to Spain July 2023 (10 days), business trip to USA March 2022 (5 days)." },
      { name: "Criminal record declaration", detail: "You must declare any criminal convictions anywhere in the world. Example: Declaration form confirming no criminal convictions." },
    ],
    importantNotes: [
      "If you leave the UK for more than 2 continuous years after getting ILR, your ILR will lapse. You would need to apply for a Returning Resident visa. Example: Move to Australia for 3 years, ILR lapses, need Returning Resident visa.",
      "ILR gives you access to public funds (benefits, housing support, etc.) that were previously restricted. Example: Eligible for unemployment benefits, housing assistance, NHS services.",
      "After 12 months with ILR, you can apply for British citizenship (naturalisation) — fee is £1,580. Example: Get ILR July 2024, apply for citizenship July 2025.",
      "Your dependants (partner and children) can apply for ILR at the same time if they have also completed 5 years. Example: Spouse and children apply together as family application.",
      "If your application is refused, you have a right of appeal in most circumstances. Example: Refused due to absence over 180 days, can appeal to First-tier Tribunal.",
      "Keep all documents and evidence for at least 6 years after ILR, as they may be needed for citizenship application. Example: Store payslips, P60s, and tax records safely.",
    ],
    officialLink: "https://www.gov.uk/indefinite-leave-to-remain",
    officialResources: [
      {
        title: "Life in the UK Test Booking",
        url: "https://www.gov.uk/life-in-the-uk-test",
        description: "Book and prepare for the Life in the UK test, including practice questions and test locations."
      },
      {
        title: "ILR Application Guide",
        url: "https://www.gov.uk/indefinite-leave-to-remain",
        description: "Complete guide to ILR requirements, application process, and eligibility."
      },
      {
        title: "ILR Eligibility Guide",
        url: "https://www.gov.uk/indefinite-leave-to-remain/eligibility",
        description: "Guide to check if you qualify for Indefinite Leave to Remain."
      },
      {
        title: "British Citizenship Application",
        url: "https://www.gov.uk/apply-for-citizenship",
        description: "Information about applying for British citizenship after holding ILR for 12 months."
      },
      {
        title: "ILR Application Fees",
        url: "https://www.gov.uk/indefinite-leave-to-remain/fees",
        description: "Current fees for Indefinite Leave to Remain application."
      }
    ],
    faqs: [
      { q: "Can I apply for citizenship after ILR?", a: "Yes. You can apply for British citizenship (naturalisation) 12 months after receiving ILR. You must meet residence requirements and pass the Life in the UK test (if not already passed). The fee is £1,580." },
      { q: "What if I fail the Life in the UK test?", a: "You can retake it as many times as needed. Each attempt costs £50. You must pass before submitting your ILR application." },
      { q: "Does my ILR expire?", a: "No, ILR does not expire. However, it can lapse if you spend more than 2 continuous years outside the UK. It can also be revoked if you obtained it through deception." },
      { q: "Can my employer help with ILR?", a: "Your employer does not need to sponsor your ILR application, but they will need to provide employment evidence (letters, payslips, P60s) to support it." },
    ],
    gallery: [
      { url: "https://images.unsplash.com/photo-1568827999250-3f6afff96e66?w=800&h=500&fit=crop&auto=format", caption: "Settling down in the UK" },
      { url: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=800&h=500&fit=crop&auto=format", caption: "Buying a home as a permanent resident" },
      { url: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800&h=500&fit=crop&auto=format", caption: "Family life in British towns" },
      { url: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&h=500&fit=crop&auto=format", caption: "Towards British citizenship" },
    ],
    videos: [
      { title: "Indefinite Leave to Remain — Full Guide", description: "Step-by-step guide to applying for ILR.", youtubeId: "8B0wO-azk8s" },
      { title: "Life in the UK Test — What to Expect", description: "Tips and sample questions for the mandatory test.", youtubeId: "vu9Cxk0_2sM" },
    ],
  },

  tourist: {
    id: "tourist",
    name: "Standard Visitor Visa",
    officialName: "Standard Visitor visa — for tourism, business, study (up to 6 months), and medical treatment",
    icon: "",
    summary: "The Standard Visitor visa allows you to visit the UK for up to 6 months for tourism, visiting family or friends, attending business meetings, or short courses of study.",
    processingTime: "3 weeks (standard), 5 working days (priority)",
    validityPeriod: "6 months (single/multiple entry), 2/5/10-year long-term options available",
    comprehensiveOverview: "The Standard Visitor visa is designed for short-term visits to the UK for various purposes including tourism, business meetings, academic conferences, private medical treatment, and short-term study (up to 6 months). This visa is ideal for tourists exploring the UK's rich heritage, business professionals attending meetings or conferences, individuals visiting family and friends, or students undertaking short courses. The visa typically allows stays of up to 6 months per visit, with options for long-term visas (2, 5, or 10 years) that permit multiple entries but still restrict each visit to 6 months maximum. Many nationalities are visa-exempt for short visits, but others require this visa. Importantly, you cannot work (paid or unpaid), access public funds, or study long-term courses on this visa. The application process is relatively straightforward, but you must demonstrate genuine visitor intent, sufficient funds, and strong ties to your home country to ensure you'll return after your visit.",
    overview: [
      "The Standard Visitor visa covers most short visits to the UK: tourism, visiting family, attending conferences, business meetings, receiving private medical treatment, and short courses of up to 6 months.",
      "You cannot work (paid or unpaid) in the UK on this visa. However, you can attend business meetings, conferences, and sign deals.",
      "You cannot study a course longer than 6 months. For longer courses, you need a Student visa.",
      "Some nationalities do not need a visa for visits of up to 6 months (e.g., EU/EEA citizens, US, Canadian, Australian nationals). Check if you need a visa on gov.uk.",
      "Long-term visit visas (2, 5, or 10 years) allow multiple visits but each stay must not exceed 6 months. You cannot live in the UK by making repeated short visits.",
    ],
    eligibility: [
      { label: "Valid passport", detail: "Must be valid for the duration of your planned stay. Example: Passport valid until December 2024 for visit in July 2024.", mandatory: true },
      { label: "Genuine visitor intent", detail: "You must intend to leave the UK at the end of your visit. You must not intend to live in the UK through repeated visits. Immigration officers may ask about your plans. Example: Clear itinerary showing 2-week tourism plan and return to home country.", mandatory: true },
      { label: "Sufficient funds", detail: "You must be able to support yourself (and any dependants) during your stay without accessing public funds. Bank statements, payslips, or sponsor letters are accepted. Example: Bank statements showing £3,000 balance for 2-week visit.", mandatory: true },
      { label: "Return/onward ticket", detail: "Evidence of a booked return flight or onward travel is strongly recommended, though not always mandatory. Example: Return flight booking from New York to London, returning July 15.", mandatory: false },
      { label: "Accommodation arrangements", detail: "Proof of where you will stay — hotel booking, or invitation letter from the person you are visiting with their address and immigration status. Example: Hotel confirmation from Hilton London or invitation letter from sister with her address.", mandatory: true },
      { label: "Ties to home country", detail: "Evidence that you have reason to return: employment, property ownership, family responsibilities, ongoing education. Example: Letter from employer confirming return to work July 16, property ownership deed.", mandatory: true },
    ],
    applicationSteps: [
      { step: 1, title: "Check if you need a visa", description: "Some nationalities are visa-exempt for visits up to 6 months. Check on gov.uk using the 'Check if you need a UK visa' tool. Example: Indian citizen needs visa, US citizen does not.", duration: "5 minutes" },
      { step: 2, title: "Complete online application", description: "Fill in the online application form on gov.uk. Answer questions about your travel history, purpose of visit, financial situation, and accommodation plans. Example: Complete form detailing 2-week London trip for tourism.", duration: "30–60 minutes" },
      { step: 3, title: "Pay the fee", description: "Pay the visa fee online. Standard 6-month visa: £115. Longer-term visas cost more. Example: Pay £115 for 6-month multiple-entry visa.", duration: "5 minutes" },
      { step: 4, title: "Book and attend biometrics", description: "Book an appointment at your nearest visa application centre (VFS Global or TLScontact). Provide fingerprints and a photo. Submit your passport and documents. Example: Book VFS appointment for June 20, bring passport and documents.", duration: "1 day" },
      { step: 5, title: "Receive decision", description: "Standard processing: 3 weeks. Priority (5 working days): £500 extra. Your passport will be returned with the visa vignette if approved. Example: Decision received July 10, passport returned with visa.", duration: "3 weeks" },
    ],
    fees: [
      { item: "Standard Visitor visa (6 months)", amount: "£115", note: "Single or multiple entry. Example: For 2-week holiday in July" },
      { item: "Long-term visa (2 years)", amount: "£400", note: "Multiple entry, max 6 months per visit. Example: For regular business visits" },
      { item: "Long-term visa (5 years)", amount: "£771", note: "Multiple entry. Example: For annual family visits" },
      { item: "Long-term visa (10 years)", amount: "£963", note: "Multiple entry. Example: For frequent business travelers" },
      { item: "Priority processing (optional)", amount: "£500", note: "Decision within 5 working days. Example: Pay extra for urgent travel" },
      { item: "Super priority (optional)", amount: "£1,000", note: "Decision next working day. Example: Emergency travel next day" },
    ],
    totalEstimatedCost: "£115 – £1,963 (depending on visa duration and priority)",
    documents: [
      { name: "Valid passport", detail: "Must have at least one blank page. Bring old passports showing previous travel history. Example: Passport with 2 blank pages, old passport with previous UK visits." },
      { name: "Financial evidence", detail: "Last 6 months of bank statements. Payslips or employment letter showing salary. If someone else is paying for your trip, their financial evidence plus a sponsor letter. Example: 6 months statements showing average £5,000 balance." },
      { name: "Accommodation proof", detail: "Hotel booking confirmation, or invitation letter from host in the UK including their full address, contact details, and immigration status. Example: Hilton London confirmation or invitation letter from sister." },
      { name: "Travel itinerary", detail: "Flight booking (return trip recommended), and a brief outline of planned activities during your visit. Example: Flight NY-London return July 1-15, itinerary showing London, Edinburgh, Bath." },
      { name: "Employment/study proof", detail: "Letter from employer confirming your role, salary, and approved leave dates. Or university enrolment letter if you are a student. Example: Employer letter confirming 2-week approved leave July 1-15." },
      { name: "Invitation letter (if visiting someone)", detail: "From the person inviting you, stating your relationship, their address, their immigration status, and how long you plan to stay. Example: Sister's invitation letter with her ILR status copy." },
    ],
    importantNotes: [
      "You cannot work (paid or unpaid), access public funds, or register with a GP for NHS treatment (except emergencies). Example: Cannot take job at UK restaurant during visit.",
      "You can receive private medical treatment, but you must declare this in your application and show you can pay for it. Example: Private surgery at Harley Street clinic.",
      "If you are refused entry at the UK border, you may be returned to your home country on the next available flight. Example: Border officer doubts visitor intent, denied entry.",
      "Making repeated short visits that amount to 'living' in the UK can lead to refusal of entry or future visa applications. Example: 6 visits of 5 months each in 2 years.",
      "If you overstay your visa even by 1 day, it can affect future UK visa applications for up to 10 years. Example: Stay until July 16 instead of leaving July 15.",
      "Some visitors may need to register with the police within 7 days of arrival if required by their nationality. Example: Certain nationalities must register at local police station.",
    ],
    officialLink: "https://www.gov.uk/standard-visitor",
    officialResources: [
      {
        title: "Check if You Need a UK Visa",
        url: "https://www.gov.uk/check-uk-visa",
        description: "Official tool to check if you need a visa based on your nationality and purpose of visit."
      },
      {
        title: "Standard Visitor Visa Guide",
        url: "https://www.gov.uk/standard-visitor-visa",
        description: "Complete guide to visitor visa requirements, application process, and rules."
      },
      {
        title: "UKVI Application Centres",
        url: "https://www.gov.uk/find-a-uk-visa-application-centre",
        description: "Locate your nearest visa application centre for biometrics and document submission."
      },
      {
        title: "UK Visa Processing Times",
        url: "https://www.gov.uk/guidance/visa-decision-waiting-times-applications-outside-the-uk",
        description: "Current processing times for UK visa applications from different countries."
      },
      {
        title: "Visit Britain Guide",
        url: "https://www.visitbritain.com/",
        description: "Official tourism website with information about visiting the UK."
      },
      {
        title: "Visitor Visa Fees",
        url: "https://www.gov.uk/standard-visitor-visa/fees",
        description: "Current fees for Standard Visitor visa applications."
      }
    ],
    faqs: [
      { q: "Can I extend my visit?", a: "In most cases, no. You must leave the UK before your visa expires. Extensions are only granted in exceptional circumstances (e.g., medical emergency)." },
      { q: "Can I study on a Visitor visa?", a: "You can take a short course of study (up to 6 months) or a recreational course. You cannot study at a state-funded school or enrol in a course longer than 6 months." },
      { q: "Do I need travel insurance?", a: "It is not mandatory but strongly recommended. The NHS may charge for treatment, and having insurance shows you are prepared." },
      { q: "Can I attend a job interview?", a: "Yes. You can attend interviews and meetings, but you cannot start working until you have the appropriate work visa." },
    ],
    gallery: [
      { url: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=500&fit=crop&auto=format", caption: "Big Ben and Westminster" },
      { url: "https://images.unsplash.com/photo-1520986606214-8b456906c813?w=800&h=500&fit=crop&auto=format", caption: "Tower Bridge by sunset" },
      { url: "https://images.unsplash.com/photo-1543832923-44667a44c804?w=800&h=500&fit=crop&auto=format", caption: "Edinburgh's historic Royal Mile" },
      { url: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800&h=500&fit=crop&auto=format", caption: "Countryside escapes across Britain" },
    ],
    videos: [
      { title: "UK Visitor Visa — Application Walkthrough", description: "How to apply for a Standard Visitor visa.", youtubeId: "S7qFc3fW0Cw" },
      { title: "Top 10 Things To Do in the UK", description: "Plan an unforgettable visit to Britain.", youtubeId: "pCRR5GvJjkA" },
    ],
  },
};
