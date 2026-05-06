import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, CheckCircle, AlertCircle, X, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface DocumentItem {
  id: string;
  name: string;
  type: string;
  size: number;
  status: "uploading" | "completed" | "error" | "verified" | "rejected";
  progress: number;
  url?: string;
  ocrData?: any;
  notes?: string;
  uploadedAt: Date;
}

interface DocumentUploadProps {
  visaType: "study" | "work" | "ilr" | "tourist";
  onDocumentsChange?: (documents: DocumentItem[]) => void;
  maxFiles?: number;
}

const UK_DOCUMENT_REQUIREMENTS = {
  study: [
    { name: "Passport", required: true, description: "Valid passport with at least 6 months validity" },
    { name: "CAS Letter", required: true, description: "Confirmation of Acceptance for Studies" },
    { name: "Bank Statements", required: true, description: "28 days of financial evidence" },
    { name: "IELTS Certificate", required: true, description: "UKVI approved English test" },
    { name: "Academic Transcripts", required: true, description: "Previous qualifications" },
    { name: "TB Certificate", required: false, description: "If required for your country" },
  ],
  work: [
    { name: "Passport", required: true, description: "Valid passport with at least 6 months validity" },
    { name: "Certificate of Sponsorship", required: true, description: "CoS from licensed employer" },
    { name: "Bank Statements", required: true, description: "28 days of financial evidence" },
    { name: "English Test Certificate", required: true, description: "B1 level or above" },
    { name: "Qualification Certificates", required: true, description: "Relevant qualifications" },
    { name: "Criminal Record Certificate", required: false, description: "If required for your role" },
  ],
  ilr: [
    { name: "Current BRP", required: true, description: "Biometric Residence Permit" },
    { name: "Passport", required: true, description: "Current and previous passports" },
    { name: "Life in UK Test Certificate", required: true, description: "Pass certificate" },
    { name: "English Language Evidence", required: true, description: "B1 level evidence" },
    { name: "Employment Evidence", required: true, description: "5 years of employment records" },
    { name: "Absence Record", required: true, description: "Travel history for 5 years" },
  ],
  tourist: [
    { name: "Passport", required: true, description: "Valid passport with blank pages" },
    { name: "Bank Statements", required: true, description: "6 months of financial evidence" },
    { name: "Accommodation Proof", required: true, description: "Hotel booking or invitation letter" },
    { name: "Employment Letter", required: false, description: "Proof of employment in home country" },
    { name: "Travel Itinerary", required: false, description: "Flight bookings and plans" },
  ],
};

export default function DocumentUpload({ visaType, onDocumentsChange, maxFiles = 20 }: DocumentUploadProps) {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);

  const requirements = UK_DOCUMENT_REQUIREMENTS[visaType] || [];

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    const newDocuments: DocumentItem[] = [];
    
    for (let i = 0; i < files.length && documents.length + newDocuments.length < maxFiles; i++) {
      const file = files[i];
      
      // Validate file type and size
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported file type. Please upload PDF, JPG, or PNG files.`,
          variant: "destructive",
        });
        continue;
      }
      
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 10MB. Please compress the file.`,
          variant: "destructive",
        });
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
      
      // Simulate upload progress
      await simulateUpload(doc, file);
    }

    const updatedDocuments = [...documents, ...newDocuments];
    setDocuments(updatedDocuments);
    onDocumentsChange?.(updatedDocuments);
  };

  const simulateUpload = async (doc: DocumentItem, file: File) => {
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      setDocuments(prev => prev.map(d => 
        d.id === doc.id 
          ? { ...d, progress, status: progress === 100 ? "completed" : "uploading" }
          : d
      ));
    }

    // Simulate OCR processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate verification
    const isVerified = Math.random() > 0.2; // 80% success rate
    const status = isVerified ? "verified" : "rejected";
    
    setDocuments(prev => prev.map(d => 
      d.id === doc.id 
        ? { 
            ...d, 
            status,
            url: URL.createObjectURL(file),
            ocrData: {
              extractedText: `Extracted text from ${file.name}`,
              confidence: 0.85,
              detectedFields: ["name", "date", "reference"],
            },
            notes: isVerified ? "Document verified successfully" : "Document needs manual review"
          }
        : d
    ));

    toast({
      title: isVerified ? "Document uploaded" : "Document needs review",
      description: `${file.name} has been ${isVerified ? "verified" : "flagged for manual review"}.`,
      variant: isVerified ? "default" : "destructive",
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeDocument = (id: string) => {
    const updatedDocuments = documents.filter(d => d.id !== id);
    setDocuments(updatedDocuments);
    onDocumentsChange?.(updatedDocuments);
  };

  const getStatusIcon = (status: DocumentItem["status"]) => {
    switch (status) {
      case "uploading":
        return <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: DocumentItem["status"]) => {
    const variants = {
      uploading: "secondary",
      completed: "default",
      verified: "default",
      rejected: "destructive",
      error: "destructive",
    } as const;

    return (
      <Badge variant={variants[status]} className="text-xs">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getDocumentStatus = (docName: string) => {
    const req = requirements.find(r => r.name.toLowerCase().includes(docName.toLowerCase()));
    return req ? (req.required ? "required" : "optional") : "additional";
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className="p-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Upload UK Visa Documents</h3>
          <p className="text-gray-600 mb-4">
            Drag and drop your files here, or click to browse
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Supported formats: PDF, JPG, PNG (Max 10MB per file)
          </p>
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Select Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
        </div>
      </Card>

      {/* Document Requirements */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Required Documents for {visaType.toUpperCase()} Visa</h3>
        <div className="space-y-3">
          {requirements.map((req, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${req.required ? "bg-red-500" : "bg-yellow-500"}`} />
                <div>
                  <p className="font-medium">{req.name}</p>
                  <p className="text-sm text-gray-600">{req.description}</p>
                </div>
              </div>
              <Badge variant={req.required ? "destructive" : "secondary"}>
                {req.required ? "Required" : "Optional"}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Uploaded Documents */}
      {documents.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Uploaded Documents ({documents.length})</h3>
          <div className="space-y-3">
            {documents.map((doc) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon(doc.status)}
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-gray-600">
                      {formatFileSize(doc.size)} • {doc.uploadedAt.toLocaleDateString()}
                    </p>
                    {doc.notes && (
                      <p className="text-sm text-blue-600 mt-1">{doc.notes}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(doc.status)}
                  {doc.status === "uploading" && (
                    <Progress value={doc.progress} className="w-20" />
                  )}
                  {doc.url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedDoc(doc)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDocument(doc.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Document Preview Modal */}
      {selectedDoc && selectedDoc.url && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">{selectedDoc.name}</h3>
              <Button variant="ghost" onClick={() => setSelectedDoc(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 overflow-auto max-h-[70vh]">
              {selectedDoc.type.includes('pdf') ? (
                <div className="text-center py-8">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p>PDF Preview</p>
                  <Button className="mt-4" onClick={() => window.open(selectedDoc.url)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              ) : (
                <img
                  src={selectedDoc.url}
                  alt={selectedDoc.name}
                  className="max-w-full h-auto mx-auto"
                />
              )}
            </div>
            {selectedDoc.ocrData && (
              <div className="p-4 border-t bg-gray-50">
                <h4 className="font-medium mb-2">OCR Results</h4>
                <div className="text-sm text-gray-600">
                  <p>Confidence: {(selectedDoc.ocrData.confidence * 100).toFixed(0)}%</p>
                  <p>Extracted: {selectedDoc.ocrData.extractedText}</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
