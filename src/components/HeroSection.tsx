import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import { ArrowDown, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Phase 1: Informative Travel Planning Stats
const stats = [
  { value: "50+", label: "Destinations" },
  { value: "24/7", label: "AI Guidance" },
  { value: "100%", label: "Free Access" },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 hero-gradient opacity-85" />

      {/* Floating dots decoration */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-accent/20"
            style={{
              width: 6 + i * 4,
              height: 6 + i * 4,
              left: `${15 + i * 18}%`,
              top: `${20 + i * 12}%`,
            }}
            animate={{ y: [0, -20, 0], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className="relative z-10 container max-w-4xl mx-auto text-center px-4 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-2 mb-6 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-5 py-2 text-sm text-primary-foreground/80 backdrop-blur-sm">
            <CheckCircle className="h-3.5 w-3.5" />
            Free Travel Planning — No Sign Up Required
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-primary-foreground leading-[1.1] mb-6">
            Your Intelligent
            <br />
            <span className="text-accent">Travel Agent</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/75 mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover amazing destinations and plan perfect journeys with AI-powered guidance. Get expert travel insights and recommendations for your next adventure.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button variant="hero" size="xl" asChild>
            <a href="#countries">
              Explore Countries
              <ArrowDown className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="hero-outline" size="lg" asChild>
            <a href="#how-it-works">How It Works</a>
          </Button>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          className="grid grid-cols-3 gap-4 max-w-lg mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl md:text-3xl font-display font-bold text-primary-foreground">{s.value}</div>
              <div className="text-xs text-primary-foreground/50 mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
