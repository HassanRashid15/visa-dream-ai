export type Country = "uk";

export interface TravelReadinessInput {
  country: Country;
  age: number;
  education: string;
  experience: number;
  languageScore: number;
  budget: number;
}

export interface TravelReadinessResult {
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

export function calculateTravelReadiness(input: TravelReadinessInput): TravelReadinessResult {
  let score = 0;
  const improvements: string[] = [];

  // Age scoring (max 15) - Travel readiness
  if (input.age >= 18 && input.age <= 65) score += 15;
  else if (input.age >= 16) score += 10;
  else { score += 5; improvements.push("Travelers under 16 may need parental guidance for international travel."); }

  // Education (max 25) - Cultural awareness
  const eduScore = EDUCATION_SCORES[input.education] || 0;
  score += eduScore;
  if (eduScore < 15) improvements.push("Higher education can enhance cultural understanding and travel experiences.");

  // Experience (max 20) - Travel experience
  if (input.experience >= 5) score += 20;
  else if (input.experience >= 3) score += 15;
  else if (input.experience >= 1) { score += 10; improvements.push("Previous travel experience would help prepare for your journey."); }
  else { score += 0; improvements.push("Consider shorter trips first to gain travel experience."); }

  // Language (max 25) - Communication ability
  if (input.languageScore >= 8) score += 25;
  else if (input.languageScore >= 7) score += 20;
  else if (input.languageScore >= 6.5) { score += 15; improvements.push("Better language skills will enhance your travel experience."); }
  else if (input.languageScore >= 6) { score += 10; improvements.push("Better language skills will significantly improve your travel experience."); }
  else { score += 5; improvements.push("Consider language preparation classes before traveling."); }

  // Budget (max 15)
  const budgetThreshold = 5000; // Recommended travel budget
  if (input.budget >= budgetThreshold) score += 15;
  else if (input.budget >= budgetThreshold * 0.7) { score += 10; improvements.push(`Consider increasing your budget to at least $${budgetThreshold.toLocaleString()} for a comfortable trip.`); }
  else { score += 5; improvements.push(`Minimum recommended budget: $${budgetThreshold.toLocaleString()} for basic travel expenses.`); }

  let recommendation: string;
  if (score >= 80) recommendation = "Excellent! You're well-prepared for your travel adventure. We recommend starting your journey planning.";
  else if (score >= 60) recommendation = "Good travel readiness! Consider the suggestions below to enhance your travel experience.";
  else if (score >= 40) recommendation = "Moderate travel readiness. Focus on the areas listed below to better prepare for your trip.";
  else recommendation = "Your travel preparation needs attention. Work on the key areas below for a safer journey.";

  return { score, recommendation, improvements };
}

export const COUNTRY_INFO: Record<Country, { name: string; flag: string; description: string }> = {
  // canada: { name: "Canada", flag: "🇨🇦", description: "Amazing nature & multicultural cities" },
  uk: { name: "United Kingdom", flag: "🇬🇧", description: "Rich history & vibrant culture" },
  // australia: { name: "Australia", flag: "🇦🇺", description: "Beautiful beaches & unique wildlife" },
};
