import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe, Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/authContext";
import { toast } from "@/hooks/use-toast";
import { useSEO } from "@/hooks/useSEO";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const redirect = redirectParam && redirectParam.startsWith("/") ? redirectParam : "/";

  // Phase 2 Feature: User Authentication
// Set SEO metadata for authentication page
  useSEO({
    title: mode === "login" ? "Sign In to VisaDreams | Access Your UK Visa Dashboard" : "Sign Up for VisaDreams | Start Your UK Visa Journey",
    description: mode === "login" 
      ? "Sign in to your VisaDreams account to track your UK visa applications, access document checklists, and manage your immigration journey."
      : "Create your free VisaDreams account to get UK visa eligibility checks, document guidance, and expert immigration assistance.",
    keywords: mode === "login"
      ? "VisaDreams login, sign in UK visa account, access visa application tracker, UK immigration login"
      : "VisaDreams signup, create UK visa account, free visa eligibility check, UK immigration platform registration"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await signup(form.name, form.email, form.password);
      }
      toast({ title: mode === "login" ? "Welcome back!" : "Account created!", description: "You're now signed in." });
      navigate(redirect);
    } catch {
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 hero-gradient relative items-center justify-center p-12">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-primary-foreground/10"
              style={{ width: 100 + i * 80, height: 100 + i * 80, left: `${10 + i * 8}%`, top: `${5 + i * 12}%` }}
              animate={{ scale: [1, 1.05, 1], opacity: [0.15, 0.3, 0.15] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>
        <div className="relative z-10 text-primary-foreground max-w-md">
          <div className="h-14 w-14 rounded-xl bg-accent flex items-center justify-center mb-8 shadow-lg">
            <Globe className="h-8 w-8 text-accent-foreground" />
          </div>
          <h1 className="text-4xl font-display font-bold mb-4">Your Immigration Journey Starts Here</h1>
          <p className="text-primary-foreground/70 text-lg leading-relaxed">
            Get personalized eligibility checks, IELTS preparation, and expert consultation — all in one platform.
          </p>
          <div className="mt-8 space-y-3">
            {["Free eligibility assessment", "IELTS prep & mock tests", "Expert advisor booking"].map((f) => (
              <div key={f} className="flex items-center gap-3 text-primary-foreground/80">
                <div className="h-2 w-2 rounded-full bg-accent" />
                <span className="text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="lg:hidden flex items-center gap-2.5 mb-4">
            <div className="h-9 w-9 rounded-lg bg-accent flex items-center justify-center">
              <Globe className="h-5 w-5 text-accent-foreground" />
            </div>
            <span className="font-display text-xl font-bold">VisaCheck</span>
          </div>

          <div>
            <h2 className="text-2xl font-display font-bold">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {mode === "login" ? "Sign in to continue your journey" : "Start your immigration journey today"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                  <User className="h-4 w-4 text-muted-foreground" /> Full Name
                </Label>
                <Input id="name" placeholder="John Doe" required className="h-12"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                <Mail className="h-4 w-4 text-muted-foreground" /> Email
              </Label>
              <Input id="email" type="email" placeholder="you@example.com" required className="h-12"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
                <Lock className="h-4 w-4 text-muted-foreground" /> Password
              </Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" required className="h-12 pr-12"
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="hero" size="xl" className="w-full gap-2" disabled={loading}>
              {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-primary font-semibold hover:underline">
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
