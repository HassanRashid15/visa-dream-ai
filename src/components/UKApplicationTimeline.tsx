import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Clock, Calendar, AlertCircle, CheckCircle, Info, TrendingUp, Users, FileText, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MobileContainer, MobileGrid, MobileCard, MobileText } from "@/components/ui/mobile-optimized";

interface TimelineStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  status: "pending" | "in-progress" | "completed" | "delayed";
  documents: string[];
  requirements: string[];
  tips: string[];
  estimatedDate?: Date;
  actualDate?: Date;
}

interface TimelineData {
  visaType: string;
  steps: TimelineStep[];
  totalEstimatedTime: string;
  currentStep: number;
  priorityService?: "standard" | "priority" | "super";
}

const UK_VISA_TIMELINES: Record<string, TimelineData> = {
  student: {
    visaType: "Student Visa",
    totalEstimatedTime: "3-6 weeks",
    currentStep: 0,
    steps: [
      {
        id: "1",
        title: "Receive Offer & Accept",
        description: "Get unconditional offer from licensed UK institution and pay deposit",
        duration: "2-4 weeks",
        status: "pending",
        documents: ["Offer Letter", "Academic Transcripts", "CV", "Personal Statement"],
        requirements: ["Unconditional offer", "Valid passport", "English proficiency"],
        tips: ["Apply to multiple universities", "Check institution license status", "Prepare documents early"],
      },
      {
        id: "2",
        title: "Get CAS Number",
        description: "Receive Confirmation of Acceptance for Studies from your institution",
        duration: "1-2 weeks",
        status: "pending",
        documents: ["CAS Reference Number", "Deposit Payment Confirmation"],
        requirements: ["Unconditional offer accepted", "Deposit paid", "Institution licensed"],
        tips: ["Keep CAS safe", "Check details for accuracy", "Apply within 6 months of issue"],
      },
      {
        id: "3",
        title: "Prepare Documents",
        description: "Gather all required documents for visa application",
        duration: "1-2 weeks",
        status: "pending",
        documents: ["Passport", "CAS", "Bank Statements", "English Test Certificate", "Academic Certificates"],
        requirements: ["Valid passport", "CAS number", "Financial evidence", "English proficiency"],
        tips: ["Translate non-English documents", "Get TB test if required", "Check document expiry dates"],
      },
      {
        id: "4",
        title: "Apply Online",
        description: "Complete online visa application and pay fees",
        duration: "1-2 hours",
        status: "pending",
        documents: ["Online Application Form", "Payment Confirmation"],
        requirements: ["All information ready", "Payment method available", "Valid email address"],
        tips: ["Save application progress", "Double-check all information", "Keep reference number"],
      },
      {
        id: "5",
        title: "Biometrics Appointment",
        description: "Attend visa application centre for fingerprints and photograph",
        duration: "1 day",
        status: "pending",
        documents: ["Appointment Confirmation", "All required documents"],
        requirements: ["Appointment booked", "Original documents", "Valid ID"],
        tips: ["Arrive early", "Bring all documents", "Dress appropriately"],
      },
      {
        id: "6",
        title: "Wait for Decision",
        description: "Wait for UKVI to process your visa application",
        duration: "3-6 weeks",
        status: "pending",
        documents: [],
        requirements: ["Application submitted"],
        tips: ["Track application online", "Don't book travel until decision", "Prepare for possible interview"],
      },
      {
        id: "7",
        title: "Receive Decision",
        description: "Get your visa decision and collect documents",
        duration: "1 day",
        status: "pending",
        documents: ["Decision Letter", "Passport with Visa"],
        requirements: ["Decision received"],
        tips: ["Check visa vignette details", "Collect BRP within 10 days", "Report any errors immediately"],
      },
    ],
  },
  work: {
    visaType: "Skilled Worker Visa",
    totalEstimatedTime: "3-8 weeks",
    currentStep: 0,
    steps: [
      {
        id: "1",
        title: "Find Job Offer",
        description: "Secure job offer from UK employer with valid sponsor licence",
        duration: "4-12 weeks",
        status: "pending",
        documents: ["Job Offer Letter", "Employer Sponsor Licence", "Job Description"],
        requirements: ["Licensed sponsor", "Eligible occupation", "Salary requirement"],
        tips: ["Check sponsor register", "Verify job details", "Negotiate salary"],
      },
      {
        id: "2",
        title: "Get Certificate of Sponsorship",
        description: "Employer assigns CoS with your job details",
        duration: "1-4 weeks",
        status: "pending",
        documents: ["CoS Reference Number", "Employer Confirmation"],
        requirements: ["Licensed sponsor", "Valid job offer", "Employer approval"],
        tips: ["Keep CoS safe", "Check details carefully", "Apply within 3 months"],
      },
      {
        id: "3",
        title: "Prepare Documents",
        description: "Gather all required documents for visa application",
        duration: "1-2 weeks",
        status: "pending",
        documents: ["Passport", "CoS", "Bank Statements", "English Test", "Qualification Certificates"],
        requirements: ["Valid passport", "CoS number", "Financial evidence", "English proficiency"],
        tips: ["Get TB test if required", "Translate documents", "Check salary requirements"],
      },
      {
        id: "4",
        title: "Apply Online",
        description: "Complete online application and pay fees",
        duration: "1-2 hours",
        status: "pending",
        documents: ["Online Application", "Payment Confirmation"],
        requirements: ["All information ready", "Payment method", "Valid email"],
        tips: ["Use UKVI website", "Save progress", "Double-check information"],
      },
      {
        id: "5",
        title: "Biometrics Appointment",
        description: "Attend visa centre for fingerprints and photo",
        duration: "1 day",
        status: "pending",
        documents: ["Appointment Confirmation", "All documents"],
        requirements: ["Appointment booked", "Original documents", "Valid ID"],
        tips: ["Book early", "Bring all documents", "Dress professionally"],
      },
      {
        id: "6",
        title: "Wait for Decision",
        description: "Wait for UKVI to process your application",
        duration: "3-8 weeks",
        status: "pending",
        documents: [],
        requirements: ["Application submitted"],
        tips: ["Track online", "Don't book travel", "Prepare for interview"],
      },
      {
        id: "7",
        title: "Receive Decision",
        description: "Get visa decision and collect documents",
        duration: "1 day",
        status: "pending",
        documents: ["Decision Letter", "Passport with Visa"],
        requirements: ["Decision received"],
        tips: ["Check visa details", "Collect BRP", "Report errors"],
      },
    ],
  },
  ilr: {
    visaType: "Indefinite Leave to Remain",
    totalEstimatedTime: "6 months",
    currentStep: 0,
    steps: [
      {
        id: "1",
        title: "Check Eligibility",
        description: "Verify you meet all ILR requirements",
        duration: "1 week",
        status: "pending",
        documents: ["Residence Records", "Employment Evidence"],
        requirements: ["5 years residence", "Qualifying visa", "English proficiency"],
        tips: ["Check absence limits", "Verify visa type", "Calculate residence"],
      },
      {
        id: "2",
        title: "Pass Life in UK Test",
        description: "Take and pass the Life in the UK test",
        duration: "2-8 weeks",
        status: "pending",
        documents: ["Test Booking", "Study Materials", "Test Certificate"],
        requirements: ["Test booking", "Study time", "Test fee"],
        tips: ["Book early", "Study official handbook", "Take practice tests"],
      },
      {
        id: "3",
        title: "Prove English",
        description: "Demonstrate B1 level English proficiency",
        duration: "1-4 weeks",
        status: "pending",
        documents: ["Test Certificate", "Degree Certificate"],
        requirements: ["English test result", "Or degree in English"],
        tips: ["Check exemptions", "Use approved tests", "Prepare in advance"],
      },
      {
        id: "4",
        title: "Gather Documents",
        description: "Collect 5 years of evidence",
        duration: "2-4 weeks",
        status: "pending",
        documents: ["Payslips", "P60s", "Bank Statements", "BRPs", "Employment Letters"],
        requirements: ["5 years evidence", "Complete records", "Original documents"],
        tips: ["Organize chronologically", "Get employer letters", "Check absence records"],
      },
      {
        id: "5",
        title: "Apply Online",
        description: "Complete ILR application and pay fees",
        duration: "2-4 hours",
        status: "pending",
        documents: ["Application Form", "Payment Confirmation"],
        requirements: ["All documents ready", "Payment method", "Valid details"],
        tips: ["Use UKVCAS", "Book appointment", "Double-check information"],
      },
      {
        id: "6",
        title: "Biometrics & Documents",
        description: "Submit biometrics and documents at UKVCAS",
        duration: "1 day",
        status: "pending",
        documents: ["All Original Documents", "Appointment Confirmation"],
        requirements: ["Appointment booked", "Original documents", "Valid ID"],
        tips: ["Bring all documents", "Use ID Check app", "Prepare questions"],
      },
      {
        id: "7",
        title: "Wait for Decision",
        description: "Wait for ILR decision",
        duration: "Up to 6 months",
        status: "pending",
        documents: [],
        requirements: ["Application submitted"],
        tips: ["Track online", "Don't travel abroad", "Maintain residence"],
      },
    ],
  },
  tourist: {
    visaType: "Standard Visitor Visa",
    totalEstimatedTime: "3 weeks",
    currentStep: 0,
    steps: [
      {
        id: "1",
        title: "Check Requirements",
        description: "Verify if you need a visa and requirements",
        duration: "1 day",
        status: "pending",
        documents: ["Passport", "Travel Plans"],
        requirements: ["Valid passport", "Visit purpose", "Financial evidence"],
        tips: ["Check exemption list", "Prepare financial proof", "Have return ticket"],
      },
      {
        id: "2",
        title: "Complete Application",
        description: "Fill out online visa application form",
        duration: "30-60 minutes",
        status: "pending",
        documents: ["Application Form"],
        requirements: ["Valid passport", "Application details", "Payment method"],
        tips: ["Be honest", "Have documents ready", "Save progress"],
      },
      {
        id: "3",
        title: "Pay Fees",
        description: "Pay visa application fees",
        duration: "5 minutes",
        status: "pending",
        documents: ["Payment Confirmation"],
        requirements: ["Valid payment method", "Correct fee amount"],
        tips: ["Use credit/debit card", "Keep receipt", "Check amount"],
      },
      {
        id: "4",
        title: "Biometrics",
        description: "Submit fingerprints and photo",
        duration: "1 day",
        status: "pending",
        documents: ["Appointment Confirmation", "Passport"],
        requirements: ["Appointment booked", "Valid passport"],
        tips: ["Book early", "Bring passport", "Dress appropriately"],
      },
      {
        id: "5",
        title: "Wait for Decision",
        description: "Wait for visa processing",
        duration: "3 weeks",
        status: "pending",
        documents: [],
        requirements: ["Application submitted"],
        tips: ["Track online", "Don't book travel", "Prepare for interview"],
      },
      {
        id: "6",
        title: "Receive Decision",
        description: "Get visa decision",
        duration: "1 day",
        status: "pending",
        documents: ["Decision Letter", "Passport with Visa"],
        requirements: ["Decision received"],
        tips: ["Check visa details", "Report errors", "Plan travel"],
      },
    ],
  },
};

export default function UKApplicationTimeline() {
  const [selectedVisa, setSelectedVisa] = useState("student");
  const [priorityService, setPriorityService] = useState<"standard" | "priority" | "super">("standard");
  const [currentStep, setCurrentStep] = useState(0);

  const timelineData = useMemo(() => {
    const data = UK_VISA_TIMELINES[selectedVisa];
    
    // Adjust timeline based on priority service
    if (priorityService === "priority") {
      return {
        ...data,
        totalEstimatedTime: "5 working days",
        steps: data.steps.map((step, index) => ({
          ...step,
          duration: index === 5 ? "5 working days" : step.duration
        }))
      };
    } else if (priorityService === "super") {
      return {
        ...data,
        totalEstimatedTime: "1 working day",
        steps: data.steps.map((step, index) => ({
          ...step,
          duration: index === 5 ? "1 working day" : step.duration
        }))
      };
    }
    
    return data;
  }, [selectedVisa, priorityService]);

  const getStatusColor = (status: TimelineStep["status"]) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "in-progress": return "bg-blue-500";
      case "delayed": return "bg-yellow-500";
      case "pending": return "bg-gray-300";
      default: return "bg-gray-300";
    }
  };

  const getStatusIcon = (status: TimelineStep["status"]) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-white" />;
      case "in-progress": return <Clock className="h-4 w-4 text-white" />;
      case "delayed": return <AlertCircle className="h-4 w-4 text-white" />;
      case "pending": return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  const getProgressPercentage = () => {
    const completedSteps = timelineData.steps.filter(step => step.status === "completed").length;
    return (completedSteps / timelineData.steps.length) * 100;
  };

  const getEstimatedDates = () => {
    const dates: Date[] = [];
    let currentDate = new Date();
    
    timelineData.steps.forEach((step) => {
      // Estimate duration in days
      let durationDays = 0;
      if (step.duration.includes("weeks")) {
        const weeks = parseInt(step.duration.split(" ")[0]);
        durationDays = weeks * 7;
      } else if (step.duration.includes("working days")) {
        const days = parseInt(step.duration.split(" ")[0]);
        durationDays = days;
      } else if (step.duration.includes("day")) {
        durationDays = 1;
      } else if (step.duration.includes("hours")) {
        durationDays = 1;
      } else if (step.duration.includes("minutes")) {
        durationDays = 1;
      }
      
      dates.push(new Date(currentDate.getTime() + durationDays * 24 * 60 * 60 * 1000));
      currentDate = dates[dates.length - 1];
    });
    
    return dates;
  };

  const estimatedDates = getEstimatedDates();

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Calendar className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">UK Application Timeline</h2>
        </div>

        <Tabs defaultValue="timeline" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="calculator">Priority Calculator</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Visa Type</label>
                <select
                  value={selectedVisa}
                  onChange={(e) => setSelectedVisa(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="student">Student Visa</option>
                  <option value="work">Skilled Worker Visa</option>
                  <option value="ilr">Indefinite Leave to Remain</option>
                  <option value="tourist">Standard Visitor Visa</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Priority Service</label>
                <select
                  value={priorityService}
                  onChange={(e) => setPriorityService(e.target.value as any)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="standard">Standard Processing</option>
                  <option value="priority">Priority (5 working days)</option>
                  <option value="super">Super Priority (1 working day)</option>
                </select>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-800">
                  {timelineData.visaType} Timeline
                </span>
                <Badge variant="outline">
                  {timelineData.totalEstimatedTime}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-blue-700">Current Progress:</span>
                  <span className="text-sm font-semibold text-blue-800">
                    {getProgressPercentage().toFixed(0)}%
                  </span>
                </div>
                <Progress value={getProgressPercentage()} className="h-2" />
              </div>
            </div>

            <div className="space-y-4">
              {timelineData.steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full ${getStatusColor(step.status)} flex items-center justify-center`}>
                        {getStatusIcon(step.status)}
                      </div>
                      {index < timelineData.steps.length - 1 && (
                        <div className="w-0.5 h-16 bg-gray-300 mt-2" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{step.title}</h3>
                          <p className="text-sm text-gray-600">{step.description}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">{step.duration}</Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            {estimatedDates[index] && estimatedDates[index].toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      {step.documents.length > 0 && (
                        <div className="mb-2">
                          <p className="text-sm font-medium text-gray-700 mb-1">Required Documents:</p>
                          <div className="flex flex-wrap gap-1">
                            {step.documents.map((doc, docIndex) => (
                              <Badge key={docIndex} variant="secondary" className="text-xs">
                                {doc}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {step.requirements.length > 0 && (
                        <div className="mb-2">
                          <p className="text-sm font-medium text-gray-700 mb-1">Requirements:</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {step.requirements.map((req, reqIndex) => (
                              <li key={reqIndex} className="flex items-center space-x-2">
                                <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {step.tips.length > 0 && (
                        <div className="bg-yellow-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-yellow-800 mb-2">Tips:</p>
                          <ul className="text-sm text-yellow-700 space-y-1">
                            {step.tips.map((tip, tipIndex) => (
                              <li key={tipIndex} className="flex items-start space-x-2">
                                <Info className="h-3 w-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="calculator" className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-4">Processing Time Calculator</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Select Visa Type:</label>
                  <select
                    value={selectedVisa}
                    onChange={(e) => setSelectedVisa(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="student">Student Visa</option>
                    <option value="work">Skilled Worker Visa</option>
                    <option value="ilr">Indefinite Leave to Remain</option>
                    <option value="tourist">Standard Visitor Visa</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Priority Service:</label>
                  <select
                    value={priorityService}
                    onChange={(e) => setPriorityService(e.target.value as any)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="standard">Standard Processing</option>
                    <option value="priority">Priority (+£500)</option>
                    <option value="super">Super Priority (+£1,000)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-4">Estimated Timeline</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Total Processing Time:</span>
                  <span className="font-semibold">{timelineData.totalEstimatedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Priority Service:</span>
                  <span className="font-semibold capitalize">{priorityService}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Application Steps:</span>
                  <span className="font-semibold">{timelineData.steps.length} steps</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-4">Priority Service Impact</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <span><strong>Standard:</strong> Regular processing times</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <span><strong>Priority:</strong> Decision in 5 working days</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span><strong>Super Priority:</strong> Decision by next working day</span>
                </div>
              </div>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Priority services cost extra but significantly reduce processing time. Not available for all visa types or applications.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
