import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchAICountries, type AICountryInfo } from "@/lib/aiCountryService";

const countryColors: Record<string, string> = {
  uk: "from-blue-500/10 to-blue-500/5",
  canada: "from-red-500/10 to-red-500/5",
  australia: "from-green-500/10 to-green-500/5",
  usa: "from-blue-600/10 to-blue-600/5",
  germany: "from-yellow-500/10 to-yellow-500/5",
  default: "from-primary/10 to-primary/5",
};

export default function CountrySelector() {
  const navigate = useNavigate();
  const [countries, setCountries] = useState<AICountryInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const aiCountries = await fetchAICountries();
        setCountries(aiCountries);
      } catch (error) {
        console.error("Failed to load countries:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCountries();
  }, []);

  return (
    <section id="countries" className="py-24 px-4">
      <div className="container max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-semibold text-accent uppercase tracking-wider">Choose Your Country</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-2">Start Your Visa Journey</h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Select your destination country to explore visa types, check eligibility, and plan your application.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8 max-w-6xl mx-auto">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
              <p className="mt-4 text-sm text-muted-foreground">Loading countries...</p>
            </div>
          ) : (
            countries.map((country, i) => (
              <motion.button
                key={country.id}
                onClick={() => navigate(`/country/${country.id}`)}
                className={`group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b ${countryColors[country.id] || countryColors.default} p-8 text-left card-elevated cursor-pointer`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-7xl mb-6 block">{country.flag}</span>
                <h3 className="text-2xl font-display font-bold mb-2">{country.name}</h3>
                <p className="text-sm text-muted-foreground mb-6">{country.description}</p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                  Explore Visa Options <ArrowRight className="h-4 w-4" />
                </span>
              </motion.button>
            ))
          )}
        </div>

        {/* Phase 2: Eligibility check (Coming Soon)
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 max-w-md mx-auto">
          {Object.entries(COUNTRY_INFO).map(
            ([id, info], i) => (
              <motion.button
                key={id}
                onClick={() => navigate(`/check/${id}`)}
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
                  Check Eligibility <ArrowRight className="h-4 w-4" />
                </span>
              </motion.button>
            )
          )}
        </div>
        */}
      </div>
    </section>
  );
}
