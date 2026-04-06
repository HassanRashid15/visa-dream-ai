import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/authContext";
import Index from "./pages/Index";
import CountryDetail from "./pages/CountryDetail";
import VisaDetail from "./pages/VisaDetail";
import EligibilityCheck from "./pages/EligibilityCheck";
import ApplicationTracker from "./pages/ApplicationTracker";
import ConsultationBooking from "./pages/ConsultationBooking";
import PreEligibility from "./pages/PreEligibility";
import IELTSPrep from "./pages/IELTSPrep";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/country/:country" element={<CountryDetail />} />
            <Route path="/country/:country/visa/:visaType" element={<VisaDetail />} />
            <Route path="/pre-check/:country" element={<PreEligibility />} />
            <Route path="/check/:country" element={<EligibilityCheck />} />
            <Route path="/ielts-prep" element={<IELTSPrep />} />
            <Route path="/tracker" element={<ApplicationTracker />} />
            <Route path="/consultation" element={<ConsultationBooking />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
