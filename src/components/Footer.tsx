import { Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/50 py-12 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
                <Globe className="h-4 w-4 text-accent-foreground" />
              </div>
              <span className="font-display text-lg font-bold">VisaCheck</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-powered visa eligibility assessment. Transparent, honest, and built to help you make informed decisions.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Countries</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/check/canada" className="hover:text-foreground transition-colors">🇨🇦 Canada</a></li>
              <li><a href="/check/uk" className="hover:text-foreground transition-colors">🇬🇧 United Kingdom</a></li>
              <li><a href="/check/australia" className="hover:text-foreground transition-colors">🇦🇺 Australia</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Important</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>No one can guarantee a visa</li>
              <li>Always verify with official sources</li>
              <li>This is an indicative tool only</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} VisaCheck. This tool is for informational purposes only. Not legal advice.
        </div>
      </div>
    </footer>
  );
}
