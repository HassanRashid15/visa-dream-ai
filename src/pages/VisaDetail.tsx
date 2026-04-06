import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Clock, DollarSign, FileText, CheckCircle, AlertTriangle,
  ExternalLink, ChevronDown, ChevronUp, HelpCircle, Shield, Banknote, ListChecks,
  Footprints, BookOpen, Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { UK_VISA_DETAILS, type VisaDetailData } from "@/lib/ukVisaDetails";
import { GradientText } from "@/components/ui/animated-bits";

function SectionHeading({ icon, label, title }: { icon: React.ReactNode; label: string; title: string }) {
  return (
    <div className="mb-6">
      <span className="text-xs font-semibold text-accent uppercase tracking-wider flex items-center gap-1.5">{icon} {label}</span>
      <h2 className="text-xl md:text-2xl font-display font-bold mt-1">{title}</h2>
    </div>
  );
}

function CollapsibleFAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors">
        <span className="text-sm font-medium pr-4">{q}</span>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <p className="text-sm text-muted-foreground px-4 pb-4 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function VisaDetailPage() {
  const { country, visaType } = useParams<{ country: string; visaType: string }>();
  const navigate = useNavigate();

  // Currently only UK is supported
  if (country !== "uk" || !visaType) {
    navigate("/");
    return null;
  }

  const visa: VisaDetailData | undefined = UK_VISA_DETAILS[visaType];
  if (!visa) {
    navigate(`/country/${country}`);
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
        <div className="container max-w-4xl mx-auto relative z-10">
          <button onClick={() => navigate(`/country/${country}`)} className="flex items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground mb-6 transition-colors text-sm">
            <ArrowLeft className="h-4 w-4" /> Back to United Kingdom
          </button>
          <div className="flex items-start gap-4 mb-4">
            <span className="text-5xl">{visa.icon}</span>
            <div>
              <h1 className="text-2xl md:text-4xl font-display font-bold text-primary-foreground leading-tight">
                {visa.name}
              </h1>
              <p className="text-primary-foreground/50 text-xs mt-1">{visa.officialName}</p>
            </div>
          </div>
          <p className="text-primary-foreground/70 text-sm leading-relaxed max-w-3xl">{visa.summary}</p>
          <div className="flex flex-wrap gap-3 mt-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-foreground/10 text-primary-foreground/80 text-xs backdrop-blur-sm">
              <Clock className="h-3 w-3" /> {visa.processingTime}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-foreground/10 text-primary-foreground/80 text-xs backdrop-blur-sm">
              <Shield className="h-3 w-3" /> {visa.validityPeriod}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="container max-w-4xl mx-auto px-4 py-10 space-y-14">

          {/* Overview */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <SectionHeading icon={<Info className="h-3.5 w-3.5" />} label="Overview" title="What You Need to Know" />
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

          {/* Eligibility */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <SectionHeading icon={<ListChecks className="h-3.5 w-3.5" />} label="Eligibility" title="Who Can Apply" />
            <div className="space-y-3">
              {visa.eligibility.map((crit, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-5 card-elevated">
                  <div className="flex items-start gap-3">
                    <CheckCircle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${crit.mandatory ? "text-primary" : "text-muted-foreground"}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold">{crit.label}</h4>
                        {crit.mandatory && <span className="text-[9px] uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded font-bold">Required</span>}
                        {!crit.mandatory && <span className="text-[9px] uppercase tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-medium">If applicable</span>}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-1.5">{crit.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Application Steps */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <SectionHeading icon={<Footprints className="h-3.5 w-3.5" />} label="Process" title="Step-by-Step Application Guide" />
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
              <div className="space-y-4">
                {visa.applicationSteps.map((step) => (
                  <div key={step.step} className="relative pl-12">
                    <div className="absolute left-2.5 top-3 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold z-10">
                      {step.step}
                    </div>
                    <div className="rounded-xl border border-border bg-card p-5 card-elevated">
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="text-sm font-semibold">{step.title}</h4>
                        {step.duration && (
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {step.duration}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Fees */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <SectionHeading icon={<Banknote className="h-3.5 w-3.5" />} label="Costs" title="Fees & Charges" />
            <div className="rounded-2xl border border-border bg-card card-elevated overflow-hidden">
              <div className="divide-y divide-border">
                {visa.fees.map((fee, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3.5">
                    <div>
                      <p className="text-sm font-medium">{fee.item}</p>
                      {fee.note && <p className="text-[10px] text-muted-foreground mt-0.5">{fee.note}</p>}
                    </div>
                    <span className="text-sm font-semibold text-primary whitespace-nowrap">{fee.amount}</span>
                  </div>
                ))}
              </div>
              <div className="bg-primary/5 px-5 py-4 flex items-center justify-between border-t border-primary/20">
                <span className="font-display font-bold">Total Estimated Cost</span>
                <span className="font-display font-bold text-primary">{visa.totalEstimatedCost}</span>
              </div>
            </div>
          </motion.section>

          {/* Documents */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <SectionHeading icon={<FileText className="h-3.5 w-3.5" />} label="Documents" title="Required Documents Checklist" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {visa.documents.map((doc, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-4 card-elevated">
                  <div className="flex items-start gap-2.5">
                    <FileText className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold">{doc.name}</h4>
                      <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">{doc.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Important Notes */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <SectionHeading icon={<AlertTriangle className="h-3.5 w-3.5" />} label="Important" title="Things to Keep in Mind" />
            <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6 space-y-3">
              {visa.importantNotes.map((note, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <AlertTriangle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-sm leading-relaxed">{note}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* FAQs */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <SectionHeading icon={<HelpCircle className="h-3.5 w-3.5" />} label="FAQ" title="Frequently Asked Questions" />
            <div className="space-y-2">
              {visa.faqs.map((faq, i) => (
                <CollapsibleFAQ key={i} q={faq.q} a={faq.a} />
              ))}
            </div>
          </motion.section>

          {/* Official Link */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-xl border border-border bg-muted/30 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div>
              <p className="text-xs text-muted-foreground">Official UK Government Source</p>
              <a href={visa.officialLink} target="_blank" rel="noopener noreferrer"
                className="text-sm font-medium text-primary hover:underline flex items-center gap-1.5 mt-0.5">
                {visa.officialLink} <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
            <p className="text-[10px] text-muted-foreground max-w-xs">
              Always verify information directly with the UK government. VisaCheck provides guidance only — this is not legal advice.
            </p>
          </motion.div>

          {/* CTA */}
          <motion.section className="rounded-2xl hero-gradient p-8 md:p-12 text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-xl md:text-2xl font-display font-bold text-primary-foreground mb-3">
              Ready to Check Your Eligibility?
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

      <Footer />
    </div>
  );
}
