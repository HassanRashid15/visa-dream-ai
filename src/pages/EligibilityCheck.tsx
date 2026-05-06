import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, User, GraduationCap, Briefcase, BookOpen, Wallet, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculateTravelReadiness, COUNTRY_INFO, type Country, type TravelReadinessInput } from "@/lib/eligibility";
import { COUNTRY_DETAILS } from "@/lib/countryData";
import ScoreResult from "@/components/ScoreResult";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSEO } from "@/hooks/useSEO";

const VISA_LABELS: Record<string, string> = {
  study: "Study Visa",
  work: "Work Visa",
  pr: "Permanent Residency",
  tourist: "Tourist Visa",
};

export default function EligibilityCheckPage() {
  const { country } = useParams<{ country: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const countryId = country as Country;
  const countryInfo = COUNTRY_INFO[countryId];
  const visaType = searchParams.get("visa") || "study";
  const visaLabel = VISA_LABELS[visaType] || visaType;
  const detail = country ? COUNTRY_DETAILS[country] : null;

  // Phase 2 Feature: Travel Planning Assessment
// Set SEO metadata for travel planning assessment
  useSEO({
    title: detail ? `Travel Planning Assessment for ${detail.name} | AI Travel Guidance | TravelAI` : 'Travel Planning Assessment | AI Travel Guidance | TravelAI',
    description: detail 
      ? `Get AI-powered travel planning assessment for ${detail.name}. Check travel requirements, get personalized recommendations, and plan your perfect journey with confidence.`
      : 'Plan your perfect journey with AI-powered travel assessment. Get personalized travel recommendations, requirement checks, and comprehensive planning guidance.',
    keywords: detail 
      ? `travel planning ${detail.name}, ${detail.name} travel assessment, AI travel guide ${detail.name}, travel requirements ${detail.name}, personalized travel ${detail.name}`
      : 'travel planning assessment, AI travel guidance, personalized travel recommendations, travel requirement check, intelligent travel planning'
  });
  const visaInfo = detail?.visaTypes.find(v => v.id === visaType);

  const [formData, setFormData] = useState({
    age: "",
    education: "",
    experience: "",
    ieltsScore: "",
    funds: "",
  });
  const [result, setResult] = useState<ReturnType<typeof calculateTravelReadiness> | null>(null);

  if (!countryInfo) {
    navigate("/");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input: TravelReadinessInput = {
      country: countryId,
      age: Number(formData.age),
      education: formData.education,
      experience: Number(formData.experience),
      languageScore: Number(formData.ieltsScore),
      budget: Number(formData.funds),
    };
    setResult(calculateTravelReadiness(input));
  };

  if (result) {
    return <ScoreResult result={result} country={countryInfo} onReset={() => setResult(null)} />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Hero banner */}
      <div className="hero-gradient pt-28 pb-20 px-4">
        <div className="container max-w-2xl mx-auto">
          <button onClick={() => navigate(`/country/${countryId}`)} className="flex items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground mb-6 transition-colors text-sm">
            <ArrowLeft className="h-4 w-4" /> Back to {countryInfo.name}
          </button>
          <div className="flex items-center gap-4 mb-3">
            <span className="text-5xl">{countryInfo.flag}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground">
                {countryInfo.name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium">
                  <Target className="h-3.5 w-3.5" /> {visaLabel}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1">
        <motion.div className="max-w-2xl mx-auto" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          {/* Visa requirements hint */}
          {visaInfo && (
            <div className="rounded-xl border border-border bg-muted/50 p-5">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <span className="text-xl">{visaInfo.icon}</span> {visaInfo.name} — Key Requirements
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {visaInfo.requirements.slice(0, 4).map((req, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-8 md:p-10 card-elevated space-y-8">
            <div>
              <h2 className="font-display text-xl font-semibold mb-1">Your Profile</h2>
              <p className="text-sm text-muted-foreground">Fill in your details to get an eligibility assessment for {visaLabel}.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Age */}
              <div className="space-y-2">
                <Label htmlFor="age" className="flex items-center gap-2 text-sm font-medium">
                  <User className="h-4 w-4 text-muted-foreground" /> Age
                </Label>
                <Input id="age" type="number" min={16} max={65} placeholder="e.g. 28" required
                  value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="h-12"
                />
              </div>

              {/* Education */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" /> Highest Education
                </Label>
                <Select required value={formData.education} onValueChange={(v) => setFormData({ ...formData, education: v })}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high-school">High School</SelectItem>
                    <SelectItem value="diploma">Diploma / Certificate</SelectItem>
                    <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                    <SelectItem value="masters">Master's Degree</SelectItem>
                    <SelectItem value="phd">PhD / Doctorate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Experience */}
              <div className="space-y-2">
                <Label htmlFor="experience" className="flex items-center gap-2 text-sm font-medium">
                  <Briefcase className="h-4 w-4 text-muted-foreground" /> Work Experience (years)
                </Label>
                <Input id="experience" type="number" min={0} max={30} placeholder="e.g. 3" required
                  value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="h-12"
                />
              </div>

              {/* IELTS */}
              <div className="space-y-2">
                <Label htmlFor="ielts" className="flex items-center gap-2 text-sm font-medium">
                  <BookOpen className="h-4 w-4 text-muted-foreground" /> IELTS Overall Score
                </Label>
                <Input id="ielts" type="number" min={0} max={9} step={0.5} placeholder="e.g. 7.0" required
                  value={formData.ieltsScore} onChange={(e) => setFormData({ ...formData, ieltsScore: e.target.value })}
                  className="h-12"
                />
              </div>
            </div>

            {/* Funds - full width */}
            <div className="space-y-2">
              <Label htmlFor="funds" className="flex items-center gap-2 text-sm font-medium">
                <Wallet className="h-4 w-4 text-muted-foreground" /> Available Settlement Funds (USD)
              </Label>
              <Input id="funds" type="number" min={0} placeholder="e.g. 20000" required
                value={formData.funds} onChange={(e) => setFormData({ ...formData, funds: e.target.value })}
                className="h-12"
              />
              <p className="text-xs text-muted-foreground">Total funds available to support your settlement abroad.</p>
            </div>

            <Button type="submit" variant="hero" size="xl" className="w-full">
              Check My Eligibility
            </Button>
          </form>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
