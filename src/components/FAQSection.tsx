import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How long does a UK visa application take?",
    answer: "Processing times vary by visa type. Standard Visitor visas typically take 3 weeks, Student visas 3 weeks, and Skilled Worker visas 3-8 weeks from outside the UK. Priority and super-priority services are available for faster decisions.",
  },
  {
    question: "What is the Immigration Health Surcharge (IHS)?",
    answer: "The IHS is a fee you pay as part of your visa application to access the UK's National Health Service (NHS). For most visas, it costs £776 per year for students and £1,035 per year for work visas. You pay the full amount upfront for the visa duration.",
  },
  {
    question: "How much money do I need to show for a UK Student Visa?",
    answer: "You must show you have enough money to pay for your course (1 year or the full course if less than 1 year) plus living costs. Living costs are £1,136 per month for courses in London (up to 9 months) or £913 per month outside London.",
  },
  {
    question: "Can I work in the UK on a Student Visa?",
    answer: "Yes, most Student Visa holders can work up to 20 hours per week during term time and full-time during holidays. However, you cannot be self-employed, engage in business activity, or fill a permanent full-time vacancy.",
  },
  {
    question: "What English test do I need for a UK visa?",
    answer: "Most UK visa categories require a SELT (Secure English Language Test) from an approved provider like IELTS for UKVI, Pearson PTE Academic UKVI, or LanguageCert. The required level varies: B1 for Skilled Worker, B2 for Student, and B1 for some ILR routes.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 px-4 bg-muted/30">
      <div className="container max-w-3xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-semibold text-accent uppercase tracking-wider">Got Questions?</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-2">UK Visa FAQs</h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Quick answers to the most common UK visa and immigration questions.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              className="rounded-xl border border-border bg-card overflow-hidden"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="flex items-center gap-3 font-semibold text-sm pr-4">
                  <HelpCircle className="h-4 w-4 text-accent flex-shrink-0" />
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform ${openIndex === i ? "rotate-180" : ""}`}
                />
              </button>
              {openIndex === i && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="px-5 pb-5"
                >
                  <p className="text-sm text-muted-foreground leading-relaxed pl-7">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
