import { motion } from "framer-motion";
import { ClipboardCheck, BarChart3, Lightbulb } from "lucide-react";

const steps = [
  {
    icon: ClipboardCheck,
    step: "01",
    title: "Fill Your Profile",
    description: "Enter your age, education, work experience, IELTS score, and available funds.",
  },
  {
    icon: BarChart3,
    step: "02",
    title: "Get Your Score",
    description: "Our algorithm calculates eligibility based on real immigration criteria.",
  },
  {
    icon: Lightbulb,
    step: "03",
    title: "Improve & Apply",
    description: "Get actionable tips to strengthen your profile before applying.",
  },
];

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
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-2">How It Works</h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Three simple steps to understand your immigration eligibility.
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
