import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, TrendingUp, AlertCircle, CheckCircle, BookOpen, Award, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MobileContainer, MobileGrid, MobileCard, MobileText } from "@/components/ui/mobile-optimized";

interface IELTSRequirement {
  visaType: string;
  minimumScore: number;
  requiredSkills: string[];
  description: string;
  exemptions: string[];
}

interface ScoreResult {
  currentScore: number;
  targetScore: number;
  requiredSkills: string[];
  recommendations: string[];
  eligibilityStatus: "eligible" | "not-eligible" | "borderline";
  preparationPlan: {
    timeframe: string;
    studyHours: number;
    resources: string[];
    tips: string[];
  };
}

const UKVI_IELTS_REQUIREMENTS: Record<string, IELTSRequirement> = {
  student: {
    visaType: "Student Visa",
    minimumScore: 5.5,
    requiredSkills: ["reading", "writing", "speaking", "listening"],
    description: "B2 level English required for most UK universities",
    exemptions: [
      "Degree taught in English",
      "Citizen of majority English-speaking country",
      "Some universities accept alternative qualifications"
    ]
  },
  work: {
    visaType: "Skilled Worker Visa",
    minimumScore: 4.0,
    requiredSkills: ["reading", "writing", "speaking", "listening"],
    description: "B1 level English required for work visas",
    exemptions: [
      "Degree taught in English",
      "Citizen of majority English-speaking country",
      "Professional qualification taught in English"
    ]
  },
  ilr: {
    visaType: "Indefinite Leave to Remain",
    minimumScore: 4.0,
    requiredSkills: ["reading", "writing", "speaking", "listening"],
    description: "B1 level English required for settlement",
    exemptions: [
      "Degree taught in English",
      "Citizen of majority English-speaking country",
      "Age 65+ exemption for some cases"
    ]
  },
  tourist: {
    visaType: "Standard Visitor Visa",
    minimumScore: 0,
    requiredSkills: [],
    description: "No English test required for visitor visa",
    exemptions: [
      "No English requirement for short visits",
      "Some specific categories may require proof"
    ]
  }
};

const IELTS_BAND_DESCRIPTIONS = {
  9.0: "Expert User - Full operational command of English",
  8.5: "Very Good User - Fully operational command with only occasional inaccuracies",
  8.0: "Very Good User - Fully operational command with occasional inaccuracies",
  7.5: "Good User - Operational command with occasional inaccuracies",
  7.0: "Good User - Operational command with occasional inaccuracies",
  6.5: "Competent User - Generally effective command despite inaccuracies",
  6.0: "Competent User - Generally effective command despite inaccuracies",
  5.5: "Modest User - Can handle basic communication in own field",
  5.0: "Modest User - Can handle basic communication in own field",
  4.5: "Limited User - Basic communication is possible",
  4.0: "Limited User - Basic communication is possible",
  3.5: "Extremely Limited User - Conveys and understands general meaning",
  3.0: "Extremely Limited User - Conveys and understands general meaning",
  2.5: "Extremely Limited User - Conveys and understands general meaning",
  2.0: "Intermittent User - Can communicate in very familiar situations",
  1.5: "Extremely Limited User - Can communicate in very familiar situations",
  1.0: "Non User - No ability to use English"
};

export default function IELTSScorePredictor() {
  const [visaType, setVisaType] = useState("student");
  const [currentScores, setCurrentScores] = useState({
    reading: "",
    writing: "",
    speaking: "",
    listening: "",
  });
  const [targetScore, setTargetScore] = useState("6.5");
  const [studyTime, setStudyTime] = useState("");
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const requirement = UKVI_IELTS_REQUIREMENTS[visaType];

  const calculateResult = () => {
    setIsCalculating(true);

    setTimeout(() => {
      const reading = parseFloat(currentScores.reading) || 0;
      const writing = parseFloat(currentScores.writing) || 0;
      const speaking = parseFloat(currentScores.speaking) || 0;
      const listening = parseFloat(currentScores.listening) || 0;
      
      const currentScore = (reading + writing + speaking + listening) / 4;
      const target = parseFloat(targetScore);
      const minimum = requirement.minimumScore;

      // Determine eligibility
      let eligibilityStatus: ScoreResult["eligibilityStatus"];
      if (currentScore >= target) {
        eligibilityStatus = "eligible";
      } else if (currentScore >= minimum) {
        eligibilityStatus = "borderline";
      } else {
        eligibilityStatus = "not-eligible";
      }

      // Generate recommendations
      const recommendations: string[] = [];
      const requiredSkills: string[] = [];

      if (reading < target) {
        recommendations.push(`Focus on reading - current: ${reading}, target: ${target}`);
        requiredSkills.push("reading");
      }
      if (writing < target) {
        recommendations.push(`Improve writing skills - current: ${writing}, target: ${target}`);
        requiredSkills.push("writing");
      }
      if (speaking < target) {
        recommendations.push(`Practice speaking - current: ${speaking}, target: ${target}`);
        requiredSkills.push("speaking");
      }
      if (listening < target) {
        recommendations.push(`Work on listening - current: ${listening}, target: ${target}`);
        requiredSkills.push("listening");
      }

      // Generate preparation plan
      const scoreGap = target - currentScore;
      const studyHoursPerWeek = studyTime ? parseInt(studyTime) : 20;
      
      let timeframe = "";
      if (scoreGap <= 0.5) {
        timeframe = "2-4 weeks";
      } else if (scoreGap <= 1.0) {
        timeframe = "1-2 months";
      } else if (scoreGap <= 1.5) {
        timeframe = "2-3 months";
      } else {
        timeframe = "3-6 months";
      }

      const preparationPlan = {
        timeframe,
        studyHours: studyHoursPerWeek,
        resources: [
          "IELTS Life Skills B1 test preparation",
          "Official IELTS practice materials",
          "Online IELTS preparation courses",
          "IELTS mock tests and practice exams"
        ],
        tips: [
          "Focus on your weakest skills first",
          "Practice with official IELTS sample questions",
          "Take regular mock tests to track progress",
          "Consider professional IELTS tutoring",
          "Improve vocabulary through daily reading"
        ]
      };

      setResult({
        currentScore,
        targetScore: target,
        requiredSkills,
        recommendations,
        eligibilityStatus,
        preparationPlan
      });

      setIsCalculating(false);
    }, 1500);
  };

  const getScoreColor = (score: number, target: number) => {
    if (score >= target) return "text-green-600";
    if (score >= target - 0.5) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressColor = (score: number, target: number) => {
    const percentage = (score / target) * 100;
    if (percentage >= 100) return "bg-green-500";
    if (percentage >= 80) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStatusIcon = (status: ScoreResult["eligibilityStatus"]) => {
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
          <BookOpen className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">IELTS Score Predictor</h2>
        </div>

        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">Score Calculator</TabsTrigger>
            <TabsTrigger value="requirements">UKVI Requirements</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="visaType">Visa Type</Label>
                <Select value={visaType} onValueChange={setVisaType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select visa type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student Visa</SelectItem>
                    <SelectItem value="work">Skilled Worker Visa</SelectItem>
                    <SelectItem value="ilr">Indefinite Leave to Remain</SelectItem>
                    <SelectItem value="tourist">Standard Visitor Visa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="target">Target Score</Label>
                <Select value={targetScore} onValueChange={setTargetScore}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target score" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4.0">4.0 (B1 Level)</SelectItem>
                    <SelectItem value="5.0">5.0 (Modest User)</SelectItem>
                    <SelectItem value="5.5">5.5 (Modest User)</SelectItem>
                    <SelectItem value="6.0">6.0 (Competent User)</SelectItem>
                    <SelectItem value="6.5">6.5 (Competent User)</SelectItem>
                    <SelectItem value="7.0">7.0 (Good User)</SelectItem>
                    <SelectItem value="7.5">7.5 (Good User)</SelectItem>
                    <SelectItem value="8.0">8.0 (Very Good User)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reading">Reading Score</Label>
                <Input
                  id="reading"
                  type="number"
                  step="0.5"
                  min="0"
                  max="9"
                  placeholder="e.g., 6.5"
                  value={currentScores.reading}
                  onChange={(e) => setCurrentScores({ ...currentScores, reading: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="writing">Writing Score</Label>
                <Input
                  id="writing"
                  type="number"
                  step="0.5"
                  min="0"
                  max="9"
                  placeholder="e.g., 6.0"
                  value={currentScores.writing}
                  onChange={(e) => setCurrentScores({ ...currentScores, writing: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="speaking">Speaking Score</Label>
                <Input
                  id="speaking"
                  type="number"
                  step="0.5"
                  min="0"
                  max="9"
                  placeholder="e.g., 6.5"
                  value={currentScores.speaking}
                  onChange={(e) => setCurrentScores({ ...currentScores, speaking: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="listening">Listening Score</Label>
                <Input
                  id="listening"
                  type="number"
                  step="0.5"
                  min="0"
                  max="9"
                  placeholder="e.g., 7.0"
                  value={currentScores.listening}
                  onChange={(e) => setCurrentScores({ ...currentScores, listening: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studyTime">Study Hours per Week</Label>
                <Select value={studyTime} onValueChange={setStudyTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select study time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 hours/week</SelectItem>
                    <SelectItem value="15">15 hours/week</SelectItem>
                    <SelectItem value="20">20 hours/week</SelectItem>
                    <SelectItem value="25">25 hours/week</SelectItem>
                    <SelectItem value="30">30+ hours/week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={calculateResult} 
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
                  <span>Calculate Score</span>
                </div>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="requirements" className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-blue-800">
                {requirement.visaType} Requirements
              </h3>
              <p className="text-sm text-blue-700 mb-3">
                {requirement.description}
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Minimum Score: {requirement.minimumScore}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Required Skills: {requirement.requiredSkills.join(", ")}</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-yellow-800">Exemptions</h3>
              <ul className="space-y-1 text-sm text-yellow-700">
                {requirement.exemptions.map((exemption, index) => (
                  <li key={index}>• {exemption}</li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-gray-800">IELTS Band Descriptions</h3>
              <div className="space-y-2 text-sm">
                {Object.entries(IELTS_BAND_DESCRIPTIONS).slice(0, 5).map(([score, description]) => (
                  <div key={score} className="flex justify-between">
                    <span className="font-medium">Band {score}:</span>
                    <span className="text-gray-600">{description}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Your IELTS Score Analysis</h3>
              <div className="flex items-center space-x-2">
                {getStatusIcon(result.eligibilityStatus)}
                <span className={`font-bold ${
                  result.eligibilityStatus === "eligible" ? "text-green-600" :
                  result.eligibilityStatus === "borderline" ? "text-yellow-600" : "text-red-600"
                }`}>
                  {result.currentScore.toFixed(1)} / {result.targetScore.toFixed(1)}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Progress to Target</span>
                <span className="text-sm text-gray-600">
                  {Math.round((result.currentScore / result.targetScore) * 100)}%
                </span>
              </div>
              <Progress 
                value={(result.currentScore / result.targetScore) * 100} 
                className="h-3"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {Object.entries(currentScores).map(([skill, score]) => {
                const scoreValue = parseFloat(score) || 0;
                return (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium capitalize">{skill}</span>
                      <Badge variant={scoreValue >= result.targetScore ? "default" : "secondary"}>
                        {scoreValue || 0}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress 
                        value={(scoreValue / 9) * 100} 
                        className="flex-1 h-2"
                      />
                      <span className={`text-sm font-medium ${getScoreColor(scoreValue, result.targetScore)}`}>
                        {IELTS_BAND_DESCRIPTIONS[scoreValue as keyof typeof IELTS_BAND_DESCRIPTIONS]?.split(" - ")[0] || "Not Rated"}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className={`p-4 rounded-lg ${
              result.eligibilityStatus === "eligible" ? "bg-green-50" :
              result.eligibilityStatus === "borderline" ? "bg-yellow-50" : "bg-red-50"
            }`}>
              <div className="flex items-start space-x-3">
                {getStatusIcon(result.eligibilityStatus)}
                <div>
                  <h4 className={`font-semibold mb-2 ${
                    result.eligibilityStatus === "eligible" ? "text-green-800" :
                    result.eligibilityStatus === "borderline" ? "text-yellow-800" : "text-red-800"
                  }`}>
                    {result.eligibilityStatus === "eligible" ? "Eligible for Target Score" :
                     result.eligibilityStatus === "borderline" ? "Close to Target Score" : "Below Target Score"}
                  </h4>
                  <div className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <p key={index} className={`text-sm ${
                        result.eligibilityStatus === "eligible" ? "text-green-700" :
                        result.eligibilityStatus === "borderline" ? "text-yellow-700" : "text-red-700"
                      }`}>
                        {rec}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Award className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Preparation Plan</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">Timeframe</span>
                  <p className="font-semibold">{result.preparationPlan.timeframe}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Study Hours/Week</span>
                  <p className="font-semibold">{result.preparationPlan.studyHours} hours</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">Recommended Resources</span>
                  <ul className="space-y-1">
                    {result.preparationPlan.resources.map((resource, index) => (
                      <li key={index} className="text-sm flex items-center space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        {resource}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2 text-blue-800">Study Tips</h4>
              <ul className="space-y-1">
                {result.preparationPlan.tips.map((tip, index) => (
                  <li key={index} className="text-sm text-blue-700 flex items-start space-x-2">
                    <TrendingUp className="h-3 w-3 text-blue-600 mt-0.5 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
