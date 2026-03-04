import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, FileText, CheckCircle, Clock, Upload, AlertCircle,
  ChevronRight, Shield, Plane, BookOpen, Briefcase, CreditCard,
  Globe, Heart, Users, Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  AnimatedCounter, GradientText, PulseDot, TiltCard,
  StaggerContainer, StaggerItem, SparkleBorder
} from "@/components/ui/animated-bits";

interface ApplicationStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  status: "completed" | "in-progress" | "pending" | "blocked";
  documents: DocumentItem[];
}

interface DocumentItem {
  name: string;
  status: "uploaded" | "pending" | "rejected" | "not-required";
  note?: string;
}

const DEMO_STEPS: ApplicationStep[] = [
  {
    id: "1",
    title: "Profile Setup",
    description: "Complete your personal information and preferences",
    icon: Users,
    status: "completed",
    documents: [
      { name: "Passport Copy", status: "uploaded" },
      { name: "Passport Photos (2x)", status: "uploaded" },
      { name: "Birth Certificate", status: "uploaded" },
    ],
  },
  {
    id: "2",
    title: "Eligibility Assessment",
    description: "AI-powered profile evaluation and scoring",
    icon: Shield,
    status: "completed",
    documents: [
      { name: "Eligibility Report", status: "uploaded", note: "Score: 78/100" },
    ],
  },
  {
    id: "3",
    title: "Document Collection",
    description: "Gather and upload all required documents",
    icon: FileText,
    status: "in-progress",
    documents: [
      { name: "Academic Transcripts", status: "uploaded" },
      { name: "Degree Certificate", status: "uploaded" },
      { name: "IELTS Score Report", status: "pending" },
      { name: "Work Experience Letters", status: "pending" },
      { name: "Police Clearance Certificate", status: "pending" },
      { name: "Medical Examination", status: "not-required" },
    ],
  },
  {
    id: "4",
    title: "Financial Proof",
    description: "Submit financial documents and proof of funds",
    icon: CreditCard,
    status: "pending",
    documents: [
      { name: "Bank Statements (6 months)", status: "pending" },
      { name: "Sponsorship Letter", status: "not-required" },
      { name: "GIC/Financial Guarantee", status: "pending" },
    ],
  },
  {
    id: "5",
    title: "Application Submission",
    description: "Review and submit your visa application",
    icon: Upload,
    status: "pending",
    documents: [
      { name: "Application Form", status: "pending" },
      { name: "Statement of Purpose", status: "pending" },
      { name: "Cover Letter", status: "pending" },
    ],
  },
  {
    id: "6",
    title: "Visa Decision",
    description: "Wait for embassy processing and decision",
    icon: Plane,
    status: "pending",
    documents: [],
  },
];

const statusConfig = {
  completed: { color: "text-emerald-600", bg: "bg-emerald-100", border: "border-emerald-200", label: "Completed", icon: CheckCircle },
  "in-progress": { color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", label: "In Progress", icon: Clock },
  pending: { color: "text-muted-foreground", bg: "bg-muted", border: "border-border", label: "Pending", icon: Clock },
  blocked: { color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20", label: "Blocked", icon: AlertCircle },
};

const docStatusConfig = {
  uploaded: { color: "text-emerald-600", bg: "bg-emerald-50", icon: CheckCircle, label: "Uploaded" },
  pending: { color: "text-amber-600", bg: "bg-amber-50", icon: Clock, label: "Pending" },
  rejected: { color: "text-destructive", bg: "bg-destructive/10", icon: AlertCircle, label: "Rejected" },
  "not-required": { color: "text-muted-foreground", bg: "bg-muted/50", icon: CheckCircle, label: "Not Required" },
};

export default function ApplicationTracker() {
  const navigate = useNavigate();
  const [steps] = useState<ApplicationStep[]>(DEMO_STEPS);
  const [expandedStep, setExpandedStep] = useState<string | null>("3");

  const completedSteps = steps.filter(s => s.status === "completed").length;
  const totalSteps = steps.length;
  const progressPercent = Math.round((completedSteps / totalSteps) * 100);

  const totalDocs = steps.flatMap(s => s.documents).filter(d => d.status !== "not-required").length;
  const uploadedDocs = steps.flatMap(s => s.documents).filter(d => d.status === "uploaded").length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Hero */}
      <div className="hero-gradient pt-28 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-primary-foreground/5"
              style={{
                width: 40 + i * 30,
                height: 40 + i * 30,
                left: `${10 + i * 16}%`,
                top: `${30 + (i % 3) * 20}%`,
              }}
              animate={{ y: [0, -10, 0], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>
        <div className="container max-w-4xl mx-auto relative z-10">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground mb-6 transition-colors text-sm">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </button>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-2">
            Application <GradientText from="hsl(38, 92%, 55%)" to="hsl(38, 92%, 75%)">Tracker</GradientText>
          </h1>
          <p className="text-primary-foreground/60 text-sm">Track your visa application progress and document status in real-time</p>
        </div>
      </div>

      <div className="flex-1">
        <div className="container max-w-4xl mx-auto px-4 -mt-8 pb-16 space-y-6">
          {/* Stats Cards */}
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StaggerItem>
              <TiltCard className="rounded-xl border border-border bg-card p-5 card-elevated">
                <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Progress</div>
                <div className="text-3xl font-display font-bold text-primary mb-2">
                  <AnimatedCounter value={progressPercent} />%
                </div>
                <Progress value={progressPercent} className="h-2" />
              </TiltCard>
            </StaggerItem>
            <StaggerItem>
              <TiltCard className="rounded-xl border border-border bg-card p-5 card-elevated">
                <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Documents</div>
                <div className="text-3xl font-display font-bold">
                  <span className="text-emerald-600"><AnimatedCounter value={uploadedDocs} /></span>
                  <span className="text-muted-foreground text-lg"> / {totalDocs}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">uploaded</p>
              </TiltCard>
            </StaggerItem>
            <StaggerItem>
              <TiltCard className="rounded-xl border border-border bg-card p-5 card-elevated">
                <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Current Step</div>
                <div className="flex items-center gap-2 mt-1">
                  <PulseDot color="bg-primary" />
                  <span className="text-sm font-semibold">Document Collection</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Step 3 of 6</p>
              </TiltCard>
            </StaggerItem>
          </StaggerContainer>

          {/* Timeline */}
          <div className="space-y-0">
            {steps.map((step, i) => {
              const config = statusConfig[step.status];
              const StepIcon = step.icon;
              const StatusIcon = config.icon;
              const isExpanded = expandedStep === step.id;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <button
                    onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                    className="w-full text-left"
                  >
                    <div className="flex gap-4 py-4">
                      {/* Timeline line */}
                      <div className="flex flex-col items-center">
                        <div className={`h-12 w-12 rounded-xl ${config.bg} border ${config.border} flex items-center justify-center flex-shrink-0`}>
                          <StepIcon className={`h-5 w-5 ${config.color}`} />
                        </div>
                        {i < steps.length - 1 && (
                          <div className={`w-0.5 flex-1 mt-2 ${step.status === "completed" ? "bg-emerald-300" : "bg-border"}`} />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-sm flex items-center gap-2">
                              {step.title}
                              <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
                                <StatusIcon className="h-3 w-3" />
                                {config.label}
                              </span>
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                          </div>
                          {step.documents.length > 0 && (
                            <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                          )}
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Expanded documents */}
                  {isExpanded && step.documents.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-16 mb-4 space-y-2"
                    >
                      {step.documents.map((doc, di) => {
                        const docConfig = docStatusConfig[doc.status];
                        const DocIcon = docConfig.icon;
                        return (
                          <motion.div
                            key={di}
                            className={`flex items-center justify-between rounded-lg border border-border ${docConfig.bg} p-3`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: di * 0.05 }}
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <span className="text-sm font-medium">{doc.name}</span>
                                {doc.note && <span className="text-xs text-muted-foreground ml-2">({doc.note})</span>}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center gap-1 text-xs ${docConfig.color}`}>
                                <DocIcon className="h-3.5 w-3.5" />
                                {docConfig.label}
                              </span>
                              {doc.status === "pending" && (
                                <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                                  <Upload className="h-3 w-3" /> Upload
                                </Button>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Action cards */}
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StaggerItem>
              <SparkleBorder>
                <div className="p-6">
                  <h3 className="font-display font-bold mb-2">Need Help?</h3>
                  <p className="text-sm text-muted-foreground mb-4">Book a consultation with an immigration advisor for personalized guidance.</p>
                  <Button onClick={() => navigate("/consultation")} className="gap-2">
                    <Heart className="h-4 w-4" /> Book Consultation
                  </Button>
                </div>
              </SparkleBorder>
            </StaggerItem>
            <StaggerItem>
              <div className="rounded-2xl border border-border bg-card p-6 card-elevated">
                <h3 className="font-display font-bold mb-2">Download Checklist</h3>
                <p className="text-sm text-muted-foreground mb-4">Get a printable PDF checklist of all required documents for your application.</p>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" /> Download PDF
                </Button>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </div>

      <Footer />
    </div>
  );
}
