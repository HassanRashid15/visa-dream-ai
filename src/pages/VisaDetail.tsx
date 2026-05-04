import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Clock, DollarSign, FileText, CheckCircle, AlertTriangle,
  ExternalLink, ChevronDown, ChevronUp, HelpCircle, Shield, Banknote, ListChecks,
  Footprints, BookOpen, Info, Image as ImageIcon, Video, X, ChevronLeft, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AISidebar from "@/components/AISidebar";
import { UK_VISA_DETAILS, type VisaDetailData } from "@/lib/ukVisaDetails";
import { COUNTRY_DETAILS } from "@/lib/countryData";
import { GradientText } from "@/components/ui/animated-bits";

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

  if (!country || !visaType) {
    navigate("/");
    return null;
  }

  const visa: VisaDetailData | undefined = UK_VISA_DETAILS[visaType];
  if (!visa) {
    navigate(`/country/${country}`);
    return null;
  }
  const universities = visa.id === "study" ? (COUNTRY_DETAILS[country]?.universities ?? []) : [];

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
                  <p className="text-sm leading-relaxed text-foreground/90">{visa.comprehensiveOverview}</p>
                </div>
              </motion.section>
            )}

            {/* Gallery */}
            {visa.gallery && visa.gallery.length > 0 && (
              <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <SectionHeading icon={<ImageIcon className="h-3.5 w-3.5" />} label="Gallery" title={`A Glimpse of ${visa.name}`} />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {visa.gallery.map((img, i) => (
                    <motion.div
                      key={i}
                      className="relative overflow-hidden rounded-xl group aspect-[4/3] border border-border"
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.2 }}
                    >
                      <img
                        src={img.url}
                        alt={img.caption}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                        <p className="text-white text-xs font-medium">{img.caption}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Videos */}
            {visa.videos && visa.videos.length > 0 && (
              <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <SectionHeading icon={<Video className="h-3.5 w-3.5" />} label="Watch & Learn" title="Video Guides" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {visa.videos.map((video, i) => (
                    <div key={i} className="rounded-xl overflow-hidden border border-border bg-card">
                      <div className="relative aspect-video bg-muted">
                        <iframe
                          src={`https://www.youtube.com/embed/${video.youtubeId}`}
                          title={video.title}
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute inset-0 w-full h-full"
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-sm mb-1">{video.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{video.description}</p>
                      </div>
                    </div>
                  ))}
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
            </motion.section>

            {/* Important Notes */}
            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <SectionHeading icon={<AlertTriangle className="h-3.5 w-3.5" />} label="Important" title="Key Points to Remember" />
              <div className="space-y-3">
                {visa.importantNotes.map((note, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-accent/10 border border-accent/20">
                    <AlertTriangle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                    <p className="text-sm leading-relaxed">{note}</p>
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
                  <FaqItem key={i} q={faq.q} a={faq.a} />
                ))}
              </div>
            </motion.section>

            {/* CTA */}
            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center py-12">
              <h2 className="text-2xl font-display font-bold mb-4">
                Ready to <GradientText>Check Your Eligibility</GradientText>?
              </h2>
              <p className="text-muted-foreground mb-6 text-sm max-w-xl mx-auto">
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

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full p-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
      >
        <span className="font-medium text-sm pr-4">{q}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 text-sm text-muted-foreground leading-relaxed border-t border-border">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
