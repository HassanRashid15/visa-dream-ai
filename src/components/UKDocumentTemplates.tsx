import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, CheckCircle, AlertCircle, Info, Eye, Printer, Mail, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MobileContainer, MobileGrid, MobileCard, MobileButton, MobileText } from "@/components/ui/mobile-optimized";

interface DocumentTemplate {
  id: string;
  title: string;
  visaType: string;
  description: string;
  fields: {
    name: string;
    label: string;
    type: "text" | "number" | "date" | "select" | "textarea";
    required: boolean;
    placeholder?: string;
    options?: string[];
    validation?: string;
    example?: string;
  }[];
  downloadUrl?: string;
  instructions: string[];
  tips: string[];
}

const UK_DOCUMENT_TEMPLATES: Record<string, DocumentTemplate[]> = {
  student: [
    {
      id: "student-visa-application",
      title: "Student Visa Application Form",
      visaType: "Student Visa",
      description: "Complete UK Student Visa application form with pre-filled common fields",
      fields: [
        { name: "full_name", label: "Full Name", type: "text", required: true, placeholder: "John Doe", example: "John Michael Doe" },
        { name: "date_of_birth", label: "Date of Birth", type: "date", required: true, placeholder: "DD/MM/YYYY", example: "15/01/1995" },
        { name: "passport_number", label: "Passport Number", type: "text", required: true, placeholder: "123456789", example: "123456789" },
        { name: "nationality", label: "Nationality", type: "select", required: true, options: ["British", "Indian", "Pakistani", "Chinese", "Nigerian", "Bangladeshi", "American", "Canadian", "Australian"] },
        { name: "email", label: "Email Address", type: "text", required: true, placeholder: "john@example.com", example: "john.doe@email.com" },
        { name: "phone", label: "Phone Number", type: "text", required: true, placeholder: "+44 20 1234 5678", example: "+44 20 1234 5678" },
        { name: "cas_number", label: "CAS Reference Number", type: "text", required: true, placeholder: "GBR123456789012", example: "GBR123456789012" },
        { name: "institution_name", label: "Institution Name", type: "text", required: true, placeholder: "University of London", example: "University of London" },
        { name: "course_title", label: "Course Title", type: "text", required: true, placeholder: "Computer Science BSc", example: "Computer Science BSc" },
        { name: "course_level", label: "Course Level", type: "select", required: true, options: ["Undergraduate", "Postgraduate", "PhD", "Diploma", "Foundation"] },
        { name: "start_date", label: "Course Start Date", type: "date", required: true, placeholder: "01/09/2024", example: "01/09/2024" },
        { name: "end_date", label: "Course End Date", type: "date", required: true, placeholder: "01/09/2027", example: "01/09/2027" },
        { name: "tuition_fees", label: "Tuition Fees (£)", type: "number", required: true, placeholder: "20000", example: "20000" },
        { name: "living_costs", label: "Living Costs (£)", type: "number", required: true, placeholder: "12000", example: "12000" },
        { name: "english_test", label: "English Test", type: "select", required: true, options: ["IELTS UKVI", "PTE Academic UKVI", "LanguageCert", "Trinity ISE", "Degree in English"] },
        { name: "test_score", label: "Test Score", type: "text", required: true, placeholder: "6.5", example: "6.5" },
        { name: "test_date", label: "Test Date", type: "date", required: true, placeholder: "01/08/2024", example: "01/08/2024" },
        { name: "test_reference", label: "Test Reference Number", type: "text", required: true, placeholder: "1234567890", example: "1234567890" },
      ],
      downloadUrl: "/templates/student-visa-application.pdf",
      instructions: [
        "Fill in all required fields accurately",
        "Double-check all information before submission",
        "Ensure passport validity extends beyond course duration",
        "Use exact CAS reference number from your institution",
        "Have all supporting documents ready",
        "Pay the correct visa fee and IHS",
        "Book biometrics appointment after online application"
      ],
      tips: [
        "Take screenshots of completed form",
        "Save application reference number",
        "Print a copy for your records",
        "Keep all documents organized",
        "Apply well before course start date",
        "Check email regularly for updates"
      ]
    },
    {
      id: "student-financial-sponsorship",
      title: "Financial Sponsorship Form",
      visaType: "Student Visa",
      description: "Financial sponsorship declaration form for Student visa applications",
      fields: [
        { name: "applicant_name", label: "Applicant Name", type: "text", required: true, placeholder: "John Doe", example: "John Michael Doe" },
        { name: "sponsor_name", label: "Sponsor Name", type: "text", required: true, placeholder: "Jane Doe", example: "Jane Doe" },
        name: "sponsor_relationship", label: "Relationship to Applicant", type: "select", required: true, options: ["Parent", "Spouse", "Guardian", "Other Family Member", "Friend", "Employer", "Government"] },
        { name: "sponsor_occupation", label: "Sponsor's Occupation", type: "text", required: true, placeholder: "Teacher", example: "Teacher" },
        name: "sponsor_income", label: "Annual Income (£)", type: "number", required: true, placeholder: "50000", example: "50000" },
        { name: "sponsorship_amount", label: "Sponsorship Amount (£)", type: "number", required: true, placeholder: "30000", example: "30000" },
        name: "sponsorship_duration", label: "Sponsorship Duration", type: "select", required: true, options: ["1 year", "2 years", "3 years", "4 years", "5 years"] },
        name: "bank_name", label: "Bank Name", type: "text", required: true, placeholder: "HSBC", example: "HSBC" },
        name: "bank_address", label: "Bank Address", type: "text", required: true, placeholder: "123 High Street", example: "123 High Street, London" },
        name: "account_number", label: "Account Number", type: "text", required: true, placeholder: "12345678", example: "12345678" },
        { name: "sort_code", label: "Sort Code", type: "text", required: true, placeholder: "12-34-56", example: "12-34-56" },
        name: "signature_date", label: "Signature Date", type: "date", required: true, placeholder: "01/08/2024", example: "01/08/2024" },
      ],
      downloadUrl: "/templates/financial-sponsorship.pdf",
      instructions: [
        "Complete all financial information accurately",
        "Include bank statements for the last 6 months",
        "Provide evidence of sponsor's income",
        "Get sponsor's signature on the form",
        "Include bank letter if self-sponsored",
        "Ensure funds meet UKVI requirements",
        "Translate documents if not in English"
      ],
      tips: [
        "Use official bank letterhead",
        "Include contact information",
        "Get bank manager's signature if possible",
        "Keep original documents safe",
        "Make copies for submission",
        "Ensure amounts match bank statements"
      ]
    }
  ],
  work: [
    {
      id: "work-visa-application",
      title: "Skilled Worker Visa Application",
      visaType: "Skilled Worker Visa",
      description: "Complete UK Skilled Worker visa application form",
      fields: [
        { name: "full_name", label: "Full Name", type: "text", required: true, placeholder: "John Doe", example: "John Michael Doe" },
        { name: "date_of_birth", label: "Date of Birth", type: "date", required: true, placeholder: "DD/MM/YYYY", example: "15/01/1995" },
        { name: "passport_number", label: "Passport Number", type: "text", required: true, placeholder: "123456789", example: "123456789" },
        { name: "nationality", label: "Nationality", type: "select", required: true, options: ["British", "Indian", "Pakistani", "Chinese", "Nigerian", "Bangladeshi", "American", "Canadian", "Australian"] },
        { name: "email", label: "Email Address", type: "text", required: true, placeholder: "john@example.com", example: "john.doe@email.com" },
        { name: "phone", label: "Phone Number", type: "text", required: true, placeholder: "+44 20 1234 5678", example: "+44 20 1234 5678" },
        { name: "cos_number", label: "Certificate of Sponsorship Number", type: "text", required: true, placeholder: "Z123456789012", example: "Z123456789012" },
        { name: "employer_name", label: "Employer Name", type: "text", required: true, placeholder: "Tech Corp Ltd", example: "Tech Corp Ltd" },
        { name: "job_title", label: "Job Title", type: "text", required: true, placeholder: "Software Developer", example: "Software Developer" },
        { name: "soc_code", label: "SOC Code", type: "text", required: true, placeholder: "2131", example: "2131" },
        { name: "salary", label: "Annual Salary (£)", type: "number", required: true, placeholder: "45000", example: "45000" },
        { name: "work_location", label: "Work Location", type: "text", required: true, placeholder: "London", example: "London" },
        { name: "start_date", label: "Job Start Date", type: "date", required: true, placeholder: "01/09/2024", example: "01/09/2024" },
        { name: "english_test", label: "English Test", type: "select", required: true, options: ["IELTS Life Skills B1", "PTE Academic", "LanguageCert", "Trinity ISE", "Degree in English"] },
        name: "test_score", label: "Test Score", type: "text", required: true, placeholder: "4.0", example: "4.0" },
        { name: "test_date", label: "Test Date", type: "date", required: true, placeholder: "01/08/2024", example: "01/08/2024" },
        { name: "dependants", label: "Number of Dependents", type: "select", required: true, options: ["0", "1", "2", "3", "4"] },
        name: "dependant_details", label: "Dependant Details", type: "textarea", required: false, placeholder: "Name, DOB, relationship", example: "Jane Doe, 15/01/2010, Daughter" },
      ],
      downloadUrl: "/templates/work-visa-application.pdf",
      instructions: [
        "Fill in all required fields accurately",
        "Ensure job meets skill level requirements",
        "Verify employer's sponsor licence",
        "Check salary meets minimum threshold",
        "Have CoS from employer",
        "Provide English language evidence",
        "Include all dependant information",
        "Pay correct visa fee and IHS"
      ],
      tips: [
        "Double-check CoS reference number",
        "Verify SOC code for your occupation",
        "Check salary against going rate",
        "Keep employer contact information",
        "Prepare dependant documents",
        "Apply before CoS expires",
        "Track application online"
      ]
    }
  ],
  ilr: [
    {
      id: "ilr-application",
      title: "Indefinite Leave to Remain Application",
      visaType: "ILR",
      description: "Complete ILR application form for permanent residence",
      fields: [
        { name: "full_name", label: "Full Name", type: "text", required: true, placeholder: "John Doe", example: "John Michael Doe" },
        { name: "date_of_birth", label: "Date of Birth", type: "date", required: true, placeholder: "DD/MM/YYYY", example: "15/01/1995" },
        { name: "passport_number", label: "Passport Number", type: "text", required: true, placeholder: "123456789", example: "123456789" },
        { name: "nationality", label: "Nationality", type: "select", required: true, options: ["British", "Indian", "Precarious", "Chinese", "Nigerian", "Bangladeshi", "American", "Canadian", "Australian"] },
        { name: "email", label: "Email Address", type: "text", required: true, placeholder: "john@example.com", example: "john.doe@email.com" },
        { name: "phone", label: "Phone Number", type: "text", required: true, placeholder: "+44 20 1234 5678", example: "+44 20 1234 5678" },
        { name: "address", label: "Current Address", type: "textarea", required: true, placeholder: "123 High Street, London", example: "123 High Street, London, SE1 1AA" },
        { name: "residence_start_date", label: "Date of First Entry to UK", type: "date", required: true, placeholder: "01/09/2019", example: "01/09/2019" },
        { name: "visa_type", label: "Current Visa Type", type: "select", required: true, options: ["Skilled Worker", "Health and Care Worker", "Global Talent", "Innovator Founder", "Student"] },
        { name: "visa_expiry", label: "Current Visa Expiry", type: "date", required: true, placeholder: "01/09/2024", example: "01/09/2024" },
        { name: "life_in_uk_test", label: "Life in UK Test Date", type: "date", required: true, placeholder: "15/07/2024", example: "15/07/2024" },
        { name: "life_in_uk_reference", label: "Test Reference Number", type: "text", required: true, placeholder: "123456789", example: "123456789" },
        { name: "english_test", label: "English Test Type", type: "select", required: true, options: ["IELTS Life Skills B1", "Degree in English", "LanguageCert", "Trinity ISE"] },
        { name: "employment_history", label: "5 Years Employment History", type: "textarea", required: true, placeholder: "List all employers with dates", example: "Tech Corp Ltd, 2019-2024; Digital Agency, 2017-2019" },
        name: "absence_record", label: "Absences from UK", type: "textarea", required: true, placeholder: "List all trips outside UK", example: "Holiday to Spain, 10 days, July 2023" },
        name: "criminal_record", label: "Criminal Convictions", type: "select", required: true, options: ["None", "Minor Offences", "Serious Offences"] },
        name: "signature_date", label: "Declaration Date", type: "date", required: true, placeholder: "01/08/2024", example: "01/08/2024" },
      ],
      downloadUrl: "/templates/ilr-application.pdf",
      instructions: [
        "Complete all sections accurately",
        "Provide 5 years of continuous residence evidence",
        "Include all employment documentation",
        "Record all absences from the UK",
        "Pass Life in UK test with required score",
        "Provide English language evidence",
        "Declare any criminal convictions",
        "Pay ILR application fee"
      ],
      tips: [
        "Organize documents chronologically",
        "Calculate total absences carefully",
        "Get employer reference letters",
        "Keep bank statements for financial evidence",
        "Prepare for UKVCAS appointment",
        "Apply before current visa expires",
        "Maintain continuous residence"
      ]
    }
  ],
  tourist: [
    {
      id: "visitor-visa-application",
      title: "Standard Visitor Visa Application",
      visaType: "Standard Visitor Visa",
      description: "Complete UK Visitor visa application form",
      fields: [
        { name: "full_name", label: "Full Name", type: "text", required: true, placeholder: "John Doe", example: "John Michael Doe" },
        { name: "date_of_birth", label: "Date of Birth", type: "date", required: true, placeholder: "DD/MM/YYYY", example: "15/01/1995" },
        { name: "passport_number", label: "Passport Number", type: "text", required: true, placeholder: "123456789", example: "123456789" },
        { name: "nationality", label: "Nationality", type: "select", required: true, options: ["British", "Indian", "Pakistani", "Chinese", "Nigerian", "Bangladeshi", "American", "Canadian", "Australian"] },
        { name: "email", label: "Email Address", type: "text", required: true, placeholder: "john@example.com", example: "john.doe@email.com" },
        { name: "phone", label: "Phone Number", type: "text", required: true, placeholder: "+44 20 1234 5678", example: "+44 20 1234 5678" },
        { name: "visit_purpose", label: "Purpose of Visit", type: "select", required: true, options: ["Tourism", "Business", "Study (up to 6 months)", "Medical Treatment", "Visiting Family/Friends", "Other"] },
        name: "planned_arrival", label: "Planned Arrival Date", type: "date", required: true, placeholder: "01/09/2024", example: "01/09/2024" },
        name: "planned_departure", label: "Planned Departure Date", type: "date", required: true, placeholder: "15/09/2024", example: "15/09/2024" },
                name: "accommodation", label: "Accommodation", type: "textarea", required: true, placeholder: "Hotel booking or host details", example: "Hilton London, 123 Park Lane" },
        name: "funds_available", label: "Available Funds (£)", type: "number", required: true, placeholder: "3000", example: "3000" },
        name: "employment_status", label: "Employment Status", type: "select", required: true, options: ["Employed", "Self-Employed", "Student", "Retired", "Unemployed"] },
        name: "employer_details", label: "Employer Details", type: "textarea", required: false, placeholder: "Company name, address, position", example: "Tech Corp Ltd, 123 Business Park, Manager" },
        name: "return_ticket", label: "Return Flight", type: "text", required: true, placeholder: "BA123", example: "BA123" },
        name: "host_details", label: "Host Contact Details", type: "textarea", required: false, placeholder: "Name, address, phone", example: "John Smith, 456 High Street, London, +44 20 1234 5678" },
      ],
      downloadUrl: "/templates/visitor-visa-application.pdf",
      instructions: [
        "Fill in all required fields accurately",
        "Provide accurate travel dates",
        "Show sufficient funds for stay",
        "Include accommodation details",
        "Have return or onward ticket",
        "Be honest about visit purpose",
        "Provide employment evidence if applicable"
      ],
      tips: [
        "Apply at least 3 months before travel",
        "Have all documents ready",
        "Check if you need a visa",
        "Book accommodation in advance",
        "Get travel insurance",
        "Prepare for interview if required",
        "Don't overstay visa validity"
      ]
    }
  ]
};

export default function UKDocumentTemplates() {
  const [selectedVisa, setSelectedVisa] = useState("student");
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);

  const templates = UK_DOCUMENT_TEMPLATES[selectedVisa];
  const currentTemplate = templates[selectedTemplate];

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const validateForm = () => {
    const errors: string[] = [];
    
    currentTemplate.fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        errors.push(`${field.label} is required`);
      }
      
      if (field.type === "email" && formData[field.name]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+\s*$/;
        if (!emailRegex.test(formData[field.name])) {
          errors.push(`${field.label} must be a valid email`);
        }
      }
      
      if (field.type === "number" && formData[field.name]) {
        const num = parseFloat(formData[field.name]);
        if (isNaN(num) || num < 0) {
          errors.push(`${field.label} must be a valid number`);
        }
      }
    });
    
    return errors;
  };

  const generatePreview = () => {
    setShowPreview(true);
  };

  const downloadTemplate = () => {
    if (currentTemplate.downloadUrl) {
      window.open(currentTemplate.downloadUrl, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <FileText className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">UK Document Templates</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Visa Type</label>
            <select
              value={selectedVisa}
              onChange={(e) => {
                setSelectedVisa(e.target.value);
                setSelectedTemplate(0);
                setFormData({});
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
            <label className="text-sm font-medium">Document Type</label>
            <select
              value={selectedTemplate}
              onChange={(e) => {
                setSelectedTemplate(parseInt(e.target.value));
                setFormData({});
              }}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              {templates.map((template, index) => (
                <option key={template.id} value={index}>
                  {template.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2 text-blue-800">{currentTemplate.title}</h3>
          <p className="text-sm text-blue-700 mb-2">{currentTemplate.description}</p>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{currentTemplate.visaType}</Badge>
            <div className="text-sm text-blue-600">
              {currentTemplate.fields.length} fields
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            {currentTemplate.fields.map((field, index) => (
              <div key={field.name} className="space-y-2">
                <label className="text-sm font-medium">
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                
                {field.type === "text" && (
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={formData[field.name] || ""}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
                
                {field.type === "number" && (
                  <input
                    type="number"
                    placeholder={field.placeholder}
                    value={formData[field.name] || ""}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
                
                {field.type === "date" && (
                  <input
                    type="date"
                    placeholder={field.placeholder}
                    value={formData[field.name] || ""}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
                
                {field.type === "select" && (
                  <select
                    value={formData[field.name] || ""}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select...</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
                
                {field.type === "textarea" && (
                  <textarea
                    placeholder={field.placeholder}
                    value={formData[field.name] || ""}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
                
                {field.example && (
                  <p className="text-xs text-gray-500">Example: {field.example}</p>
                )}
              </div>
            ))}
          </div>

          <div className="flex space-x-4">
            <Button onClick={generatePreview} className="flex-1">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button onClick={downloadTemplate} variant="outline" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2 text-yellow-800">Instructions</h3>
          <ul className="space-y-1 text-sm text-yellow-700">
            {currentTemplate.instructions.map((instruction, index) => (
              <li key={index} className="flex items-start space-x-2">
                <Info className="h-3 w-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                {instruction}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2 text-green-800">Tips</h3>
          <ul className="space-y-1 text-sm text-green-700">
            {currentTemplate.tips.map((tip, index) => (
              <li key={index} className="flex items-start space-x-2">
                <Shield className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </Card>

      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white rounded-lg">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Document Preview</h3>
              <Button variant="ghost" onClick={() => setShowPreview(false)}>
                <span className="sr-only">Close</span>
                ×
              </Button>
            </div>
            <div className="p-6 overflow-auto">
              <div className="space-y-4">
                <div className="text-center">
                  <h2 className="text-xl font-bold mb-4">{currentTemplate.title}</h2>
                  <Badge variant="outline">{currentTemplate.visaType}</Badge>
                </div>
                
                <div className="space-y-4">
                  {currentTemplate.fields.map((field) => (
                    <div key={field.name} className="border-b pb-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{field.label}</span>
                        <span className="text-sm text-gray-500">
                          {field.required && <span className="text-red-500">*</span>}
                        </span>
                      </div>
                      <div className="text-gray-800">
                        {formData[field.name] || (
                          <span className="text-gray-400 italic">Not filled</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
