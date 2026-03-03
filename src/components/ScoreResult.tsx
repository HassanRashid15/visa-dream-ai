import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, AlertTriangle, XCircle, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EligibilityResult } from "@/lib/eligibility";

interface Props {
  result: EligibilityResult;
  country: { name: string; flag: string };
  onReset: () => void;
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-emerald-500";
  if (score >= 60) return "text-amber-500";
  return "text-destructive";
}

function getScoreIcon(score: number) {
  if (score >= 80) return <CheckCircle className="h-10 w-10 text-emerald-500" />;
  if (score >= 60) return <AlertTriangle className="h-10 w-10 text-amber-500" />;
  return <XCircle className="h-10 w-10 text-destructive" />;
}

function getScoreRing(score: number) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;
  let stroke = "stroke-emerald-500";
  if (score < 80) stroke = "stroke-amber-500";
  if (score < 60) stroke = "stroke-destructive";

  return (
    <svg className="h-36 w-36 -rotate-90" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
      <motion.circle
        cx="60" cy="60" r="54" fill="none"
        className={stroke}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </svg>
  );
}

export default function ScoreResult({ result, country, onReset }: Props) {
  return (
    <div className="min-h-screen bg-background">
      <div className="hero-gradient py-12 px-4">
        <div className="container max-w-2xl mx-auto">
          <button onClick={onReset} className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Try Again
          </button>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground">
            {country.flag} {country.name} — Your Result
          </h1>
        </div>
      </div>

      <motion.div
        className="container max-w-2xl mx-auto px-4 -mt-6 space-y-6 pb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Score Card */}
        <div className="rounded-xl border border-border bg-card p-8 card-elevated flex flex-col items-center text-center">
          <div className="relative flex items-center justify-center mb-4">
            {getScoreRing(result.score)}
            <span className={`absolute text-4xl font-bold font-display ${getScoreColor(result.score)}`}>
              {result.score}%
            </span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            {getScoreIcon(result.score)}
            <span className={`text-lg font-semibold ${getScoreColor(result.score)}`}>
              {result.score >= 80 ? "Strong Profile" : result.score >= 60 ? "Moderate Profile" : "Needs Improvement"}
            </span>
          </div>
          <p className="text-muted-foreground max-w-md">{result.recommendation}</p>
        </div>

        {/* Improvements */}
        {result.improvements.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-6 card-elevated">
            <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-accent" />
              How to Improve
            </h3>
            <ul className="space-y-3">
              {result.improvements.map((tip, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-3 text-sm text-muted-foreground"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <span className="mt-0.5 h-2 w-2 rounded-full bg-accent flex-shrink-0" />
                  {tip}
                </motion.li>
              ))}
            </ul>
          </div>
        )}

        <Button onClick={onReset} variant="outline" className="w-full py-5">
          Check Another Country
        </Button>
      </motion.div>
    </div>
  );
}
