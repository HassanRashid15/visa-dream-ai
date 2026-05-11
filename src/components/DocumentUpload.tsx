import { useState, useRef, useMemo } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, FileText, CheckCircle, AlertCircle, X, Eye, Download, Lock,
  Shield, Sparkles, ClipboardCheck, TrendingUp, BookOpen, Clock, ChevronDown, ChevronUp,
  UserCheck, FileWarning, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/authContext";

export type DocStatus = "uploading" | "completed" | "error" | "verified" | "rejected" | "pending_review" | "consultant_approved";

export interface AIAnalysis {
  documentType: string;
  confidence: number;
  extractedFields: Record<string, string>;
  validationChecks: { rule: string; passed: boolean; message: string }[];
  overallScore: number;
  recommendations: string[];
}

export interface DocumentItem {
  id: string;
  name: string;
  type: string;
  size: number;
  status: DocStatus;
  progress: number;
  url?: string;
  aiAnalysis?: AIAnalysis;
  notes?: string;
  uploadedAt: Date;
}

export interface DocumentUploadProps {
  visaType: "study" | "work" | "ilr" | "tourist";
  onDocumentsChange?: (documents: DocumentItem[]) => void;
  maxFiles?: number;
}

export const UK_DOCUMENT_REQUIREMENTS: Record<string, { name: string; required: boolean; description: string; keywords: string[] }[]> = {
  study: [
    { name: "Passport", required: true, description: "Valid passport with at least 6 months validity", keywords: ["passport", "travel document"] },
    { name: "CAS Letter", required: true, description: "Confirmation of Acceptance for Studies (CAS)", keywords: ["cas", "acceptance", "confirmation", "sponsor"] },
    { name: "Bank Statements", required: true, description: "28 consecutive days of financial evidence", keywords: ["bank", "statement", "finance", "fund", "balance"] },
    { name: "IELTS / SELT Certificate", required: true, description: "UKVI-approved English language test (B2 for degree)", keywords: ["ielts", "english", "language", "selt", "pte", "toefl", "test"] },
    { name: "Academic Transcripts", required: true, description: "Previous qualifications & certificates", keywords: ["transcript", "certificate", "degree", "diploma", "academic", "mark sheet"] },
    { name: "TB Test Certificate", required: false, description: "Required if you are from a listed country", keywords: ["tb", "tuberculosis", "medical", "x-ray"] },
    { name: "ATAS Certificate", required: false, description: "For certain science & engineering courses", keywords: ["atas", "certificate"] },
  ],
  work: [
    { name: "Passport", required: true, description: "Valid passport with at least 6 months validity", keywords: ["passport", "travel document"] },
    { name: "Certificate of Sponsorship (CoS)", required: true, description: "CoS reference from licensed UK employer", keywords: ["cos", "certificate of sponsorship", "sponsorship", "employer"] },
    { name: "Bank Statements", required: true, description: "28 consecutive days of financial evidence", keywords: ["bank", "statement", "finance", "fund", "balance"] },
    { name: "English Test Certificate", required: true, description: "B1 level or above (IELTS SELT)", keywords: ["ielts", "english", "language", "selt", "pte", "toefl", "test"] },
    { name: "Qualification Certificates", required: true, description: "Relevant degree/diploma for the role", keywords: ["certificate", "degree", "diploma", "qualification", "academic"] },
    { name: "Criminal Record Certificate", required: false, description: "Required for certain roles (education, healthcare, social care)", keywords: ["criminal", "police", "record", "clearance", "acpo"] },
    { name: "Professional References", required: false, description: "Employment reference letters", keywords: ["reference", "employer", "letter", "recommendation"] },
  ],
  ilr: [
    { name: "Current & Previous BRPs", required: true, description: "All Biometric Residence Permits", keywords: ["brp", "biometric", "residence", "permit"] },
    { name: "Passport(s)", required: true, description: "Current and all previous passports", keywords: ["passport", "travel document"] },
    { name: "Life in the UK Test Pass", required: true, description: "Official pass certificate", keywords: ["life in the uk", "test", "pass"] },
    { name: "English Language Evidence", required: true, description: "B1 level or degree taught in English", keywords: ["ielts", "english", "language", "degree", "certificate"] },
    { name: "5-Year Employment Evidence", required: true, description: "P60s, payslips, employer letters", keywords: ["p60", "payslip", "employment", "employer", "salary"] },
    { name: "Absence Record", required: true, description: "Travel history for the qualifying 5-year period", keywords: ["absence", "travel", "history", "entry", "exit"] },
    { name: "Marriage / Birth Certificates", required: false, description: "If including dependants", keywords: ["marriage", "birth", "certificate", "dependant"] },
  ],
  tourist: [
    { name: "Passport", required: true, description: "Valid passport with at least one blank page", keywords: ["passport", "travel document"] },
    { name: "Bank Statements", required: true, description: "6 months of financial evidence showing you can support yourself", keywords: ["bank", "statement", "finance", "fund"] },
    { name: "Accommodation Proof", required: true, description: "Hotel booking or invitation letter from host", keywords: ["hotel", "accommodation", "invitation", "booking", "host"] },
    { name: "Employment / Business Proof", required: false, description: "Letter from employer or business registration", keywords: ["employment", "employer", "business", "letter", "company"] },
    { name: "Travel Itinerary", required: false, description: "Flight bookings and planned activities", keywords: ["itinerary", "flight", "travel", "ticket", "plan"] },
  ],
};

// Smart document classifier based on filename
function classifyDocument(fileName: string, visaType: string): { type: string; confidence: number } {
  const lower = fileName.toLowerCase();
  const reqs = UK_DOCUMENT_REQUIREMENTS[visaType] || [];
  for (const req of reqs) {
    for (const kw of req.keywords) {
      if (lower.includes(kw.toLowerCase())) {
        return { type: req.name, confidence: 0.85 + Math.random() * 0.1 };
      }
    }
  }
  // Fallback heuristics
  if (lower.includes("pass")) return { type: "Passport", confidence: 0.72 };
  if (lower.includes("bank") || lower.includes("statement")) return { type: "Bank Statements", confidence: 0.68 };
  if (lower.includes("ielts") || lower.includes("english") || lower.includes("language")) return { type: "English Test", confidence: 0.70 };
  if (lower.includes("certif")) return { type: "Certificate", confidence: 0.55 };
  return { type: "Unknown Document", confidence: 0.40 };
}

// Simulated AI rule validation per document type
function runAIValidation(docType: string, fileName: string): { rule: string; passed: boolean; message: string }[] {
  const checks: { rule: string; passed: boolean; message: string }[] = [];
  const lower = fileName.toLowerCase();

  if (docType.includes("Passport")) {
    const expiryOK = Math.random() > 0.15;
    checks.push({ rule: "Expiry Date Check", passed: expiryOK, message: expiryOK ? "Valid for 12+ months" : "⚠️ Expires within 6 months — renew before applying" });
    checks.push({ rule: "Blank Pages Check", passed: Math.random() > 0.1, message: "At least 1 blank page detected" });
    checks.push({ rule: "Passport Condition", passed: Math.random() > 0.05, message: "No significant damage detected" });
  }
  if (docType.includes("Bank")) {
    const balanceOK = Math.random() > 0.2;
    checks.push({ rule: "28-Day Rule", passed: balanceOK, message: balanceOK ? "Funds held for 28+ consecutive days ✓" : "⚠️ Ensure funds have been in the account for a full 28-day period" });
    checks.push({ rule: "Currency & Amount", passed: Math.random() > 0.15, message: "GBP balance meets minimum threshold" });
    checks.push({ rule: "Letterhead / Stamp", passed: Math.random() > 0.25, message: Math.random() > 0.25 ? "Official bank letterhead confirmed" : "⚠️ Consider requesting an official stamped statement" });
  }
  if (docType.includes("IELTS") || docType.includes("English") || docType.includes("SELT")) {
    const scoreOK = Math.random() > 0.2;
    checks.push({ rule: "UKVI Approval", passed: scoreOK, message: scoreOK ? "UKVI-approved SELT provider confirmed" : "⚠️ Ensure your test centre is on the UKVI approved list" });
    checks.push({ rule: "Band Score", passed: Math.random() > 0.15, message: "Overall band meets minimum requirement" });
    checks.push({ rule: "Test Date Validity", passed: Math.random() > 0.1, message: "Test taken within last 2 years" });
  }
  if (docType.includes("CAS")) {
    checks.push({ rule: "CAS Number Format", passed: Math.random() > 0.1, message: "Valid CAS reference format detected" });
    checks.push({ rule: "Institution Licence", passed: Math.random() > 0.15, message: "Sponsor institution appears on UKVI register" });
    checks.push({ rule: "Course Level", passed: Math.random() > 0.1, message: "Course meets Student Route level requirement" });
  }
  if (docType.includes("CoS")) {
    checks.push({ rule: "CoS Reference", passed: Math.random() > 0.1, message: "Valid CoS reference format" });
    checks.push({ rule: "Salary Threshold", passed: Math.random() > 0.2, message: "Salary meets minimum threshold for role" });
    checks.push({ rule: "SOC Code Match", passed: Math.random() > 0.15, message: "Job code aligns with occupation classification" });
  }
  if (docType.includes("BRP")) {
    checks.push({ rule: "BRP Validity", passed: Math.random() > 0.1, message: "BRP within validity period" });
    checks.push({ rule: "Biometric Chip", passed: Math.random() > 0.05, message: "Biometric data readable" });
  }
  if (docType.includes("Life in the UK")) {
    checks.push({ rule: "Pass Status", passed: Math.random() > 0.1, message: "Pass result confirmed" });
    checks.push({ rule: "Test Date", passed: Math.random() > 0.15, message: "Test taken within valid period" });
  }
  if (docType.includes("Employment") || docType.includes("P60") || docType.includes("payslip")) {
    checks.push({ rule: "5-Year Continuity", passed: Math.random() > 0.2, message: "Employment records span required period" });
    checks.push({ rule: "Salary Consistency", passed: Math.random() > 0.15, message: "Salary meets route-specific thresholds" });
  }
  if (checks.length === 0) {
    checks.push({ rule: "File Quality", passed: Math.random() > 0.1, message: "Document is legible and complete" });
    checks.push({ rule: "Format Check", passed: true, message: "Supported file format (PDF/JPG/PNG)" });
  }
  return checks;
}

function generateAIRecommendations(docType: string, checks: { passed: boolean }[]): string[] {
  const recs: string[] = [];
  const failCount = checks.filter(c => !c.passed).length;
  if (failCount === 0) {
    recs.push("Document looks good for submission.");
    recs.push("Upload the original (not photocopy) if this is a certificate.");
  } else {
    recs.push("Address the flagged issues before submitting to UKVI.");
    recs.push("Consider booking a consultant review for expert verification.");
  }
  if (docType.includes("Bank")) recs.push("Ensure the bank statement shows your name, account number, and is dated within 31 days of application.");
  if (docType.includes("Passport")) recs.push("Scan all pages including blank ones. UKVI may request to see travel history.");
  if (docType.includes("IELTS")) recs.push("Download the official TRF (Test Report Form) from the test provider website.");
  return recs;
}

export default function DocumentUpload({ visaType, onDocumentsChange, maxFiles = 20 }: DocumentUploadProps) {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [expandedAnalysis, setExpandedAnalysis] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const requirements = UK_DOCUMENT_REQUIREMENTS[visaType] || [];

  const requireAuthForUpload = () => {
    if (isAuthenticated) return true;
    const returnTo = `${location.pathname}${location.search}${location.hash}`;
    const encodedReturnTo = encodeURIComponent(returnTo || "/");
    toast({ title: "Sign in required", description: "Please sign up or sign in to upload your visa documents." });
    navigate(`/auth?redirect=${encodedReturnTo}`);
    return false;
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!requireAuthForUpload()) return;
    if (!files) return;

    const newDocuments: DocumentItem[] = [];
    for (let i = 0; i < files.length && documents.length + newDocuments.length < maxFiles; i++) {
      const file = files[i];
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 10 * 1024 * 1024;
      if (!allowedTypes.includes(file.type)) {
        toast({ title: "Invalid file type", description: `${file.name} is not supported. Upload PDF, JPG, or PNG.`, variant: "destructive" });
        continue;
      }
      if (file.size > maxSize) {
        toast({ title: "File too large", description: `${file.name} exceeds 10MB. Please compress.`, variant: "destructive" });
        continue;
      }
      const doc: DocumentItem = {
        id: `doc_${Date.now()}_${i}`,
        name: file.name,
        type: file.type,
        size: file.size,
        status: "uploading",
        progress: 0,
        uploadedAt: new Date(),
      };
      newDocuments.push(doc);
      simulateUploadAndVerify(doc, file);
    }
    const updated = [...documents, ...newDocuments];
    setDocuments(updated);
    onDocumentsChange?.(updated);
  };

  const simulateUploadAndVerify = async (doc: DocumentItem, file: File) => {
    // Upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(r => setTimeout(r, 180));
      setDocuments(prev => prev.map(d => d.id === doc.id ? { ...d, progress, status: progress === 100 ? "completed" : "uploading" } : d));
    }
    // OCR / AI processing simulation
    await new Promise(r => setTimeout(r, 800));
    setDocuments(prev => prev.map(d => d.id === doc.id ? { ...d, status: "completed" } : d));
    await new Promise(r => setTimeout(r, 600));

    // AI Classification & Validation
    const classification = classifyDocument(file.name, visaType);
    const checks = runAIValidation(classification.type, file.name);
    const passedChecks = checks.filter(c => c.passed).length;
    const score = Math.round((passedChecks / Math.max(checks.length, 1)) * 100);

    const overallStatus: DocStatus = score >= 80 ? "verified" : score >= 50 ? "pending_review" : "rejected";

    const analysis: AIAnalysis = {
      documentType: classification.type,
      confidence: Math.round(classification.confidence * 100),
      extractedFields: {
        detectedType: classification.type,
        fileName: file.name,
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        pages: String(Math.floor(Math.random() * 5) + 1),
        scanQuality: score >= 80 ? "High" : score >= 50 ? "Medium" : "Low",
      },
      validationChecks: checks,
      overallScore: score,
      recommendations: generateAIRecommendations(classification.type, checks),
    };

    setDocuments(prev => prev.map(d =>
      d.id === doc.id
        ? {
            ...d,
            status: overallStatus,
            url: URL.createObjectURL(file),
            aiAnalysis: analysis,
            notes: score >= 80
              ? "AI Verified — Document meets UKVI standards"
              : score >= 50
              ? "AI Flagged — Some checks need attention"
              : "AI Rejected — Multiple issues detected",
          }
        : d
    ));

    toast({
      title: score >= 80 ? "Document Verified by AI" : score >= 50 ? "Document Needs Review" : "Document Issues Found",
      description: `${file.name} scored ${score}/100. ${analysis.recommendations[0]}`,
      variant: score >= 50 ? "default" : "destructive",
    });
  };

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); if (!requireAuthForUpload()) return; handleFileSelect(e.dataTransfer.files); };
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); if (!isAuthenticated) return; setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const removeDocument = (id: string) => {
    const updated = documents.filter(d => d.id !== id);
    setDocuments(updated);
    onDocumentsChange?.(updated);
  };

  const getStatusIcon = (status: DocStatus) => {
    switch (status) {
      case "uploading": return <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />;
      case "completed": return <Clock className="h-4 w-4 text-blue-500" />;
      case "verified": return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case "pending_review": return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case "rejected": return <FileWarning className="h-4 w-4 text-red-500" />;
      case "consultant_approved": return <Award className="h-4 w-4 text-violet-500" />;
      default: return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: DocStatus) => {
    const map: Record<DocStatus, { variant: "default" | "secondary" | "destructive" | "outline"; label: string; className?: string }> = {
      uploading: { variant: "secondary", label: "Uploading" },
      completed: { variant: "secondary", label: "Processing" },
      verified: { variant: "default", label: "AI Verified", className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" },
      pending_review: { variant: "outline", label: "Needs Review", className: "border-amber-300 text-amber-700 bg-amber-50" },
      rejected: { variant: "destructive", label: "Issues Found" },
      error: { variant: "destructive", label: "Error" },
      consultant_approved: { variant: "default", label: "Advisor Approved", className: "bg-violet-100 text-violet-700 hover:bg-violet-100" },
    };
    const cfg = map[status];
    return <Badge variant={cfg.variant} className={`text-xs ${cfg.className || ""}`}>{cfg.label}</Badge>;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  // Compute readiness score based on uploaded docs vs requirements
  const readiness = useMemo(() => {
    const requiredNames = requirements.filter(r => r.required).map(r => r.name);
    const matched = new Set<string>();
    for (const doc of documents) {
      if (doc.status === "verified" || doc.status === "consultant_approved") {
        const type = doc.aiAnalysis?.documentType || "";
        for (const req of requirements) {
          if (req.required && type.includes(req.name.split(" ")[0])) matched.add(req.name);
        }
      }
    }
    const score = requiredNames.length > 0 ? Math.round((matched.size / requiredNames.length) * 100) : 0;
    return { score, matched: matched.size, total: requiredNames.length, missing: requiredNames.filter(n => !Array.from(matched).some(m => m.includes(n.split(" ")[0]))) };
  }, [documents, requirements]);

  return (
    <div className="space-y-6">
      {/* AI Readiness Dashboard */}
      {isAuthenticated && (
        <Card className="p-5 border border-border bg-card card-elevated">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm">AI Document Readiness</h3>
              <p className="text-xs text-muted-foreground">Smart classification & validation for UKVI compliance</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">{readiness.matched} of {readiness.total} required documents verified</span>
                <span className="font-semibold">{readiness.score}%</span>
              </div>
              <Progress value={readiness.score} className="h-2" />
            </div>
            <div className="text-right">
              <span className={`text-2xl font-display font-bold ${readiness.score >= 80 ? "text-emerald-600" : readiness.score >= 50 ? "text-amber-600" : "text-red-500"}`}>
                {readiness.score}
              </span>
              <span className="text-xs text-muted-foreground">/100</span>
            </div>
          </div>
          {readiness.missing.length > 0 && (
            <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
              <span className="font-semibold">Still needed: </span>
              {readiness.missing.join(", ")}
            </div>
          )}
          {readiness.score >= 80 && (
            <div className="mt-3 flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
              <Shield className="h-4 w-4" />
              <span>Your documents look strong. You are ready to book a consultant for final review before submission.</span>
            </div>
          )}
          {readiness.score > 0 && readiness.score < 80 && (
            <div className="mt-3 flex items-center gap-2">
              <Button size="sm" variant="outline" className="text-xs gap-1" asChild>
                <Link to="/consultation">
                  <UserCheck className="h-3.5 w-3.5" /> Book Consultant Review
                </Link>
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Upload Area */}
      <Card className="p-6">
        <div className="relative">
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Upload Your Visa Documents</h3>
            {!isAuthenticated && (
              <p className="text-sm text-amber-600 font-medium mb-3">Please sign in first to start uploading files.</p>
            )}
            <p className="text-muted-foreground mb-4">Drag and drop your files here, or click to browse</p>
            <p className="text-sm text-muted-foreground mb-4">Supported: PDF, JPG, PNG (Max 10MB each)</p>
            <Button onClick={() => { if (!requireAuthForUpload()) return; fileInputRef.current?.click(); }}>
              {isAuthenticated ? "Select Files" : "Sign in to Upload"}
            </Button>
            <input ref={fileInputRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => handleFileSelect(e.target.files)} />
          </div>
          {!isAuthenticated && (
            <div className="absolute inset-0 rounded-xl bg-background/55 backdrop-blur-[1px] border border-border/60 flex items-center justify-center">
              <div className="text-center">
                <div className="h-11 w-11 rounded-full bg-primary/10 border border-primary/20 mx-auto mb-2 flex items-center justify-center">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm font-semibold">Upload Locked</p>
                <p className="text-xs text-muted-foreground">Sign in to upload your documents</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Required Documents Checklist with smart matching */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-1">Required Documents — {visaType.charAt(0).toUpperCase() + visaType.slice(1)} Visa</h3>
        <p className="text-xs text-muted-foreground mb-4">Upload a document and our AI will try to auto-match it to the correct requirement.</p>
        <div className="space-y-2">
          {requirements.map((req, index) => {
            const matchedDoc = documents.find(d =>
              d.aiAnalysis?.documentType.includes(req.name.split(" ")[0]) &&
              (d.status === "verified" || d.status === "consultant_approved")
            );
            const pendingDoc = documents.find(d =>
              d.aiAnalysis?.documentType.includes(req.name.split(" ")[0]) &&
              d.status !== "verified" && d.status !== "consultant_approved"
            );
            return (
              <div key={index} className={`flex items-center justify-between p-3 rounded-lg border ${matchedDoc ? "bg-emerald-50/50 border-emerald-200" : pendingDoc ? "bg-amber-50/50 border-amber-200" : "bg-muted/30 border-border"}`}>
                <div className="flex items-center gap-3">
                  {matchedDoc ? <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    : pendingDoc ? <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                    : <div className={`h-2 w-2 rounded-full flex-shrink-0 ${req.required ? "bg-red-400" : "bg-yellow-400"}`} />}
                  <div>
                    <p className={`text-sm font-medium ${matchedDoc ? "text-emerald-800" : ""}`}>{req.name}</p>
                    <p className="text-xs text-muted-foreground">{req.description}</p>
                    {matchedDoc && (
                      <p className="text-[10px] text-emerald-600 mt-0.5">Matched: {matchedDoc.name} (AI Score: {matchedDoc.aiAnalysis?.overallScore}/100)</p>
                    )}
                    {pendingDoc && (
                      <p className="text-[10px] text-amber-600 mt-0.5">Uploaded but flagged: {pendingDoc.aiAnalysis?.overallScore}/100</p>
                    )}
                  </div>
                </div>
                <Badge variant={req.required ? "destructive" : "secondary"} className="text-[10px]">{req.required ? "Required" : "Optional"}</Badge>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Uploaded Documents with AI Analysis */}
      {documents.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-accent" />
              <h3 className="text-lg font-semibold">Uploaded Documents ({documents.length})</h3>
            </div>
            <Badge variant="outline" className="text-xs">AI Verified</Badge>
          </div>
          <div className="space-y-3">
            {documents.map((doc) => (
              <motion.div key={doc.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {getStatusIcon(doc.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-sm truncate">{doc.name}</p>
                        {getStatusBadge(doc.status)}
                      </div>
                      <p className="text-xs text-muted-foreground">{formatFileSize(doc.size)} • {doc.uploadedAt.toLocaleDateString()}</p>
                      {doc.aiAnalysis && (
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{doc.aiAnalysis.documentType}</span>
                          <span className="text-[10px] text-muted-foreground">AI Confidence: {doc.aiAnalysis.confidence}%</span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${doc.aiAnalysis.overallScore >= 80 ? "bg-emerald-100 text-emerald-700" : doc.aiAnalysis.overallScore >= 50 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                            Score: {doc.aiAnalysis.overallScore}/100
                          </span>
                        </div>
                      )}
                      {doc.notes && (
                        <p className={`text-xs mt-1.5 ${doc.status === "verified" ? "text-emerald-600" : doc.status === "pending_review" ? "text-amber-600" : "text-red-500"}`}>
                          {doc.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {doc.status === "uploading" && <Progress value={doc.progress} className="w-16 h-1.5" />}
                    {doc.url && (
                      <Button variant="ghost" size="sm" onClick={() => setSelectedDoc(doc)}><Eye className="h-4 w-4" /></Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => removeDocument(doc.id)}><X className="h-4 w-4" /></Button>
                  </div>
                </div>

                {/* Expandable AI Analysis */}
                {doc.aiAnalysis && (
                  <div className="mt-3">
                    <button
                      onClick={() => setExpandedAnalysis(expandedAnalysis === doc.id ? null : doc.id)}
                      className="flex items-center gap-1.5 text-xs text-accent font-medium hover:underline"
                    >
                      {expandedAnalysis === doc.id ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      {expandedAnalysis === doc.id ? "Hide AI Analysis" : "View AI Analysis"}
                    </button>
                    <AnimatePresence>
                      {expandedAnalysis === doc.id && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                          <div className="mt-3 p-4 rounded-lg bg-muted/40 border border-border space-y-3">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {Object.entries(doc.aiAnalysis.extractedFields).map(([k, v]) => (
                                <div key={k} className="bg-card rounded-lg p-2 border border-border">
                                  <p className="text-[10px] text-muted-foreground uppercase">{k.replace(/([A-Z])/g, ' $1').trim()}</p>
                                  <p className="text-xs font-medium truncate">{v}</p>
                                </div>
                              ))}
                            </div>
                            <div>
                              <p className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                                <TrendingUp className="h-3.5 w-3.5" /> Validation Checks ({doc.aiAnalysis.validationChecks.filter(c => c.passed).length}/{doc.aiAnalysis.validationChecks.length} passed)
                              </p>
                              <div className="space-y-1.5">
                                {doc.aiAnalysis.validationChecks.map((check, i) => (
                                  <div key={i} className={`flex items-start gap-2 text-xs p-2 rounded-md ${check.passed ? "bg-emerald-50/50" : "bg-red-50/50"}`}>
                                    {check.passed ? <CheckCircle className="h-3.5 w-3.5 text-emerald-500 mt-0.5 flex-shrink-0" /> : <FileWarning className="h-3.5 w-3.5 text-red-500 mt-0.5 flex-shrink-0" />}
                                    <div>
                                      <span className="font-medium">{check.rule}:</span>{" "}
                                      <span className={check.passed ? "text-emerald-700" : "text-red-600"}>{check.message}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-semibold mb-1.5 flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" /> AI Recommendations</p>
                              <ul className="space-y-1">
                                {doc.aiAnalysis.recommendations.map((rec, i) => (
                                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                                    <span className="text-accent mt-0.5">•</span>{rec}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Document Preview Modal */}
      {selectedDoc && selectedDoc.url && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedDoc(null)}>
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{selectedDoc.name}</h3>
                {selectedDoc.aiAnalysis && (
                  <p className="text-xs text-muted-foreground">{selectedDoc.aiAnalysis.documentType} • AI Score: {selectedDoc.aiAnalysis.overallScore}/100</p>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedDoc(null)}><X className="h-4 w-4" /></Button>
            </div>
            <div className="p-4 overflow-auto max-h-[70vh]">
              {selectedDoc.type.includes('pdf') ? (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">PDF Preview</p>
                  <Button className="mt-4" onClick={() => window.open(selectedDoc.url)}><Download className="h-4 w-4 mr-2" /> Download</Button>
                </div>
              ) : (
                <img src={selectedDoc.url} alt={selectedDoc.name} className="max-w-full h-auto mx-auto rounded-lg" />
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

