import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { COUNTRY_INFO, type Country } from "@/lib/eligibility";
import { ArrowRight } from "lucide-react";

const countryImages: Record<Country, string> = {
  uk: "🇬🇧",
};

const countryColors: Record<Country, string> = {
  uk: "from-blue-500/10 to-blue-500/5",
};

export default function CountrySelector() {
  const navigate = useNavigate();

  return (
    <section id="countries" className="py-24 px-4">
      <div className="container max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-semibold text-accent uppercase tracking-wider">Destinations</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-2">Choose Your Destination</h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Select the country you're interested in and get an instant eligibility assessment.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 max-w-md mx-auto">
          {Object.entries(COUNTRY_INFO).map(
            ([id, info], i) => (
              <motion.button
                key={id}
                onClick={() => navigate(`/country/${id}`)}
                className={`group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b ${countryColors[id]} p-8 text-left card-elevated cursor-pointer`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-7xl mb-6 block">{countryImages[id]}</span>
                <h3 className="text-2xl font-display font-bold mb-2">{info.name}</h3>
                <p className="text-sm text-muted-foreground mb-6">{info.description}</p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                  Explore Options <ArrowRight className="h-4 w-4" />
                </span>
              </motion.button>
            )
          )}
        </div>
      </div>
    </section>
  );
}
