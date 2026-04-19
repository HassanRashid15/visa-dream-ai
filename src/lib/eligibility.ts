export type Country = "uk";

export interface EligibilityInput {
  country: Country;
  age: number;
  education: string;
  experience: number;
  ieltsScore: number;
  funds: number;
}

export interface EligibilityResult {
  score: number;
  recommendation: string;
  improvements: string[];
}

const EDUCATION_SCORES: Record<string, number> = {
  "high-school": 5,
  "diploma": 10,
  "bachelors": 15,
  "masters": 20,
  "phd": 25,
};

export function calculateEligibility(input: EligibilityInput): EligibilityResult {
  let score = 0;
  const improvements: string[] = [];

  // Age scoring (max 15)
  if (input.age >= 18 && input.age <= 35) score += 15;
  else if (input.age <= 40) score += 10;
  else if (input.age <= 45) { score += 5; improvements.push("Age above 40 reduces points. Consider applying sooner."); }
  else { score += 2; improvements.push("Age above 45 significantly reduces eligibility."); }

  // Education (max 25)
  const eduScore = EDUCATION_SCORES[input.education] || 0;
  score += eduScore;
  if (eduScore < 15) improvements.push("A higher education credential (Bachelor's or above) would improve your score.");

  // Experience (max 20)
  if (input.experience >= 5) score += 20;
  else if (input.experience >= 3) score += 15;
  else if (input.experience >= 1) { score += 10; improvements.push("3+ years of work experience would strengthen your profile."); }
  else { score += 0; improvements.push("Work experience is critical. Gain at least 1 year of relevant experience."); }

  // IELTS (max 25)
  if (input.ieltsScore >= 8) score += 25;
  else if (input.ieltsScore >= 7) score += 20;
  else if (input.ieltsScore >= 6.5) { score += 15; improvements.push("An IELTS score of 7+ would significantly boost eligibility."); }
  else if (input.ieltsScore >= 6) { score += 10; improvements.push("Aim for IELTS 7+ for better chances."); }
  else { score += 5; improvements.push("IELTS score below 6 is below minimum for most programs."); }

  // Funds (max 15)
  const fundsThreshold = 20000; // UK threshold
  if (input.funds >= fundsThreshold) score += 15;
  else if (input.funds >= fundsThreshold * 0.7) { score += 10; improvements.push(`Increase settlement funds to at least $${fundsThreshold.toLocaleString()} for better standing.`); }
  else { score += 5; improvements.push(`Minimum recommended funds: $${fundsThreshold.toLocaleString()}.`); }

  let recommendation: string;
  if (score >= 80) recommendation = "Excellent! You have a strong profile. We recommend proceeding with your application.";
  else if (score >= 60) recommendation = "Good profile with room for improvement. Address the suggestions below to strengthen your application.";
  else if (score >= 40) recommendation = "Moderate eligibility. Focus on improving the areas listed below before applying.";
  else recommendation = "Your current profile needs significant improvement. Work on the key areas below.";

  return { score, recommendation, improvements };
}

export const COUNTRY_INFO: Record<Country, { name: string; flag: string; description: string }> = {
  // canada: { name: "Canada", flag: "🇨🇦", description: "Express Entry, PNP & Study Permits" },
  uk: { name: "United Kingdom", flag: "🇬🇧", description: "Skilled Worker & Graduate Visas" },
  // australia: { name: "Australia", flag: "🇦🇺", description: "Skilled Migration & Student Visas" },
};
