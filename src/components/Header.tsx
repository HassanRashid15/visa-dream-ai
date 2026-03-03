import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${isHome ? "bg-transparent" : "bg-card/80 backdrop-blur-md border-b border-border"}`}>
      <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-lg bg-accent flex items-center justify-center shadow-sm">
            <Globe className="h-5 w-5 text-accent-foreground" />
          </div>
          <span className={`font-display text-xl font-bold tracking-tight ${isHome ? "text-primary-foreground" : "text-foreground"}`}>
            VisaCheck
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="/#countries" className={`text-sm font-medium transition-colors ${isHome ? "text-primary-foreground/70 hover:text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            Countries
          </a>
          <a href="/#how-it-works" className={`text-sm font-medium transition-colors ${isHome ? "text-primary-foreground/70 hover:text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            How It Works
          </a>
          <a href="/#trust" className={`text-sm font-medium transition-colors ${isHome ? "text-primary-foreground/70 hover:text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            Trust & Safety
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen
            ? <X className={`h-5 w-5 ${isHome ? "text-primary-foreground" : "text-foreground"}`} />
            : <Menu className={`h-5 w-5 ${isHome ? "text-primary-foreground" : "text-foreground"}`} />
          }
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-card/95 backdrop-blur-md border-b border-border px-4 pb-4 pt-2 space-y-3"
        >
          <a href="/#countries" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-foreground py-2">Countries</a>
          <a href="/#how-it-works" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-foreground py-2">How It Works</a>
          <a href="/#trust" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-foreground py-2">Trust & Safety</a>
        </motion.div>
      )}
    </header>
  );
}
