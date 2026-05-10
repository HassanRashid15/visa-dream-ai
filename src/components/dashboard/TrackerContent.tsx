import { useState } from "react";
import {
  FileText, CheckCircle, Clock, Upload, AlertCircle,
  ChevronRight, Shield, Plane, Users, CreditCard,
  Heart, Download, Sparkles, Award, FileWarning
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// --- Types ---
interface DocumentItem {
  name: string;
  status: "uploaded" | "pending" | "rejected" | "not-required" | "ai-verified" | "consultant-approved" | "needs-review";
  note?: string;
}

interface ApplicationStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  status: "completed" | "in-progress" | "pending" | "blocked";
  documents: DocumentItem[];
}

// --- Data ---
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
      { name: "Passport", status: "ai-verified", note: "AI Score: 95/100 — Valid 14 months" },
      { name: "CAS Letter", status: "consultant-approved", note: "Advisor approved — Valid CAS ref" },
      { name: "Bank Statements", status: "ai-verified", note: "AI Score: 88/100 — 28-day rule met" },
      { name: "IELTS Certificate", status: "needs-review", note: "AI Flagged — Check UKVI centre list" },
      { name: "Academic Transcripts", status: "pending" },
      { name: "TB Test Certificate", status: "not-required" },
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
  "in-progress": { color: "text-[#0f8b5f]", bg: "bg-[#0f8b5f]/10", border: "border-[#0f8b5f]/20", label: "In Progress", icon: Clock },
  pending: { color: "text-gray-400", bg: "bg-gray-100", border: "border-gray-200", label: "Pending", icon: Clock },
  blocked: { color: "text-red-500", bg: "bg-red-50", border: "border-red-200", label: "Blocked", icon: AlertCircle },
};

const docStatusConfig = {
  uploaded: { color: "text-emerald-600", bg: "bg-emerald-50", icon: CheckCircle, label: "Uploaded" },
  pending: { color: "text-amber-600", bg: "bg-amber-50", icon: Clock, label: "Pending" },
  rejected: { color: "text-red-500", bg: "bg-red-50", icon: AlertCircle, label: "Rejected" },
  "not-required": { color: "text-gray-400", bg: "bg-gray-50", icon: CheckCircle, label: "Not Required" },
  "ai-verified": { color: "text-blue-600", bg: "bg-blue-50", icon: Sparkles, label: "AI Verified" },
  "consultant-approved": { color: "text-violet-600", bg: "bg-violet-50", icon: Award, label: "Advisor Approved" },
  "needs-review": { color: "text-amber-600", bg: "bg-amber-50", icon: FileWarning, label: "Needs Review" },
};

// --- Components ---

function TrackerStatCard({ title, value, subtext, highlighted }: { title: string; value: string; subtext?: string; highlighted?: boolean }) {
  if (highlighted) {
    return (
      <div className="bg-gradient-to-br from-[#0f8b5f] to-[#27ae60] rounded-[20px] p-6 text-white shadow-lg shadow-[#0f8b5f]/20">
        <p className="text-sm font-medium text-white/70 mb-1">{title}</p>
        <h3 className="text-3xl font-bold">{value}</h3>
        {subtext && <p className="text-xs text-white/60 mt-1">{subtext}</p>}
      </div>
    );
  }
  return (
    <div className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-sm">
      <p className="text-sm text-gray-400 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-[#111827]">{value}</h3>
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
  );
}

export default function TrackerContent() {
  const [expandedStep, setExpandedStep] = useState<string | null>("3");
  const steps = DEMO_STEPS;

  const completedSteps = steps.filter((s) => s.status === "completed").length;
  const totalSteps = steps.length;
  const progressPercent = Math.round((completedSteps / totalSteps) * 100);

  const totalDocs = steps.flatMap((s) => s.documents).filter((d) => d.status !== "not-required").length;
  const uploadedDocs = steps.flatMap((s) => s.documents).filter((d) => d.status === "uploaded").length;

  return (
    <div className="space-y-8">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <TrackerStatCard
          title="Progress"
          value={`${progressPercent}%`}
          subtext="Overall completion"
        />
        <TrackerStatCard
          title="Documents"
          value={`${uploadedDocs}/${totalDocs}`}
          subtext="documents uploaded"
        />
        <TrackerStatCard
          title="Current Step"
          value="Document Collection"
          subtext="Step 3 of 6"
          highlighted
        />
        <TrackerStatCard
          title="AI Score"
          value="78/100"
          subtext="Eligibility rating"
        />
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-[#111827]">Application Progress</h3>
            <p className="text-sm text-gray-400 mt-1">Track your visa application journey</p>
          </div>
          <span className="text-sm font-semibold text-[#0f8b5f]">{progressPercent}% Complete</span>
        </div>
        <Progress value={progressPercent} className="h-3 bg-gray-100 [&>div]:bg-[#0f8b5f]" />
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-semibold text-[#111827] mb-6">Application Steps</h3>
        <div className="space-y-0">
          {steps.map((step, i) => {
            const config = statusConfig[step.status];
            const StepIcon = step.icon;
            const StatusIcon = config.icon;
            const isExpanded = expandedStep === step.id;

            return (
              <div key={step.id} className={i < steps.length - 1 ? "pb-6" : ""}>
                <button onClick={() => setExpandedStep(isExpanded ? null : step.id)} className="w-full text-left">
                  <div className="flex gap-4">
                    {/* Timeline line */}
                    <div className="flex flex-col items-center">
                      <div className={`h-12 w-12 rounded-xl ${config.bg} border ${config.border} flex items-center justify-center flex-shrink-0`}>
                        <StepIcon className={`h-5 w-5 ${config.color}`} />
                      </div>
                      {i < steps.length - 1 && (
                        <div className={`w-0.5 flex-1 mt-2 ${step.status === "completed" ? "bg-[#0f8b5f]/30" : "bg-gray-200"}`} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#111827] flex items-center gap-2 text-sm">
                            {step.title}
                            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
                              <StatusIcon className="h-3 w-3" />
                              {config.label}
                            </span>
                          </h3>
                          <p className="text-sm text-gray-400 mt-1">{step.description}</p>
                        </div>
                        {step.documents.length > 0 && (
                          <ChevronRight className={`h-4 w-4 text-gray-300 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                        )}
                      </div>
                    </div>
                  </div>
                </button>

                {/* Expanded documents */}
                {isExpanded && step.documents.length > 0 && (
                  <div className="ml-16 mt-4 space-y-2">
                    {step.documents.map((doc, di) => {
                      const docConfig = docStatusConfig[doc.status];
                      const DocIcon = docConfig.icon;
                      return (
                        <div
                          key={di}
                          className={`flex items-center justify-between rounded-xl border border-gray-100 ${docConfig.bg} p-4`}
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <div>
                              <span className="text-sm font-medium text-[#111827]">{doc.name}</span>
                              {doc.note && <span className="text-xs text-gray-400 ml-2">({doc.note})</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 text-xs ${docConfig.color}`}>
                              <DocIcon className="h-3.5 w-3.5" />
                              {docConfig.label}
                            </span>
                            {doc.status === "pending" && (
                              <Button variant="outline" size="sm" className="h-7 text-xs gap-1 border-[#0f8b5f] text-[#0f8b5f] hover:bg-[#0f8b5f] hover:text-white">
                                <Upload className="h-3 w-3" /> Upload
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Heart className="h-6 w-6 text-blue-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[#111827] mb-2">Need Help?</h3>
              <p className="text-sm text-gray-400 mb-4">Book a consultation with an immigration advisor for personalized guidance.</p>
              <Button className="bg-[#0f8b5f] hover:bg-[#0d7a52] text-white">Book Consultation</Button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <Download className="h-6 w-6 text-emerald-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[#111827] mb-2">Download Checklist</h3>
              <p className="text-sm text-gray-400 mb-4">Get a printable PDF checklist of all required documents.</p>
              <Button variant="outline" className="gap-2 border-gray-200">
                <Download className="h-4 w-4" /> Download PDF
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
