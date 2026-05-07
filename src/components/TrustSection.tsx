import { motion } from "framer-motion";
import { Shield, Eye, Ban, AlertTriangle } from "lucide-react";

const items = [
  {
    icon: Shield,
    title: "Official GOV.UK Links",
    description: "All visa information is cross-checked with official UK government sources. We never provide outdated or misleading guidance.",
  },
  {
    icon: Eye,
    title: "Transparent Pricing",
    description: "No hidden fees. See exact visa costs, IHS fees, and living expenses upfront with our UK Cost Calculator.",
  },
  {
    icon: Ban,
    title: "Avoid Visa Rejection",
    description: "Common rejection reasons include incomplete documents, insufficient funds, and wrong visa category. We help you get it right the first time.",
  },
  {
    icon: AlertTriangle,
    title: "Real Cost Breakdown",
    description: "Budget for visa fees, NHS surcharge, biometrics, flights, tuition, and living costs. We give you the full financial picture.",
  },
];

export default function TrustSection() {
  return (
    <section id="trust" className="py-24 px-4">
      <div className="container max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-semibold text-accent uppercase tracking-wider">Trust & Transparency</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-2">Why Trust VisaDreams</h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Accurate, up-to-date, and honest UK immigration guidance powered by official sources and AI.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              className="flex gap-4 p-6 rounded-xl border border-border bg-card card-elevated"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex-shrink-0 h-11 w-11 rounded-lg bg-destructive/10 flex items-center justify-center">
                <item.icon className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
