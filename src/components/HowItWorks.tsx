import { motion } from "framer-motion";
import { ClipboardCheck, BarChart3, Lightbulb } from "lucide-react";

const steps = [
  {
    icon: ClipboardCheck,
    step: "01",
    title: "Check Eligibility",
    description: "Answer a few questions and get an instant AI-powered assessment for your visa category.",
  },
  {
    icon: BarChart3,
    step: "02",
    title: "Review Your Pathway",
    description: "See your personalized visa roadmap with required documents, costs, and processing timelines.",
  },
  {
    icon: Lightbulb,
    step: "03",
    title: "Apply with Confidence",
    description: "Use our templates, IELTS prep, and expert consultations to submit a winning application.",
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
          <span className="text-sm font-semibold text-accent uppercase tracking-wider">Simple Process</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-2">How Visa Dreams Works</h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Three simple steps to navigate your visa journey with AI-powered immigration guidance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
