import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, CheckCircle, AlertCircle, AlertTriangle, Info, FileText, Clock, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MobileContainer, MobileGrid, MobileCard, MobileButton, MobileText } from "@/components/ui/mobile-optimized";

interface ComplianceRule {
  id: string;
  category: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  checkType: "document" | "financial" | "eligibility" | "timeline" | "qualification";
  requirements: string[];
  evidence: string[];
  exemptions: string[];
  penalties: string[];
  lastUpdated: string;
}

interface ComplianceResult {
  score: number;
  status: "compliant" | "non-compliant" | "partial" | "requires-review";
  criticalIssues: ComplianceIssue[];
  recommendations: string[];
  timeline: ComplianceTimeline[];
  documents: ComplianceDocument[];
}

interface ComplianceIssue {
  rule: string;
  severity: "critical" | "high" | "medium" | "low";
  description: string;
  impact: string;
  solution: string;
  deadline?: string;
}

interface ComplianceTimeline {
  event: string;
  date: string;
  action: string;
  status: "pending" | "completed" | "overdue";
}

interface ComplianceDocument {
  name: string;
  type: string;
  status: "valid" | "expired" | "missing" | "pending";
  expiryDate?: string;
  priority: "high" | "medium" | "low";
}

const UK_COMPLIANCE_RULES: Record<string, ComplianceRule[]> = {
  student: [
    {
      id: "CAS_VALIDITY",
      category: "Documentation",
      title: "CAS Validity Period",
      description: "CAS must be used within 6 months of issue",
      severity: "critical",
      checkType: "document",
      requirements: ["Valid CAS reference number", "CAS issued within last 6 months", "CAS matches course details"],
      evidence: ["CAS confirmation letter", "Email from institution", "Online CAS verification"],
      exemptions: ["None - CAS is mandatory"],
      penalties: ["Visa refusal", "Need new CAS", "Additional fees"],
      lastUpdated: "2024-03-15"
    },
    {
      id: "FINANCIAL_REQUIREMENT",
      category: "Financial",
      title: "Financial Evidence Requirements",
      description: "Must show sufficient funds for tuition and living costs",
      severity: "critical",
      checkType: "financial",
      requirements: ["28 days of bank statements", "Sufficient funds for tuition", "Living costs for location", "Funds held for 28 days"],
      evidence: ["Bank statements", "Letter from bank", "Sponsor letter if applicable", "Loan approval letter"],
      exemptions: ["Official financial sponsor", "Government funding", "Scholarship with living costs"],
      penalties: ["Visa refusal", "Additional evidence required", "Delay in processing"],
      lastUpdated: "2024-03-01"
    },
    {
      id: "ENGLISH_LANGUAGE",
      category: "Qualification",
      title: "English Language Requirement",
      description: "Must meet B2 level English requirement",
      severity: "high",
      checkType: "qualification",
      requirements: ["Valid UKVI English test", "Minimum score 5.5 overall", "No component below 5.5", "Test taken in last 2 years"],
      evidence: ["IELTS UKVI certificate", "PTE Academic UKVI", "LanguageCert", "Degree taught in English"],
      exemptions: ["Degree from English-speaking country", "Majority English nationality", "English qualification"],
      penalties: ["Visa refusal", "Need to retake test", "Additional costs"],
      lastUpdated: "2024-02-20"
    },
    {
      id: "ACADEMIC_QUALIFICATIONS",
      category: "Qualification",
      title: "Academic Qualification Verification",
      description: "Qualifications must meet UK standards",
      severity: "high",
      checkType: "qualification",
      requirements: ["Recognized qualifications", "NARIC verification if required", "Transcripts and certificates", "English translations"],
      evidence: ["Academic certificates", "Transcripts", "NARIC assessment", "Translation certificates"],
      exemptions: ["UK qualifications", "International qualifications recognized by NARIC"],
      penalties: ["Additional evidence required", "NARIC assessment needed", "Potential visa refusal"],
      lastUpdated: "2024-01-15"
    },
    {
      id: "TB_CERTIFICATE",
      category: "Health",
      title: "Tuberculosis Certificate",
      description: "TB test certificate required for some countries",
      severity: "medium",
      checkType: "document",
      requirements: ["TB test from approved clinic", "Valid for 6 months", "Clear test result", "Original certificate"],
      evidence: ["TB certificate", "Clinic confirmation", "Test results"],
      exemptions: ["EU countries", "Non-resident countries", "Diplomatic passport holders"],
      penalties: ["Visa refusal", "Need new test", "Additional costs"],
      lastUpdated: "2024-02-10"
    }
  ],
  work: [
    {
      id: "SPONSOR_LICENCE",
      category: "Employment",
      title: "Sponsor Licence Verification",
      description: "Employer must have valid sponsor licence",
      severity: "critical",
      checkType: "document",
      requirements: ["Valid sponsor licence", "Licence covers job role", "CoS assigned correctly", "Sponsor licence not suspended"],
      evidence: ["Sponsor licence number", "CoS certificate", "Sponsor register verification", "Employer confirmation"],
      exemptions: ["None - Sponsor licence mandatory"],
      penalties: ["Visa refusal", "Employer penalties", "Job offer invalid"],
      lastUpdated: "2024-03-20"
    },
    {
      id: "SALARY_THRESHOLD",
      category: "Financial",
      title: "Salary Requirement Compliance",
      description: "Salary must meet minimum threshold for occupation",
      severity: "critical",
      checkType: "financial",
      requirements: ["Salary above going rate", "Minimum £25,600 or specific rate", "Genuine employment", "Contract terms"],
      evidence: ["Employment contract", "Salary details", "Job description", "SOC code verification"],
      exemptions: ["New entrant salary", "PhD positions", "Healthcare worker rates"],
      penalties: ["Visa refusal", "Salary adjustment required", "Additional checks"],
      lastUpdated: "2024-03-05"
    },
    {
      id: "ENGLISH_B1",
      category: "Qualification",
      title: "B1 English Requirement",
      description: "Must meet B1 level English for work visa",
      severity: "high",
      checkType: "qualification",
      requirements: ["B1 level English test", "Valid test certificate", "Test from approved provider", "Score meets requirements"],
      evidence: ["IELTS Life Skills", "PTE Academic", "LanguageCert", "Degree in English"],
      exemptions: ["Degree taught in English", "Majority English nationality", "English qualification"],
      penalties: ["Visa refusal", "Retake test required", "Additional costs"],
      lastUpdated: "2024-02-15"
    }
  ],
  ilr: [
    {
      id: "RESIDENCE_PERIOD",
      category: "Timeline",
      title: "Continuous Residence Requirement",
      description: "Must have 5 years continuous residence",
      severity: "critical",
      checkType: "timeline",
      requirements: ["5 years continuous residence", "No more than 180 days absence", "Valid visa throughout", "No breaches of immigration laws"],
      evidence: ["Passport stamps", "BRP cards", "Travel records", "Employment records"],
      exemptions: ["Some absences for work/study", "Compelling reasons", "Diplomatic service"],
      penalties: ["Application refused", "Wait period reset", "Additional residence required"],
      lastUpdated: "2024-03-10"
    },
    {
      id: "LIFE_IN_UK_TEST",
      category: "Qualification",
      title: "Life in the UK Test",
      description: "Must pass Life in the UK test",
      severity: "critical",
      checkType: "qualification",
      requirements: ["Pass test with 75% or higher", "Valid test certificate", "Test taken at approved centre", "Certificate not expired"],
      evidence: ["Test certificate", "Booking confirmation", "Test results"],
      exemptions: ["Age 65+", "Physical/mental condition", "Long-term UK resident"],
      penalties: ["Application refused", "Retake test required", "Additional costs"],
      lastUpdated: "2024-02-25"
    },
    {
      id: "ENGLISH_B1_ILR",
      category: "Qualification",
      title: "B1 English for ILR",
      description: "B1 English requirement for settlement",
      severity: "high",
      checkType: "qualification",
      requirements: ["B1 level English", "Valid certificate", "Approved test provider", "Recent test result"],
      evidence: ["IELTS Life Skills", "PTE Academic", "LanguageCert", "Degree in English"],
      exemptions: ["Degree taught in English", "Majority English nationality", "Age exemptions"],
      penalties: ["Application refused", "Additional evidence required", "Retest needed"],
      lastUpdated: "2024-02-20"
    }
  ],
  tourist: [
    {
      id: "VISITOR_INTENT",
      category: "Eligibility",
      title: "Genuine Visitor Intent",
      description: "Must demonstrate genuine visitor intentions",
      severity: "high",
      checkType: "eligibility",
      requirements: ["Clear visit purpose", "Sufficient funds", "Return intention", "No prohibited activities"],
      evidence: ["Bank statements", "Employment letter", "Travel itinerary", "Accommodation details"],
      exemptions: ["Diplomatic visits", "Official government business"],
      penalties: ["Visa refusal", "Entry refusal", "Future travel restrictions"],
      lastUpdated: "2024-03-01"
    },
    {
      id: "FINANCIAL_VISITOR",
      category: "Financial",
      title: "Financial Support for Visit",
      description: "Must show sufficient funds for visit",
      severity: "medium",
      checkType: "financial",
      requirements: ["Sufficient funds for stay", "Return ticket funds", "Accommodation costs", "Living expenses"],
      evidence: ["Bank statements", "Credit card statements", "Sponsor letter", "Employment verification"],
      exemptions: ["Host covering costs", "Government funded visit"],
      penalties: ["Visa refusal", "Additional evidence required", "Reduced stay duration"],
      lastUpdated: "2024-02-15"
    }
  ]
};

export default function UKComplianceChecker() {
  const [selectedVisa, setSelectedVisa] = useState("student");
  const [checkResults, setCheckResults] = useState<ComplianceResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [activeTab, setActiveTab] = useState("rules");

  const rules = UK_COMPLIANCE_RULES[selectedVisa];

  const runComplianceCheck = () => {
    setIsChecking(true);

    setTimeout(() => {
      const criticalIssues: ComplianceIssue[] = [];
      const recommendations: string[] = [];
      const timeline: ComplianceTimeline[] = [];
      const documents: ComplianceDocument[] = [];

      // Simulate compliance checking
      rules.forEach(rule => {
        const randomCompliance = Math.random();
        
        if (randomCompliance < 0.2 && rule.severity === "critical") {
          criticalIssues.push({
            rule: rule.id,
            severity: rule.severity,
            description: `Issue detected with ${rule.title}`,
            impact: "May result in visa refusal",
            solution: `Provide required evidence for ${rule.title}`,
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          });
        }

        if (randomCompliance < 0.4) {
          recommendations.push(`Review ${rule.title} requirements`);
        }
      });

      // Generate timeline
      const now = new Date();
      timeline.push(
        {
          event: "Document Review",
          date: now.toISOString(),
          action: "Review all required documents",
          status: "pending"
        },
        {
          event: "Financial Check",
          date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          action: "Verify financial requirements",
          status: "pending"
        },
        {
          event: "Final Compliance",
          date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          action: "Complete compliance verification",
          status: "pending"
        }
      );

      // Generate document status
      documents.push(
        {
          name: "Passport",
          type: "Identity",
          status: "valid",
          expiryDate: "2025-01-15",
          priority: "high"
        },
        {
          name: "Bank Statements",
          type: "Financial",
          status: "pending",
          priority: "high"
        },
        {
          name: "English Test Certificate",
          type: "Qualification",
          status: "valid",
          expiryDate: "2024-12-31",
          priority: "high"
        }
      );

      const score = Math.max(0, 100 - (criticalIssues.length * 25));
      let status: ComplianceResult["status"] = "compliant";
      
      if (criticalIssues.some(issue => issue.severity === "critical")) {
        status = "non-compliant";
      } else if (criticalIssues.length > 0) {
        status = "partial";
      } else if (recommendations.length > 3) {
        status = "requires-review";
      }

      setCheckResults({
        score,
        status,
        criticalIssues,
        recommendations,
        timeline,
        documents
      });

      setIsChecking(false);
    }, 2000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-red-600 bg-red-50 border-red-200";
      case "high": return "text-orange-600 bg-orange-50 border-orange-200";
      case "medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low": return "text-blue-600 bg-blue-50 border-blue-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusColor = (status: ComplianceResult["status"]) => {
    switch (status) {
      case "compliant": return "text-green-600";
      case "non-compliant": return "text-red-600";
      case "partial": return "text-yellow-600";
      case "requires-review": return "text-blue-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">UK Compliance Checker</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Visa Type</label>
            <select
              value={selectedVisa}
              onChange={(e) => {
                setSelectedVisa(e.target.value);
                setCheckResults(null);
              }}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="student">Student Visa</option>
              <option value="work">Skilled Worker Visa</option>
              <option value="ilr">Indefinite Leave to Remain</option>
              <option value="tourist">Standard Visitor Visa</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Compliance Check</label>
            <Button
              onClick={runComplianceCheck}
              disabled={isChecking}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isChecking ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>Checking...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Run Compliance Check</span>
                </div>
              )}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="rules">Compliance Rules</TabsTrigger>
            <TabsTrigger value="results" disabled={!checkResults}>Results</TabsTrigger>
            <TabsTrigger value="timeline" disabled={!checkResults}>Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="rules" className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-blue-800">
                {selectedVisa.toUpperCase()} Compliance Requirements
              </h3>
              <p className="text-sm text-blue-700">
                {rules.length} compliance rules to check
              </p>
            </div>

            <div className="space-y-4">
              {rules.map((rule, index) => (
                <motion.div
                  key={rule.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border ${getSeverityColor(rule.severity)}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{rule.title}</h4>
                      <p className="text-sm mt-1">{rule.description}</p>
                    </div>
                    <Badge variant="outline" className={getSeverityColor(rule.severity)}>
                      {rule.severity}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h5 className="text-sm font-medium mb-1">Requirements:</h5>
                      <ul className="text-sm space-y-1">
                        {rule.requirements.map((req, reqIndex) => (
                          <li key={reqIndex} className="flex items-center space-x-2">
                            <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium mb-1">Required Evidence:</h5>
                      <ul className="text-sm space-y-1">
                        {rule.evidence.slice(0, 3).map((ev, evIndex) => (
                          <li key={evIndex} className="flex items-center space-x-2">
                            <FileText className="h-3 w-3 text-blue-500 flex-shrink-0" />
                            {ev}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {rule.exemptions.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium mb-1">Exemptions:</h5>
                        <ul className="text-sm space-y-1">
                          {rule.exemptions.map((ex, exIndex) => (
                            <li key={exIndex} className="flex items-center space-x-2">
                              <Info className="h-3 w-3 text-gray-500 flex-shrink-0" />
                              {ex}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Category: {rule.category}</span>
                      <span>Updated: {rule.lastUpdated}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            {checkResults && (
              <>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Compliance Score</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`font-bold text-lg ${getStatusColor(checkResults.status)}`}>
                        {checkResults.score}%
                      </span>
                      <Badge variant="outline" className={getStatusColor(checkResults.status)}>
                        {checkResults.status}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={checkResults.score} className="h-3" />
                </div>

                {checkResults.criticalIssues.length > 0 && (
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3 text-red-800">Critical Issues</h3>
                    <div className="space-y-3">
                      {checkResults.criticalIssues.map((issue, index) => (
                        <div key={index} className="bg-white p-3 rounded-lg border border-red-200">
                          <div className="flex items-start space-x-3">
                            <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-red-800">{issue.rule}</h4>
                              <p className="text-sm text-red-700 mt-1">{issue.description}</p>
                              <p className="text-sm text-red-600 mt-1">Impact: {issue.impact}</p>
                              <p className="text-sm text-red-600 mt-1">Solution: {issue.solution}</p>
                              {issue.deadline && (
                                <p className="text-xs text-red-500 mt-2">
                                  Deadline: {new Date(issue.deadline).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {checkResults.recommendations.length > 0 && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3 text-yellow-800">Recommendations</h3>
                    <ul className="space-y-2">
                      {checkResults.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-yellow-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 text-blue-800">Document Status</h3>
                  <div className="space-y-2">
                    {checkResults.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-2 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium">{doc.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={
                            doc.status === "valid" ? "text-green-600" :
                            doc.status === "expired" ? "text-red-600" :
                            doc.status === "missing" ? "text-red-600" : "text-yellow-600"
                          }>
                            {doc.status}
                          </Badge>
                          <Badge variant="outline" className={
                            doc.priority === "high" ? "text-red-600" :
                            doc.priority === "medium" ? "text-yellow-600" : "text-blue-600"
                          }>
                            {doc.priority}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            {checkResults && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-blue-800">Compliance Timeline</h3>
                  <p className="text-sm text-blue-700">
                    Track your compliance progress
                  </p>
                </div>

                <div className="space-y-4">
                  {checkResults.timeline.map((event, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-4"
                    >
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${
                          event.status === "completed" ? "bg-green-500" :
                          event.status === "overdue" ? "bg-red-500" : "bg-gray-300"
                        }`} />
                        {index < checkResults.timeline.length - 1 && (
                          <div className="w-0.5 h-16 bg-gray-300 mt-2" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{event.event}</h4>
                            <Badge variant="outline" className={
                              event.status === "completed" ? "text-green-600" :
                              event.status === "overdue" ? "text-red-600" : "text-gray-600"
                            }>
                              {event.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{event.action}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(event.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
