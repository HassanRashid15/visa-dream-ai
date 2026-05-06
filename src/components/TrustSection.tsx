import { motion } from "framer-motion";
import { Shield, Eye, Ban, AlertTriangle } from "lucide-react";

const items = [
  {
    icon: Shield,
    title: "Travel Safety First",
    description: "Your safety is our priority. We provide verified travel information and safety guidelines for every destination.",
  },
  {
    icon: Eye,
    title: "Transparent Pricing",
    description: "No hidden fees or surprise charges. All travel planning costs and services are clearly displayed upfront.",
  },
  {
    icon: Ban,
    title: "Avoid Travel Scams",
    description: "Watch out for too-good-to-be-true deals, fake travel agencies, and unrealistic promises about destinations.",
  },
  {
    icon: AlertTriangle,
    title: "Real Travel Costs",
    description: "Budget realistically for flights, accommodation, food, and activities. We help you plan within your means.",
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
          <span className="text-sm font-semibold text-accent uppercase tracking-wider">Travel Smart</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-2">Travel Safety & Tips</h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Travel confidently with our expert guidance. Here's what you need to know for safe journeys.
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
