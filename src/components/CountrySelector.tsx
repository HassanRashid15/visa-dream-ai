import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { COUNTRY_INFO, type Country } from "@/lib/eligibility";

const CountryCard = ({ id, country }: { id: Country; country: typeof COUNTRY_INFO.canada }) => {
  const navigate = useNavigate();
  return (
    <motion.button
      onClick={() => navigate(`/check/${id}`)}
      className="card-elevated flex flex-col items-center gap-4 rounded-xl bg-card p-8 text-card-foreground cursor-pointer border border-border"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="text-6xl">{country.flag}</span>
      <h3 className="text-xl font-semibold font-display">{country.name}</h3>
      <p className="text-sm text-muted-foreground text-center">{country.description}</p>
    </motion.button>
  );
};

export default function CountrySelector() {
  return (
    <section className="py-20 px-4">
      <div className="container max-w-4xl mx-auto text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-display font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Choose Your Destination
        </motion.h2>
        <p className="text-muted-foreground mb-12 max-w-xl mx-auto">
          Select the country you're interested in and get an instant eligibility assessment.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {(Object.entries(COUNTRY_INFO) as [Country, typeof COUNTRY_INFO.canada][]).map(
            ([id, info], i) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <CountryCard id={id} country={info} />
              </motion.div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
