import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, GraduationCap, ArrowRight, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { COUNTRY_INFO, type Country } from "@/lib/eligibility";
import { useAuth } from "@/lib/authContext";
import { useEffect } from "react";
import { GradientText } from "@/components/ui/animated-bits";

export default function PreEligibilityPage() {
  const { country } = useParams<{ country: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const visaType = searchParams.get("visa") || "study";
  const countryId = country as Country;
  const countryInfo = COUNTRY_INFO[countryId];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/auth?redirect=/pre-check/${country}?visa=${visaType}`);
    }
  }, [isAuthenticated, navigate, country, visaType]);

  if (!countryInfo || !isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="hero-gradient pt-28 pb-20 px-4">
        <div className="container max-w-2xl mx-auto">
          <button onClick={() => navigate(`/country/${countryId}`)} className="flex items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground mb-6 transition-colors text-sm">
            <ArrowLeft className="h-4 w-4" /> Back to {countryInfo.name}
          </button>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground">
            Before You <GradientText from="hsl(38, 92%, 55%)" to="hsl(38, 92%, 75%)">Check Eligibility</GradientText>
          </h1>
          <p className="text-primary-foreground/60 text-sm mt-2">Would you like to prepare for IELTS first?</p>
        </div>
      </div>

      <div className="flex-1">
        <motion.div
          className="container max-w-2xl mx-auto px-4 -mt-8 pb-16 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* IELTS Prep Option */}
          <div className="rounded-2xl border border-border bg-card p-8 card-elevated space-y-6">
            <div className="text-center">
              <span className="text-6xl mb-4 block">📝</span>
              <h2 className="text-2xl font-display font-bold mb-2">IELTS Test Preparation</h2>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Most visa applications require an IELTS score. Our comprehensive modules cover Reading, Listening, Writing, and Speaking — with a mock test to assess your readiness.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: "📖", label: "Reading" },
                { icon: "🎧", label: "Listening" },
                { icon: "✍️", label: "Writing" },
                { icon: "🗣️", label: "Speaking" },
              ].map((mod) => (
                <div key={mod.label} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/50 border border-border">
                  <span className="text-3xl">{mod.icon}</span>
                  <span className="text-xs font-medium">{mod.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="hero"
                size="xl"
                className="flex-1 gap-2"
                onClick={() => navigate(`/ielts-prep?country=${countryId}&visa=${visaType}`)}
              >
                <GraduationCap className="h-5 w-5" />
                Yes, Prepare for IELTS
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="xl"
                className="flex-1 gap-2"
                onClick={() => navigate(`/check/${countryId}?visa=${visaType}`)}
              >
                <SkipForward className="h-5 w-5" />
                No, Check Eligibility Directly
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
