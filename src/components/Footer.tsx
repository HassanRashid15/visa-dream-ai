import { FileCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/50 py-12 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
                <FileCheck className="h-4 w-4 text-accent-foreground" />
              </div>
              <span className="font-display text-lg font-bold">VisaDreams</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-powered UK visa and immigration guidance. Eligibility checks, document checklists, cost calculators, and expert consultations.
            </p>
          </div>

          {/* UK Visa Types */}
          <div>
            <h4 className="font-semibold text-sm mb-3">UK Visa Types</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/country/uk/visa/student" className="hover:text-foreground transition-colors">Student Visa</Link></li>
              <li><Link to="/country/uk/visa/work" className="hover:text-foreground transition-colors">Skilled Worker Visa</Link></li>
              <li><Link to="/country/uk/visa/ilr" className="hover:text-foreground transition-colors">ILR / Settlement</Link></li>
              <li><Link to="/country/uk/visa/tourist" className="hover:text-foreground transition-colors">Standard Visitor Visa</Link></li>
            </ul>
          </div>

          {/* Tools & Services */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Tools & Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/ielts-prep" className="hover:text-foreground transition-colors">IELTS Preparation</Link></li>
              <li><Link to="/tracker" className="hover:text-foreground transition-colors">Application Tracker</Link></li>
              <li><Link to="/consultation" className="hover:text-foreground transition-colors">Book Consultation</Link></li>
              <li><Link to="/country/uk" className="hover:text-foreground transition-colors">UK Country Guide</Link></li>
            </ul>
          </div>

          {/* Quick Links / Help */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Help & Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="https://www.gov.uk/browse/visas-immigration" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GOV.UK Visas & Immigration</a></li>
              <li><a href="https://www.gov.uk/check-uk-visa" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Check if you need a UK visa</a></li>
              <li><Link to="/auth" className="hover:text-foreground transition-colors">Sign In / Register</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} VisaDreams. Not legal advice. Always verify with official UKVI and GOV.UK sources.
        </div>
      </div>
    </footer>
  );
}
