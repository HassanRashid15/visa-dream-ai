import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya S.",
    visa: "Student Visa",
    location: "India → UK",
    quote: "VisaDreams helped me understand exactly which documents I needed for my CAS and financial proof. I got my student visa in 3 weeks!",
    rating: 5,
  },
  {
    name: "Ahmed K.",
    visa: "Skilled Worker Visa",
    location: "Pakistan → UK",
    quote: "The points calculator was a game-changer. I knew my salary threshold and COS requirements before my employer even asked.",
    rating: 5,
  },
  {
    name: "Maria G.",
    visa: "ILR Application",
    location: "Brazil → UK",
    quote: "After 5 years on a work visa, I used the ILR checklist here. It caught missing documents I would've overlooked. Approved first time!",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 px-4">
      <div className="container max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-semibold text-accent uppercase tracking-wider">Success Stories</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-2">Trusted by UK Visa Applicants</h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Real stories from people who navigated their UK visa journey with VisaDreams.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className="rounded-2xl border border-border bg-card p-8 card-elevated relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Quote className="h-8 w-8 text-accent/30 absolute top-6 right-6" />
              <div className="flex items-center gap-1 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                "{t.quote}"
              </p>
              <div className="border-t border-border pt-4">
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.visa} — {t.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
