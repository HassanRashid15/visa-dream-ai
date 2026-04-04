import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, Headphones, PenTool, Mic, Clock, CheckCircle, XCircle, Eye, EyeOff, Timer, Volume2, Send, ChevronDown, ChevronUp, Play, Pause, SkipForward, AlertCircle, Info, Sparkles, Square, CircleDot, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { GradientText, TiltCard, StaggerContainer, StaggerItem, ShimmerButton, SparkleBorder, AnimatedCounter, PulseDot } from "@/components/ui/animated-bits";
import {
  type ReadingPassage,
  type ListeningExercise,
  type WritingTask,
  type SpeakingCueCard,
  type PracticeQuestion,
  type CountryPracticeData,
} from "@/lib/ieltsPracticeData";

type PracticeType = "reading" | "listening" | "writing" | "speaking";

interface Props {
  practiceData: CountryPracticeData;
  countryName: string;
  countryCode?: string;
  onBack: () => void;
}

// ─── SHUFFLE UTILITY ────────────────────────────────────────────────────────

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function shuffleQuestions(questions: PracticeQuestion[]): PracticeQuestion[] {
  return shuffleArray(questions).map(q => {
    if (q.options) {
      return { ...q, options: shuffleArray(q.options) };
    }
    return q;
  });
}

type TranscriptToken = {
  text: string;
  isWord: boolean;
  start: number;
  end: number;
};

function tokenizeTranscript(transcript: string): TranscriptToken[] {
  const parts = transcript.match(/\S+|\s+/g) ?? [];
  let cursor = 0;

  return parts.map((text) => {
    const start = cursor;
    cursor += text.length;

    return {
      text,
      isWord: /\S/.test(text),
      start,
      end: cursor,
    };
  });
}

function getTokenIndexForChar(tokens: TranscriptToken[], charIndex: number) {
  const safeCharIndex = Math.max(0, charIndex);

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (!token.isWord) continue;

    if (safeCharIndex < token.end) {
      return i;
    }
  }

  for (let i = tokens.length - 1; i >= 0; i--) {
    if (tokens[i].isWord) return i;
  }

  return -1;
}

// ─── VOICE HELPERS ──────────────────────────────────────────────────────────

function getVoiceLang(countryCode?: string): string {
  switch (countryCode) {
    case "australia": return "en-AU";
    case "canada": return "en-CA";
    default: return "en-GB";
  }
}

function getBestVoice(lang: string): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  return voices.find(v => v.lang === lang) || voices.find(v => v.lang.startsWith(lang.split("-")[0])) || null;
}

// ─── SKILL GUIDES ───────────────────────────────────────────────────────────

const SKILL_GUIDES: Record<PracticeType, {
  title: string;
  icon: React.ReactNode;
  description: string;
  steps: string[];
  tips: string[];
  realTestInfo: string;
}> = {
  reading: {
    title: "Reading Practice Guide",
    icon: <BookOpen className="h-8 w-8" />,
    description: "In the IELTS Reading test, you'll read passages and answer questions. This practice simulates the real test environment.",
    steps: [
      "Read the passage carefully — you can toggle it on/off",
      "Answer all questions (True/False/Not Given, MCQ, Fill-in-the-blank)",
      "A 20-minute timer runs just like the real test",
      "Submit when done to see your score and explanations",
    ],
    tips: [
      "Skim the passage first, then read questions before re-reading in detail",
      "For True/False/Not Given: 'Not Given' means the information isn't in the passage at all",
      "Don't spend too long on one question — move on and come back",
    ],
    realTestInfo: "Real test: 3 passages, 40 questions, 60 minutes total.",
  },
  listening: {
    title: "Listening Practice Guide",
    icon: <Headphones className="h-8 w-8" />,
    description: "In the IELTS Listening test, you hear audio ONCE and answer questions. This practice uses text-to-speech to read the transcript aloud with live word highlighting.",
    steps: [
      "Read the questions FIRST before playing audio",
      "Click 'Play Audio' — each word highlights as it's spoken",
      "After audio ends, you get 20 seconds to review — then the transcript closes",
      "Answer the questions from memory, just like the real test",
    ],
    tips: [
      "Always read the questions before listening — this is what top scorers do",
      "Listen for keywords, numbers, names, and spelling",
      "In the real test you hear audio only ONCE — don't rely on re-reading!",
      "Use the 20-second review time wisely to note key details",
    ],
    realTestInfo: "Real test: 4 sections, 40 questions, ~30 minutes audio + 10 minutes transfer time.",
  },
  writing: {
    title: "Writing Practice Guide",
    icon: <PenTool className="h-8 w-8" />,
    description: "The IELTS Writing test has two tasks. Practice writing under timed conditions and self-assess using official criteria.",
    steps: [
      "Read the prompt carefully before you start writing",
      "The timer starts when you begin typing",
      "Write at least the minimum word count shown",
      "Submit to see the self-assessment checklist based on official IELTS criteria",
    ],
    tips: [
      "Plan for 2-3 minutes before writing — structure matters!",
      "Task 1: Describe the data objectively (150+ words, 20 mins)",
      "Task 2: Present a clear argument with examples (250+ words, 40 mins)",
      "Check your grammar and spelling in the last 2-3 minutes",
    ],
    realTestInfo: "Real test: Task 1 (150 words, 20 min) + Task 2 (250 words, 40 min) = 60 minutes total.",
  },
  speaking: {
    title: "Speaking Practice Guide",
    icon: <Mic className="h-8 w-8" />,
    description: "The IELTS Speaking test is a face-to-face interview. Record yourself speaking and play it back for self-review!",
    steps: [
      "Part 1: Answer introductory questions (60 seconds each)",
      "Part 2: You get 60 seconds prep time, then speak for 2 minutes on a topic",
      "Part 3: Discuss abstract follow-up questions",
      "Use the RECORD button to capture your speaking — play it back to self-assess!",
    ],
    tips: [
      "Extend your answers — give reasons, examples, and details",
      "Use a range of vocabulary and grammar structures",
      "Don't memorise answers — examiners can tell",
      "Listen to your recordings to identify pronunciation issues",
    ],
    realTestInfo: "Real test: 11-14 minutes, 3 parts, face-to-face with examiner.",
  },
};

export default function IELTSPracticeModule({ practiceData, countryName, countryCode, onBack }: Props) {
  const [activeType, setActiveType] = useState<PracticeType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showGuide, setShowGuide] = useState(true);

  // Shuffle data on each mount/skill change
  const shuffledData = useMemo(() => ({
    readingPassages: shuffleArray(practiceData.readingPassages),
    listeningExercises: shuffleArray(practiceData.listeningExercises),
    writingTasks: shuffleArray(practiceData.writingTasks),
    speakingCards: shuffleArray(practiceData.speakingCards),
  }), [practiceData]);

  const tabs: { type: PracticeType; icon: React.ReactNode; label: string; count: number }[] = [
    { type: "reading", icon: <BookOpen className="h-5 w-5" />, label: "Reading", count: shuffledData.readingPassages.length },
    { type: "listening", icon: <Headphones className="h-5 w-5" />, label: "Listening", count: shuffledData.listeningExercises.length },
    { type: "writing", icon: <PenTool className="h-5 w-5" />, label: "Writing", count: shuffledData.writingTasks.length },
    { type: "speaking", icon: <Mic className="h-5 w-5" />, label: "Speaking", count: shuffledData.speakingCards.length },
  ];

  const handleSelectSkill = (type: PracticeType) => {
    setActiveType(type);
    setActiveIndex(0);
    setShowGuide(true);
  };

  if (!activeType) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-3 w-3" /> Back
        </button>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-display font-bold">
            <GradientText>Practice Zone</GradientText>
          </h2>
          <p className="text-sm text-muted-foreground">Real IELTS-format exercises — {countryName}</p>
        </div>

        <StaggerContainer className="grid grid-cols-2 gap-4">
          {tabs.map((tab) => (
            <StaggerItem key={tab.type}>
              <TiltCard className="cursor-pointer">
                <button
                  onClick={() => handleSelectSkill(tab.type)}
                  className="w-full rounded-xl border border-border bg-card p-6 card-elevated text-center space-y-3 hover:border-primary/40 transition-colors"
                >
                  <div className="h-12 w-12 rounded-full bg-primary/10 mx-auto flex items-center justify-center text-primary">
                    {tab.icon}
                  </div>
                  <h3 className="font-display font-bold">{tab.label}</h3>
                  <p className="text-xs text-muted-foreground">{tab.count} exercise{tab.count !== 1 ? "s" : ""}</p>
                </button>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </motion.div>
    );
  }

  // Show guide before practice
  if (showGuide && activeType) {
    const guide = SKILL_GUIDES[activeType];
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <button onClick={() => setActiveType(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-3 w-3" /> Back to Practice Zone
        </button>

        <SparkleBorder>
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                {guide.icon}
              </div>
              <div>
                <h2 className="text-xl font-display font-bold">{guide.title}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">{guide.realTestInfo}</p>
              </div>
            </div>

            <p className="text-sm text-foreground/80 leading-relaxed">{guide.description}</p>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5" /> How this practice works
              </h4>
              {guide.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/40">
                  <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0 font-bold">{i + 1}</span>
                  <p className="text-sm text-foreground/80">{step}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-accent/10 border border-accent/20 p-4 space-y-2">
              <h4 className="text-xs font-semibold text-accent flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> Pro Tips
              </h4>
              {guide.tips.map((tip, i) => (
                <p key={i} className="text-xs text-foreground/70 flex items-start gap-2">
                  <span className="h-1 w-1 rounded-full bg-accent mt-1.5 flex-shrink-0" /> {tip}
                </p>
              ))}
            </div>
          </div>
        </SparkleBorder>

        <ShimmerButton onClick={() => setShowGuide(false)} className="w-full">
          <Play className="h-4 w-4" /> Start {guide.title.replace(" Guide", "")}
        </ShimmerButton>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <button onClick={() => setActiveType(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-3 w-3" /> Back to Practice Zone
      </button>

      {activeType === "reading" && (
        <ReadingPractice passages={shuffledData.readingPassages} index={activeIndex} onChangeIndex={setActiveIndex} />
      )}
      {activeType === "listening" && (
        <ListeningPractice exercises={shuffledData.listeningExercises} index={activeIndex} onChangeIndex={setActiveIndex} countryCode={countryCode} />
      )}
      {activeType === "writing" && (
        <WritingPractice tasks={shuffledData.writingTasks} index={activeIndex} onChangeIndex={setActiveIndex} />
      )}
      {activeType === "speaking" && (
        <SpeakingPractice cards={shuffledData.speakingCards} index={activeIndex} onChangeIndex={setActiveIndex} />
      )}
    </motion.div>
  );
}

// ─── READING PRACTICE ───────────────────────────────────────────────────────

function ReadingPractice({ passages, index, onChangeIndex }: { passages: ReadingPassage[]; index: number; onChangeIndex: (i: number) => void }) {
  const passage = passages[index];
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [timerActive, setTimerActive] = useState(true);
  const [showPassage, setShowPassage] = useState(true);

  // Shuffle questions on mount
  const questions = useMemo(() => shuffleQuestions(passage?.questions || []), [passage?.id]);

  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [timerActive, timeLeft]);

  const handleAnswer = (qId: string, answer: string) => {
    if (showResults) return;
    setAnswers((p) => ({ ...p, [qId]: answer }));
  };

  const handleSubmit = () => {
    setTimerActive(false);
    setShowResults(true);
  };

  const correctCount = questions.filter((q) => answers[q.id] === q.correctAnswer).length;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  if (!passage) return <p className="text-muted-foreground">No reading passages available.</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-display font-bold">{passage.title}</h2>
          <p className="text-xs text-muted-foreground">{passage.source} • {questions.length} questions</p>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${timeLeft < 300 ? "bg-destructive/10 text-destructive" : "bg-muted"}`}>
          <Timer className="h-3 w-3" />
          {mins}:{secs.toString().padStart(2, "0")}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${passage.difficulty === "easy" ? "bg-green-100 text-green-700" : passage.difficulty === "medium" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
          {passage.difficulty.toUpperCase()}
        </span>
        {passages.length > 1 && (
          <div className="flex gap-1 ml-auto">
            {passages.map((_, i) => (
              <button key={i} onClick={() => { onChangeIndex(i); setAnswers({}); setShowResults(false); setTimeLeft(20 * 60); setTimerActive(true); }}
                className={`h-2 w-6 rounded-full transition-colors ${i === index ? "bg-primary" : "bg-muted"}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card card-elevated overflow-hidden">
        <button onClick={() => setShowPassage(!showPassage)} className="w-full flex items-center justify-between p-4 text-sm font-medium hover:bg-muted/30 transition-colors">
          <span className="flex items-center gap-2">
            {showPassage ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showPassage ? "Hide Passage" : "Show Passage"}
          </span>
          {showPassage ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        <AnimatePresence>
          {showPassage && (
            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
              <div className="px-6 pb-6 max-h-[400px] overflow-y-auto">
                <p className="text-sm leading-relaxed whitespace-pre-line text-foreground/80">{passage.passage}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-4">
        {questions.map((q, qi) => (
          <QuestionCard key={q.id} question={q} index={qi} userAnswer={answers[q.id]} showResults={showResults} onAnswer={(ans) => handleAnswer(q.id, ans)} />
        ))}
      </div>

      {!showResults ? (
        <ShimmerButton onClick={handleSubmit} className="w-full">
          <CheckCircle className="h-4 w-4" /> Submit Answers ({Object.keys(answers).length}/{questions.length})
        </ShimmerButton>
      ) : (
        <SparkleBorder>
          <div className="p-6 text-center space-y-2">
            <h3 className="text-xl font-display font-bold">
              <GradientText>{correctCount}/{questions.length} Correct</GradientText>
            </h3>
            <p className="text-sm text-muted-foreground">
              Time used: {20 - mins} minutes {60 - secs} seconds
            </p>
          </div>
        </SparkleBorder>
      )}
    </div>
  );
}

// ─── LISTENING PRACTICE WITH WORD HIGHLIGHTING ──────────────────────────────

type ListeningPhase = "read-questions" | "playing" | "review" | "answer" | "results";

function ListeningPractice({ exercises, index, onChangeIndex, countryCode }: { exercises: ListeningExercise[]; index: number; onChangeIndex: (i: number) => void; countryCode?: string }) {
  const exercise = exercises[index];
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [phase, setPhase] = useState<ListeningPhase>("read-questions");
  const [reviewCountdown, setReviewCountdown] = useState(20);
  const [speechProgress, setSpeechProgress] = useState(0);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const [boundarySupported, setBoundarySupported] = useState(true);

  // Shuffle questions
  const questions = useMemo(() => shuffleQuestions(exercise?.questions || []), [exercise?.id]);

  // Split transcript into words for highlighting
  const transcriptTokens = useMemo(() => {
    if (!exercise) return [];
    return tokenizeTranscript(exercise.transcript);
  }, [exercise?.id]);

  useEffect(() => {
    if (!window.speechSynthesis) setSpeechSupported(false);
  }, []);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Review countdown
  useEffect(() => {
    if (phase !== "review") return;
    if (reviewCountdown <= 0) {
      setPhase("answer");
      return;
    }
    const t = setInterval(() => setReviewCountdown((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [phase, reviewCountdown]);

  // Auto-scroll to highlighted word
  useEffect(() => {
    if (currentWordIndex < 0 || !transcriptRef.current) return;
    const highlighted = transcriptRef.current.querySelector('[data-highlighted="true"]');
    if (highlighted) {
      highlighted.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  }, [currentWordIndex]);

  const handlePlayAudio = useCallback(() => {
    if (!window.speechSynthesis || !exercise) return;

    window.speechSynthesis.cancel();
    if (intervalRef.current) clearInterval(intervalRef.current);
    setPhase("playing");
    setSpeechProgress(0);
    setCurrentWordIndex(-1);
    setBoundarySupported(true);

    const utterance = new SpeechSynthesisUtterance(exercise.transcript);
    utterance.rate = 0.9;
    utterance.pitch = 1;

    const lang = getVoiceLang(countryCode);
    utterance.lang = lang;

    const trySetVoice = () => {
      const voice = getBestVoice(lang);
      if (voice) utterance.voice = voice;
    };
    trySetVoice();
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = trySetVoice;
    }

    let boundaryCount = 0;

    // ONLY use real boundary events for word highlighting — no fallback timer
    utterance.onboundary = (event) => {
      if (typeof event.name === "string" && event.name.length > 0 && event.name !== "word") return;
      if (typeof event.charIndex !== "number") return;

      boundaryCount += 1;
      const tokenIndex = getTokenIndexForChar(transcriptTokens, event.charIndex);
      if (tokenIndex >= 0) {
        setCurrentWordIndex(tokenIndex);
      }
      if (exercise.transcript.length > 0) {
        setSpeechProgress(Math.min((event.charIndex / exercise.transcript.length) * 100, 99));
      }
    };

    // After 3 seconds of speech, if no boundary events fired, mark as unsupported
    setTimeout(() => {
      if (boundaryCount === 0) {
        setBoundarySupported(false);
      }
    }, 3000);

    // Simple progress bar fallback (just for the progress bar, NOT for word highlighting)
    const wordCount = exercise.transcript.split(/\s+/).length;
    const estimatedDuration = (wordCount / 135) * 60 * 1000; // 135 wpm at 0.9 rate
    const startTime = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      // Only update progress bar if boundary events aren't handling it
      if (boundaryCount === 0) {
        setSpeechProgress(Math.min((elapsed / estimatedDuration) * 100, 99));
      }
    }, 500);

    utterance.onend = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setSpeechProgress(100);
      setCurrentWordIndex(-1);
      setPhase("review");
      setReviewCountdown(20);
    };

    utterance.onerror = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setSpeechProgress(100);
      setCurrentWordIndex(-1);
      setPhase("review");
      setReviewCountdown(20);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [exercise, countryCode, transcriptTokens]);

  const handleStopAudio = () => {
    window.speechSynthesis?.cancel();
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrentWordIndex(-1);
    setPhase("review");
    setReviewCountdown(20);
  };

  const handleSkipReview = () => setPhase("answer");

  const handleReset = () => {
    window.speechSynthesis?.cancel();
    if (intervalRef.current) clearInterval(intervalRef.current);
    setPhase("read-questions");
    setAnswers({});
    setShowResults(false);
    setSpeechProgress(0);
    setReviewCountdown(20);
    setCurrentWordIndex(-1);
    setBoundarySupported(true);
  };

  if (!exercise) return <p className="text-muted-foreground">No listening exercises available.</p>;

  const correctCount = questions.filter((q) => answers[q.id] === q.correctAnswer).length;
  const accentLabel = countryCode === "australia" ? "🇦🇺 Australian English" : countryCode === "canada" ? "🇨🇦 Canadian English" : "🇬🇧 British English";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-display font-bold flex items-center gap-2">
            <Headphones className="h-5 w-5 text-primary" /> {exercise.title}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">{exercise.context}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${exercise.difficulty === "easy" ? "bg-green-100 text-green-700" : exercise.difficulty === "medium" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
          {exercise.difficulty.toUpperCase()}
        </span>
        <span className="text-xs text-muted-foreground">Section {exercise.section} • {questions.length} questions</span>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary">{accentLabel}</span>
        {exercises.length > 1 && (
          <div className="flex gap-1 ml-auto">
            {exercises.map((_, i) => (
              <button key={i} onClick={() => { onChangeIndex(i); handleReset(); }}
                className={`h-2 w-6 rounded-full transition-colors ${i === index ? "bg-primary" : "bg-muted"}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Phase indicator */}
      <div className="flex items-center gap-1">
        {(["read-questions", "playing", "review", "answer"] as ListeningPhase[]).map((p, i) => (
          <div key={p} className="flex items-center gap-1 flex-1">
            <div className={`h-1.5 rounded-full flex-1 transition-colors ${
              (["read-questions", "playing", "review", "answer"].indexOf(phase) >= i || phase === "results") ? "bg-primary" : "bg-muted"
            }`} />
            {i < 3 && <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>Read Questions</span><span>Listen</span><span>Review</span><span>Answer</span>
      </div>

      {/* PHASE: Read Questions */}
      {phase === "read-questions" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              <h3 className="font-display font-bold text-sm">Step 1: Read the questions FIRST</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              In the real IELTS test, you get time to read questions before the audio plays.
              Read all {questions.length} questions below, then click "Play Audio" when ready.
            </p>
          </div>

          <div className="space-y-3">
            {questions.map((q, qi) => (
              <div key={q.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-start gap-2">
                  <span className="h-6 w-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 font-bold">{qi + 1}</span>
                  <p className="text-sm font-medium">{q.question}</p>
                </div>
                {q.options && (
                  <div className="ml-8 mt-2 space-y-1">
                    {q.options.map((opt) => (
                      <p key={opt} className="text-xs text-muted-foreground">• {opt}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {!speechSupported ? (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
              <p className="text-xs text-destructive flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Your browser doesn't support text-to-speech. The transcript will be shown as text instead.
              </p>
              <Button onClick={() => setPhase("playing")} variant="outline" className="mt-3 w-full">
                Show Transcript Instead
              </Button>
            </div>
          ) : (
            <ShimmerButton onClick={handlePlayAudio} className="w-full">
              <Volume2 className="h-4 w-4" /> Play Audio — Listen Carefully!
            </ShimmerButton>
          )}
        </motion.div>
      )}

      {/* PHASE: Playing Audio with Word Highlighting */}
      {phase === "playing" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="rounded-xl border-2 border-primary bg-card p-6 card-elevated space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center animate-pulse">
                <Volume2 className="h-7 w-7 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-bold flex items-center gap-2">
                  <PulseDot /> Audio Playing...
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">{accentLabel} • Listen carefully</p>
              </div>
            </div>
            <Progress value={speechProgress} className="h-2" />
            <p className="text-xs text-center text-muted-foreground">{Math.round(speechProgress)}% complete</p>
          </div>

          {/* Transcript with word highlighting */}
          <div className="rounded-xl border border-border bg-card card-elevated overflow-hidden">
            <div className="p-3 bg-muted/30 border-b border-border flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-xs font-medium">
                {boundarySupported ? "Live Transcript — words highlight as spoken" : "Live Transcript — listening..."}
              </span>
            </div>
            <div ref={transcriptRef} className="p-4 max-h-[300px] overflow-y-auto">
              {boundarySupported ? (
                <p className="text-sm leading-relaxed">
                  {transcriptTokens.map((token, i) => {
                    const isHighlighted = i === currentWordIndex;
                    const isPast = i < currentWordIndex;
                    if (!token.isWord) {
                      return <span key={i}>{token.text}</span>;
                    }
                    return (
                      <span
                        key={i}
                        data-highlighted={isHighlighted ? "true" : "false"}
                        className={`transition-colors duration-100 ${
                          isHighlighted
                            ? "bg-primary text-primary-foreground px-0.5 rounded font-semibold"
                            : isPast
                            ? "text-foreground/90"
                            : "text-foreground/40"
                        }`}
                      >
                        {token.text}
                      </span>
                    );
                  })}
                </p>
              ) : (
                <p className="text-sm leading-relaxed whitespace-pre-line text-foreground/80">{exercise.transcript}</p>
              )}
            </div>
          </div>

          <Button onClick={handleStopAudio} variant="outline" className="w-full gap-2">
            <SkipForward className="h-4 w-4" /> Skip to Review Phase
          </Button>
        </motion.div>
      )}

      {/* PHASE: Review (20 second countdown) */}
      {phase === "review" && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
          <div className="rounded-xl border-2 border-accent bg-accent/10 p-6 text-center space-y-3">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-accent/20 mx-auto">
              <span className="text-3xl font-display font-bold text-accent">
                <AnimatedCounter value={reviewCountdown} duration={0.3} />
              </span>
            </div>
            <h3 className="font-display font-bold">Review Time</h3>
            <p className="text-xs text-muted-foreground">
              You have {reviewCountdown} seconds to review the transcript before it closes.
            </p>
            <Progress value={(reviewCountdown / 20) * 100} className="h-1.5" />
          </div>

          <div className="rounded-xl border border-border bg-card card-elevated overflow-hidden">
            <div className="p-3 bg-muted/30 border-b border-border flex items-center gap-2">
              <Timer className="h-4 w-4 text-accent" />
              <span className="text-xs font-medium">Transcript — closing in {reviewCountdown}s</span>
            </div>
            <div className="p-4 max-h-[250px] overflow-y-auto">
              <p className="text-sm leading-relaxed whitespace-pre-line text-foreground/80">{exercise.transcript}</p>
            </div>
          </div>

          <Button onClick={handleSkipReview} variant="outline" className="w-full gap-2">
            <ArrowRight className="h-4 w-4" /> Skip to Questions
          </Button>
        </motion.div>
      )}

      {/* PHASE: Answer Questions */}
      {(phase === "answer" || phase === "results") && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {phase === "answer" && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-primary flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold">Answer from memory!</p>
                <p className="text-xs text-muted-foreground">The transcript is now closed — just like the real IELTS test.</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {questions.map((q, qi) => (
              <QuestionCard key={q.id} question={q} index={qi} userAnswer={answers[q.id]} showResults={showResults} onAnswer={(ans) => !showResults && setAnswers((p) => ({ ...p, [q.id]: ans }))} />
            ))}
          </div>

          {!showResults ? (
            <ShimmerButton onClick={() => { setShowResults(true); setPhase("results"); }} className="w-full">
              <CheckCircle className="h-4 w-4" /> Submit Answers ({Object.keys(answers).length}/{questions.length})
            </ShimmerButton>
          ) : (
            <div className="space-y-4">
              <SparkleBorder>
                <div className="p-6 text-center space-y-2">
                  <h3 className="text-xl font-display font-bold">
                    <GradientText>{correctCount}/{questions.length} Correct</GradientText>
                  </h3>
                </div>
              </SparkleBorder>

              <div className="rounded-xl border border-border bg-card card-elevated overflow-hidden">
                <div className="p-3 bg-muted/30 border-b border-border flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-medium">Transcript (for review)</span>
                </div>
                <div className="p-4 max-h-[300px] overflow-y-auto">
                  <p className="text-sm leading-relaxed whitespace-pre-line text-foreground/80">{exercise.transcript}</p>
                </div>
              </div>

              <Button onClick={handleReset} variant="outline" className="w-full gap-2">
                <ArrowLeft className="h-4 w-4" /> Try Again
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

// ─── WRITING PRACTICE ───────────────────────────────────────────────────────

function WritingPractice({ tasks, index, onChangeIndex }: { tasks: WritingTask[]; index: number; onChangeIndex: (i: number) => void }) {
  const task = tasks[index];
  const [essay, setEssay] = useState("");
  const [showSelfAssess, setShowSelfAssess] = useState(false);
  const [timeLeft, setTimeLeft] = useState((task?.timeLimit || 40) * 60);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [timerActive, timeLeft]);

  if (!task) return <p className="text-muted-foreground">No writing tasks available.</p>;

  const wordCount = essay.trim().split(/\s+/).filter(Boolean).length;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-display font-bold flex items-center gap-2">
            <PenTool className="h-5 w-5 text-primary" /> {task.title}
          </h2>
          <p className="text-xs text-muted-foreground">Task {task.taskNumber} • Minimum {task.wordLimit} words • {task.timeLimit} minutes</p>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${timeLeft < 300 ? "bg-destructive/10 text-destructive" : "bg-muted"}`}>
          <Timer className="h-3 w-3" />
          {mins}:{secs.toString().padStart(2, "0")}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${task.difficulty === "easy" ? "bg-green-100 text-green-700" : task.difficulty === "medium" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
          {task.difficulty.toUpperCase()}
        </span>
        {tasks.length > 1 && (
          <div className="flex gap-1 ml-auto">
            {tasks.map((_, i) => (
              <button key={i} onClick={() => { onChangeIndex(i); setEssay(""); setShowSelfAssess(false); setTimeLeft((tasks[i]?.timeLimit || 40) * 60); setTimerActive(false); }}
                className={`h-2 w-6 rounded-full transition-colors ${i === index ? "bg-primary" : "bg-muted"}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card p-6 card-elevated">
        <p className="text-sm leading-relaxed whitespace-pre-line">{task.prompt}</p>
      </div>

      <div className="rounded-xl bg-accent/10 border border-accent/20 p-4 space-y-2">
        <h4 className="text-xs font-semibold text-accent">💡 Tips</h4>
        {task.tips.map((tip, i) => (
          <p key={i} className="text-xs text-foreground/70 flex items-start gap-2">
            <span className="h-1 w-1 rounded-full bg-accent mt-1.5 flex-shrink-0" /> {tip}
          </p>
        ))}
      </div>

      <div className="space-y-2">
        <textarea
          value={essay}
          onChange={(e) => setEssay(e.target.value)}
          onFocus={() => !timerActive && setTimerActive(true)}
          placeholder="Start writing your response here... (timer starts when you begin typing)"
          className="w-full min-h-[300px] p-4 rounded-xl border border-border bg-background text-sm leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Words: <span className={wordCount >= task.wordLimit ? "text-primary font-semibold" : "text-destructive font-semibold"}>{wordCount}</span> / {task.wordLimit} minimum
          </span>
          <Progress value={Math.min((wordCount / task.wordLimit) * 100, 100)} className="w-24 h-1.5" />
        </div>
      </div>

      {!showSelfAssess ? (
        <ShimmerButton onClick={() => { setTimerActive(false); setShowSelfAssess(true); }} className="w-full">
          <Send className="h-4 w-4" /> Submit for Self-Assessment
        </ShimmerButton>
      ) : (
        <SparkleBorder>
          <div className="p-6 space-y-4">
            <h3 className="font-display font-bold text-center">
              <GradientText>Self-Assessment Checklist</GradientText>
            </h3>
            <p className="text-xs text-muted-foreground text-center">Rate yourself honestly on each criterion</p>
            <div className="space-y-3">
              {task.criteria.map((c, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/30 border border-border">
                  <p className="text-sm font-semibold">{c.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.description}</p>
                </div>
              ))}
            </div>
          </div>
        </SparkleBorder>
      )}
    </div>
  );
}

// ─── SPEAKING PRACTICE WITH RECORDING ───────────────────────────────────────

function SpeakingPractice({ cards, index, onChangeIndex }: { cards: SpeakingCueCard[]; index: number; onChangeIndex: (i: number) => void }) {
  const card = cards[index];
  const [phase, setPhase] = useState<"prep" | "speaking" | "done">("prep");
  const [timeLeft, setTimeLeft] = useState(card?.part === 2 ? 60 : card?.timeLimit || 120);
  const [showIdeas, setShowIdeas] = useState(false);

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<{ url: string; timestamp: number }[]>([]);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [recordingSupported, setRecordingSupported] = useState(true);

  useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setRecordingSupported(false);
    }
  }, []);

  useEffect(() => {
    if (phase === "done") return;
    if (timeLeft <= 0) {
      if (phase === "prep") {
        setPhase("speaking");
        setTimeLeft(card?.timeLimit || 120);
      } else {
        stopRecording();
        setPhase("done");
      }
      return;
    }
    const t = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, phase]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      recordings.forEach(r => URL.revokeObjectURL(r.url));
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setRecordings(prev => [...prev, { url, timestamp: Date.now() }]);
        stream.getTracks().forEach(t => t.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied:", err);
      setRecordingSupported(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const playRecording = (idx: number) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(recordings[idx].url);
    audio.onended = () => setPlayingIndex(null);
    audio.play();
    audioRef.current = audio;
    setPlayingIndex(idx);
  };

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlayingIndex(null);
  };

  const deleteRecording = (idx: number) => {
    URL.revokeObjectURL(recordings[idx].url);
    setRecordings(prev => prev.filter((_, i) => i !== idx));
    if (playingIndex === idx) stopPlayback();
  };

  if (!card) return <p className="text-muted-foreground">No speaking cards available.</p>;

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-display font-bold flex items-center gap-2">
          <Mic className="h-5 w-5 text-primary" /> Speaking Part {card.part}
        </h2>
        <p className="text-xs text-muted-foreground">
          {card.part === 1 ? "Interview Questions" : card.part === 2 ? "Individual Long Turn" : "Discussion"}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${card.difficulty === "easy" ? "bg-green-100 text-green-700" : card.difficulty === "medium" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
          {card.difficulty.toUpperCase()}
        </span>
        {cards.length > 1 && (
          <div className="flex gap-1 ml-auto">
            {cards.map((_, i) => (
              <button key={i} onClick={() => { onChangeIndex(i); setPhase("prep"); setTimeLeft(cards[i]?.part === 2 ? 60 : cards[i]?.timeLimit || 120); setShowIdeas(false); setRecordings([]); }}
                className={`h-2 w-6 rounded-full transition-colors ${i === index ? "bg-primary" : "bg-muted"}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Timer */}
      <div className="text-center">
        <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-bold ${phase === "prep" ? "bg-accent/20 text-accent" : phase === "speaking" ? "bg-primary/20 text-primary" : "bg-muted"}`}>
          {phase === "prep" && <Clock className="h-5 w-5" />}
          {phase === "speaking" && <Mic className="h-5 w-5 animate-pulse" />}
          {phase === "done" && <CheckCircle className="h-5 w-5" />}
          {phase === "done" ? "Time's up!" : `${mins}:${secs.toString().padStart(2, "0")}`}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {phase === "prep" ? "Preparation time — make notes!" : phase === "speaking" ? (isRecording ? "🔴 Recording your speech..." : "Speak now! Tap record to capture.") : "Review your performance below."}
        </p>
      </div>

      {/* Cue Card */}
      <SparkleBorder>
        <div className="p-6 space-y-4">
          <h3 className="font-display font-bold text-lg">{card.topic}</h3>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">You should say:</p>
            {card.prompts.map((p, i) => (
              <p key={i} className="text-sm flex items-start gap-2">
                <span className="h-5 w-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">{i + 1}</span>
                {p}
              </p>
            ))}
          </div>
        </div>
      </SparkleBorder>

      {/* Recording Controls */}
      {phase === "speaking" && recordingSupported && (
        <div className="rounded-xl border-2 border-primary/30 bg-card p-4 space-y-3">
          <div className="flex items-center justify-center gap-3">
            {!isRecording ? (
              <Button onClick={startRecording} variant="hero" className="gap-2">
                <CircleDot className="h-4 w-4" /> Start Recording
              </Button>
            ) : (
              <Button onClick={stopRecording} variant="destructive" className="gap-2">
                <Square className="h-4 w-4" /> Stop Recording
              </Button>
            )}
          </div>
          {isRecording && (
            <div className="flex items-center justify-center gap-2 text-xs text-destructive">
              <PulseDot color="bg-destructive" size="h-2 w-2" />
              Recording in progress...
            </div>
          )}
        </div>
      )}

      {/* Controls */}
      {phase === "prep" && (
        <Button onClick={() => { setPhase("speaking"); setTimeLeft(card.timeLimit); }} variant="hero" className="w-full gap-2">
          <Mic className="h-4 w-4" /> Start Speaking Now
        </Button>
      )}

      {phase === "speaking" && (
        <Button onClick={() => { stopRecording(); setPhase("done"); }} variant="outline" className="w-full">
          <CheckCircle className="h-4 w-4" /> I'm Done Speaking
        </Button>
      )}

      {phase === "done" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {/* Recordings playback */}
          {recordings.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-4 card-elevated space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Mic className="h-4 w-4 text-primary" /> Your Recordings ({recordings.length})
              </h4>
              {recordings.map((rec, i) => (
                <div key={rec.timestamp} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <span className="text-xs text-muted-foreground font-mono">#{i + 1}</span>
                  <Button
                    size="sm"
                    variant={playingIndex === i ? "destructive" : "outline"}
                    onClick={() => playingIndex === i ? stopPlayback() : playRecording(i)}
                    className="gap-1"
                  >
                    {playingIndex === i ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                    {playingIndex === i ? "Stop" : "Play"}
                  </Button>
                  <span className="text-xs text-muted-foreground flex-1">
                    {new Date(rec.timestamp).toLocaleTimeString()}
                  </span>
                  <Button size="sm" variant="ghost" onClick={() => deleteRecording(i)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-xl border border-border bg-card p-5 card-elevated space-y-3">
            <h4 className="text-sm font-semibold">Follow-up Questions (Part 3 style):</h4>
            {card.followUpQuestions.map((q, i) => (
              <p key={i} className="text-sm text-foreground/70 flex items-start gap-2">
                <span className="text-primary font-bold">Q{i + 1}.</span> {q}
              </p>
            ))}
          </div>

          <button onClick={() => setShowIdeas(!showIdeas)} className="flex items-center gap-2 text-sm text-primary hover:underline">
            {showIdeas ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            {showIdeas ? "Hide" : "Show"} sample ideas
          </button>

          {showIdeas && (
            <div className="rounded-xl bg-accent/10 border border-accent/20 p-4 space-y-2">
              {card.sampleIdeas.map((idea, i) => (
                <p key={i} className="text-xs text-foreground/70 flex items-start gap-2">
                  <span className="h-1 w-1 rounded-full bg-accent mt-1.5 flex-shrink-0" /> {idea}
                </p>
              ))}
            </div>
          )}

          <Button onClick={() => { setPhase("prep"); setTimeLeft(card.part === 2 ? 60 : card.timeLimit); setShowIdeas(false); }} variant="outline" className="w-full gap-2">
            <ArrowLeft className="h-4 w-4" /> Try Again
          </Button>
        </motion.div>
      )}
    </div>
  );
}

// ─── SHARED QUESTION CARD ───────────────────────────────────────────────────

function QuestionCard({ question, index, userAnswer, showResults, onAnswer }: {
  question: PracticeQuestion;
  index: number;
  userAnswer?: string;
  showResults: boolean;
  onAnswer: (answer: string) => void;
}) {
  const isCorrect = userAnswer === question.correctAnswer;
  const options = question.options || (question.type === "true-false-ng" ? ["True", "False", "Not Given"] : []);

  return (
    <div className={`rounded-xl border p-4 space-y-3 transition-colors ${
      showResults ? (isCorrect ? "border-green-300 bg-green-50/50" : "border-destructive/30 bg-destructive/5") : "border-border bg-card"
    }`}>
      <div className="flex items-start gap-2">
        <span className="h-6 w-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 font-bold">{index + 1}</span>
        <div className="flex-1">
          <p className="text-sm font-medium">{question.question}</p>
          <span className={`text-[10px] px-1.5 py-0.5 rounded mt-1 inline-block ${question.difficulty === "easy" ? "bg-green-100 text-green-700" : question.difficulty === "medium" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
            {question.difficulty}
          </span>
        </div>
      </div>

      {question.type === "fill-blank" || question.type === "short-answer" ? (
        <input
          type="text"
          value={userAnswer || ""}
          onChange={(e) => onAnswer(e.target.value)}
          disabled={showResults}
          placeholder="Type your answer..."
          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 disabled:opacity-60"
        />
      ) : (
        <div className="space-y-2">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => onAnswer(opt)}
              disabled={showResults}
              className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-all ${
                showResults
                  ? opt === question.correctAnswer
                    ? "border-green-400 bg-green-50 text-green-800 font-medium"
                    : userAnswer === opt
                    ? "border-destructive bg-destructive/10 text-destructive"
                    : "border-border opacity-50"
                  : userAnswer === opt
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                  : "border-border hover:border-primary/40"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {showResults && (
        <div className={`text-xs p-2 rounded-lg ${isCorrect ? "bg-green-100/50 text-green-700" : "bg-destructive/10 text-destructive"}`}>
          {isCorrect ? (
            <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Correct!</span>
          ) : (
            <span className="flex items-center gap-1"><XCircle className="h-3 w-3" /> Correct answer: {question.correctAnswer}</span>
          )}
          <p className="mt-1 text-foreground/60">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
