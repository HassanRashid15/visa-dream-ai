import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Clock, DollarSign, FileText, GraduationCap, MapPin, Globe, Star, CheckCircle, ChevronDown,
  Users, Crown, Briefcase, Landmark, TrendingUp, Building2, HeartPulse, Code, Plane, BookOpen, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { COUNTRY_DETAILS, type VisaTypeInfo, type CountryDetail } from "@/lib/countryData";
import { useState, useEffect } from "react";
import { useSEO } from "@/hooks/useSEO";
import { fetchAICountryDetail } from "@/lib/aiCountryService";

interface SectionTab {
  id: string;
  label: string;
  icon: any;
}

function VisaCard({ visa, index, countryId }: { visa: VisaTypeInfo; index: number; countryId: string }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div
      className="rounded-2xl border border-border bg-card card-elevated overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="p-6 md:p-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{visa.icon}</span>
            <div>
              <h3 className="text-lg font-display font-bold">{visa.name}</h3>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {visa.processingTime}</span>
                <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> {visa.cost}</span>
              </div>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{visa.description}</p>
        
        <div className="space-y-3 mb-5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Key Requirements</h4>
          <ul className="space-y-2">
            {visa.requirements.slice(0, expanded ? undefined : 3).map((req, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
          {visa.requirements.length > 3 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-primary font-medium flex items-center gap-1 hover:underline"
            >
              {expanded ? "Show less" : `+${visa.requirements.length - 3} more requirements`}
              <ChevronDown className={`h-3 w-3 transition-transform ${expanded ? "rotate-180" : ""}`} />
            </button>
          )}
        </div>

        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-3 mb-5 pt-3 border-t border-border"
          >
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Required Documents</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {visa.documents.map((doc, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
                  <FileText className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                  <span>{doc}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <Button
          onClick={() => navigate(`/country/${countryId}/visa/${visa.id}`)}
          className="w-full gap-2"
          variant="default"
        >
          Check Eligibility for {visa.name} <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}

export default function CountryDetail() {
  const { country } = useParams<{ country: string }>();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<CountryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const loadCountryDetail = async () => {
      if (!country) return;

      try {
        setLoading(true);
        // Try to fetch from AI first
        const aiDetail = await fetchAICountryDetail(country);
        
        if (aiDetail) {
          setDetail(aiDetail);
        } else {
          // Fallback to hardcoded data
          const hardcodedDetail = COUNTRY_DETAILS[country];
          if (hardcodedDetail) {
            setDetail(hardcodedDetail);
          } else {
            setError("Country not found");
            setTimeout(() => navigate("/"), 2000);
          }
        }
      } catch (err) {
        console.error("Error loading country detail:", err);
        // Fallback to hardcoded data on error
        const hardcodedDetail = COUNTRY_DETAILS[country];
        if (hardcodedDetail) {
          setDetail(hardcodedDetail);
        } else {
          setError("Failed to load country data");
          setTimeout(() => navigate("/"), 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    loadCountryDetail();
  }, [country, navigate]);

  // Generate section tabs based on country
  const sectionTabs: SectionTab[] = detail ? [
    ...(detail.id === "uk" ? [{ id: "stats", label: "Why UK?", icon: Users }] : []),
    { id: "gallery", label: "Life & Study", icon: Plane },
    ...(detail.id === "uk" && detail.universities?.length ? [{ id: "universities", label: "Universities", icon: GraduationCap }] : []),
    ...(detail.id === "uk" ? [{ id: "pathway", label: "Your Pathway", icon: BookOpen }] : []),
    { id: "visas", label: "Visa Types", icon: FileText },
    { id: "highlights", label: "Why " + detail.name + "?", icon: Star },
    ...(detail.id === "uk" ? [{ id: "employers", label: "Employers", icon: Briefcase }] : []),
    { id: "costs", label: "Costs", icon: DollarSign },
  ] : [];

  // Scroll spy to highlight active section
  useEffect(() => {
    if (!detail || sectionTabs.length === 0) return;

    const handleScroll = () => {
      const sections = sectionTabs.map(tab => document.getElementById(tab.id)).filter(Boolean);
      
      for (const section of sections) {
        const rect = section?.getBoundingClientRect();
        if (rect && rect.top <= 150 && rect.bottom >= 150) {
          const tabId = section.id;
          if (activeSection !== tabId) {
            setActiveSection(tabId);
          }
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, [detail, sectionTabs, activeSection]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Set SEO metadata based on country
  useSEO({
    title: detail ? `${detail.name} UK Visa Guide | Immigration Insights | VisaDreams` : 'UK Visa Guide | VisaDreams',
    description: detail 
      ? `Comprehensive UK visa and immigration information for ${detail.name}. Get AI-powered insights, visa requirements, costs, timelines, and personalized application guidance.`
      : 'Explore UK visa options with AI-powered immigration guidance. Get visa requirements, costs, timelines, and personalized application assistance.',
    keywords: detail 
      ? `${detail.name} UK visa, ${detail.name} immigration, UK visa guide, ${detail.name} visa requirements, UK visa costs, AI immigration ${detail.name}`
      : 'UK visa guide, UK immigration, visa requirements UK, visa costs UK, AI visa assistance, immigration guidance'
  });

  // Debug: Log to check if heroImage is available
  if (detail) {
    console.log('Country detail:', detail.name, 'Hero image:', detail.heroImage);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-4 text-sm text-muted-foreground">Loading country details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-semibold text-muted-foreground">{error || "Country not found"}</p>
            <p className="text-sm text-muted-foreground mt-2">Redirecting to home...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Hero */}
      <div className="relative pt-28 pb-24 px-4 overflow-hidden">
        {/* Background Image with Fade Effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: detail.heroImage ? `url(${detail.heroImage})` : undefined,
            backgroundColor: detail.heroImage ? 'transparent' : 'hsl(var(--muted))'
          }}
        >
          {/* Fade Overlay - Top faded, bottom shadow */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80" />
        </div>
        
        {/* Animated Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/5"
              style={{ width: 100 + i * 80, height: 100 + i * 80, right: -20 + i * 30, top: -20 + i * 40 }}
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>
        <div className="container max-w-5xl mx-auto relative z-10">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors text-sm">
            <ArrowLeft className="h-4 w-4" /> Back to Countries
          </button>
          <div className="flex items-start gap-5 mb-6">
            <span className="text-7xl">{detail.flag}</span>
            <div>
              <h1 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight">
                {detail.name}
              </h1>
              <p className="text-white/90 text-lg mt-2 max-w-2xl">{detail.tagline}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white/90 text-sm backdrop-blur-sm border border-white/20">
              <Globe className="h-3.5 w-3.5" /> {detail.language}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white/90 text-sm backdrop-blur-sm border border-white/20">
              <DollarSign className="h-3.5 w-3.5" /> {detail.currency}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white/90 text-sm backdrop-blur-sm border border-white/20">
              <MapPin className="h-3.5 w-3.5" /> {detail.capital}
            </span>
            {detail.id === "uk" && (
              <>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white/90 text-sm backdrop-blur-sm border border-white/20">
                  <Users className="h-3.5 w-3.5" /> 600K+ yearly arrivals
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white/90 text-sm backdrop-blur-sm border border-white/20">
                  <Crown className="h-3.5 w-3.5" /> 4 Top-10 Universities
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1">
        {/* Sticky Navigation Tabs */}
        {detail && sectionTabs.length > 0 && (
          <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
            <div className="container max-w-5xl mx-auto px-4">
              <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
                {sectionTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => scrollToSection(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      activeSection === tab.id
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="container max-w-5xl mx-auto px-4 py-12 space-y-16">
          {/* Aspirational Stats — Why the UK */}
          {detail.id === "uk" && (
            <motion.section id="stats" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="mb-8">
                <span className="text-sm font-semibold text-accent uppercase tracking-wider">Why the UK?</span>
                <h2 className="text-2xl md:text-3xl font-display font-bold mt-1">The Numbers That Make the UK Irresistible</h2>
                <p className="text-muted-foreground mt-2 max-w-3xl">
                  Thousands of students and professionals choose the UK every year. Here is why it could be your perfect next chapter.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "International Students", value: "600,000+", sub: "welcomed yearly", icon: Users },
                  { label: "Top-Ranked Universities", value: "4", sub: "in the global top 10", icon: Crown },
                  { label: "Post-Study Work", value: "2 Years", sub: "via Graduate Route", icon: Briefcase },
                  { label: "Part-Time Earnings", value: "£15–25", sub: "per hour while studying", icon: DollarSign },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-border bg-card p-5 card-elevated text-center">
                    <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-3">
                      <item.icon className="h-5 w-5 text-accent" />
                    </div>
                    <p className="text-2xl font-display font-bold text-foreground">{item.value}</p>
                    <p className="text-xs font-semibold text-foreground mt-1">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Generic Country Snapshot for non-UK */}
          {detail.id !== "uk" && (
            <motion.section id="stats" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="mb-8">
                <span className="text-sm font-semibold text-accent uppercase tracking-wider">Country Snapshot</span>
                <h2 className="text-2xl md:text-3xl font-display font-bold mt-1">{detail.name} at a Glance</h2>
                <p className="text-muted-foreground mt-2 max-w-3xl">
                  Dynamic details based on your selected country to help you compare options faster before choosing a visa category.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Capital", value: detail.capital, icon: MapPin },
                  { label: "Language", value: detail.language, icon: Globe },
                  { label: "Currency", value: detail.currency, icon: DollarSign },
                  { label: "Visa Categories", value: `${detail.visaTypes.length} options`, icon: FileText },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-border bg-card p-4 card-elevated">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <item.icon className="h-4.5 w-4.5 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-semibold mt-1">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                <div className="rounded-xl border border-border bg-muted/40 p-4">
                  <p className="text-xs text-muted-foreground">Tuition (per year)</p>
                  <p className="text-sm font-semibold mt-1">{detail.costs.tuitionPerYear}</p>
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-4">
                  <p className="text-xs text-muted-foreground">Living Cost (per month)</p>
                  <p className="text-sm font-semibold mt-1">{detail.costs.livingCostPerMonth}</p>
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-4">
                  <p className="text-xs text-muted-foreground">Estimated First Year</p>
                  <p className="text-sm font-semibold mt-1 text-primary">{detail.costs.totalEstimatedFirst}</p>
                </div>
              </div>
            </motion.section>
          )}

          {/* Image Gallery */}
          <motion.section id="gallery" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="mb-8">
              <span className="text-sm font-semibold text-accent uppercase tracking-wider">Experience {detail.name}</span>
              <h2 className="text-2xl md:text-3xl font-display font-bold mt-1">Life & Study</h2>
              <p className="text-muted-foreground mt-2 max-w-2xl">
                {detail.id === "uk"
                  ? "From the historic quads of Oxford to the vibrant streets of London, the tech hubs of Manchester to the creative scene in Edinburgh — picture yourself here."
                  : "Get a glimpse of student life, campus experiences, and the beautiful landscapes that await you."}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {detail.galleryImages.map((image, i) => (
                <motion.div
                  key={i}
                  className="relative overflow-hidden rounded-xl card-elevated group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <img
                    src={image}
                    alt={`${detail.name} gallery ${i + 1}`}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Top Universities — UK only */}
          {detail.id === "uk" && detail.universities && detail.universities.length > 0 && (
            <motion.section id="universities" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="mb-8">
                <span className="text-sm font-semibold text-accent uppercase tracking-wider">World-Class Institutions</span>
                <h2 className="text-2xl md:text-3xl font-display font-bold mt-1">Top UK Universities</h2>
                <p className="text-muted-foreground mt-2 max-w-2xl">
                  These are the institutions shaping the next generation of global leaders. Your name could be on their admission list.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {detail.universities.map((uni, i) => (
                  <motion.div
                    key={uni.name}
                    className="rounded-xl border border-border bg-card p-5 card-elevated"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-display font-bold text-sm">{uni.name}</h3>
                      <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full">{uni.ranking}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                      <MapPin className="h-3 w-3" /> {uni.location}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">Tuition: {uni.tuitionRange}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {uni.popularCourses.map((course) => (
                        <span key={course} className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{course}</span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Your UK Visa Journey */}
          {detail.id === "uk" && (
            <motion.section id="pathway" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="mb-8">
                <span className="text-sm font-semibold text-accent uppercase tracking-wider">Your Pathway</span>
                <h2 className="text-2xl md:text-3xl font-display font-bold mt-1">From Application to Settlement</h2>
                <p className="text-muted-foreground mt-2 max-w-2xl">
                  The UK offers one of the clearest immigration pathways in the world. See how your journey could unfold step by step.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[
                  {
                    title: "Study Route",
                    icon: BookOpen,
                    color: "text-[#f6a823]",
                    steps: ["Get admission & CAS from a UK university", "Apply for Student Visa (3–6 weeks)", "Arrive, study, work part-time", "Graduate & switch to Graduate Route (2 years)", "Find a sponsored job & switch to Skilled Worker"],
                  },
                  {
                    title: "Work Route",
                    icon: Briefcase,
                    color: "text-[#f6a823]",
                    steps: ["Secure a job offer from a licensed sponsor", "Receive Certificate of Sponsorship (CoS)", "Apply for Skilled Worker Visa (3–8 weeks)", "Move to the UK & start your career", "After 5 years → apply for Indefinite Leave to Remain"],
                  },
                  {
                    title: "Settlement Route",
                    icon: Landmark,
                    color: "text-[#f6a823] ",
                    steps: ["Complete 5 years on a qualifying visa", "Pass the Life in the UK test", "Prove English at B1 level or higher", "Apply for ILR (Indefinite Leave to Remain)", "After 1 year of ILR → apply for British Citizenship"],
                  },
                ].map((path, i) => (
                  <motion.div
                    key={path.title}
                    className={`rounded-2xl border p-6 card-elevated ${path.color}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-lg bg-[#fef6e8] flex items-center justify-center">
                        <path.icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-display font-bold text-lg text-black">{path.title}</h3>
                    </div>
                    <ol className="space-y-3">
                      {path.steps.map((step, j) => (
                        <li key={j} className="flex items-start gap-2.5 text-sm">
                          <span className="flex-shrink-0 h-5 w-5 rounded-full bg-current/10 flex items-center justify-center text-[24px] font-bold mt-0.5">.</span>
                          <span className="text-foreground/90 ">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Visa Types */}
          <section id="visas">
            <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="text-sm font-semibold text-accent uppercase tracking-wider">Visa Options</span>
              <h2 className="text-2xl md:text-3xl font-display font-bold mt-1">Choose Your Visa Type</h2>
              <p className="text-muted-foreground mt-2 max-w-2xl">
                {detail.id === "uk"
                  ? "Every UK visa has a purpose — and a clear path forward. Pick the one that aligns with your dream and we will guide you through every document, deadline, and detail."
                  : "Select the visa that matches your goals. Each includes requirements, costs, and a full document checklist."}
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {detail.visaTypes.map((visa, i) => (
                <VisaCard key={visa.id} visa={visa} index={i} countryId={detail.id} />
              ))}
            </div>
          </section>

          {/* About & Highlights */}
          <motion.section id="highlights" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="mb-6">
              <span className="text-sm font-semibold text-accent uppercase tracking-wider">Why {detail.name}?</span>
              <h2 className="text-2xl md:text-3xl font-display font-bold mt-1">A Destination That Invests in You</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-3xl mb-8">{detail.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {detail.highlights.map((h, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border card-elevated"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Star className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm leading-relaxed">{h}</span>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Top UK Employers — UK only */}
          {detail.id === "uk" && (
            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="mb-8">
                <span className="text-sm font-semibold text-accent uppercase tracking-wider">Career Opportunities</span>
                <h2 className="text-2xl md:text-3xl font-display font-bold mt-1">Top UK Employers Hiring Internationally</h2>
                <p className="text-muted-foreground mt-2 max-w-2xl">
                  These companies actively sponsor Skilled Worker visas. Your next job — and your path to settlement — could start here.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { name: "NHS", sector: "Healthcare", icon: HeartPulse },
                  { name: "Deloitte", sector: "Consulting", icon: Briefcase },
                  { name: "Google UK", sector: "Technology", icon: Code },
                  { name: "Barclays", sector: "Finance", icon: Landmark },
                  { name: "BP", sector: "Energy", icon: TrendingUp },
                  { name: "Rolls-Royce", sector: "Engineering", icon: Building2 },
                ].map((emp, i) => (
                  <motion.div
                    key={emp.name}
                    className="rounded-xl border border-border bg-card p-4 card-elevated text-center"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      <emp.icon className="h-4.5 w-4.5 text-primary" />
                    </div>
                    <p className="text-xs font-semibold">{emp.name}</p>
                    <p className="text-[10px] text-muted-foreground">{emp.sector}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Cost Breakdown */}
          <section>
            <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="text-sm font-semibold text-accent uppercase tracking-wider">Budget Planning</span>
              <h2 className="text-2xl md:text-3xl font-display font-bold mt-1">Estimated Costs</h2>
            </motion.div>
            <motion.div
              className="rounded-2xl border border-border bg-card p-6 md:p-8 card-elevated"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { label: "Tuition (per year)", value: detail.costs.tuitionPerYear, icon: GraduationCap },
                  { label: "Living Costs (per month)", value: detail.costs.livingCostPerMonth, icon: MapPin },
                  { label: "Visa Application Fee", value: detail.costs.visaFee, icon: FileText },
                  { label: "Health Insurance", value: detail.costs.healthInsurance, icon: Star },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="font-semibold text-sm mt-0.5">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-lg">Total Estimated (1st Year)</span>
                  <span className="font-display font-bold text-xl text-primary">{detail.costs.totalEstimatedFirst}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  * Estimates vary based on institution, location, and lifestyle. Contact us for a personalized budget plan.
                </p>
              </div>
            </motion.div>
          </section>

          {/* CTA */}
          <motion.section
            className="rounded-2xl hero-gradient p-8 md:p-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-display font-bold text-primary-foreground mb-3">
              {detail.id === "uk" ? "Your UK Visa Is Closer Than You Think" : `Ready to Start Your Journey to ${detail.name}?`}
            </h2>
            <p className="text-primary-foreground/70 mb-6 max-w-xl mx-auto">
              {detail.id === "uk"
                ? "Thousands have made it. Check your eligibility, review your documents, and take the first real step toward your UK dream — in under 60 seconds."
                : "Check your eligibility now or explore visa options above. Our AI-powered assessment takes less than 60 seconds."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" className="!rounded-full h-14 px-8 flex items-center justify-center" onClick={() => navigate(`/pre-check/${detail.id}`)}>
                Check My Eligibility <ArrowRight className="h-5 w-5" />
              </Button>
              {detail.id === "uk" && (
                <Button variant="hero-outline" className="!rounded-full h-14 px-8 flex items-center justify-center" onClick={() => navigate(`/country/uk/visa/student`)}>
                  Explore Student Visa <ChevronRight className="h-5 w-5" />
                </Button>
              )}
            </div>
          </motion.section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
