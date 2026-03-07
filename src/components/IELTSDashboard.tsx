import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Target, Award, Calendar, BookOpen } from "lucide-react";
import { AnimatedCounter, GradientText, TiltCard, StaggerContainer, StaggerItem, SparkleBorder } from "@/components/ui/animated-bits";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  getTestAttempts,
  getCountryProgress,
  estimateCLBLevel,
  estimateDHAPoints,
  type TestAttempt,
} from "@/lib/ieltsPracticeData";

interface Props {
  country: string;
  onStartPractice: () => void;
  onStartTest: () => void;
}

export default function IELTSDashboard({ country, onStartPractice, onStartTest }: Props) {
  const attempts = getTestAttempts().filter((a) => a.country === country);
  const progress = getCountryProgress(country);
  const latestAttempt = attempts[attempts.length - 1];

  const avgScore =
    attempts.length > 0
      ? attempts.reduce((sum, a) => sum + a.scores.overall, 0) / attempts.length
      : 0;

  const bestScore =
    attempts.length > 0
      ? Math.max(...attempts.map((a) => a.scores.overall))
      : 0;

  const skillLabels = ["listening", "reading", "writing", "speaking"] as const;

  const latestSkillScores = latestAttempt
    ? skillLabels.map((s) => ({
        skill: s,
        score: latestAttempt.scores[s],
        max: Math.ceil(latestAttempt.totalQuestions / 4),
      }))
    : [];

  const countryEstimate = (() => {
    if (!latestAttempt) return null;
    if (country === "canada") return estimateCLBLevel(latestAttempt.correctAnswers, latestAttempt.totalQuestions);
    if (country === "australia") return estimateDHAPoints(latestAttempt.correctAnswers, latestAttempt.totalQuestions);
    // UK — band estimate
    const pct = latestAttempt.correctAnswers / latestAttempt.totalQuestions;
    if (pct >= 0.9) return { label: "Band 8.0–9.0", description: "Expert User" };
    if (pct >= 0.75) return { label: "Band 7.0–7.5", description: "Good User" };
    if (pct >= 0.6) return { label: "Band 6.0–6.5", description: "Competent User" };
    if (pct >= 0.45) return { label: "Band 5.0–5.5", description: "Modest User" };
    return { label: "Band 4.0–4.5", description: "Limited User" };
  })();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Stats Row */}
      <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StaggerItem>
          <TiltCard className="rounded-xl border border-border bg-card p-5 card-elevated text-center">
            <BookOpen className="h-5 w-5 mx-auto text-primary mb-2" />
            <div className="text-3xl font-display font-bold text-primary">
              <AnimatedCounter value={progress.totalCompleted} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Lessons Done</p>
            <Progress value={(progress.totalCompleted / progress.totalLessons) * 100} className="h-1 mt-2" />
          </TiltCard>
        </StaggerItem>

        <StaggerItem>
          <TiltCard className="rounded-xl border border-border bg-card p-5 card-elevated text-center">
            <BarChart3 className="h-5 w-5 mx-auto text-accent mb-2" />
            <div className="text-3xl font-display font-bold text-accent">
              <AnimatedCounter value={attempts.length} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Tests Taken</p>
          </TiltCard>
        </StaggerItem>

        <StaggerItem>
          <TiltCard className="rounded-xl border border-border bg-card p-5 card-elevated text-center">
            <TrendingUp className="h-5 w-5 mx-auto text-primary mb-2" />
            <div className="text-3xl font-display font-bold">
              {avgScore > 0 ? `${avgScore.toFixed(1)}` : "—"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Avg Score</p>
          </TiltCard>
        </StaggerItem>

        <StaggerItem>
          <TiltCard className="rounded-xl border border-border bg-card p-5 card-elevated text-center">
            <Award className="h-5 w-5 mx-auto text-accent mb-2" />
            <div className="text-3xl font-display font-bold">
              {bestScore > 0 ? `${bestScore.toFixed(1)}` : "—"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Best Score</p>
          </TiltCard>
        </StaggerItem>
      </StaggerContainer>

      {/* Country-Specific Estimate */}
      {countryEstimate && (
        <SparkleBorder>
          <div className="p-6 text-center space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              {country === "canada" ? "CLB Estimation" : country === "australia" ? "DHA Points Estimation" : "Band Estimation"}
            </p>
            <h3 className="text-2xl font-display font-bold">
              <GradientText>{"label" in countryEstimate ? countryEstimate.label : ""}</GradientText>
            </h3>
            <p className="text-sm text-muted-foreground">
              {"description" in countryEstimate
                ? (countryEstimate as { description: string }).description
                : "crsPoints" in countryEstimate
                ? (countryEstimate as { crsPoints: string }).crsPoints
                : ""}
            </p>
          </div>
        </SparkleBorder>
      )}

      {/* Skill Breakdown */}
      {latestSkillScores.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6 card-elevated space-y-4">
          <h3 className="font-display font-bold flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" /> Latest Skill Breakdown
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {latestSkillScores.map((s) => (
              <div key={s.skill} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="capitalize font-medium">{s.skill}</span>
                  <span className="text-muted-foreground">{s.score}/{s.max}</span>
                </div>
                <Progress value={s.max > 0 ? (s.score / s.max) * 100 : 0} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Score History */}
      {attempts.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6 card-elevated space-y-3">
          <h3 className="font-display font-bold flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" /> Score History
          </h3>
          <div className="space-y-2">
            {attempts.slice(-5).reverse().map((a, i) => (
              <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border">
                <span className="text-xs text-muted-foreground min-w-[80px]">
                  {new Date(a.date).toLocaleDateString()}
                </span>
                <div className="flex-1">
                  <Progress value={(a.correctAnswers / a.totalQuestions) * 100} className="h-1.5" />
                </div>
                <span className="text-sm font-semibold min-w-[60px] text-right">
                  {a.correctAnswers}/{a.totalQuestions}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({((a.correctAnswers / a.totalQuestions) * 100).toFixed(0)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onStartPractice} className="flex-1 gap-2">
          <BookOpen className="h-4 w-4" /> Practice Modules
        </Button>
        <Button variant="hero" onClick={onStartTest} className="flex-1 gap-2">
          <Target className="h-4 w-4" /> Take Mock Test
        </Button>
      </div>
    </motion.div>
  );
}
