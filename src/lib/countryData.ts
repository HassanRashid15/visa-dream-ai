export type VisaType = "study" | "work" | "pr" | "tourist";

export interface University {
  name: string;
  location: string;
  ranking: string;
  tuitionRange: string;
  popularCourses: string[];
}

export interface VisaTypeInfo {
  id: VisaType;
  name: string;
  icon: string;
  description: string;
  processingTime: string;
  cost: string;
  requirements: string[];
  documents: string[];
}

export interface CostBreakdown {
  tuitionPerYear: string;
  livingCostPerMonth: string;
  visaFee: string;
  healthInsurance: string;
  totalEstimatedFirst: string;
}

export interface CountryDetail {
  id: string;
  name: string;
  flag: string;
  tagline: string;
  description: string;
  currency: string;
  language: string;
  capital: string;
  heroImage: string;
  galleryImages: string[];
  visaTypes: VisaTypeInfo[];
  universities: University[];
  costs: CostBreakdown;
  highlights: string[];
}

export const COUNTRY_DETAILS: Record<string, CountryDetail> = {
  canada: {
    id: "canada",
    name: "Canada",
    flag: "🇨🇦",
    tagline: "Land of Opportunity & Quality Education",
    heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&auto=format",
    galleryImages: [
      "https://images.unsplash.com/photo-1531251445707-1f6e5c4b5c99?w=400&h=300&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop&auto=format"
    ],
    description: "Canada offers world-class education, post-graduation work permits, and clear pathways to permanent residency. Consistently ranked among the best countries for quality of life.",
    currency: "CAD",
    language: "English / French",
    capital: "Ottawa",
    highlights: [
      "Post-Graduation Work Permit (PGWP) up to 3 years",
      "Pathway to Permanent Residency via Express Entry",
      "Work up to 20 hours/week during studies",
      "Free healthcare in most provinces for students",
    ],
    visaTypes: [
      {
        id: "study",
        name: "Study Permit",
        icon: "📚",
        description: "For international students enrolling in designated learning institutions (DLIs) in Canada.",
        processingTime: "8–16 weeks",
        cost: "CAD $150 (application fee)",
        requirements: [
          "Acceptance letter from a DLI",
          "Proof of financial support (CAD $10,000/year + tuition)",
          "IELTS 6.0+ overall (6.0 each band for most programs)",
          "Clean criminal record",
          "Medical examination",
        ],
        documents: [
          "Valid passport",
          "Letter of acceptance from DLI",
          "Proof of funds (bank statements, GIC)",
          "IELTS/TOEFL score report",
          "Statement of Purpose (SOP)",
          "Academic transcripts & certificates",
          "2 passport-sized photos",
          "Medical exam results",
          "Police clearance certificate",
        ],
      },
      {
        id: "work",
        name: "Skilled Worker Visa",
        icon: "💼",
        description: "For skilled workers through Express Entry (Federal Skilled Worker Program).",
        processingTime: "6–8 months",
        cost: "CAD $1,365 (processing + RPRF)",
        requirements: [
          "CRS score 470+ (competitive)",
          "IELTS CLB 7+ in each band",
          "1+ year skilled work experience",
          "Education credential assessment (ECA)",
          "Proof of settlement funds",
        ],
        documents: [
          "Valid passport",
          "IELTS score report",
          "Education Credential Assessment (ECA)",
          "Reference letters from employers",
          "Proof of funds",
          "Police clearance certificates",
          "Medical examination results",
          "Digital photo",
        ],
      },
      {
        id: "pr",
        name: "Permanent Residency",
        icon: "🏡",
        description: "Apply through Express Entry, Provincial Nominee Programs (PNP), or Canadian Experience Class.",
        processingTime: "6–12 months",
        cost: "CAD $1,365 (processing + RPRF)",
        requirements: [
          "Meet Express Entry criteria or PNP nomination",
          "IELTS CLB 7+ recommended",
          "Skilled work experience",
          "Education credential assessment",
          "Settlement funds (CAD $13,000+ for single applicant)",
        ],
        documents: [
          "Valid passport",
          "IELTS/CELPIP score report",
          "ECA report",
          "Employment reference letters",
          "Proof of funds",
          "Police clearance from all countries lived 6+ months",
          "Medical exam results",
          "Birth certificate",
          "Marriage certificate (if applicable)",
        ],
      },
      {
        id: "tourist",
        name: "Visitor Visa",
        icon: "✈️",
        description: "Temporary resident visa for tourism, visiting family, or short business trips.",
        processingTime: "2–4 weeks",
        cost: "CAD $100",
        requirements: [
          "Valid passport",
          "Sufficient funds for stay",
          "Ties to home country",
          "No criminal record",
          "Good health",
        ],
        documents: [
          "Valid passport",
          "Proof of funds",
          "Travel itinerary",
          "Invitation letter (if visiting family)",
          "Employment letter",
          "Bank statements (last 6 months)",
          "Passport-sized photos",
        ],
      },
    ],
    universities: [
      { name: "University of Toronto", location: "Toronto, ON", ranking: "#21 World", tuitionRange: "CAD $45,000–$65,000/year", popularCourses: ["Computer Science", "Engineering", "Business", "Medicine"] },
      { name: "University of British Columbia", location: "Vancouver, BC", ranking: "#34 World", tuitionRange: "CAD $40,000–$55,000/year", popularCourses: ["Data Science", "Environmental Science", "Arts", "Forestry"] },
      { name: "McGill University", location: "Montreal, QC", ranking: "#30 World", tuitionRange: "CAD $20,000–$50,000/year", popularCourses: ["Medicine", "Law", "Engineering", "Music"] },
      { name: "University of Alberta", location: "Edmonton, AB", ranking: "#110 World", tuitionRange: "CAD $25,000–$40,000/year", popularCourses: ["AI & Machine Learning", "Engineering", "Nursing", "Business"] },
      { name: "University of Waterloo", location: "Waterloo, ON", ranking: "#154 World", tuitionRange: "CAD $40,000–$58,000/year", popularCourses: ["Computer Science", "Engineering", "Mathematics", "Co-op Programs"] },
    ],
    costs: {
      tuitionPerYear: "CAD $20,000 – $65,000",
      livingCostPerMonth: "CAD $1,000 – $2,000",
      visaFee: "CAD $150",
      healthInsurance: "Included in most provinces",
      totalEstimatedFirst: "CAD $35,000 – $80,000",
    },
  },
  uk: {
    id: "uk",
    name: "United Kingdom",
    flag: "🇬🇧",
    tagline: "World-Class Education with Rich Heritage",
    heroImage: "https://images.unsplash.com/photo-1513635264979-4d1c000c4d12?w=1920&h=1080&fit=crop&auto=format",
    galleryImages: [
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=400&h=300&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=400&h=300&fit=crop&auto=format"
    ],
    description: "The UK is home to some of the world's oldest and most prestigious universities. With shorter degree programs and the Graduate Route visa, it's an attractive destination for ambitious students.",
    currency: "GBP",
    language: "English",
    capital: "London",
    highlights: [
      "1-year Master's programs (save time & money)",
      "Graduate Route: 2-year post-study work visa",
      "Work up to 20 hours/week during term",
      "NHS healthcare access for students",
    ],
    visaTypes: [
      {
        id: "study",
        name: "Student Visa (Tier 4)",
        icon: "📚",
        description: "For international students accepted to a licensed UK institution on the Student Route.",
        processingTime: "3–6 weeks",
        cost: "£490 + IHS surcharge (£776/year)",
        requirements: [
          "CAS (Confirmation of Acceptance for Studies)",
          "IELTS 6.0–7.0 depending on course",
          "Proof of funds (tuition + £1,023/month living for London)",
          "TB test certificate (if applicable)",
          "English language proficiency",
        ],
        documents: [
          "Valid passport",
          "CAS reference number",
          "Proof of funds (28-day bank statements)",
          "IELTS/PTE/TOEFL score",
          "Academic certificates & transcripts",
          "TB test results (from certain countries)",
          "Passport-sized photos (biometric)",
          "Consent letter (if under 18)",
        ],
      },
      {
        id: "work",
        name: "Skilled Worker Visa",
        icon: "💼",
        description: "For workers with a job offer from a UK employer with a valid sponsor licence.",
        processingTime: "3–8 weeks",
        cost: "£625–£1,423 + IHS",
        requirements: [
          "Job offer from a licensed sponsor",
          "Certificate of Sponsorship (CoS)",
          "Minimum salary threshold (£26,200 or going rate)",
          "English language B1 level",
          "Sufficient maintenance funds",
        ],
        documents: [
          "Valid passport",
          "Certificate of Sponsorship",
          "Proof of English language ability",
          "Bank statements",
          "Criminal record certificate",
          "TB test (if applicable)",
        ],
      },
      {
        id: "pr",
        name: "Indefinite Leave to Remain",
        icon: "🏡",
        description: "Settlement after 5 years of qualifying residence in the UK.",
        processingTime: "6–12 months",
        cost: "£2,885",
        requirements: [
          "5 years continuous residence on qualifying visa",
          "Life in the UK test pass",
          "English language B1",
          "No serious criminal convictions",
          "Meet salary requirements",
        ],
        documents: [
          "Valid passport",
          "BRP cards for previous visas",
          "Life in the UK test certificate",
          "English language certificate",
          "P60s / payslips for 5 years",
          "Employer letters",
        ],
      },
      {
        id: "tourist",
        name: "Standard Visitor Visa",
        icon: "✈️",
        description: "For tourism, visiting family, or attending business meetings (up to 6 months).",
        processingTime: "3 weeks",
        cost: "£115",
        requirements: [
          "Valid passport",
          "Proof of accommodation",
          "Sufficient funds",
          "Intent to leave the UK",
          "Travel history",
        ],
        documents: [
          "Valid passport",
          "Bank statements",
          "Accommodation booking",
          "Travel itinerary",
          "Employment/business proof",
          "Invitation letter (if applicable)",
        ],
      },
    ],
    universities: [
      { name: "University of Oxford", location: "Oxford", ranking: "#1 World", tuitionRange: "£28,000–£45,000/year", popularCourses: ["PPE", "Medicine", "Law", "Computer Science"] },
      { name: "University of Cambridge", location: "Cambridge", ranking: "#2 World", tuitionRange: "£24,000–£63,000/year", popularCourses: ["Engineering", "Natural Sciences", "Mathematics", "Economics"] },
      { name: "Imperial College London", location: "London", ranking: "#6 World", tuitionRange: "£35,000–£50,000/year", popularCourses: ["Engineering", "Medicine", "Business", "Computing"] },
      { name: "University College London", location: "London", ranking: "#9 World", tuitionRange: "£23,000–£40,000/year", popularCourses: ["Architecture", "Law", "Psychology", "Data Science"] },
      { name: "University of Manchester", location: "Manchester", ranking: "#32 World", tuitionRange: "£20,000–£30,000/year", popularCourses: ["Business", "Engineering", "Computer Science", "Pharmacy"] },
    ],
    costs: {
      tuitionPerYear: "£15,000 – £45,000",
      livingCostPerMonth: "£1,023 – £1,500 (London: higher)",
      visaFee: "£490 + IHS £776/year",
      healthInsurance: "NHS (via IHS surcharge)",
      totalEstimatedFirst: "£25,000 – £55,000",
    },
  },
  australia: {
    id: "australia",
    name: "Australia",
    flag: "",
    tagline: "Innovation, Sunshine & Global Recognition",
    heroImage: "https://images.unsplash.com/photo-1524492442969-5b2fb23b4e3b?w=1920&h=1080&fit=crop&auto=format",
    galleryImages: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1549180030-48bf059f10d8?w=400&h=300&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&auto=format"
    ],
    description: "Australia combines excellent education quality with incredible lifestyle. With generous post-study work rights and a strong economy, it's a top choice for international students and skilled migrants.",
    currency: "AUD",
    language: "English",
    capital: "Canberra",
    highlights: [
      "Post-Study Work Visa up to 4 years",
      "Work up to 48 hours/fortnight during studies",
      "High minimum wage (AUD $23.23/hr)",
      "Pathway to PR through skilled migration",
    ],
    visaTypes: [
      {
        id: "study",
        name: "Student Visa (Subclass 500)",
        icon: "📚",
        description: "For international students enrolling in registered courses at Australian institutions.",
        processingTime: "4–12 weeks",
        cost: "AUD $710",
        requirements: [
          "CoE (Confirmation of Enrolment)",
          "IELTS 6.0+ overall (5.5 each band minimum)",
          "Genuine Temporary Entrant (GTE) requirement",
          "Overseas Student Health Cover (OSHC)",
          "Sufficient funds (AUD $24,505/year living)",
        ],
        documents: [
          "Valid passport",
          "CoE from registered institution",
          "IELTS/PTE/TOEFL score report",
          "GTE statement",
          "Proof of funds",
          "OSHC policy",
          "Academic transcripts & certificates",
          "Police clearance certificates",
          "Medical examination results",
          "Passport photos",
        ],
      },
      {
        id: "work",
        name: "Skilled Worker Visa (Subclass 482)",
        icon: "💼",
        description: "Temporary Skill Shortage visa for workers nominated by an approved sponsor.",
        processingTime: "1–4 months",
        cost: "AUD $1,455–$2,645",
        requirements: [
          "Nomination by approved sponsor",
          "Occupation on skilled occupation list",
          "2+ years relevant work experience",
          "IELTS 5.0+ overall",
          "Skills assessment (for some occupations)",
        ],
        documents: [
          "Valid passport",
          "Skills assessment result",
          "IELTS/PTE score report",
          "Employment references",
          "Qualification certificates",
          "Police clearance",
          "Medical examination",
          "Sponsor nomination approval",
        ],
      },
      {
        id: "pr",
        name: "Permanent Residency (Subclass 189/190)",
        icon: "🏡",
        description: "Points-based skilled migration for permanent settlement in Australia.",
        processingTime: "6–18 months",
        cost: "AUD $4,640",
        requirements: [
          "65+ points on points test",
          "Occupation on skilled occupation list",
          "Skills assessment",
          "IELTS 6.0+ each band (CLB 7 equivalent)",
          "Under 45 years of age",
          "Health and character requirements",
        ],
        documents: [
          "Valid passport",
          "Skills assessment result",
          "IELTS/PTE score report",
          "Employment references (all past 10 years)",
          "Education certificates with transcripts",
          "Police clearance (all countries lived 12+ months)",
          "Medical examination results",
          "Birth certificate",
          "Evidence of Australian study (if applicable)",
        ],
      },
      {
        id: "tourist",
        name: "Visitor Visa (Subclass 600)",
        icon: "✈️",
        description: "For tourism, visiting family, or short business activities in Australia.",
        processingTime: "2–4 weeks",
        cost: "AUD $190",
        requirements: [
          "Valid passport",
          "Sufficient funds for stay",
          "Return ticket or proof of onward travel",
          "Health insurance recommended",
          "No criminal history",
        ],
        documents: [
          "Valid passport",
          "Bank statements",
          "Travel insurance",
          "Flight itinerary",
          "Accommodation proof",
          "Employment verification letter",
          "Invitation letter (if visiting family)",
        ],
      },
    ],
    universities: [
      { name: "University of Melbourne", location: "Melbourne, VIC", ranking: "#14 World", tuitionRange: "AUD $35,000–$50,000/year", popularCourses: ["Medicine", "Law", "Engineering", "Business"] },
      { name: "University of Sydney", location: "Sydney, NSW", ranking: "#18 World", tuitionRange: "AUD $40,000–$55,000/year", popularCourses: ["Business", "Engineering", "Health Sciences", "Arts"] },
      { name: "Australian National University", location: "Canberra, ACT", ranking: "#27 World", tuitionRange: "AUD $40,000–$50,000/year", popularCourses: ["Political Science", "Astronomy", "Computer Science", "Law"] },
      { name: "University of Queensland", location: "Brisbane, QLD", ranking: "#43 World", tuitionRange: "AUD $33,000–$45,000/year", popularCourses: ["Biomedical Science", "Engineering", "Environmental Science", "Business"] },
      { name: "Monash University", location: "Melbourne, VIC", ranking: "#42 World", tuitionRange: "AUD $35,000–$48,000/year", popularCourses: ["Pharmacy", "Engineering", "IT", "Education"] },
    ],
    costs: {
      tuitionPerYear: "AUD $20,000 – $55,000",
      livingCostPerMonth: "AUD $1,800 – $2,500",
      visaFee: "AUD $710",
      healthInsurance: "OSHC required (~AUD $500/year)",
      totalEstimatedFirst: "AUD $40,000 – $75,000",
    },
  },
};
