import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FileCheck, Menu, X, LogIn, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/authContext";

export default function Header() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${isHome ? "bg-transparent" : "bg-card/80 backdrop-blur-md border-b border-border"}`}>
      <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-lg bg-accent flex items-center justify-center shadow-sm">
            <FileCheck className="h-5 w-5 text-accent-foreground" />
          </div>
          <span className={`font-display text-xl font-bold tracking-tight ${isHome ? "text-primary-foreground" : "text-foreground"}`}>
            VisaDreams
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="/#countries" className={`text-sm font-medium transition-colors ${isHome ? "text-primary-foreground/70 hover:text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            Countries
          </a>
          <Link to="/tracker" className={`text-sm font-medium transition-colors ${isHome ? "text-primary-foreground/70 hover:text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            My Journey
          </Link>
          <Link to="/consultation" className={`text-sm font-medium transition-colors ${isHome ? "text-primary-foreground/70 hover:text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            Book Consultation
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-3 ml-2">
              <span className={`text-sm flex items-center gap-1.5 ${isHome ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                <User className="h-3.5 w-3.5" /> {user?.name}
              </span>
              <button
                onClick={() => logout()}
                className={`text-sm font-medium flex items-center gap-1.5 transition-colors ${isHome ? "text-primary-foreground/70 hover:text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                <LogOut className="h-3.5 w-3.5" /> Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className={`ml-2 inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                isHome
                  ? "bg-accent text-accent-foreground hover:bg-accent/90"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              <LogIn className="h-3.5 w-3.5" /> Sign In
            </Link>
          )}
        </nav>

        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen
            ? <X className={`h-5 w-5 ${isHome ? "text-primary-foreground" : "text-foreground"}`} />
            : <Menu className={`h-5 w-5 ${isHome ? "text-primary-foreground" : "text-foreground"}`} />
          }
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-card/95 backdrop-blur-md border-b border-border px-4 pb-4 pt-2 space-y-3"
        >
          <a href="/#countries" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-foreground py-2">Countries</a>
          <Link to="/tracker" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-foreground py-2">My Journey</Link>
          <Link to="/consultation" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-foreground py-2">Book Consultation</Link>
          {isAuthenticated ? (
            <>
              <div className="text-sm text-muted-foreground py-2 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" /> {user?.name}
              </div>
              <button onClick={() => { logout(); setMobileOpen(false); }} className="block text-sm font-medium text-foreground py-2 flex items-center gap-1.5">
                <LogOut className="h-3.5 w-3.5" /> Sign Out
              </button>
            </>
          ) : (
            <Link to="/auth" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-foreground py-2 flex items-center gap-1.5">
              <LogIn className="h-3.5 w-3.5" /> Sign In
            </Link>
          )}
        </motion.div>
      )}
    </header>
  );
}
