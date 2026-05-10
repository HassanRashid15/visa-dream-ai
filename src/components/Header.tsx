import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, LogIn, LogOut, User, ChevronDown, LayoutDashboard } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import Logo from "./Logo";

export default function Header() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${isHome ? "bg-transparent" : "bg-card/80 backdrop-blur-md border-b border-border"}`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
        <motion.div 
          className="w-11 h-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
         <img className="w-full h-full" src="/images/navlogo.png" alt="VisaDreams" />
         </motion.div>
          <span className={`font-display text-xl font-semibold tracking-tight ${isHome ? "text-primary-foreground" : "text-foreground"}`}>
            Visa<span className="text-accent font-bold">Dreams</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="/#countries" className={`text-sm font-normal transition-colors ${isHome ? "text-primary-foreground/70 hover:text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            Countries
          </a>
          <Link to="/tracker" className={`text-sm font-normal transition-colors ${isHome ? "text-primary-foreground/70 hover:text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            My Journey
          </Link>
          <Link to="/consultation" className={`text-sm font-normal transition-colors ${isHome ? "text-primary-foreground/70 hover:text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            Book Consultation
          </Link>

          {isAuthenticated ? (
            <div className="relative ml-2" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                  isHome ? "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10" : "text-muted-foreground hover:text-foreground hover:bg-accent/10"
                }`}
              >
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">{user?.name}</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${userDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-1 z-50"
                >
                  <Link
                    to="/dashboard"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-accent/10 transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <div className="border-t border-border my-1"></div>
                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </motion.div>
              )}
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
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center justify-between w-full text-sm font-medium text-foreground py-2 px-2 rounded-lg hover:bg-accent/10 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" /> {user?.name}
                </div>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${userDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {userDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="pl-4 space-y-1"
                >
                  <Link
                    to="/tracker"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      setMobileOpen(false);
                    }}
                    className="flex items-center gap-2 text-sm text-foreground py-2 hover:bg-accent/10 rounded-lg px-2 transition-colors"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                      setMobileOpen(false);
                    }}
                    className="flex items-center gap-2 w-full text-sm text-destructive py-2 hover:bg-destructive/10 rounded-lg px-2 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign Out
                  </button>
                </motion.div>
              )}
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
