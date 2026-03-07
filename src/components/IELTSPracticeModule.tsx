import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, Headphones, PenTool, Mic, Clock, CheckCircle, XCircle, Eye, EyeOff, Timer, Volume2, Send, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { GradientText, TiltCard, StaggerContainer, StaggerItem, ShimmerButton, SparkleBorder } from "@/components/ui/animated-bits";
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
  onBack: () => void;
}

export default function IELTSPracticeModule({ practiceData, countryName, onBack }: Props) {
  const [activeType, setActiveType] = useState<PracticeType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const tabs: { type: PracticeType; icon: React.ReactNode; label: string; count: number }[] = [
    { type: "reading", icon: <BookOpen className="h-5 w-5" />, label: "Reading", count: practiceData.readingPassages.length },
    { type: "listening", icon: <Headphones className="h-5 w-5" />, label: "Listening", count: practiceData.listeningExercises.length },
    { type: "writing", icon: <PenTool className="h-5 w-5" />, label: "Writing", count: practiceData.writingTasks.length },
    { type: "speaking", icon: <Mic className="h-5 w-5" />, label: "Speaking", count: practiceData.speakingCards.length },
  ];

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
              <TiltCard className="cursor-pointer" >
                <button
                  onClick={() => { setActiveType(tab.type); setActiveIndex(0); }}
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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <button onClick={() => setActiveType(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-3 w-3" /> Back to Practice Zone
      </button>

      {activeType === "reading" && (
        <ReadingPractice
          passages={practiceData.readingPassages}
          index={activeIndex}
          onChangeIndex={setActiveIndex}
        />
      )}
      {activeType === "listening" && (
        <ListeningPractice
          exercises={practiceData.listeningExercises}
          index={activeIndex}
          onChangeIndex={setActiveIndex}
        />
      )}
      {activeType === "writing" && (
        <WritingPractice
          tasks={practiceData.writingTasks}
          index={activeIndex}
          onChangeIndex={setActiveIndex}
        />
      )}
      {activeType === "speaking" && (
        <SpeakingPractice
          cards={practiceData.speakingCards}
          index={activeIndex}
          onChangeIndex={setActiveIndex}
        />
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

  const correctCount = passage.questions.filter((q) => answers[q.id] === q.correctAnswer).length;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  if (!passage) return <p className="text-muted-foreground">No reading passages available.</p>;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-display font-bold">{passage.title}</h2>
          <p className="text-xs text-muted-foreground">{passage.source} • {passage.questions.length} questions</p>
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

      {/* Passage toggle */}
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

      {/* Questions */}
      <div className="space-y-4">
        {passage.questions.map((q, qi) => (
          <QuestionCard
            key={q.id}
            question={q}
            index={qi}
            userAnswer={answers[q.id]}
            showResults={showResults}
            onAnswer={(ans) => handleAnswer(q.id, ans)}
          />
        ))}
      </div>

      {/* Submit / Results */}
      {!showResults ? (
        <ShimmerButton onClick={handleSubmit} className="w-full">
          <CheckCircle className="h-4 w-4" /> Submit Answers ({Object.keys(answers).length}/{passage.questions.length})
        </ShimmerButton>
      ) : (
        <SparkleBorder>
          <div className="p-6 text-center space-y-2">
            <h3 className="text-xl font-display font-bold">
              <GradientText>{correctCount}/{passage.questions.length} Correct</GradientText>
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

// ─── LISTENING PRACTICE ─────────────────────────────────────────────────────

function ListeningPractice({ exercises, index, onChangeIndex }: { exercises: ListeningExercise[]; index: number; onChangeIndex: (i: number) => void }) {
  const exercise = exercises[index];
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!exercise) return <p className="text-muted-foreground">No listening exercises available.</p>;

  const correctCount = exercise.questions.filter((q) => answers[q.id] === q.correctAnswer).length;

  const handleSimulatePlay = () => {
    setIsPlaying(true);
    // Reveal transcript after a short delay to simulate "listening"
    setTimeout(() => {
      setShowTranscript(true);
      setIsPlaying(false);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-display font-bold flex items-center gap-2">
          <Headphones className="h-5 w-5 text-primary" /> {exercise.title}
        </h2>
        <p className="text-xs text-muted-foreground mt-1">{exercise.context}</p>
      </div>

      <div className="flex items-center gap-2">
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${exercise.difficulty === "easy" ? "bg-green-100 text-green-700" : exercise.difficulty === "medium" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
          {exercise.difficulty.toUpperCase()}
        </span>
        <span className="text-xs text-muted-foreground">Section {exercise.section} • {exercise.questions.length} questions</span>
      </div>

      {/* Audio simulation */}
      <div className="rounded-xl border border-border bg-card p-4 card-elevated">
        <div className="flex items-center gap-4">
          <button
            onClick={handleSimulatePlay}
            disabled={isPlaying || showTranscript}
            className={`h-12 w-12 rounded-full flex items-center justify-center transition-all ${
              isPlaying ? "bg-primary animate-pulse" : showTranscript ? "bg-muted" : "bg-primary hover:bg-primary/90"
            } text-primary-foreground`}
          >
            <Volume2 className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <p className="text-sm font-medium">
              {isPlaying ? "Playing audio..." : showTranscript ? "Transcript revealed — read and answer" : "Click play to begin listening exercise"}
            </p>
            <p className="text-xs text-muted-foreground">
              {showTranscript ? "Read the transcript carefully, then answer the questions below" : "In a real test, you'd hear this audio once. Read questions first!"}
            </p>
          </div>
        </div>
        {isPlaying && <Progress value={50} className="h-1 mt-3 animate-pulse" />}
      </div>

      {/* Transcript */}
      <AnimatePresence>
        {showTranscript && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card card-elevated overflow-hidden">
            <div className="p-4 bg-muted/30 border-b border-border flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Audio Transcript</span>
            </div>
            <div className="p-6 max-h-[400px] overflow-y-auto">
              <p className="text-sm leading-relaxed whitespace-pre-line text-foreground/80">{exercise.transcript}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Questions — only show after transcript */}
      {showTranscript && (
        <div className="space-y-4">
          {exercise.questions.map((q, qi) => (
            <QuestionCard
              key={q.id}
              question={q}
              index={qi}
              userAnswer={answers[q.id]}
              showResults={showResults}
              onAnswer={(ans) => !showResults && setAnswers((p) => ({ ...p, [q.id]: ans }))}
            />
          ))}

          {!showResults ? (
            <ShimmerButton onClick={() => setShowResults(true)} className="w-full">
              <CheckCircle className="h-4 w-4" /> Submit Answers ({Object.keys(answers).length}/{exercise.questions.length})
            </ShimmerButton>
          ) : (
            <SparkleBorder>
              <div className="p-6 text-center space-y-2">
                <h3 className="text-xl font-display font-bold">
                  <GradientText>{correctCount}/{exercise.questions.length} Correct</GradientText>
                </h3>
              </div>
            </SparkleBorder>
          )}
        </div>
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

      {/* Prompt */}
      <div className="rounded-xl border border-border bg-card p-6 card-elevated">
        <p className="text-sm leading-relaxed whitespace-pre-line">{task.prompt}</p>
      </div>

      {/* Tips */}
      <div className="rounded-xl bg-accent/10 border border-accent/20 p-4 space-y-2">
        <h4 className="text-xs font-semibold text-accent">💡 Tips</h4>
        {task.tips.map((tip, i) => (
          <p key={i} className="text-xs text-foreground/70 flex items-start gap-2">
            <span className="h-1 w-1 rounded-full bg-accent mt-1.5 flex-shrink-0" /> {tip}
          </p>
        ))}
      </div>

      {/* Writing area */}
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

      {/* Submit */}
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
            <p className="text-xs text-muted-foreground text-center">
              Rate yourself honestly on each criterion (British Council / IELTS standard)
            </p>
            <div className="space-y-3">
              {task.criteria.map((c, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/30 border border-border">
                  <p className="text-sm font-semibold">{c.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.description}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center italic">
              For accurate scoring, consider submitting your essay to a certified IELTS examiner for professional feedback.
            </p>
          </div>
        </SparkleBorder>
      )}
    </div>
  );
}

// ─── SPEAKING PRACTICE ──────────────────────────────────────────────────────

function SpeakingPractice({ cards, index, onChangeIndex }: { cards: SpeakingCueCard[]; index: number; onChangeIndex: (i: number) => void }) {
  const card = cards[index];
  const [phase, setPhase] = useState<"prep" | "speaking" | "done">("prep");
  const [timeLeft, setTimeLeft] = useState(card?.part === 2 ? 60 : card?.timeLimit || 120);
  const [speakingTime, setSpeakingTime] = useState(card?.timeLimit || 120);
  const [showIdeas, setShowIdeas] = useState(false);

  useEffect(() => {
    if (phase === "done") return;
    if (timeLeft <= 0) {
      if (phase === "prep") {
        setPhase("speaking");
        setSpeakingTime(card?.timeLimit || 120);
        setTimeLeft(card?.timeLimit || 120);
      } else {
        setPhase("done");
      }
      return;
    }
    const t = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, phase]);

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
              <button key={i} onClick={() => { onChangeIndex(i); setPhase("prep"); setTimeLeft(cards[i]?.part === 2 ? 60 : cards[i]?.timeLimit || 120); setShowIdeas(false); }}
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
          {phase === "prep" ? "Preparation time — make notes!" : phase === "speaking" ? "Speak now! Cover all the prompts." : "Review your performance below."}
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

      {/* Controls */}
      {phase === "prep" && (
        <Button onClick={() => { setPhase("speaking"); setTimeLeft(card.timeLimit); }} variant="hero" className="w-full gap-2">
          <Mic className="h-4 w-4" /> Start Speaking Now
        </Button>
      )}

      {phase === "speaking" && (
        <Button onClick={() => setPhase("done")} variant="outline" className="w-full">
          <CheckCircle className="h-4 w-4" /> I'm Done Speaking
        </Button>
      )}

      {/* Follow-up questions & ideas (after done) */}
      {phase === "done" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
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
