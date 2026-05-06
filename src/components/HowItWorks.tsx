import { motion } from "framer-motion";
import { ClipboardCheck, BarChart3, Lightbulb } from "lucide-react";

// Phase 1: Informative Travel Planning
const steps = [
  {
    icon: ClipboardCheck,
    step: "01",
    title: "Discover Destinations",
    description: "Explore amazing countries, attractions, and experiences tailored to your interests.",
  },
  {
    icon: BarChart3,
    step: "02",
    title: "Plan Your Journey",
    description: "Get AI-powered travel recommendations, itineraries, and destination insights.",
  },
  {
    icon: Lightbulb,
    step: "03",
    title: "Travel Guidance",
    description: "Receive expert travel tips, safety information, and local insights for your perfect trip.",
  },
];

// Phase 2: Preparation & Practice (Coming Soon)
// const phase2Steps = [
//   {
//     icon: Lightbulb,
//     step: "03",
//     title: "Prepare & Practice",
//     description: "Access travel classes, language practice, and expert guidance for your perfect trip.",
//   },
// ];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 bg-muted/30">
      <div className="container max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-semibold text-accent uppercase tracking-wider">Phase 1</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-2">Informative Travel Planning</h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Phase 1: Three simple steps to discover and plan your perfect journey with AI-powered travel guidance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              className="relative rounded-2xl border border-border bg-card p-8 card-elevated text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground shadow-sm">
                Step {item.step}
              </div>
              <div className="mx-auto mb-5 h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <item.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
