import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, TrendingUp, Users, Clock, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface CostBreakdown {
  category: string;
  items: {
    name: string;
    amount: number;
    description: string;
    required: boolean;
  }[];
  total: number;
}

interface TotalCosts {
  visaFees: number;
  healthSurcharge: number;
  priorityServices: number;
  additionalCosts: number;
  total: number;
}

const UK_VISA_FEES = {
  student: {
    standard: 490,
    priority: 500,
    superPriority: 1000,
    ihs: 776,
  },
  work: {
    standard: 719,
    standard3Years: 1420,
    priority: 500,
    superPriority: 1000,
    ihs: 1035,
    skillsCharge: 1000,
  },
  ilr: {
    standard: 2885,
    superPriority: 800,
    lifeInUKTest: 50,
    ieltsLifeSkills: 150,
  },
  tourist: {
    standard6Months: 115,
    longTerm2Years: 400,
    longTerm5Years: 771,
    longTerm10Years: 963,
    priority: 500,
    superPriority: 1000,
  },
} as const;

export default function UKCostCalculator() {
  const [visaType, setVisaType] = useState<"student" | "work" | "ilr" | "tourist">("student");
  const [duration, setDuration] = useState("");
  const [priorityService, setPriorityService] = useState("none");
  const [dependants, setDependants] = useState("0");
  const [additionalServices, setAdditionalServices] = useState({
    documentTranslation: false,
    courierService: false,
    legalAdvice: false,
    healthInsurance: false,
  });

  const calculateCosts = (): TotalCosts => {
    let visaFees = 0;
    let healthSurcharge = 0;
    let priorityServices = 0;
    let additionalCosts = 0;

    const dependantCount = parseInt(dependants) || 0;
    const durationYears = parseInt(duration) || 1;

    // Calculate visa fees
    switch (visaType) {
      case "student":
        visaFees = UK_VISA_FEES.student.standard;
        healthSurcharge = UK_VISA_FEES.student.ihs * durationYears;
        break;
      case "work":
        visaFees = durationYears > 3 ? UK_VISA_FEES.work.standard3Years : UK_VISA_FEES.work.standard;
        healthSurcharge = UK_VISA_FEES.work.ihs * durationYears;
        break;
      case "ilr":
        visaFees = UK_VISA_FEES.ilr.standard;
        break;
      case "tourist":
        switch (duration) {
          case "6":
            visaFees = UK_VISA_FEES.tourist.standard6Months;
            break;
          case "24":
            visaFees = UK_VISA_FEES.tourist.longTerm2Years;
            break;
          case "60":
            visaFees = UK_VISA_FEES.tourist.longTerm5Years;
            break;
          case "120":
            visaFees = UK_VISA_FEES.tourist.longTerm10Years;
            break;
          default:
            visaFees = UK_VISA_FEES.tourist.standard6Months;
        }
        break;
    }

    // Add dependant fees
    if (visaType === "work" && dependantCount > 0) {
      visaFees += UK_VISA_FEES.work.standard * dependantCount;
      healthSurcharge += UK_VISA_FEES.work.ihs * durationYears * dependantCount;
    }

    // Add priority services
    switch (priorityService) {
      case "priority":
        priorityServices = (UK_VISA_FEES[visaType] as any).priority || 0;
        break;
      case "super":
        priorityServices = (UK_VISA_FEES[visaType] as any).superPriority || 0;
        break;
    }

    // Add additional services
    if (additionalServices.documentTranslation) additionalCosts += 150;
    if (additionalServices.courierService) additionalCosts += 50;
    if (additionalServices.legalAdvice) additionalCosts += 500;
    if (additionalServices.healthInsurance) additionalCosts += 300;

    return {
      visaFees,
      healthSurcharge,
      priorityServices,
      additionalCosts,
      total: visaFees + healthSurcharge + priorityServices + additionalCosts,
    };
  };

  const getCostBreakdown = (): CostBreakdown[] => {
    const costs = calculateCosts();
    const breakdown: CostBreakdown[] = [];

    // Visa Fees
    const visaItems = [
      {
        name: "Main Applicant Visa Fee",
        amount: visaType === "work" && duration && parseInt(duration) > 3 ? UK_VISA_FEES.work.standard3Years : (UK_VISA_FEES[visaType] as any).standard || 115,
        description: "Standard visa application fee",
        required: true,
      },
    ];

    if (visaType === "ilr") {
      visaItems.push(
        {
          name: "Life in the UK Test",
          amount: UK_VISA_FEES.ilr.lifeInUKTest,
          description: "Required test for ILR",
          required: true,
        },
        {
          name: "IELTS Life Skills B1",
          amount: UK_VISA_FEES.ilr.ieltsLifeSkills,
          description: "English language test",
          required: false,
        }
      );
    }

    if (visaType === "work" && dependants && parseInt(dependants) > 0) {
      visaItems.push({
        name: "Dependant Visa Fees",
        amount: UK_VISA_FEES.work.standard * parseInt(dependants),
        description: `Visa fees for ${dependants} dependant(s)`,
        required: true,
      });
    }

    breakdown.push({
      category: "Visa Fees",
      items: visaItems,
      total: costs.visaFees,
    });

    // Immigration Health Surcharge
    if (visaType !== "tourist") {
      const ihsItems = [
        {
          name: "Main Applicant IHS",
          amount: (UK_VISA_FEES[visaType] as any).ihs * (parseInt(duration) || 1),
          description: `Healthcare surcharge for ${parseInt(duration) || 1} year(s)`,
          required: true,
        },
      ];

      if (visaType === "work" && dependants && parseInt(dependants) > 0) {
        ihsItems.push({
          name: "Dependant IHS",
          amount: UK_VISA_FEES.work.ihs * (parseInt(duration) || 1) * parseInt(dependants),
          description: `Healthcare surcharge for ${dependants} dependant(s)`,
          required: true,
        });
      }

      breakdown.push({
        category: "Immigration Health Surcharge",
        items: ihsItems,
        total: costs.healthSurcharge,
      });
    }

    // Priority Services
    if (priorityService !== "none") {
      breakdown.push({
        category: "Priority Services",
        items: [
          {
            name: priorityService === "priority" ? "Priority Processing" : "Super Priority Processing",
            amount: costs.priorityServices,
            description: priorityService === "priority" ? "5 working days" : "Next working day",
            required: false,
          },
        ],
        total: costs.priorityServices,
      });
    }

    // Additional Services
    const additionalItems = [];
    if (additionalServices.documentTranslation) {
      additionalItems.push({
        name: "Document Translation",
        amount: 150,
        description: "Professional translation services",
        required: false,
      });
    }
    if (additionalServices.courierService) {
      additionalItems.push({
        name: "Courier Service",
        amount: 50,
        description: "Fast document delivery",
        required: false,
      });
    }
    if (additionalServices.legalAdvice) {
      additionalItems.push({
        name: "Legal Advice",
        amount: 500,
        description: "Immigration lawyer consultation",
        required: false,
      });
    }
    if (additionalServices.healthInsurance) {
      additionalItems.push({
        name: "Private Health Insurance",
        amount: 300,
        description: "Additional health coverage",
        required: false,
      });
    }

    if (additionalItems.length > 0) {
      breakdown.push({
        category: "Additional Services",
        items: additionalItems,
        total: costs.additionalCosts,
      });
    }

    return breakdown;
  };

  const costs = calculateCosts();
  const breakdown = getCostBreakdown();

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Calculator className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">UK Visa Cost Calculator</h2>
        </div>

        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="breakdown">Cost Breakdown</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="visaType">Visa Type</Label>
                <Select value={visaType} onValueChange={(value: any) => setVisaType(value)}>
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
                <Label htmlFor="duration">
                  {visaType === "tourist" ? "Visa Duration" : "Course/Job Duration"}
                </Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {visaType === "tourist" ? (
                      <>
                        <SelectItem value="6">6 months (£115)</SelectItem>
                        <SelectItem value="24">2 years (£400)</SelectItem>
                        <SelectItem value="60">5 years (£771)</SelectItem>
                        <SelectItem value="120">10 years (£963)</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="1">1 year</SelectItem>
                        <SelectItem value="2">2 years</SelectItem>
                        <SelectItem value="3">3 years</SelectItem>
                        <SelectItem value="4">4 years</SelectItem>
                        <SelectItem value="5">5 years</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority Service</Label>
                <Select value={priorityService} onValueChange={setPriorityService}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Standard Processing</SelectItem>
                    <SelectItem value="priority">Priority (+£500)</SelectItem>
                    <SelectItem value="super">Super Priority (+£1,000)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {visaType === "work" && (
                <div className="space-y-2">
                  <Label htmlFor="dependants">Number of Dependents</Label>
                  <Select value={dependants} onValueChange={setDependants}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select dependents" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No dependents</SelectItem>
                      <SelectItem value="1">1 dependent</SelectItem>
                      <SelectItem value="2">2 dependents</SelectItem>
                      <SelectItem value="3">3 dependents</SelectItem>
                      <SelectItem value="4">4 dependents</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <Label>Additional Services</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="translation"
                    checked={additionalServices.documentTranslation}
                    onChange={(e) => setAdditionalServices({ ...additionalServices, documentTranslation: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="translation">Document Translation (+£150)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="courier"
                    checked={additionalServices.courierService}
                    onChange={(e) => setAdditionalServices({ ...additionalServices, courierService: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="courier">Courier Service (+£50)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="legal"
                    checked={additionalServices.legalAdvice}
                    onChange={(e) => setAdditionalServices({ ...additionalServices, legalAdvice: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="legal">Legal Advice (+£500)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="health"
                    checked={additionalServices.healthInsurance}
                    onChange={(e) => setAdditionalServices({ ...additionalServices, healthInsurance: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="health">Private Health Insurance (+£300)</Label>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="breakdown" className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-800">Total Estimated Cost</h3>
              </div>
              <div className="text-3xl font-bold text-blue-600">
                £{costs.total.toLocaleString()}
              </div>
              <p className="text-sm text-blue-700 mt-1">
                All costs are in GBP (£) and are estimates based on current UKVI fees
              </p>
            </div>

            {breakdown.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{category.category}</h4>
                  <Badge variant="outline">£{category.total.toLocaleString()}</Badge>
                </div>
                <div className="space-y-2 pl-4">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <span>{item.name}</span>
                        {item.required && <Badge variant="secondary" className="text-xs">Required</Badge>}
                      </div>
                      <span className="font-medium">£{item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                {index < breakdown.length - 1 && <Separator />}
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Cost Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Visa Fees</span>
            <span className="font-medium">£{costs.visaFees.toLocaleString()}</span>
          </div>
          {costs.healthSurcharge > 0 && (
            <div className="flex justify-between">
              <span>Immigration Health Surcharge</span>
              <span className="font-medium">£{costs.healthSurcharge.toLocaleString()}</span>
            </div>
          )}
          {costs.priorityServices > 0 && (
            <div className="flex justify-between">
              <span>Priority Services</span>
              <span className="font-medium">£{costs.priorityServices.toLocaleString()}</span>
            </div>
          )}
          {costs.additionalCosts > 0 && (
            <div className="flex justify-between">
              <span>Additional Services</span>
              <span className="font-medium">£{costs.additionalCosts.toLocaleString()}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>Total Cost</span>
            <span className="text-blue-600">£{costs.total.toLocaleString()}</span>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-start space-x-2">
            <Info className="h-4 w-4 text-gray-500 mt-0.5" />
            <div className="text-sm text-gray-600">
              <p className="mb-2">
                <strong>Important Notes:</strong>
              </p>
              <ul className="space-y-1">
                <li>• Fees are subject to change by UKVI</li>
                <li>• Additional costs may apply for complex cases</li>
                <li>• Exchange rates may affect final costs</li>
                <li>• Some fees are non-refundable</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
