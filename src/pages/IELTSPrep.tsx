import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle, Clock, ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { IELTS_MODULES, IELTS_TEST_QUESTIONS, type IELTSModule, type IELTSQuestion } from "@/lib/ieltsData";
import { GradientText } from "@/components/ui/animated-bits";

type View = "modules" | "lesson" | "test" | "results";

export default function IELTSPrepPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectCountry = searchParams.get("country") || "";
  const redirectVisa = searchParams.get("visa") || "";

  const [view, setView] = useState<View>("modules");
  const [activeModule, setActiveModule] = useState<IELTSModule | null>(null);
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  // Test state
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [testScore, setTestScore] = useState<number | null>(null);

  const totalLessons = IELTS_MODULES.reduce((sum, m) => sum + m.lessons.length, 0);
  const progress = (completedLessons.size / totalLessons) * 100;

  const handleStartLesson = (mod: IELTSModule, lessonIdx: number) => {
    setActiveModule(mod);
    setActiveLessonIdx(lessonIdx);
    setView("lesson");
  };

  const handleCompleteLesson = () => {
    if (!activeModule) return;
    const lessonId = activeModule.lessons[activeLessonIdx].id;
    setCompletedLessons((prev) => new Set([...prev, lessonId]));

    if (activeLessonIdx < activeModule.lessons.length - 1) {
      setActiveLessonIdx(activeLessonIdx + 1);
    } else {
      setView("modules");
      setActiveModule(null);
    }
  };

  const handleStartTest = () => {
    setCurrentQ(0);
    setAnswers({});
    setTestScore(null);
    setView("test");
  };

  const handleAnswer = (qId: string, answerIdx: number) => {
    setAnswers((prev) => ({ ...prev, [qId]: answerIdx }));
  };

  const handleSubmitTest = () => {
    let correct = 0;
    IELTS_TEST_QUESTIONS.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) correct++;
    });
    setTestScore(correct);
    setView("results");
  };

  const estimatedBand = testScore !== null
    ? testScore >= 11 ? "8.0-9.0" : testScore >= 9 ? "7.0-7.5" : testScore >= 7 ? "6.0-6.5" : testScore >= 5 ? "5.0-5.5" : "4.0-4.5"
    : "";

  const handleProceedToEligibility = () => {
    if (redirectCountry) {
      navigate(`/check/${redirectCountry}?visa=${redirectVisa}`);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="hero-gradient pt-28 pb-20 px-4">
        <div className="container max-w-3xl mx-auto">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground mb-6 transition-colors text-sm">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-2">
            IELTS <GradientText from="hsl(38, 92%, 55%)" to="hsl(38, 92%, 75%)">Preparation</GradientText>
          </h1>
          <p className="text-primary-foreground/60 text-sm">Full course modules with lessons, practice, and a final mock test</p>
          <div className="mt-4 flex items-center gap-3">
            <Progress value={progress} className="flex-1 h-2 bg-primary-foreground/20" />
            <span className="text-primary-foreground text-xs font-semibold">{completedLessons.size}/{totalLessons} lessons</span>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="container max-w-3xl mx-auto px-4 -mt-8 pb-16 space-y-6">

          {/* MODULE LIST */}
          {view === "modules" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {IELTS_MODULES.map((mod) => {
                const modCompleted = mod.lessons.filter((l) => completedLessons.has(l.id)).length;
                const isExpanded = expandedModule === mod.id;
                return (
                  <div key={mod.id} className="rounded-xl border border-border bg-card card-elevated overflow-hidden">
                    <button
                      onClick={() => setExpandedModule(isExpanded ? null : mod.id)}
                      className="w-full flex items-center gap-4 p-5 text-left hover:bg-muted/30 transition-colors"
                    >
                      <span className="text-4xl">{mod.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-display font-bold text-lg">{mod.title}</h3>
                        <p className="text-sm text-muted-foreground">{mod.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Progress value={(modCompleted / mod.lessons.length) * 100} className="flex-1 h-1.5" />
                          <span className="text-xs text-muted-foreground">{modCompleted}/{mod.lessons.length}</span>
                        </div>
                      </div>
                      {isExpanded ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-border overflow-hidden"
                        >
                          <div className="p-4 space-y-2">
                            {mod.lessons.map((lesson, idx) => {
                              const done = completedLessons.has(lesson.id);
                              return (
                                <button
                                  key={lesson.id}
                                  onClick={() => handleStartLesson(mod, idx)}
                                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                                    done ? "border-emerald-200 bg-emerald-50/50" : "border-border hover:border-primary/40"
                                  }`}
                                >
                                  {done ? (
                                    <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                                  ) : (
                                    <BookOpen className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                  )}
                                  <div className="flex-1">
                                    <span className="text-sm font-medium">{lesson.title}</span>
                                  </div>
                                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" /> {lesson.duration}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              {/* Take test button */}
              <div className="rounded-xl border border-accent/30 bg-accent/5 p-6 text-center space-y-3">
                <h3 className="font-display text-lg font-bold">Ready for the Mock Test?</h3>
                <p className="text-sm text-muted-foreground">
                  {completedLessons.size < totalLessons
                    ? `Complete all ${totalLessons} lessons for the best preparation, or take the test now.`
                    : "You've completed all lessons! Take the mock test to assess your readiness."
                  }
                </p>
                <Button onClick={handleStartTest} variant="hero" size="lg" className="gap-2">
                  Start Mock Test <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Skip to eligibility */}
              {redirectCountry && (
                <div className="text-center">
                  <button onClick={handleProceedToEligibility} className="text-sm text-muted-foreground hover:text-primary underline">
                    Skip and go to eligibility check →
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* LESSON VIEW */}
          {view === "lesson" && activeModule && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{activeModule.icon} {activeModule.title}</span>
                <span>•</span>
                <span>Lesson {activeLessonIdx + 1} of {activeModule.lessons.length}</span>
              </div>

              <div className="rounded-2xl border border-border bg-card p-8 card-elevated space-y-6">
                <h2 className="text-2xl font-display font-bold">{activeModule.lessons[activeLessonIdx].title}</h2>
                <p className="text-foreground/80 leading-relaxed">{activeModule.lessons[activeLessonIdx].content}</p>

                <div className="rounded-xl bg-accent/10 border border-accent/20 p-5">
                  <h4 className="flex items-center gap-2 text-sm font-semibold mb-3">
                    <Lightbulb className="h-4 w-4 text-accent" /> Key Tips
                  </h4>
                  <ul className="space-y-2">
                    {activeModule.lessons[activeLessonIdx].tips.map((tip, i) => (
                      <li key={i} className="text-sm text-foreground/70 flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => { setView("modules"); setActiveModule(null); }} className="flex-1">
                  Back to Modules
                </Button>
                <Button onClick={handleCompleteLesson} className="flex-1 gap-2">
                  {activeLessonIdx < activeModule.lessons.length - 1 ? "Next Lesson" : "Complete Module"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* TEST VIEW */}
          {view === "test" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-display font-bold">Mock Test</h2>
                <span className="text-sm text-muted-foreground">
                  Question {currentQ + 1} of {IELTS_TEST_QUESTIONS.length}
                </span>
              </div>

              <Progress value={((currentQ + 1) / IELTS_TEST_QUESTIONS.length) * 100} className="h-2" />

              {(() => {
                const q = IELTS_TEST_QUESTIONS[currentQ];
                return (
                  <div className="rounded-2xl border border-border bg-card p-8 card-elevated space-y-6">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="px-2 py-0.5 rounded-full bg-muted font-medium capitalize">{q.module}</span>
                    </div>
                    <h3 className="text-lg font-semibold">{q.question}</h3>
                    <div className="space-y-3">
                      {q.options.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAnswer(q.id, idx)}
                          className={`w-full text-left p-4 rounded-lg border transition-all ${
                            answers[q.id] === idx
                              ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                              : "border-border hover:border-primary/40"
                          }`}
                        >
                          <span className="text-sm">{opt}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}

              <div className="flex gap-3">
                <Button variant="outline" disabled={currentQ === 0} onClick={() => setCurrentQ(currentQ - 1)} className="flex-1">
                  Previous
                </Button>
                {currentQ < IELTS_TEST_QUESTIONS.length - 1 ? (
                  <Button onClick={() => setCurrentQ(currentQ + 1)} disabled={!answers[IELTS_TEST_QUESTIONS[currentQ].id] && answers[IELTS_TEST_QUESTIONS[currentQ].id] !== 0} className="flex-1 gap-2">
                    Next <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmitTest} variant="hero" disabled={Object.keys(answers).length < IELTS_TEST_QUESTIONS.length} className="flex-1">
                    Submit Test
                  </Button>
                )}
              </div>
            </motion.div>
          )}

          {/* RESULTS VIEW */}
          {view === "results" && testScore !== null && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              <div className="rounded-2xl border border-border bg-card card-elevated overflow-hidden">
                <div className="hero-gradient p-8 text-center text-primary-foreground">
                  <h2 className="text-2xl font-display font-bold mb-2">Mock Test Results</h2>
                  <div className="text-6xl font-display font-bold my-4">{testScore}/{IELTS_TEST_QUESTIONS.length}</div>
                  <p className="text-primary-foreground/70">Estimated Band: <span className="font-bold text-accent">{estimatedBand}</span></p>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="font-semibold">Review Answers</h3>
                  {IELTS_TEST_QUESTIONS.map((q) => {
                    const isCorrect = answers[q.id] === q.correctAnswer;
                    return (
                      <div key={q.id} className={`p-4 rounded-lg border ${isCorrect ? "border-emerald-200 bg-emerald-50/50" : "border-destructive/20 bg-destructive/5"}`}>
                        <p className="text-sm font-medium mb-1">{q.question}</p>
                        <p className="text-xs text-muted-foreground">
                          Your answer: <span className={isCorrect ? "text-emerald-600 font-semibold" : "text-destructive font-semibold"}>{q.options[answers[q.id]]}</span>
                          {!isCorrect && <> • Correct: <span className="text-emerald-600 font-semibold">{q.options[q.correctAnswer]}</span></>}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{q.explanation}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setView("modules")} className="flex-1">
                  Back to Modules
                </Button>
                <Button variant="hero" onClick={handleProceedToEligibility} className="flex-1 gap-2">
                  Proceed to Eligibility Check <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
