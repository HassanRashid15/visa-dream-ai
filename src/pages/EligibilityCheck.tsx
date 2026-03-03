import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, User, GraduationCap, Briefcase, BookOpen, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculateEligibility, COUNTRY_INFO, type Country, type EligibilityInput } from "@/lib/eligibility";
import ScoreResult from "@/components/ScoreResult";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const fields = [
  { id: "age", label: "Age", icon: User, type: "number", placeholder: "e.g. 28", min: 16, max: 65 },
  { id: "experience", label: "Work Experience (years)", icon: Briefcase, type: "number", placeholder: "e.g. 3", min: 0, max: 30 },
  { id: "ieltsScore", label: "IELTS Overall Score", icon: BookOpen, type: "number", placeholder: "e.g. 7.0", min: 0, max: 9, step: 0.5 },
  { id: "funds", label: "Available Funds (USD)", icon: Wallet, type: "number", placeholder: "e.g. 20000", min: 0 },
];

export default function EligibilityCheckPage() {
  const { country } = useParams<{ country: string }>();
  const navigate = useNavigate();
  const countryId = country as Country;
  const countryInfo = COUNTRY_INFO[countryId];

  const [formData, setFormData] = useState({
    age: "",
    education: "",
    experience: "",
    ieltsScore: "",
    funds: "",
  });
  const [result, setResult] = useState<ReturnType<typeof calculateEligibility> | null>(null);

  if (!countryInfo) {
    navigate("/");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input: EligibilityInput = {
      country: countryId,
      age: Number(formData.age),
      education: formData.education,
      experience: Number(formData.experience),
      ieltsScore: Number(formData.ieltsScore),
      funds: Number(formData.funds),
    };
    setResult(calculateEligibility(input));
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
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground mb-6 transition-colors text-sm">
            <ArrowLeft className="h-4 w-4" /> Back to Countries
          </button>
          <div className="flex items-center gap-4 mb-3">
            <span className="text-5xl">{countryInfo.flag}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground">
                {countryInfo.name}
              </h1>
              <p className="text-primary-foreground/60 text-sm mt-1">{countryInfo.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1">
        <motion.div
          className="container max-w-2xl mx-auto px-4 -mt-8 pb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-8 md:p-10 card-elevated space-y-8">
            <div>
              <h2 className="font-display text-xl font-semibold mb-1">Your Profile</h2>
              <p className="text-sm text-muted-foreground">Fill in your details to get an eligibility assessment.</p>
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
