import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, AlertTriangle, XCircle, Lightbulb, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import type { EligibilityResult } from "@/lib/eligibility";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Props {
  result: EligibilityResult;
  country: { name: string; flag: string };
  onReset: () => void;
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-amber-500";
  return "text-red-500";
}

function getScoreBg(score: number) {
  if (score >= 80) return "bg-emerald-50 border-emerald-200";
  if (score >= 60) return "bg-amber-50 border-amber-200";
  return "bg-red-50 border-red-200";
}

function getScoreLabel(score: number) {
  if (score >= 80) return { text: "Strong Profile", icon: CheckCircle, color: "text-emerald-600" };
  if (score >= 60) return { text: "Moderate Profile", icon: AlertTriangle, color: "text-amber-500" };
  return { text: "Needs Improvement", icon: XCircle, color: "text-red-500" };
}

function ScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;
  let stroke = "stroke-emerald-500";
  if (score < 80) stroke = "stroke-amber-500";
  if (score < 60) stroke = "stroke-red-500";

  return (
    <div className="relative">
      <svg className="h-44 w-44 -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
        <motion.circle
          cx="60" cy="60" r="54" fill="none"
          className={stroke}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-4xl font-display font-bold ${getScoreColor(score)}`}>{score}</span>
        <span className="text-xs text-muted-foreground">out of 100</span>
      </div>
    </div>
  );
}

export default function ScoreResult({ result, country, onReset }: Props) {
  const navigate = useNavigate();
  const label = getScoreLabel(result.score);
  const LabelIcon = label.icon;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="hero-gradient pt-28 pb-20 px-4">
        <div className="container max-w-2xl mx-auto">
          <button onClick={onReset} className="flex items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground mb-6 transition-colors text-sm">
            <ArrowLeft className="h-4 w-4" /> Try Different Values
          </button>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground">
            {country.flag} {country.name} — Your Result
          </h1>
          <p className="text-primary-foreground/60 text-sm mt-2">Based on the information you provided</p>
        </div>
      </div>

      <div className="flex-1">
        <motion.div
          className="container max-w-2xl mx-auto px-4 -mt-8 space-y-6 pb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Score Card */}
          <div className={`rounded-2xl border p-8 md:p-10 card-elevated flex flex-col items-center text-center ${getScoreBg(result.score)}`}>
            <ScoreRing score={result.score} />
            <div className="flex items-center gap-2 mt-4 mb-3">
              <LabelIcon className={`h-6 w-6 ${label.color}`} />
              <span className={`text-xl font-display font-bold ${label.color}`}>{label.text}</span>
            </div>
            <p className="text-muted-foreground max-w-md text-sm leading-relaxed">{result.recommendation}</p>
          </div>

          {/* Improvements */}
          {result.improvements.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-6 md:p-8 card-elevated">
              <h3 className="font-display text-lg font-semibold mb-5 flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Lightbulb className="h-4 w-4 text-accent" />
                </div>
                How to Improve Your Score
              </h3>
              <ul className="space-y-4">
                {result.improvements.map((tip, i) => (
                  <motion.li
                    key={i}
                    className="flex items-start gap-3 text-sm text-muted-foreground bg-muted/50 rounded-lg p-4"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    <span className="mt-1 h-2 w-2 rounded-full bg-accent flex-shrink-0" />
                    <span className="leading-relaxed">{tip}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button onClick={onReset} variant="outline" size="lg" className="gap-2">
              <RotateCcw className="h-4 w-4" /> Try Again
            </Button>
            <Button onClick={() => navigate("/")} variant="default" size="lg" className="gap-2">
              <Home className="h-4 w-4" /> Check Another Country
            </Button>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
