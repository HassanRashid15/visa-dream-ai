import HeroSection from "@/components/HeroSection";
import CountrySelector from "@/components/CountrySelector";
import { Shield } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <div id="countries">
        <CountrySelector />
      </div>

      {/* Trust Banner */}
      <section className="py-16 px-4 border-t border-border">
        <div className="container max-w-3xl mx-auto text-center">
          <Shield className="h-8 w-8 mx-auto mb-4 text-accent" />
          <h2 className="text-2xl font-display font-bold mb-3">Transparent & Honest</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
            No one can guarantee a visa. Our tool provides an indicative assessment based on publicly available criteria. Always verify with official immigration sources.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Index;
