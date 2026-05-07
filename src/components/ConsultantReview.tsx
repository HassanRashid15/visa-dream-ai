import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText, CheckCircle, XCircle, Eye, MessageSquare, Send,
  Award, AlertTriangle, Clock, UserCheck, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import type { DocumentItem, DocStatus } from "@/components/DocumentUpload";

export interface ConsultantReviewProps {
  documents: DocumentItem[];
  visaType: string;
  applicantName: string;
  onReviewComplete?: (updatedDocs: DocumentItem[]) => void;
}

export default function ConsultantReview({ documents, visaType, applicantName, onReviewComplete }: ConsultantReviewProps) {
  const [reviewedDocs, setReviewedDocs] = useState<DocumentItem[]>(documents);
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [feedback, setFeedback] = useState<Record<string, { status: DocStatus; comment: string }>>({});

  const handleApprove = (docId: string) => {
    setFeedback(prev => ({ ...prev, [docId]: { status: "consultant_approved", comment: prev[docId]?.comment || "Approved by consultant" } }));
    toast({ title: "Document Approved", description: "Marked as advisor-approved in applicant dashboard." });
  };

  const handleReject = (docId: string) => {
    setFeedback(prev => ({ ...prev, [docId]: { status: "rejected", comment: prev[docId]?.comment || "Needs revision" } }));
    toast({ title: "Document Rejected", description: "Applicant will be notified with feedback." });
  };

  const handleSaveReview = () => {
    const updated = reviewedDocs.map(doc => {
      const fb = feedback[doc.id];
      if (!fb) return doc;
      return {
        ...doc,
        status: fb.status,
        notes: fb.comment,
      };
    });
    setReviewedDocs(updated);
    onReviewComplete?.(updated);
    toast({ title: "Review Saved", description: "All feedback has been saved and applicant notified." });
  };

  const getStatusBadge = (doc: DocumentItem) => {
    const fb = feedback[doc.id];
    const effectiveStatus = fb?.status || doc.status;
    if (effectiveStatus === "consultant_approved") return <Badge className="bg-violet-100 text-violet-700 text-xs">Advisor Approved</Badge>;
    if (effectiveStatus === "rejected") return <Badge variant="destructive" className="text-xs">Needs Revision</Badge>;
    if (effectiveStatus === "verified") return <Badge className="bg-emerald-100 text-emerald-700 text-xs">AI Verified</Badge>;
    if (effectiveStatus === "pending_review") return <Badge variant="outline" className="text-xs border-amber-300 text-amber-700 bg-amber-50">Pending Review</Badge>;
    return <Badge variant="secondary" className="text-xs">{effectiveStatus}</Badge>;
  };

  const approvedCount = Object.values(feedback).filter(f => f.status === "consultant_approved").length;
  const rejectedCount = Object.values(feedback).filter(f => f.status === "rejected").length;
  const pendingCount = reviewedDocs.length - approvedCount - rejectedCount;

  return (
    <div className="space-y-6">
      {/* Review Summary Header */}
      <Card className="p-5 border border-border bg-card card-elevated">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <UserCheck className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm">Consultant Document Review</h3>
              <p className="text-xs text-muted-foreground">{applicantName} — {visaType.toUpperCase()} Visa Application</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleSaveReview} className="gap-1.5">
              <Send className="h-3.5 w-3.5" /> Save & Notify Applicant
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-center">
            <p className="text-2xl font-display font-bold text-emerald-600">{approvedCount}</p>
            <p className="text-[10px] text-emerald-700 font-medium">Approved</p>
          </div>
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-center">
            <p className="text-2xl font-display font-bold text-amber-600">{pendingCount}</p>
            <p className="text-[10px] text-amber-700 font-medium">Pending</p>
          </div>
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-center">
            <p className="text-2xl font-display font-bold text-red-500">{rejectedCount}</p>
            <p className="text-[10px] text-red-700 font-medium">Needs Revision</p>
          </div>
        </div>
      </Card>

      {/* Document Review List */}
      <div className="space-y-3">
        {reviewedDocs.map((doc, i) => {
          const fb = feedback[doc.id];
          const hasReviewed = !!fb;
          return (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-xl border p-4 ${
                hasReviewed && fb.status === "consultant_approved" ? "bg-violet-50/30 border-violet-200" :
                hasReviewed && fb.status === "rejected" ? "bg-red-50/30 border-red-200" :
                "bg-card border-border"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-medium text-sm">{doc.name}</p>
                    {getStatusBadge(doc)}
                  </div>
                  {doc.aiAnalysis && (
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">{doc.aiAnalysis.documentType}</span>
                      <span>AI Score: {doc.aiAnalysis.overallScore}/100</span>
                      <span>Confidence: {doc.aiAnalysis.confidence}%</span>
                    </div>
                  )}
                  {doc.notes && (
                    <p className="text-xs text-muted-foreground mt-1">{doc.notes}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {doc.url && (
                    <Button variant="outline" size="sm" onClick={() => setSelectedDoc(doc)}><Eye className="h-3.5 w-3.5" /></Button>
                  )}
                  <Button
                    size="sm"
                    variant={fb?.status === "consultant_approved" ? "default" : "outline"}
                    className={fb?.status === "consultant_approved" ? "bg-violet-600 hover:bg-violet-700" : ""}
                    onClick={() => handleApprove(doc.id)}
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant={fb?.status === "rejected" ? "destructive" : "outline"}
                    onClick={() => handleReject(doc.id)}
                  >
                    <XCircle className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* AI Checks Summary for Consultant */}
              {doc.aiAnalysis && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {doc.aiAnalysis.validationChecks.map((check, j) => (
                    <span key={j} className={`text-[10px] px-2 py-0.5 rounded-full ${check.passed ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                      {check.rule}: {check.passed ? "Pass" : "Fail"}
                    </span>
                  ))}
                </div>
              )}

              {/* Feedback Textarea */}
              <div className="mt-3">
                <Textarea
                  placeholder="Add consultant feedback for the applicant..."
                  value={feedback[doc.id]?.comment || ""}
                  onChange={(e) => setFeedback(prev => ({ ...prev, [doc.id]: { status: prev[doc.id]?.status || doc.status, comment: e.target.value } }))}
                  className="text-xs min-h-[60px] resize-none"
                />
              </div>
            </motion.div>
          );
        })}
      </div>

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
              <Button variant="ghost" size="sm" onClick={() => setSelectedDoc(null)}><XCircle className="h-4 w-4" /></Button>
            </div>
            <div className="p-4 overflow-auto max-h-[70vh]">
              {selectedDoc.type.includes('pdf') ? (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">PDF Preview</p>
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
