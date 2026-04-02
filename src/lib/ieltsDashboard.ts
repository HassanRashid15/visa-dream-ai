import { type TestAttempt } from "@/lib/ieltsPracticeData";

export const skillLabels = ["listening", "reading", "writing", "speaking"] as const;

export type SkillLabel = (typeof skillLabels)[number];

type DescriptorTier = {
  minBand: number;
  title: string;
  why: string;
  focus: string;
  benchmark: string;
};

export interface SkillBandInsight {
  skill: SkillLabel;
  raw: number;
  max: number;
  ratio: number;
  band: number;
  descriptor: Omit<DescriptorTier, "minBand">;
}

export interface StudyPlannerItem {
  skill: SkillLabel;
  ratio: number;
  label: string;
  advice: string;
}

export interface TimetableDay {
  day: string;
  skill: SkillLabel;
  session: string;
  duration: string;
  reason: string;
}

const DESCRIPTORS: Record<SkillLabel, DescriptorTier[]> = {
  listening: [
    {
      minBand: 8,
      title: "Strong detail recognition",
      why: "You are following fast speech, corrections, numbers, and key detail with very few misses.",
      focus: "Keep practising one-play recordings with mixed accents to protect speed and accuracy.",
      benchmark: "Higher bands depend on catching distractors and exact factual detail in one listen.",
    },
    {
      minBand: 7,
      title: "Good comprehension under pressure",
      why: "You catch main ideas well, but some detail is still slipping in denser sections or after corrections.",
      focus: "Drill spelling, dates, names, and signpost words such as however, finally, and instead.",
      benchmark: "Band 7+ listening needs reliable detail capture, not just general understanding.",
    },
    {
      minBand: 6,
      title: "Competent but inconsistent",
      why: "You understand the topic, but accuracy drops when the speaker moves quickly or changes information.",
      focus: "Do short dictation sets and question preview practice before every listening task.",
      benchmark: "To move up, reduce losses on factual detail and late-answer distractors.",
    },
    {
      minBand: 5,
      title: "Basic understanding developing",
      why: "You are catching some correct points, but missing too many keywords to stay consistent.",
      focus: "Start with slower recordings, then build toward real-test pace using note-taking drills.",
      benchmark: "A higher band needs steadier understanding across the full recording, not isolated answers.",
    },
    {
      minBand: 0,
      title: "Foundation stage",
      why: "Right now the estimate suggests core detail is being missed across most of the task.",
      focus: "Work on basic listening stamina, common test vocabulary, and daily short audio practice.",
      benchmark: "The next jump comes from recognising predictable answer types such as names, places, and times.",
    },
  ],
  reading: [
    {
      minBand: 8,
      title: "Fast and accurate reader",
      why: "You are locating evidence quickly and handling question traps with strong control.",
      focus: "Maintain timed passage work and keep sharpening heading, matching, and inference questions.",
      benchmark: "Top reading bands need precision, speed, and strong control of tricky question types.",
    },
    {
      minBand: 7,
      title: "Good passage control",
      why: "You understand structure and key ideas well, but some pressure points still reduce exact accuracy.",
      focus: "Practise True/False/Not Given, matching headings, and scanning evidence lines faster.",
      benchmark: "Band 7+ reading comes from proving answers with text evidence, not guessing from topic sense.",
    },
    {
      minBand: 6,
      title: "Solid main-idea understanding",
      why: "You can follow passages, but detail questions and paraphrased evidence still cause avoidable loss.",
      focus: "Train with timed evidence-finding and paraphrase recognition exercises.",
      benchmark: "To improve, convert general understanding into exact answer selection.",
    },
    {
      minBand: 5,
      title: "Partial accuracy",
      why: "You pick up obvious answers, but longer passages and distractors are pulling the estimate down.",
      focus: "Use shorter timed passages first, then build up to full sets with review of mistakes.",
      benchmark: "Higher reading bands need better time control and clearer evidence tracking.",
    },
    {
      minBand: 0,
      title: "Foundation stage",
      why: "The estimate suggests passage tracking and question matching still need core improvement.",
      focus: "Build skimming, scanning, and vocabulary range before pushing into harder timed sets.",
      benchmark: "Start by learning how IELTS hides answers through paraphrase and ordering.",
    },
  ],
  writing: [
    {
      minBand: 8,
      title: "Clear task control",
      why: "This estimate suggests strong organisation, relevant support, and a mature command of written English.",
      focus: "Keep refining accuracy, paragraph balance, and flexible vocabulary under time pressure.",
      benchmark: "Higher writing bands require precision, strong cohesion, and very few noticeable errors.",
    },
    {
      minBand: 7,
      title: "Well-developed response",
      why: "You likely show a clear position and logical structure, though some language control can still tighten.",
      focus: "Strengthen topic sentences, paragraph links, and task coverage in timed essays.",
      benchmark: "Band 7 writing depends on clear progression, relevant ideas, and controlled grammar.",
    },
    {
      minBand: 6,
      title: "Competent structure",
      why: "Your estimate suggests ideas are understandable, but development or accuracy is not yet consistent enough.",
      focus: "Work on stronger planning, fuller support, and error-checking in the final minutes.",
      benchmark: "To move up, improve both task response quality and sentence accuracy together.",
    },
    {
      minBand: 5,
      title: "Basic response quality",
      why: "You may be addressing the task only partly or losing marks through structure and grammar issues.",
      focus: "Practise clear essay templates, overview writing, and short timed paragraph drills.",
      benchmark: "A stronger band needs clearer organisation and more relevant support for each idea.",
    },
    {
      minBand: 0,
      title: "Foundation stage",
      why: "The current estimate points to core gaps in task response, cohesion, or language control.",
      focus: "Start with guided paragraph writing before returning to full timed tasks.",
      benchmark: "Focus first on clarity and structure before chasing advanced vocabulary.",
    },
  ],
  speaking: [
    {
      minBand: 8,
      title: "Confident and fluent delivery",
      why: "This estimate suggests strong fluency, clear ideas, and flexible language across topics.",
      focus: "Maintain natural pacing and keep polishing pronunciation, precision, and extended answers.",
      benchmark: "Higher speaking bands rely on sustained fluency with very little strain or hesitation.",
    },
    {
      minBand: 7,
      title: "Strong spoken control",
      why: "You likely communicate clearly with good range, though some hesitation or repetition may still appear.",
      focus: "Record more Part 2 and Part 3 answers to improve linking, examples, and answer depth.",
      benchmark: "Band 7+ speaking needs natural development of ideas, not short direct responses only.",
    },
    {
      minBand: 6,
      title: "Clear but uneven fluency",
      why: "You can express ideas, but pauses, repetition, or limited range are still holding the estimate back.",
      focus: "Practise cue-card speaking with one-minute planning and two-minute delivery.",
      benchmark: "To improve, extend answers smoothly and rely less on safe repeated vocabulary.",
    },
    {
      minBand: 5,
      title: "Basic communicative ability",
      why: "You are understandable, but fluency, pronunciation, or idea development are not yet steady.",
      focus: "Do daily speaking recordings and replay them to catch short answers and unclear pronunciation.",
      benchmark: "A stronger band needs longer answers, smoother flow, and clearer sound patterns.",
    },
    {
      minBand: 0,
      title: "Foundation stage",
      why: "The estimate shows you still need stronger confidence and structure when speaking under test conditions.",
      focus: "Begin with short personal-topic answers, then build to longer cue-card practice.",
      benchmark: "Fluency grows fastest with frequent short recordings and immediate playback review.",
    },
  ],
};

const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function getDescriptor(skill: SkillLabel, band: number) {
  const match = DESCRIPTORS[skill].find((tier) => band >= tier.minBand) ?? DESCRIPTORS[skill][DESCRIPTORS[skill].length - 1];
  return {
    title: match.title,
    why: match.why,
    focus: match.focus,
    benchmark: match.benchmark,
  };
}

export function estimateBandScore(score: number, total: number) {
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
}

export function getLatestSkillMax(latestAttempt?: TestAttempt) {
  return latestAttempt ? Math.max(1, Math.ceil(latestAttempt.totalQuestions / 4)) : 0;
}

export function buildLatestBandBreakdown(latestAttempt?: TestAttempt): SkillBandInsight[] {
  const max = getLatestSkillMax(latestAttempt);
  if (!latestAttempt || !max) return [];

  return skillLabels.map((skill) => {
    const raw = latestAttempt.scores[skill];
    const ratio = raw / max;
    const band = estimateBandScore(raw, max);

    return {
      skill,
      raw,
      max,
      ratio,
      band,
      descriptor: getDescriptor(skill, band),
    };
  });
}

export function getOverallBand(breakdown: SkillBandInsight[]) {
  return breakdown.length
    ? Math.round((breakdown.reduce((sum, item) => sum + item.band, 0) / breakdown.length) * 2) / 2
    : null;
}

export function getPointsMapping(country: string, overallBand: number | null) {
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
}

export function buildStudyPlanner(attempts: TestAttempt[]): StudyPlannerItem[] {
  if (attempts.length === 0) return [];

  return skillLabels
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
    .sort((a, b) => a.ratio - b.ratio);
}

export function buildWeeklyTimetable(attempts: TestAttempt[]): TimetableDay[] {
  const planner = buildStudyPlanner(attempts);
  if (planner.length === 0) return [];

  const ranked = [...planner];
  const top = ranked[0] ?? ranked[ranked.length - 1];
  const second = ranked[1] ?? top;
  const third = ranked[2] ?? second;
  const fourth = ranked[3] ?? third;

  const sessions: Record<SkillLabel, { session: string; duration: string }> = {
    listening: { session: "Accent listening + one-play recall", duration: "75 min" },
    reading: { session: "Timed passage + evidence scan", duration: "75 min" },
    writing: { session: "Task plan + timed writing review", duration: "90 min" },
    speaking: { session: "Cue card recording + playback review", duration: "60 min" },
  };

  const rotation: SkillLabel[] = [top.skill, second.skill, top.skill, third.skill, second.skill, top.skill, fourth.skill];

  return DAY_NAMES.map((day, index) => {
    const skill = rotation[index];
    const matched = ranked.find((item) => item.skill === skill) ?? top;
    const session = sessions[skill];

    return {
      day,
      skill,
      session: session.session,
      duration: matched.label === "High priority" ? session.duration : skill === fourth.skill ? "45 min" : session.duration,
      reason: `${matched.label} — recent attempts show ${(matched.ratio * 100).toFixed(0)}% average accuracy in ${skill}.`,
    };
  });
}