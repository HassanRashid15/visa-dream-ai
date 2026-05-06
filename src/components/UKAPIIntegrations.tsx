import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Globe, RefreshCw, AlertCircle, CheckCircle, Clock, Database, Shield, TrendingUp, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MobileContainer, MobileGrid, MobileCard, MobileButton, MobileText } from "@/components/ui/mobile-optimized";

interface APIEndpoint {
  id: string;
  name: string;
  description: string;
  category: "govuk" | "ukvi" | "sponsor" | "qualification" | "health" | "finance";
  status: "active" | "inactive" | "error" | "maintenance";
  lastUpdate: string;
  updateFrequency: string;
  dataPoints: string[];
  dependencies: string[];
  reliability: number;
  responseTime: number;
}

interface APIResponse {
  endpoint: string;
  data: any;
  timestamp: string;
  status: "success" | "error" | "pending";
  processingTime: number;
}

interface IntegrationStatus {
  totalEndpoints: number;
  activeEndpoints: number;
  lastSync: string;
  dataFreshness: number;
  errorRate: number;
  uptime: number;
}

const UK_API_ENDPOINTS: APIEndpoint[] = [
  {
    id: "govuk-visa-fees",
    name: "GOV.UK Visa Fees API",
    description: "Current visa fees and immigration health surcharge rates",
    category: "govuk",
    status: "active",
    lastUpdate: "2024-03-20T10:30:00Z",
    updateFrequency: "Daily",
    dataPoints: ["Student visa fees", "Work visa fees", "ILR fees", "IHS rates", "Priority service fees"],
    dependencies: ["GOV.UK API Gateway"],
    reliability: 99.8,
    responseTime: 120
  },
  {
    id: "ukvi-processing-times",
    name: "UKVI Processing Times",
    description: "Real-time visa application processing times",
    category: "ukvi",
    status: "active",
    lastUpdate: "2024-03-20T09:15:00Z",
    updateFrequency: "Hourly",
    dataPoints: ["Student visa processing", "Work visa processing", "ILR processing", "Visitor visa processing"],
    dependencies: ["UKVI Systems"],
    reliability: 99.5,
    responseTime: 200
  },
  {
    id: "sponsor-register",
    name: "Sponsor Licence Register",
    description: "Licensed UK sponsors and their status",
    category: "sponsor",
    status: "active",
    lastUpdate: "2024-03-19T16:45:00Z",
    updateFrequency: "Weekly",
    dataPoints: ["Active sponsors", "Suspended licences", "Sponsor ratings", "Sponsor locations"],
    dependencies: ["Home Office Sponsor Register"],
    reliability: 99.9,
    responseTime: 150
  },
  {
    id: "soc-codes",
    name: "SOC Occupation Codes",
    description: "Standard Occupational Classification codes and going rates",
    category: "qualification",
    status: "active",
    lastUpdate: "2024-03-15T14:20:00Z",
    updateFrequency: "Monthly",
    dataPoints: ["SOC codes", "Going rates", "Job descriptions", "Skill levels"],
    dependencies: ["ONS Data"],
    reliability: 100,
    responseTime: 80
  },
  {
    id: "nhs-ihs",
    name: "NHS Immigration Health Surcharge",
    description: "IHS rates and healthcare coverage information",
    category: "health",
    status: "active",
    lastUpdate: "2024-03-18T11:00:00Z",
    updateFrequency: "Monthly",
    dataPoints: ["IHS rates", "Coverage details", "Exemptions", "Payment methods"],
    dependencies: ["NHS Digital"],
    reliability: 99.7,
    responseTime: 100
  },
  {
    id: "bank-england-rates",
    name: "Bank of England Exchange Rates",
    description: "Currency exchange rates for financial calculations",
    category: "finance",
    status: "active",
    lastUpdate: "2024-03-20T12:00:00Z",
    updateFrequency: "Daily",
    dataPoints: ["GBP rates", "Major currencies", "Historical data", "Forecasts"],
    dependencies: ["Bank of England API"],
    reliability: 99.9,
    responseTime: 90
  },
  {
    id: "ukvi-policy-updates",
    name: "UKVI Policy Updates",
    description: "Latest immigration policy changes and announcements",
    category: "ukvi",
    status: "maintenance",
    lastUpdate: "2024-03-19T08:30:00Z",
    updateFrequency: "Real-time",
    dataPoints: ["Policy changes", "New requirements", "Fee updates", "Process changes"],
    dependencies: ["GOV.UK Updates"],
    reliability: 98.5,
    responseTime: 250
  },
  {
    id: "english-test-providers",
    name: "English Test Providers",
    description: "Approved English language test providers and centers",
    category: "qualification",
    status: "active",
    lastUpdate: "2024-03-17T13:45:00Z",
    updateFrequency: "Weekly",
    dataPoints: ["Test centers", "Available dates", "Test fees", "Provider ratings"],
    dependencies: ["UKVI Approved Providers"],
    reliability: 99.6,
    responseTime: 110
  }
];

export default function UKAPIIntegrations() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [integrationStatus, setIntegrationStatus] = useState<IntegrationStatus | null>(null);
  const [apiResponses, setApiResponses] = useState<APIResponse[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("endpoints");

  useEffect(() => {
    calculateIntegrationStatus();
  }, []);

  const calculateIntegrationStatus = () => {
    const totalEndpoints = UK_API_ENDPOINTS.length;
    const activeEndpoints = UK_API_ENDPOINTS.filter(ep => ep.status === "active").length;
    const lastSync = new Date().toISOString();
    const dataFreshness = 95; // Simulated freshness percentage
    const errorRate = 0.5; // Simulated error rate
    const uptime = 99.7; // Simulated uptime

    setIntegrationStatus({
      totalEndpoints,
      activeEndpoints,
      lastSync,
      dataFreshness,
      errorRate,
      uptime
    });
  };

  const refreshAllEndpoints = async () => {
    setIsRefreshing(true);
    
    // Simulate API refresh
    setTimeout(() => {
      const responses: APIResponse[] = UK_API_ENDPOINTS.map(endpoint => ({
        endpoint: endpoint.id,
        data: { status: "updated", timestamp: new Date().toISOString() },
        timestamp: new Date().toISOString(),
        status: Math.random() > 0.1 ? "success" : "error",
        processingTime: Math.floor(Math.random() * 300) + 50
      }));

      setApiResponses(responses);
      calculateIntegrationStatus();
      setIsRefreshing(false);
    }, 2000);
  };

  const testEndpoint = async (endpointId: string) => {
    const endpoint = UK_API_ENDPOINTS.find(ep => ep.id === endpointId);
    if (!endpoint) return;

    // Simulate API test
    setTimeout(() => {
      const response: APIResponse = {
        endpoint: endpointId,
        data: { test: "success", endpoint: endpoint.name },
        timestamp: new Date().toISOString(),
        status: "success",
        processingTime: endpoint.responseTime
      };

      setApiResponses(prev => [
        ...prev.filter(r => r.endpoint !== endpointId),
        response
      ]);
    }, 1000);
  };

  const filteredEndpoints = selectedCategory === "all" 
    ? UK_API_ENDPOINTS 
    : UK_API_ENDPOINTS.filter(ep => ep.category === selectedCategory);

  const getStatusColor = (status: APIEndpoint["status"]) => {
    switch (status) {
      case "active": return "text-green-600 bg-green-50 border-green-200";
      case "inactive": return "text-gray-600 bg-gray-50 border-gray-200";
      case "error": return "text-red-600 bg-red-50 border-red-200";
      case "maintenance": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getCategoryColor = (category: APIEndpoint["category"]) => {
    switch (category) {
      case "govuk": return "text-blue-600 bg-blue-50 border-blue-200";
      case "ukvi": return "text-purple-600 bg-purple-50 border-purple-200";
      case "sponsor": return "text-green-600 bg-green-50 border-green-200";
      case "qualification": return "text-orange-600 bg-orange-50 border-orange-200";
      case "health": return "text-red-600 bg-red-50 border-red-200";
      case "finance": return "text-indigo-600 bg-indigo-50 border-indigo-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Globe className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">UK API Integrations</h2>
        </div>

        {integrationStatus && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-800">Active Endpoints</span>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-900">
                {integrationStatus.activeEndpoints}/{integrationStatus.totalEndpoints}
              </div>
              <div className="text-xs text-green-600 mt-1">
                {Math.round((integrationStatus.activeEndpoints / integrationStatus.totalEndpoints) * 100)}% operational
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-800">System Uptime</span>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-900">
                {integrationStatus.uptime}%
              </div>
              <div className="text-xs text-blue-600 mt-1">
                Last 30 days
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-800">Data Freshness</span>
                <Database className="h-4 w-4 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-900">
                {integrationStatus.dataFreshness}%
              </div>
              <div className="text-xs text-purple-600 mt-1">
                Last sync: {new Date(integrationStatus.lastSync).toLocaleTimeString()}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg"
            >
              <option value="all">All Categories</option>
              <option value="govuk">GOV.UK</option>
              <option value="ukvi">UKVI</option>
              <option value="sponsor">Sponsor</option>
              <option value="qualification">Qualification</option>
              <option value="health">Health</option>
              <option value="finance">Finance</option>
            </select>
          </div>

          <Button
            onClick={refreshAllEndpoints}
            disabled={isRefreshing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isRefreshing ? (
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Refreshing...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-4 w-4" />
                <span>Refresh All</span>
              </div>
            )}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="responses">Responses</TabsTrigger>
          </TabsList>

          <TabsContent value="endpoints" className="space-y-4">
            <div className="space-y-4">
              {filteredEndpoints.map((endpoint, index) => (
                <motion.div
                  key={endpoint.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-white rounded-lg border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{endpoint.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{endpoint.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={getStatusColor(endpoint.status)}>
                        {endpoint.status}
                      </Badge>
                      <Badge variant="outline" className={getCategoryColor(endpoint.category)}>
                        {endpoint.category}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <span className="text-xs font-medium text-gray-500">Reliability</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <Progress value={endpoint.reliability} className="flex-1 h-2" />
                        <span className="text-sm font-medium">{endpoint.reliability}%</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500">Response Time</span>
                      <div className="text-sm font-medium mt-1">{endpoint.responseTime}ms</div>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500">Update Frequency</span>
                      <div className="text-sm font-medium mt-1">{endpoint.updateFrequency}</div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <span className="text-xs font-medium text-gray-500">Data Points</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {endpoint.dataPoints.slice(0, 3).map((point, pointIndex) => (
                        <Badge key={pointIndex} variant="secondary" className="text-xs">
                          {point}
                        </Badge>
                      ))}
                      {endpoint.dataPoints.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{endpoint.dataPoints.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      Last updated: {new Date(endpoint.lastUpdate).toLocaleString()}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => testEndpoint(endpoint.id)}
                    >
                      Test Endpoint
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-4">
            {integrationStatus && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-4">System Health</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Active Endpoints</span>
                        <span className="text-sm font-medium">
                          {integrationStatus.activeEndpoints}/{integrationStatus.totalEndpoints}
                        </span>
                      </div>
                      <Progress 
                        value={(integrationStatus.activeEndpoints / integrationStatus.totalEndpoints) * 100} 
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">System Uptime</span>
                        <span className="text-sm font-medium">{integrationStatus.uptime}%</span>
                      </div>
                      <Progress value={integrationStatus.uptime} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Data Freshness</span>
                        <span className="text-sm font-medium">{integrationStatus.dataFreshness}%</span>
                      </div>
                      <Progress value={integrationStatus.dataFreshness} className="h-2" />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-4">Performance Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-blue-800">Average Response Time</span>
                      <div className="text-2xl font-bold text-blue-900 mt-1">
                        {Math.round(UK_API_ENDPOINTS.reduce((acc, ep) => acc + ep.responseTime, 0) / UK_API_ENDPOINTS.length)}ms
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-blue-800">Error Rate</span>
                      <div className="text-2xl font-bold text-blue-900 mt-1">
                        {integrationStatus.errorRate}%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-4">Dependencies</h3>
                  <div className="space-y-2">
                    {Array.from(new Set(UK_API_ENDPOINTS.flatMap(ep => ep.dependencies))).map((dep, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Database className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm text-yellow-800">{dep}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="responses" className="space-y-4">
            {apiResponses.length > 0 ? (
              <div className="space-y-4">
                {apiResponses.map((response, index) => (
                  <motion.div
                    key={`${response.endpoint}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-white rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{response.endpoint}</h4>
                        <p className="text-sm text-gray-600">
                          {new Date(response.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={
                          response.status === "success" ? "text-green-600" :
                          response.status === "error" ? "text-red-600" : "text-yellow-600"
                        }>
                          {response.status}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {response.processingTime}ms
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <pre className="text-xs text-gray-600 overflow-x-auto">
                        {JSON.stringify(response.data, null, 2)}
                      </pre>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No API responses yet. Test an endpoint to see results.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
