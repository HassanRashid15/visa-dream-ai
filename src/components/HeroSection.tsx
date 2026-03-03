import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import { ArrowDown } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 hero-gradient opacity-80" />
      <div className="relative z-10 container max-w-3xl mx-auto text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-block mb-4 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-sm text-primary-foreground/80 backdrop-blur-sm">
            Free Eligibility Check
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-primary-foreground leading-tight mb-6">
            Check Your Visa Eligibility in 60 Seconds
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-xl mx-auto">
            Get a transparent, AI-powered assessment for Canada, UK, or Australia — no guesswork, no hidden fees.
          </p>
        </motion.div>
        <motion.a
          href="#countries"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 font-semibold text-accent-foreground shadow-lg transition-transform hover:scale-105"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Get Started
          <ArrowDown className="h-4 w-4" />
        </motion.a>
      </div>
    </section>
  );
}
