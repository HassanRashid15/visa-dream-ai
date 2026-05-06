import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, CheckCircle, AlertCircle, Info, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

interface CalculatorResult {
  totalPoints: number;
  breakdown: {
    category: string;
    points: number;
    maxPoints: number;
    details: string[];
  }[];
  status: "eligible" | "not-eligible" | "borderline";
  recommendation: string;
}

const UK_OCCUPATIONS = [
  { code: "2131", title: "Software Engineer", goingRate: 37908, shortage: false },
  { code: "2133", title: "IT Project Manager", goingRate: 45250, shortage: false },
  { code: "2135", title: "IT Business Analyst", goingRate: 42800, shortage: false },
  { code: "2136", title: "Programmer/Software Developer", goingRate: 37908, shortage: false },
  { code: "2137", title: "Web Developer", goingRate: 37908, shortage: false },
  { code: "2139", title: "Database Administrator", goingRate: 41200, shortage: false },
  { code: "2141", title: "Systems Analyst", goingRate: 45250, shortage: false },
  { code: "2143", title: "Cyber Security Specialist", goingRate: 50800, shortage: true },
  { code: "2146", title: "Data Scientist", goingRate: 50800, shortage: true },
  { code: "2150", title: "Civil Engineer", goingRate: 28500, shortage: false },
  { code: "2151", title: "Mechanical Engineer", goingRate: 28500, shortage: false },
  { code: "2152", title: "Electrical Engineer", goingRate: 32900, shortage: false },
  { code: "2153", title: "Electronic Engineer", goingRate: 32900, shortage: false },
  { code: "2211", title: "Biologist", goingRate: 31600, shortage: false },
  { code: "2212", title: "Biochemist", goingRate: 31600, shortage: false },
  { code: "2213", title: "Psychologist", goingRate: 41200, shortage: false },
  { code: "2217", title: "Medical Radiographer", goingRate: 32900, shortage: false },
  { code: "2219", title: "Veterinary Surgeon", goingRate: 50800, shortage: false },
  { code: "2221", title: "Nursery Nurse", goingRate: 16700, shortage: false },
  { code: "2222", title: "Paramedic", goingRate: 37908, shortage: false },
  { code: "2223", title: "Social Worker", goingRate: 37908, shortage: false },
  { code: "2231", title: "Nurse", goingRate: 37908, shortage: true },
  { code: "2232", title: "Midwife", goingRate: 37908, shortage: true },
  { code: "2311", title: "Secondary Teacher", goingRate: 31600, shortage: false },
  { code: "2312", title: "Primary Teacher", goingRate: 31600, shortage: false },
  { code: "2313", title: "Special Needs Teacher", goingRate: 37908, shortage: false },
  { code: "2314", title: "Higher Education Teacher", goingRate: 50800, shortage: false },
  { code: "2421", title: "Accountant", goingRate: 45250, shortage: false },
  { code: "2422", title: "Finance Officer", goingRate: 37908, shortage: false },
  { code: "2423", title: "Bookkeeper", goingRate: 28500, shortage: false },
  { code: "2431", title: "Architect", goingRate: 50800, shortage: false },
  { code: "2432", title: "Town Planner", goingRate: 45250, shortage: false },
  { code: "2433", title: "Surveyor", goingRate: 37908, shortage: false },
  { code: "2441", title: "Legal Professional", goingRate: 50800, shortage: false },
  { code: "2442", title: "Solicitor", goingRate: 50800, shortage: false },
  { code: "2443", title: "Barrister", goingRate: 50800, shortage: false },
  { code: "2451", title: "Marketing Manager", goingRate: 45250, shortage: false },
  { code: "2452", title: "Sales Manager", goingRate: 37908, shortage: false },
  { code: "2453", title: "Public Relations Officer", goingRate: 37908, shortage: false },
  { code: "2461", title: "Graphic Designer", goingRate: 28500, shortage: false },
  { code: "2462", title: "Product Designer", goingRate: 37908, shortage: false },
  { code: "2463", title: "Fashion Designer", goingRate: 37908, shortage: false },
  { code: "2471", title: "Journalist", goingRate: 37908, shortage: false },
  { code: "2472", title: "Newspaper Editor", goingRate: 45250, shortage: false },
  { code: "2473", title: "Translator", goingRate: 31600, shortage: false },
];

export default function UKVisaCalculator() {
  const [formData, setFormData] = useState({
    age: "",
    salary: "",
    education: "",
    englishTest: "",
    jobOffer: "",
    occupation: "",
    maintenanceFunds: "",
    certificate: "",
  });

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculatePoints = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      const breakdown: CalculatorResult['breakdown'] = [];
      let totalPoints = 0;
      let recommendation = "";

      // Age Points (Max 20)
      let agePoints = 0;
      const age = parseInt(formData.age);
      if (age >= 18 && age <= 23) agePoints = 20;
      else if (age >= 24 && age <= 29) agePoints = 20;
      else if (age >= 30 && age <= 34) agePoints = 10;
      else if (age >= 35 && age <= 39) agePoints = 5;
      else agePoints = 0;

      breakdown.push({
        category: "Age",
        points: agePoints,
        maxPoints: 20,
        details: agePoints > 0 ? [`Age ${age}: ${agePoints} points`] : ["Age outside eligible range"]
      });
      totalPoints += agePoints;

      // Salary Points (Max 20)
      let salaryPoints = 0;
      const salary = parseFloat(formData.salary);
      const occupation = UK_OCCUPATIONS.find(occ => occ.code === formData.occupation);
      
      if (occupation && salary) {
        const generalThreshold = 38700;
        const goingRate = occupation.goingRate;
        const requiredSalary = Math.max(generalThreshold, goingRate);
        
        if (salary >= requiredSalary + 10000) salaryPoints = 20;
        else if (salary >= requiredSalary + 5000) salaryPoints = 15;
        else if (salary >= requiredSalary) salaryPoints = 10;
        else salaryPoints = 0;

        breakdown.push({
          category: "Salary",
          points: salaryPoints,
          maxPoints: 20,
          details: [
            `Salary: £${salary.toLocaleString()}`,
            `Required: £${requiredSalary.toLocaleString()}`,
            occupation.shortage ? "Shortage occupation bonus eligible" : "Standard occupation"
          ]
        });
      } else {
        breakdown.push({
          category: "Salary",
          points: 0,
          maxPoints: 20,
          details: ["Please enter valid salary and occupation"]
        });
      }
      totalPoints += salaryPoints;

      // Education Points (Max 20)
      let educationPoints = 0;
      switch (formData.education) {
        case "phd":
          educationPoints = 20;
          break;
        case "masters":
          educationPoints = 15;
          break;
        case "bachelors":
          educationPoints = 10;
          break;
        case "diploma":
          educationPoints = 5;
          break;
        default:
          educationPoints = 0;
      }

      breakdown.push({
        category: "Education",
        points: educationPoints,
        maxPoints: 20,
        details: [`${formData.education || "No education"}: ${educationPoints} points`]
      });
      totalPoints += educationPoints;

      // English Language Points (Max 20)
      let englishPoints = 0;
      switch (formData.englishTest) {
        case "ielts8":
          englishPoints = 20;
          break;
        case "ielts7":
          englishPoints = 15;
          break;
        case "ielts6":
          englishPoints = 10;
          break;
        case "degree":
          englishPoints = 20;
          break;
        default:
          englishPoints = 0;
      }

      breakdown.push({
        category: "English Language",
        points: englishPoints,
        maxPoints: 20,
        details: [`${formData.englishTest || "No English proof"}: ${englishPoints} points`]
      });
      totalPoints += englishPoints;

      // Job Offer Points (Max 20)
      let jobOfferPoints = 0;
      if (formData.jobOffer === "licensed") jobOfferPoints = 20;
      else if (formData.jobOffer === "pending") jobOfferPoints = 10;
      else jobOfferPoints = 0;

      breakdown.push({
        category: "Job Offer",
        points: jobOfferPoints,
        maxPoints: 20,
        details: [`${formData.jobOffer || "No job offer"}: ${jobOfferPoints} points`]
      });
      totalPoints += jobOfferPoints;

      // Maintenance Funds Points (Max 10)
      let maintenancePoints = 0;
      if (formData.maintenanceFunds === "certified") maintenancePoints = 10;
      else if (formData.maintenanceFunds === "available") maintenancePoints = 5;
      else maintenancePoints = 0;

      breakdown.push({
        category: "Maintenance Funds",
        points: maintenancePoints,
        maxPoints: 10,
        details: [`${formData.maintenanceFunds || "No funds proof"}: ${maintenancePoints} points`]
      });
      totalPoints += maintenancePoints;

      // Certificate of Sponsorship (Mandatory - 0 points but required)
      breakdown.push({
        category: "Certificate of Sponsorship",
        points: 0,
        maxPoints: 0,
        details: [formData.certificate === "yes" ? "Certificate available" : "Certificate required"]
      });

      // Determine status and recommendation
      let status: CalculatorResult['status'];
      if (totalPoints >= 70) {
        status = "eligible";
        recommendation = "Congratulations! You meet the minimum points requirement for the UK Skilled Worker visa. Next steps: secure a Certificate of Sponsorship from your employer and prepare your application.";
      } else if (totalPoints >= 50) {
        status = "borderline";
        recommendation = `You're close to eligibility! You need ${70 - totalPoints} more points. Consider improving your English score, gaining more qualifications, or finding a higher-paying position.`;
      } else {
        status = "not-eligible";
        recommendation = `You need ${70 - totalPoints} more points to be eligible. Focus on improving your qualifications, English language skills, and finding a higher-paying position.`;
      }

      setResult({
        totalPoints,
        breakdown,
        status,
        recommendation
      });

      setIsCalculating(false);
    }, 1500);
  };

  const getStatusColor = (status: CalculatorResult['status']) => {
    switch (status) {
      case "eligible": return "text-green-600";
      case "borderline": return "text-yellow-600";
      case "not-eligible": return "text-red-600";
    }
  };

  const getStatusIcon = (status: CalculatorResult['status']) => {
    switch (status) {
      case "eligible": return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "borderline": return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "not-eligible": return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Calculator className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">UK Skilled Worker Visa Calculator</h2>
        </div>

        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="e.g., 28"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">Annual Salary (£)</Label>
                <Input
                  id="salary"
                  type="number"
                  placeholder="e.g., 45000"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">Education Level</Label>
                <Select value={formData.education} onValueChange={(value) => setFormData({ ...formData, education: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phd">PhD or higher</SelectItem>
                    <SelectItem value="masters">Master's degree</SelectItem>
                    <SelectItem value="bachelors">Bachelor's degree</SelectItem>
                    <SelectItem value="diploma">Diploma/Certificate</SelectItem>
                    <SelectItem value="none">No formal education</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="english">English Language Test</Label>
                <Select value={formData.englishTest} onValueChange={(value) => setFormData({ ...formData, englishTest: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select English test" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ielts8">IELTS 8.0+ (20 points)</SelectItem>
                    <SelectItem value="ielts7">IELTS 7.0+ (15 points)</SelectItem>
                    <SelectItem value="ielts6">IELTS 6.0+ (10 points)</SelectItem>
                    <SelectItem value="degree">Degree taught in English (20 points)</SelectItem>
                    <SelectItem value="none">No English proof (0 points)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Select value={formData.occupation} onValueChange={(value) => setFormData({ ...formData, occupation: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your occupation" />
                  </SelectTrigger>
                  <SelectContent>
                    {UK_OCCUPATIONS.map((occ) => (
                      <SelectItem key={occ.code} value={occ.code}>
                        {occ.title} - £{occ.goingRate.toLocaleString()}
                        {occ.shortage && " (Shortage)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobOffer">Job Offer Status</Label>
                <Select value={formData.jobOffer} onValueChange={(value) => setFormData({ ...formData, jobOffer: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job offer status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="licensed">Licensed sponsor (20 points)</SelectItem>
                    <SelectItem value="pending">Pending sponsorship (10 points)</SelectItem>
                    <SelectItem value="none">No job offer (0 points)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maintenance">Maintenance Funds</Label>
                <Select value={formData.maintenanceFunds} onValueChange={(value) => setFormData({ ...formData, maintenanceFunds: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select funds status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="certified">Employer certified funds (10 points)</SelectItem>
                    <SelectItem value="available">Personal funds available (5 points)</SelectItem>
                    <SelectItem value="none">No funds proof (0 points)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="certificate">Certificate of Sponsorship</Label>
                <Select value={formData.certificate} onValueChange={(value) => setFormData({ ...formData, certificate: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Certificate status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Available</SelectItem>
                    <SelectItem value="no">Not yet received</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={calculatePoints} 
              disabled={isCalculating}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              {isCalculating ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>Calculating...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Calculator className="h-4 w-4" />
                  <span>Calculate Points</span>
                </div>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="requirements" className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-blue-800">Skilled Worker Visa Requirements</h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>• Minimum 70 points required</li>
                <li>• 50 points from mandatory criteria (job offer, English, skill level)</li>
                <li>• 20 points from tradeable criteria (salary, education, age)</li>
                <li>• Job offer from UK licensed sponsor</li>
                <li>• Salary at least £38,700 or going rate for occupation</li>
                <li>• English language at B1 level (IELTS 4.0)</li>
                <li>• Maintenance funds of £1,270 (unless employer certified)</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-yellow-800">Shortage Occupations</h3>
              <p className="text-sm text-yellow-700 mb-2">
                Certain occupations are on the shortage occupation list, which means:
              </p>
              <ul className="space-y-1 text-sm text-yellow-700">
                <li>• Lower salary requirements may apply</li>
                <li>• Higher priority in visa processing</li>
                <li>• More flexible immigration rules</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Your Results</h3>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(result.status)}
                  <span className={`font-bold ${getStatusColor(result.status)}`}>
                    {result.totalPoints} / 70 points
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-gray-600">
                    {Math.round((result.totalPoints / 70) * 100)}%
                  </span>
                </div>
                <Progress 
                  value={(result.totalPoints / 70) * 100} 
                  className="h-3"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {result.breakdown.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{item.category}</span>
                      <Badge variant={item.points > 0 ? "default" : "secondary"}>
                        {item.points} / {item.maxPoints}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      {item.details.map((detail, i) => (
                        <p key={i} className="text-sm text-gray-600">{detail}</p>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className={`p-4 rounded-lg ${
                result.status === "eligible" ? "bg-green-50" :
                result.status === "borderline" ? "bg-yellow-50" : "bg-red-50"
              }`}>
                <div className="flex items-start space-x-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <h4 className={`font-semibold mb-2 ${
                      result.status === "eligible" ? "text-green-800" :
                      result.status === "borderline" ? "text-yellow-800" : "text-red-800"
                    }`}>
                      {result.status === "eligible" ? "Eligible for Skilled Worker Visa" :
                       result.status === "borderline" ? "Close to Eligibility" : "Not Currently Eligible"}
                    </h4>
                    <p className={`text-sm ${
                      result.status === "eligible" ? "text-green-700" :
                      result.status === "borderline" ? "text-yellow-700" : "text-red-700"
                    }`}>
                      {result.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
