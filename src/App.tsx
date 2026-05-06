import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/authContext";

const Index = lazy(() => import("./pages/Index"));
const CountryDetail = lazy(() => import("./pages/CountryDetail"));
const VisaDetail = lazy(() => import("./pages/VisaDetail"));
const EligibilityCheck = lazy(() => import("./pages/EligibilityCheck"));
const ApplicationTracker = lazy(() => import("./pages/ApplicationTracker"));
const ConsultationBooking = lazy(() => import("./pages/ConsultationBooking"));
const PreEligibility = lazy(() => import("./pages/PreEligibility"));
const IELTSPrep = lazy(() => import("./pages/IELTSPrep"));
const Auth = lazy(() => import("./pages/Auth"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<div className="min-h-screen bg-background" />}>
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
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
