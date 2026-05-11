import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Briefcase, Home, Plane, ArrowRight } from "lucide-react";

const visaTypes = [
  {
    id: "student",
    title: "Student Visa",
    description: "Study at UK universities with CAS-backed visa guidance, financial requirement checks, and IELTS prep.",
    icon: GraduationCap,
    color: "bg-blue-500/10 text-blue-600",
    border: "border-blue-500/20",
  },
  {
    id: "work",
    title: "Skilled Worker Visa",
    description: "Navigate the points-based system, COS requirements, salary thresholds, and employer sponsorship.",
    icon: Briefcase,
    color: "bg-emerald-500/10 text-emerald-600",
    border: "border-emerald-500/20",
  },
  {
    id: "ilr",
    title: "ILR / Settlement",
    description: "Check your 5-year or 10-year route eligibility, Life in the UK requirements, and continuous residence rules.",
    icon: Home,
    color: "bg-violet-500/10 text-violet-600",
    border: "border-violet-500/20",
  },
  {
    id: "tourist",
    title: "Standard Visitor",
    description: "Tourist, business, and family visit visas with financial proof guidance and invitation letter templates.",
    icon: Plane,
    color: "bg-amber-500/10 text-amber-600",
    border: "border-amber-500/20",
  },
];

export default function VisaTypesPreview() {
  const navigate = useNavigate();

  return (
    <section id="visa-types" className="py-24 px-4 bg-muted/30">
      <div className="container max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-semibold text-accent uppercase tracking-wider">Visa Categories</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-2">Visa's We Cover</h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Comprehensive AI-powered guidance for the four most popular UK visa pathways.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {visaTypes.map((visa, i) => (
            <motion.button
              key={visa.id}
              onClick={() => navigate(`/country/uk/visa/${visa.id}`)}
              className={`group relative overflow-hidden rounded-2xl border ${visa.border} bg-card p-8 text-left card-elevated cursor-pointer`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`h-14 w-14 rounded-xl ${visa.color} flex items-center justify-center mb-5`}>
                <visa.icon className="h-7 w-7" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2">{visa.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {visa.description}
              </p>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                Explore Details <ArrowRight className="h-4 w-4" />
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
