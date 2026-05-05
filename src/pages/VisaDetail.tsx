import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Clock, DollarSign, FileText, CheckCircle, AlertTriangle,
  ExternalLink, ChevronDown, ChevronUp, HelpCircle, Shield, Banknote, ListChecks,
  Footprints, BookOpen, Info, Image as ImageIcon, Video, X, ChevronLeft, ChevronRight,
  Download, Share2, Copy, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AISidebar from "@/components/AISidebar";
import { UK_VISA_DETAILS, type VisaDetailData } from "@/lib/ukVisaDetails";
import { COUNTRY_DETAILS } from "@/lib/countryData";
import { GradientText } from "@/components/ui/animated-bits";
import { toast } from "sonner";
import jsPDF from "jspdf";

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
  const [searchParams, setSearchParams] = useSearchParams();

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

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const gallery = visa.gallery ?? [];
  const lightboxRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const showPrev = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i - 1 + gallery.length) % gallery.length)),
    [gallery.length],
  );
  const showNext = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i + 1) % gallery.length)),
    [gallery.length],
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    // Save the previously focused element so we can restore later
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") showPrev();
      else if (e.key === "ArrowRight") showNext();
      else if (e.key === "Tab") {
        // Focus trap inside the lightbox
        const root = lightboxRef.current;
        if (!root) return;
        const focusables = root.querySelectorAll<HTMLElement>(
          'button, [href], input, [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Move focus into the dialog
    requestAnimationFrame(() => {
      const root = lightboxRef.current;
      const target = root?.querySelector<HTMLElement>('[data-autofocus="true"]') ??
        root?.querySelector<HTMLElement>('button');
      target?.focus();
    });
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      previouslyFocusedRef.current?.focus?.();
    };
  }, [lightboxIndex, closeLightbox, showPrev, showNext]);

  // Document checklist state — persisted per visa, also shareable via ?c=
  const storageKey = `visa-checklist:${visa.id}`;
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Priority: URL param > localStorage
    const cParam = searchParams.get("c");
    if (cParam) {
      try {
        const decoded = atob(cParam);
        // bitmask string of "0"/"1" per doc index
        const next: Record<number, boolean> = {};
        for (let i = 0; i < decoded.length; i++) next[i] = decoded[i] === "1";
        setChecked(next);
        return;
      } catch { /* fall through */ }
    }
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setChecked(JSON.parse(raw));
    } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(checked)); } catch { /* ignore */ }
  }, [checked, storageKey]);

  const requiredDocs = useMemo(
    () => visa.documents.filter((d) => (d.status ?? "required") === "required"),
    [visa.documents],
  );
  const requiredDoneCount = visa.documents.reduce(
    (acc, d, i) => acc + (((d.status ?? "required") === "required") && checked[i] ? 1 : 0),
    0,
  );
  const progressPct = requiredDocs.length === 0 ? 0 : Math.round((requiredDoneCount / requiredDocs.length) * 100);

  // Build shareable URL encoding the current checklist
  const shareUrl = useMemo(() => {
    const bits = visa.documents.map((_, i) => (checked[i] ? "1" : "0")).join("");
    const encoded = btoa(bits);
    const url = new URL(window.location.href);
    url.searchParams.set("c", encoded);
    return url.toString();
  }, [checked, visa.documents]);

  const handleCopyShare = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Share link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy. Long-press the link to copy manually.");
    }
  };

  const handleNativeShare = async () => {
    const data = {
      title: `${visa.name} — Document Checklist Progress`,
      text: `My ${visa.name} checklist progress: ${requiredDoneCount}/${requiredDocs.length} required documents ready (${progressPct}%).`,
      url: shareUrl,
    };
    if (navigator.share) {
      try { await navigator.share(data); } catch { /* user cancelled */ }
    } else {
      handleCopyShare();
    }
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 48;
    let y = margin;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(`${visa.name} — Document Checklist`, margin, y);
    y += 22;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(110);
    doc.text(`Generated ${new Date().toLocaleDateString()}  •  Required progress: ${requiredDoneCount}/${requiredDocs.length} (${progressPct}%)`, margin, y);
    y += 24;
    doc.setTextColor(0);

    const groups: Array<{ title: string; key: "required" | "optional" | "depends" }> = [
      { title: "Required", key: "required" },
      { title: "Depends on Circumstances", key: "depends" },
      { title: "Optional", key: "optional" },
    ];

    groups.forEach((group) => {
      const items = visa.documents
        .map((d, i) => ({ d, i }))
        .filter(({ d }) => (d.status ?? "required") === group.key);
      if (items.length === 0) return;

      if (y > 760) { doc.addPage(); y = margin; }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text(group.title, margin, y);
      y += 16;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);

      items.forEach(({ d, i }) => {
        const box = checked[i] ? "[x]" : "[ ]";
        const nameLines = doc.splitTextToSize(`${box} ${d.name}`, pageWidth - margin * 2);
        if (y + nameLines.length * 14 > 800) { doc.addPage(); y = margin; }
        doc.text(nameLines, margin, y);
        y += nameLines.length * 14;
        if (d.detail) {
          doc.setTextColor(110);
          doc.setFontSize(9);
          const detailLines = doc.splitTextToSize(d.detail, pageWidth - margin * 2 - 14);
          if (y + detailLines.length * 12 > 800) { doc.addPage(); y = margin; }
          doc.text(detailLines, margin + 14, y);
          y += detailLines.length * 12 + 4;
          doc.setTextColor(0);
          doc.setFontSize(11);
        }
      });
      y += 8;
    });

    doc.save(`${visa.id}-uk-visa-checklist.pdf`);
    toast.success("Checklist PDF downloaded");
  };

  // Swipe handling for lightbox
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => setTouchStartX(e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (dx > 50) showPrev();
    else if (dx < -50) showNext();
    setTouchStartX(null);
  };

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
                    <motion.button
                      key={i}
                      type="button"
                      onClick={() => setLightboxIndex(i)}
                      className="relative overflow-hidden rounded-xl group aspect-[4/3] border border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.2 }}
                      aria-label={`Open image: ${img.caption}`}
                    >
                      <img
                        src={img.url}
                        alt={img.caption}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                        <p className="text-white text-xs font-medium text-left">{img.caption}</p>
                      </div>
                    </motion.button>
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

            {/* Documents — Interactive Checklist */}
            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <SectionHeading icon={<FileText className="h-3.5 w-3.5" />} label="Documents" title="Interactive Document Checklist" />

              {/* Progress + legend */}
              <div className="mb-4 p-4 rounded-xl bg-muted/40 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    Required documents ready: <span className="text-foreground font-semibold">{requiredDoneCount}/{requiredDocs.length}</span>
                  </span>
                  <span className="text-xs font-semibold text-primary">{progressPct}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-background overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-3 text-[11px]">
                  <StatusBadge status="required" />
                  <StatusBadge status="optional" />
                  <StatusBadge status="depends" />
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Button type="button" size="sm" variant="default" onClick={handleDownloadPdf}>
                    <Download className="h-4 w-4" /> Download PDF
                  </Button>
                  <Button type="button" size="sm" variant="outline" onClick={handleNativeShare}>
                    <Share2 className="h-4 w-4" /> Share progress
                  </Button>
                  <Button type="button" size="sm" variant="ghost" onClick={() => setShareOpen((v) => !v)}>
                    {shareOpen ? "Hide link" : "Show link"}
                  </Button>
                </div>
                {shareOpen && (
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      readOnly
                      value={shareUrl}
                      onFocus={(e) => e.currentTarget.select()}
                      className="flex-1 text-xs px-3 py-2 rounded-md border border-border bg-background font-mono truncate"
                      aria-label="Shareable checklist link"
                    />
                    <Button type="button" size="sm" variant="outline" onClick={handleCopyShare}>
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copied ? "Copied" : "Copy"}
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {visa.documents.map((doc, i) => {
                  const status = doc.status ?? "required";
                  const isChecked = !!checked[i];
                  return (
                    <label
                      key={i}
                      htmlFor={`doc-${visa.id}-${i}`}
                      className={`flex items-start gap-3 p-3 rounded-xl bg-muted/40 border transition-colors cursor-pointer ${
                        isChecked ? "border-primary/60 bg-primary/5" : "border-border hover:bg-muted/60"
                      }`}
                    >
                      <Checkbox
                        id={`doc-${visa.id}-${i}`}
                        checked={isChecked}
                        onCheckedChange={(v) =>
                          setChecked((prev) => ({ ...prev, [i]: v === true }))
                        }
                        className="mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className={`text-xs font-medium ${isChecked ? "line-through text-muted-foreground" : ""}`}>
                            {doc.name}
                          </span>
                          <StatusBadge status={status} />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{doc.detail}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
              {Object.values(checked).some(Boolean) && (
                <button
                  type="button"
                  onClick={() => setChecked({})}
                  className="mt-3 text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
                >
                  Reset checklist
                </button>
              )}
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

      {/* Image Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && gallery[lightboxIndex] && (
          <motion.div
            ref={lightboxRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Image ${lightboxIndex + 1} of ${gallery.length}: ${gallery[lightboxIndex].caption}`}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <button
              type="button"
              data-autofocus="true"
              onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
              className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {gallery.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); showPrev(); }}
                  className="absolute left-2 md:left-6 h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); showNext(); }}
                  className="absolute right-2 md:right-6 h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.18 }}
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={gallery[lightboxIndex].url}
                alt={gallery[lightboxIndex].caption}
                className="w-full max-h-[80vh] object-contain rounded-lg"
              />
              <div className="mt-3 flex items-center justify-between gap-4 text-white/90">
                <p className="text-sm">{gallery[lightboxIndex].caption}</p>
                <span className="text-xs text-white/60">{lightboxIndex + 1} / {gallery.length}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatusBadge({ status }: { status: "required" | "optional" | "depends" }) {
  const map = {
    required: { label: "Required", cls: "bg-destructive/10 text-destructive border-destructive/30" },
    optional: { label: "Optional", cls: "bg-muted text-muted-foreground border-border" },
    depends: { label: "Depends", cls: "bg-accent/10 text-accent border-accent/30" },
  } as const;
  const { label, cls } = map[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-semibold uppercase tracking-wide ${cls}`}>
      {label}
    </span>
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
