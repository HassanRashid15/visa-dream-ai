import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import CountrySelector from "@/components/CountrySelector";
import HowItWorks from "@/components/HowItWorks";
import TrustSection from "@/components/TrustSection";
import VisaTypesPreview from "@/components/VisaTypesPreview";
import Testimonials from "@/components/Testimonials";
import FAQSection from "@/components/FAQSection";
import NewsletterSignup from "@/components/NewsletterSignup";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const Index = () => {
  useSEO({
    title: 'VisaDreams — UK Visa & Immigration Experts | AI-Powered Guidance',
    description: 'Navigate UK visa applications with AI-powered guidance. Get eligibility checks, document checklists, IELTS prep, cost calculators, and expert consultations for Student, Work, ILR, and Tourist visas.',
    keywords: 'UK visa, UK immigration, student visa UK, work visa UK, ILR UK, tourist visa UK, visa eligibility, UK visa calculator, IELTS prep UK, visa consultation'
  });

  return (
    <div className="min-h-screen bg-background relative">
      <Header />
      <HeroSection />
      <CountrySelector />
      <VisaTypesPreview />
      <HowItWorks />
      <TrustSection />
      <Testimonials />
      <FAQSection />
      <NewsletterSignup />

      {/* CTA Section */}
      <section className="py-24 px-4 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-primary-foreground/20"
              style={{
                width: 200 + i * 150,
                height: 200 + i * 150,
                left: `${50 - (100 + i * 75) / 10}%`,
                top: `${50 - (100 + i * 75) / 10}%`,
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20 + i * 10, repeat: Infinity, ease: "linear" }}
            />
          ))}
        </div>
        <div className="container max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">
              Ready to Start Your UK Visa Journey?
            </h2>
            <p className="text-primary-foreground/70 mb-8 max-w-xl mx-auto">
              It takes less than 60 seconds. No sign-up required. Get honest, AI-powered eligibility results.
            </p>
            <Button variant="hero" size="xl" asChild>
              <a href="#countries">
                Check Eligibility Now <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
