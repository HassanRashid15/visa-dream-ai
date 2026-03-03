import { motion } from "framer-motion";
import { Shield, Eye, Ban, AlertTriangle } from "lucide-react";

const items = [
  {
    icon: Shield,
    title: "No Guarantees",
    description: "No agent or tool can guarantee visa approval. Anyone who says otherwise is misleading you.",
  },
  {
    icon: Eye,
    title: "Full Transparency",
    description: "Our scoring criteria are based on publicly available immigration guidelines. No black box.",
  },
  {
    icon: Ban,
    title: "Spot the Red Flags",
    description: "Beware of agents demanding large upfront fees, promising guaranteed outcomes, or rushing your decision.",
  },
  {
    icon: AlertTriangle,
    title: "Realistic Cost Ranges",
    description: "Visa fees vary by country. Always budget for application fees, medical exams, and biometrics separately.",
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
          <span className="text-sm font-semibold text-accent uppercase tracking-wider">Stay Safe</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-2">Trust & Fraud Awareness</h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            We believe in transparency. Here's what you need to know to protect yourself.
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
