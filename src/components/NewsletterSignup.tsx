import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowRight, Bell } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("Thanks for subscribing! We'll keep you updated on UK visa news.");
    setEmail("");
  };

  return (
    <section className="py-24 px-4">
      <div className="container max-w-4xl mx-auto">
        <motion.div
          className="rounded-2xl border border-border bg-card p-8 md:p-12 card-elevated text-center relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Bell className="h-24 w-24 text-accent" />
          </div>

          <div className="relative z-10">
            <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-5">
              <Mail className="h-6 w-6 text-accent" />
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">
              Stay Ahead of Visa Changes
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">
              Get timely updates on immigration policy changes, fee updates, and new visa routes delivered to your inbox.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 flex-1"
              />
              <Button type="submit" className="h-11 gap-2">
                Subscribe <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-4">
              No spam. Unsubscribe anytime. We respect your privacy.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
