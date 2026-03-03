import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculateEligibility, COUNTRY_INFO, type Country, type EligibilityInput } from "@/lib/eligibility";
import ScoreResult from "@/components/ScoreResult";

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
    <div className="min-h-screen bg-background">
      <div className="hero-gradient py-12 px-4">
        <div className="container max-w-2xl mx-auto">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground">
            {countryInfo.flag} {countryInfo.name} Eligibility Check
          </h1>
          <p className="text-primary-foreground/70 mt-2">{countryInfo.description}</p>
        </div>
      </div>

      <motion.div
        className="container max-w-2xl mx-auto px-4 -mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 md:p-10 card-elevated space-y-6">
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              min={16}
              max={65}
              placeholder="e.g. 28"
              required
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="education">Highest Education</Label>
            <Select required value={formData.education} onValueChange={(v) => setFormData({ ...formData, education: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select education level" />
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

          <div className="space-y-2">
            <Label htmlFor="experience">Work Experience (years)</Label>
            <Input
              id="experience"
              type="number"
              min={0}
              max={30}
              placeholder="e.g. 3"
              required
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ielts">IELTS Overall Score</Label>
            <Input
              id="ielts"
              type="number"
              min={0}
              max={9}
              step={0.5}
              placeholder="e.g. 7.0"
              required
              value={formData.ieltsScore}
              onChange={(e) => setFormData({ ...formData, ieltsScore: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="funds">Available Funds (USD)</Label>
            <Input
              id="funds"
              type="number"
              min={0}
              placeholder="e.g. 20000"
              required
              value={formData.funds}
              onChange={(e) => setFormData({ ...formData, funds: e.target.value })}
            />
          </div>

          <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base py-6">
            Check My Eligibility
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
