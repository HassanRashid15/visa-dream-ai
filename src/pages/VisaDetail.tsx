import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Clock, Users, FileText, CheckCircle, AlertCircle, 
  BookOpen, Globe, Heart, Shield, Plane, Briefcase, CreditCard,
  ChevronRight, Star, ArrowRight, Info, ListChecks, ExternalLink,
  Footprints, DollarSign, AlertTriangle, HelpCircle, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UK_VISA_DETAILS, type VisaDetailData } from "@/lib/ukVisaDetails";
import { COUNTRY_DETAILS } from "@/lib/countryData";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AISidebar from "@/components/AISidebar";
import ScoreResult from "@/components/ScoreResult";
import DocumentUpload from "@/components/DocumentUpload";
import { usePerformanceOptimization, useViewport } from "@/hooks/usePerformanceOptimization";
import { MobileContainer, MobileGrid, MobileCard, MobileButton, MobileText, MobileNav } from "@/components/ui/mobile-optimized";
import { memoryCache } from "@/lib/performance";
import {
  AnimatedCounter, GradientText, PulseDot, TiltCard,
  StaggerContainer, StaggerItem, SparkleBorder
} from "@/components/ui/animated-bits";
import { useSEO } from "@/hooks/useSEO";

function SectionHeading({ icon, label, title }: { icon: React.ReactNode; label: string; title: string }) {
  return (
    <div className="mb-6">
      <span className="text-xs font-semibold text-accent uppercase tracking-wider flex items-center gap-1.5">{icon} {label}</span>
      <h2 className="text-xl md:text-2xl font-display font-bold mt-1">{title}</h2>
    </div>
  );
}

export default function VisaDetail() {
  const { country, visaType } = useParams<{ country: string; visaType: string }>();
  const navigate = useNavigate();
  const { isMobile, isTablet } = useViewport();
  const { optimizedApiCall } = usePerformanceOptimization();
  
  const [visa, setVisa] = useState<VisaDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAISidebar, setShowAISidebar] = useState(false);
  const [uploadedDocumentsCount, setUploadedDocumentsCount] = useState(0);

  // Set SEO metadata based on visa type
  useSEO({
    title: visa ? `Travel Requirements for ${country} | ${visa.name} Guide | TravelAI` : 'Travel Requirements Guide | TravelAI',
    description: visa 
      ? `Complete travel guide for ${country} including ${visa.name} requirements, travel documents, and entry information. Get AI-powered travel planning assistance.`
      : 'Comprehensive travel requirements and entry information for your destination. Get AI-powered travel guidance and document preparation assistance.',
    keywords: visa 
      ? `${country} travel requirements, ${visa.name} travel guide, ${country} entry requirements, travel documents ${country}, ${country} tourism guide`
      : 'travel requirements, entry requirements, travel documents, tourism guide, travel preparation, AI travel assistance'
  });

  // Cache key for visa details
  const cacheKey = `visa-${country}-${visaType}`;

  // Optimized data fetching with caching
  const fetchVisaData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await optimizedApiCall(
        cacheKey,
        async () => {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 100));
          
          const countryData = COUNTRY_DETAILS[country || ""];
          if (!countryData) {
            throw new Error("Country not found");
          }

          const visaData = UK_VISA_DETAILS[visaType || ""];
          if (!visaData) {
            throw new Error("Visa type not found");
          }

          return visaData;
        },
        1000 * 60 * 60 // 1 hour cache
      );

      setVisa(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load visa information");
    } finally {
      setLoading(false);
    }
  }, [country, visaType, optimizedApiCall, cacheKey]);

  // Memoized universities data
  const universities = useMemo(() => {
    if (!country || !COUNTRY_DETAILS[country]) return [];
    return COUNTRY_DETAILS[country].universities || [];
  }, [country]);

  useEffect(() => {
    fetchVisaData();
  }, [fetchVisaData]);

  if (!country || !visaType) {
    navigate("/");
    return null;
  }

  if (!visa) {
    navigate(`/country/${country}`);
    return null;
  }

  const uploadVisaType = visa.id === "pr" ? "ilr" : visa.id;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <div className="hero-gradient pt-28 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <motion.div key={i} className="absolute rounded-full bg-primary-foreground/5"
              style={{ width: 120 + i * 80, height: 120 + i * 80, right: -30 + i * 40, top: -30 + i * 50 }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>
        <div className="relative z-10 container max-w-4xl mx-auto">
          <button onClick={() => navigate(`/country/${country}`)} className="flex items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground mb-6 transition-colors text-sm">
            <ArrowLeft className="h-4 w-4" /> Back to {country === "uk" ? "United Kingdom" : country}
          </button>
          <div className="flex items-center gap-4 mb-3">
            <span className="text-5xl">{visa.icon}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground">
                {visa.name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-foreground/10 text-primary-foreground/80 text-xs backdrop-blur-sm">
                  <Clock className="h-3 w-3" /> {visa.processingTime}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-foreground/10 text-primary-foreground/80 text-xs backdrop-blur-sm">
                  <Shield className="h-3 w-3" /> {visa.validityPeriod}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="flex">
        <div className="flex-1">
          <div className="container max-w-4xl mx-auto px-4 py-10 space-y-14">

            {/* Comprehensive Overview */}
            {visa.comprehensiveOverview && (
              <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <SectionHeading icon={<Info className="h-3.5 w-3.5" />} label="About This Visa" title={`Understanding the ${visa.name}`} />
                <div className="p-6 rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20">
                  <p className="text-sm leading-relaxed text-primary-foreground/90">{visa.comprehensiveOverview}</p>
                </div>
              </motion.section>
            )}

            {/* Practice Features - TEMPORARILY HIDDEN */}
            {/* {visa.practiceFeatures && visa.practiceFeatures.length > 0 && (
              <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <SectionHeading icon={<ListChecks className="h-3.5 w-3.5" />} label="Practice Tools" title="Prepare Your Application" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {visa.practiceFeatures.map((feature, i) => (
                    <div key={i} className="p-4 rounded-xl bg-muted/40 border border-border hover:bg-muted/60 hover:border-primary/50 transition-all duration-200 group">
                      <div className="flex flex-col h-full">
                        <h4 className="font-semibold text-sm mb-2 group-hover:text-primary transition-colors">
                          {feature.title}
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1">
                          {feature.description}
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                          onClick={() => navigate(feature.link)}
                        >
                          {feature.action}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )} */}

            {/* Key Points */}
            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <SectionHeading icon={<Info className="h-3.5 w-3.5" />} label="Key Points" title="What You Need to Know" />
              <div className="space-y-3">
                {visa.overview.map((p, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-muted/40 border border-border">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">{i + 1}</span>
                    </div>
                    <p className="text-sm leading-relaxed">{p}</p>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Top Universities (Study Visa) */}
            {visa.id === "study" && universities.length > 0 && (
              <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <SectionHeading icon={<BookOpen className="h-3.5 w-3.5" />} label="Education" title="Top Universities" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {universities.map((uni) => (
                    <div key={uni.name} className="rounded-xl border border-border bg-muted/40 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-sm">{uni.name}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{uni.location} • {uni.ranking}</p>
                        </div>
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full whitespace-nowrap">
                          {uni.tuitionRange}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {uni.popularCourses.slice(0, 3).map((course) => (
                          <span key={course} className="text-[11px] px-2 py-1 rounded-full bg-background border border-border text-muted-foreground">
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Eligibility */}
            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <SectionHeading icon={<CheckCircle className="h-3.5 w-3.5" />} label="Eligibility" title="Who Can Apply" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visa.eligibility.map((req, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-muted/40 border border-border">
                    <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-sm font-medium">{req.label}</span>
                      <p className="text-xs text-muted-foreground mt-1">{req.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Application Steps */}
            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <SectionHeading icon={<Footprints className="h-3.5 w-3.5" />} label="Process" title="Application Steps" />
              <div className="space-y-4">
                {visa.applicationSteps.map((step, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl bg-muted/40 border border-border">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">{i + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{step.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Fees */}
            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <SectionHeading icon={<DollarSign className="h-3.5 w-3.5" />} label="Costs" title="Fees & Expenses" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visa.fees.map((fee, i) => (
                  <div key={i} className="p-4 rounded-xl bg-muted/40 border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{fee.item}</span>
                      <span className="text-lg font-bold text-primary">{fee.amount}</span>
                    </div>
                    {fee.note && <p className="text-xs text-muted-foreground">{fee.note}</p>}
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Documents */}
            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <SectionHeading icon={<FileText className="h-3.5 w-3.5" />} label="Documents" title="Required Paperwork" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {visa.documents.map((doc, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 border border-border">
                    <FileText className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-xs font-medium">{doc.name}</span>
                      <p className="text-xs text-muted-foreground mt-1">{doc.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              {country === "uk" && (uploadVisaType === "study" || uploadVisaType === "work" || uploadVisaType === "ilr" || uploadVisaType === "tourist") && (
                <div className="mt-6 rounded-xl border border-border bg-card p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-semibold">Document Upload (UK)</p>
                    <span className="text-xs text-muted-foreground">{uploadedDocumentsCount} uploaded</span>
                  </div>
                  <DocumentUpload
                    visaType={uploadVisaType}
                    onDocumentsChange={(documents) => setUploadedDocumentsCount(documents.length)}
                  />
                </div>
              )}
            </motion.section>

            {/* Important Notes */}
            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <SectionHeading icon={<AlertTriangle className="h-3.5 w-3.5" />} label="Important" title="Key Points to Remember" />
              <div className="space-y-3">
                {visa.importantNotes.map((note, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-accent/10 border border-accent/20">
                    <AlertTriangle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                    <p className="text-sm leading-relaxed">{typeof note === 'string' ? note : note}</p>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Official Resources */}
            {visa.officialResources && visa.officialResources.length > 0 && (
              <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <SectionHeading icon={<ExternalLink className="h-3.5 w-3.5" />} label="Resources" title="Official UK Government Links" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {visa.officialResources.map((resource, i) => (
                    <a
                      key={i}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 rounded-xl bg-muted/40 border border-border hover:bg-muted/60 hover:border-primary/50 transition-all duration-200 group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                            {resource.title}
                          </h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {resource.description}
                          </p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
                      </div>
                    </a>
                  ))}
                </div>
              </motion.section>
            )}

            {/* FAQ */}
            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <SectionHeading icon={<HelpCircle className="h-3.5 w-3.5" />} label="FAQ" title="Frequently Asked Questions" />
              <div className="space-y-4">
                {visa.faqs.map((faq, i) => (
                  <div key={i} className="border border-border rounded-xl overflow-hidden">
                    <button className="w-full p-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors">
                      <span className="font-medium text-sm">{faq.q}</span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* CTA */}
            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center py-12">
              <h2 className="text-2xl font-display font-bold mb-4">
                Ready to <GradientText>Check Your Eligibility</GradientText>?
              </h2>
              <p className="text-primary-foreground/70 mb-6 text-sm max-w-xl mx-auto">
                Our AI assessment evaluates your profile against {visa.name} requirements in under 60 seconds.
              </p>
              <Button variant="hero" size="xl" onClick={() => navigate(`/pre-check/uk?visa=${visa.id}`)}>
                Check Eligibility for {visa.name} <ArrowRight className="h-5 w-5" />
              </Button>
            </motion.section>
          </div>
        </div>
        <AISidebar visa={visa} universities={universities} />
      </div>
      <Footer />
    </div>
  );
}
