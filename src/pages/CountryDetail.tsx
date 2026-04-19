import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Clock, DollarSign, FileText, GraduationCap, MapPin, Globe, Star, CheckCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { COUNTRY_DETAILS, type VisaTypeInfo } from "@/lib/countryData";
import { useState } from "react";

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
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
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
  const detail = country ? COUNTRY_DETAILS[country] : null;

  if (!detail) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Hero */}
      <div className="hero-gradient pt-28 pb-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-primary-foreground/5"
              style={{ width: 100 + i * 80, height: 100 + i * 80, right: -20 + i * 30, top: -20 + i * 40 }}
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>
        <div className="container max-w-5xl mx-auto relative z-10">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground mb-6 transition-colors text-sm">
            <ArrowLeft className="h-4 w-4" /> Back to Countries
          </button>
          <div className="flex items-start gap-5 mb-6">
            <span className="text-7xl">{detail.flag}</span>
            <div>
              <h1 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground leading-tight">
                {detail.name}
              </h1>
              <p className="text-primary-foreground/70 text-lg mt-2 max-w-2xl">{detail.tagline}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-foreground/10 text-primary-foreground/80 text-sm backdrop-blur-sm">
              <Globe className="h-3.5 w-3.5" /> {detail.language}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-foreground/10 text-primary-foreground/80 text-sm backdrop-blur-sm">
              <DollarSign className="h-3.5 w-3.5" /> {detail.currency}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-foreground/10 text-primary-foreground/80 text-sm backdrop-blur-sm">
              <MapPin className="h-3.5 w-3.5" /> {detail.capital}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="container max-w-5xl mx-auto px-4 py-12 space-y-16">
          {/* Dynamic Country Snapshot */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
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

          {/* Visa Types */}
          <section>
            <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="text-sm font-semibold text-accent uppercase tracking-wider">Visa Options</span>
              <h2 className="text-2xl md:text-3xl font-display font-bold mt-1">Choose Your Visa Type</h2>
              <p className="text-muted-foreground mt-2 max-w-2xl">Select the visa that matches your goals. Each includes requirements, costs, and a full document checklist.</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {detail.visaTypes.map((visa, i) => (
                <VisaCard key={visa.id} visa={visa} index={i} countryId={detail.id} />
              ))}
            </div>
          </section>

          {/* About & Highlights */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-muted-foreground leading-relaxed max-w-3xl mb-8">{detail.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {detail.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border">
                  <Star className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm leading-relaxed">{h}</span>
                </div>
              ))}
            </div>
          </motion.section>

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
              Ready to Start Your Journey to {detail.name}?
            </h2>
            <p className="text-primary-foreground/70 mb-6 max-w-xl mx-auto">
              Check your eligibility now or explore visa options above. Our AI-powered assessment takes less than 60 seconds.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="xl" onClick={() => navigate(`/pre-check/${detail.id}`)}>
                Check My Eligibility <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </motion.section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
