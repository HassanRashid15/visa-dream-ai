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
  const latestSkillMax = latestAttempt ? Math.max(1, Math.ceil(latestAttempt.totalQuestions / 4)) : 0;

  const avgScore =
    attempts.length > 0
      ? attempts.reduce((sum, a) => sum + a.scores.overall, 0) / attempts.length
      : 0;

  const bestScore =
    attempts.length > 0
      ? Math.max(...attempts.map((a) => a.scores.overall))
      : 0;

  const skillLabels = ["listening", "reading", "writing", "speaking"] as const;

  const estimateBandScore = (score: number, total: number) => {
    const pct = total > 0 ? score / total : 0;
    if (pct >= 0.95) return 9;
    if (pct >= 0.9) return 8.5;
    if (pct >= 0.82) return 8;
    if (pct >= 0.75) return 7.5;
    if (pct >= 0.68) return 7;
    if (pct >= 0.6) return 6.5;
    if (pct >= 0.52) return 6;
    if (pct >= 0.44) return 5.5;
    if (pct >= 0.36) return 5;
    if (pct >= 0.28) return 4.5;
    return 4;
  };

  const latestBandBreakdown = latestAttempt
    ? skillLabels.map((skill) => ({
        skill,
        raw: latestAttempt.scores[skill],
        band: estimateBandScore(latestAttempt.scores[skill], latestSkillMax),
      }))
    : [];

  const overallBand = latestBandBreakdown.length
    ? Math.round((latestBandBreakdown.reduce((sum, item) => sum + item.band, 0) / latestBandBreakdown.length) * 2) / 2
    : null;

  const pointsMapping = (() => {
    if (overallBand === null) return null;
    if (country === "canada") {
      if (overallBand >= 8) return { title: "Canada mapping", value: "CLB 9+ range", detail: "Strong language profile with high CRS potential in this mock estimate." };
      if (overallBand >= 7) return { title: "Canada mapping", value: "CLB 7–8 range", detail: "Usually meets core skilled migration language thresholds with moderate CRS value." };
      return { title: "Canada mapping", value: "Below CLB 7 range", detail: "Improve weakest skills to reach stronger immigration language eligibility." };
    }
    if (country === "australia") {
      if (overallBand >= 8) return { title: "Australia mapping", value: "Superior English", detail: "Mock estimate aligns with the top language points tier when skills are consistently high." };
      if (overallBand >= 7) return { title: "Australia mapping", value: "Proficient English", detail: "Good migration profile with likely bonus points if all skills stay in range." };
      return { title: "Australia mapping", value: "Competent / below", detail: "Good baseline, but higher scores improve competitiveness for points-tested visas." };
    }
    if (overallBand >= 6.5) {
      return { title: "UK mapping", value: "Typical study-ready range", detail: "Often aligns with many university offer thresholds, depending on course and provider." };
    }
    return { title: "UK mapping", value: "Needs improvement", detail: "Improve before relying on this score for stricter university or visa language expectations." };
  })();

  const studyPlanner = attempts.length > 0
    ? skillLabels
        .map((skill) => {
          const averageRatio = attempts.reduce((sum, attempt) => {
            const skillTotal = Math.max(1, Math.ceil(attempt.totalQuestions / 4));
            return sum + attempt.scores[skill] / skillTotal;
          }, 0) / attempts.length;

          const advice = {
            listening: "Repeat listening drills with note-taking, numbers, names, and one-play recall.",
            reading: "Do more passage scanning, True/False/Not Given practice, and timed comprehension sets.",
            writing: "Focus on structure, task response, and timed essays with self-review against band criteria.",
            speaking: "Record more answers, extend responses naturally, and review fluency and pronunciation.",
          }[skill];

          return {
            skill,
            ratio: averageRatio,
            label: averageRatio < 0.55 ? "High priority" : averageRatio < 0.72 ? "Focus next" : "Maintain strength",
            advice,
          };
        })
        .sort((a, b) => a.ratio - b.ratio)
    : [];

  const latestSkillScores = latestAttempt
    ? skillLabels.map((s) => ({
        skill: s,
        score: latestAttempt.scores[s],
        max: latestSkillMax,
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

      {/* Mock Score Calculator */}
      {overallBand !== null && (
        <div className="rounded-xl border border-border bg-card p-6 card-elevated space-y-4">
          <h3 className="font-display font-bold flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" /> Mock IELTS Score Calculator
          </h3>
          <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Combined overall band</p>
              <div className="text-4xl font-display font-bold text-primary">{overallBand.toFixed(1)}</div>
              <div className="grid grid-cols-2 gap-2">
                {latestBandBreakdown.map((item) => (
                  <div key={item.skill} className="rounded-md border border-border bg-background px-3 py-2">
                    <p className="text-xs capitalize text-muted-foreground">{item.skill}</p>
                    <p className="font-semibold">Band {item.band.toFixed(1)}</p>
                  </div>
                ))}
              </div>
            </div>

            {pointsMapping && (
              <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{pointsMapping.title}</p>
                <p className="text-xl font-display font-bold text-accent">{pointsMapping.value}</p>
                <p className="text-sm text-muted-foreground">{pointsMapping.detail}</p>
                <p className="text-[11px] text-muted-foreground">Mock estimate based on your latest four-skill score split.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Study Planner */}
      {studyPlanner.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6 card-elevated space-y-4">
          <h3 className="font-display font-bold flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" /> Study Planner
          </h3>
          <div className="space-y-3">
            {studyPlanner.slice(0, 3).map((item) => (
              <div key={item.skill} className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold capitalize">{item.skill}</p>
                    <p className="text-xs text-muted-foreground">Past attempt average: {(item.ratio * 100).toFixed(0)}%</p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">{item.label}</span>
                </div>
                <Progress value={item.ratio * 100} className="h-1.5" />
                <p className="text-sm text-muted-foreground">{item.advice}</p>
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
