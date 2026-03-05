import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  ArrowLeft, Calendar as CalendarIcon, Clock, Video, Phone,
  MessageSquare, Star, CheckCircle, User, Globe, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  GradientText, TiltCard, StaggerContainer, StaggerItem, ShimmerButton
} from "@/components/ui/animated-bits";
import { toast } from "@/hooks/use-toast";

interface Advisor {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  languages: string[];
  rating: number;
  avatar: string;
  available: boolean;
}

const ADVISORS: Advisor[] = [
  {
    id: "1",
    name: "Sarah Mitchell",
    specialty: "Canada Immigration (Express Entry, PNP)",
    experience: "8+ years",
    languages: ["English", "French"],
    rating: 4.9,
    avatar: "👩‍💼",
    available: true,
  },
  {
    id: "2",
    name: "James Wilson",
    specialty: "UK Visas (Skilled Worker, Student Route)",
    experience: "12+ years",
    languages: ["English", "Hindi"],
    rating: 4.8,
    avatar: "👨‍💼",
    available: true,
  },
  {
    id: "3",
    name: "Emily Chen",
    specialty: "Australia Migration (Subclass 189, 482, 500)",
    experience: "6+ years",
    languages: ["English", "Mandarin"],
    rating: 4.9,
    avatar: "👩‍💻",
    available: false,
  },
];

const TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
];

const CALL_TYPES = [
  { id: "video", label: "Video Call", icon: Video, description: "Face-to-face consultation via Zoom" },
  { id: "phone", label: "Phone Call", icon: Phone, description: "Voice consultation" },
  { id: "chat", label: "Chat Session", icon: MessageSquare, description: "Text-based consultation" },
];

type Step = "advisor" | "datetime" | "details" | "confirm";

export default function ConsultationBooking() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("advisor");
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [callType, setCallType] = useState<string>("video");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });

  const steps: { id: Step; label: string }[] = [
    { id: "advisor", label: "Choose Advisor" },
    { id: "datetime", label: "Date & Time" },
    { id: "details", label: "Your Details" },
    { id: "confirm", label: "Confirm" },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === step);

  const handleConfirm = () => {
    // Mock email notifications
    toast({
      title: "✅ Consultation Booked!",
      description: `Your ${callType} call with ${selectedAdvisor?.name} is scheduled for ${selectedDate ? format(selectedDate, "PPP") : ""} at ${selectedTime}.`,
    });

    // Simulate email to user
    setTimeout(() => {
      toast({
        title: "📧 Confirmation Email Sent",
        description: `A confirmation email has been sent to ${formData.email} with your booking details.`,
      });
    }, 1500);

    // Simulate email to advisor
    setTimeout(() => {
      toast({
        title: "📧 Advisor Notified",
        description: `${selectedAdvisor?.name} has been notified about your upcoming consultation.`,
      });
    }, 3000);

    setTimeout(() => navigate("/tracker"), 4000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Hero */}
      <div className="hero-gradient pt-28 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-primary-foreground/10"
              style={{
                width: 80 + i * 60,
                height: 80 + i * 60,
                right: `${5 + i * 10}%`,
                top: `${10 + i * 15}%`,
              }}
              animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>
        <div className="container max-w-4xl mx-auto relative z-10">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground mb-6 transition-colors text-sm">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </button>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-2">
            Book a <GradientText from="hsl(38, 92%, 55%)" to="hsl(38, 92%, 75%)">Consultation</GradientText>
          </h1>
          <p className="text-primary-foreground/60 text-sm">Get expert guidance from certified immigration advisors</p>
        </div>
      </div>

      <div className="flex-1">
        <div className="container max-w-4xl mx-auto px-4 -mt-8 pb-16 space-y-6">
          {/* Progress Steps */}
          <div className="rounded-xl border border-border bg-card p-4 card-elevated">
            <div className="flex items-center justify-between">
              {steps.map((s, i) => (
                <div key={s.id} className="flex items-center gap-2 flex-1">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                    i < currentStepIndex ? "bg-emerald-100 text-emerald-600" :
                    i === currentStepIndex ? "bg-primary text-primary-foreground" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {i < currentStepIndex ? <CheckCircle className="h-4 w-4" /> : i + 1}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${i === currentStepIndex ? "text-foreground" : "text-muted-foreground"}`}>
                    {s.label}
                  </span>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 ${i < currentStepIndex ? "bg-emerald-300" : "bg-border"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step: Advisor */}
          {step === "advisor" && (
            <StaggerContainer className="space-y-4">
              <StaggerItem>
                <h2 className="text-xl font-display font-bold mb-1">Choose Your Advisor</h2>
                <p className="text-sm text-muted-foreground mb-4">Select an immigration expert who specializes in your destination</p>
              </StaggerItem>
              {ADVISORS.map((advisor) => (
                <StaggerItem key={advisor.id}>
                  <TiltCard
                    className={`rounded-xl border bg-card p-5 cursor-pointer transition-all ${
                      selectedAdvisor?.id === advisor.id
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/40"
                    } ${!advisor.available ? "opacity-50 pointer-events-none" : ""}`}
                  >
                    <div onClick={() => advisor.available && setSelectedAdvisor(advisor)}>
                      <div className="flex items-start gap-4">
                        <span className="text-5xl">{advisor.avatar}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{advisor.name}</h3>
                            <div className="flex items-center gap-1 text-accent">
                              <Star className="h-4 w-4 fill-current" />
                              <span className="text-sm font-semibold">{advisor.rating}</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{advisor.specialty}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {advisor.experience}</span>
                            <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> {advisor.languages.join(", ")}</span>
                          </div>
                          {!advisor.available && (
                            <span className="text-xs text-destructive mt-2 inline-block">Currently unavailable</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </StaggerItem>
              ))}
              <StaggerItem>
                <Button
                  onClick={() => setStep("datetime")}
                  disabled={!selectedAdvisor}
                  className="w-full gap-2"
                  size="lg"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              </StaggerItem>
            </StaggerContainer>
          )}

          {/* Step: Date & Time */}
          {step === "datetime" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <h2 className="text-xl font-display font-bold mb-1">Select Date & Time</h2>
                <p className="text-sm text-muted-foreground">Choose your preferred consultation slot with {selectedAdvisor?.name}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Calendar */}
                <div className="rounded-xl border border-border bg-card p-4 card-elevated">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </div>

                {/* Time slots */}
                <div className="space-y-4">
                  <div className="rounded-xl border border-border bg-card p-4 card-elevated">
                    <h3 className="text-sm font-semibold mb-3">Available Time Slots</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {TIME_SLOTS.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`text-xs py-2.5 px-2 rounded-lg border transition-all font-medium ${
                            selectedTime === time
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-card hover:border-primary/40"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Call type */}
                  <div className="rounded-xl border border-border bg-card p-4 card-elevated">
                    <h3 className="text-sm font-semibold mb-3">Consultation Type</h3>
                    <div className="space-y-2">
                      {CALL_TYPES.map((ct) => (
                        <button
                          key={ct.id}
                          onClick={() => setCallType(ct.id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                            callType === ct.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/40"
                          }`}
                        >
                          <ct.icon className={`h-5 w-5 ${callType === ct.id ? "text-primary" : "text-muted-foreground"}`} />
                          <div>
                            <span className="text-sm font-medium">{ct.label}</span>
                            <p className="text-xs text-muted-foreground">{ct.description}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("advisor")} className="flex-1">Back</Button>
                <Button
                  onClick={() => setStep("details")}
                  disabled={!selectedDate || !selectedTime}
                  className="flex-1 gap-2"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step: Details */}
          {step === "details" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <h2 className="text-xl font-display font-bold mb-1">Your Details</h2>
                <p className="text-sm text-muted-foreground">Tell us about yourself so the advisor can prepare</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6 card-elevated space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                      <User className="h-4 w-4 text-muted-foreground" /> Full Name
                    </Label>
                    <Input
                      id="name" placeholder="John Doe" required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                    <Input
                      id="email" type="email" placeholder="john@example.com" required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="h-12"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                  <Input
                    id="phone" type="tel" placeholder="+1 234 567 8900"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium">What would you like to discuss?</Label>
                  <Textarea
                    id="message" placeholder="E.g. I'm looking to apply for a Canada Study Permit. I have questions about..." rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("datetime")} className="flex-1">Back</Button>
                <Button
                  onClick={() => setStep("confirm")}
                  disabled={!formData.name || !formData.email}
                  className="flex-1 gap-2"
                >
                  Review Booking <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step: Confirm */}
          {step === "confirm" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <h2 className="text-xl font-display font-bold mb-1">Confirm Your Booking</h2>
                <p className="text-sm text-muted-foreground">Review your consultation details</p>
              </div>

              <div className="rounded-2xl border border-border bg-card card-elevated overflow-hidden">
                <div className="hero-gradient p-6 text-primary-foreground">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl">{selectedAdvisor?.avatar}</span>
                    <div>
                      <h3 className="font-display font-bold text-lg">{selectedAdvisor?.name}</h3>
                      <p className="text-primary-foreground/70 text-sm">{selectedAdvisor?.specialty}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <CalendarIcon className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Date</p>
                        <p className="text-sm font-semibold">{selectedDate ? format(selectedDate, "PPP") : "-"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Time</p>
                        <p className="text-sm font-semibold">{selectedTime || "-"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      {callType === "video" ? <Video className="h-5 w-5 text-primary" /> :
                       callType === "phone" ? <Phone className="h-5 w-5 text-primary" /> :
                       <MessageSquare className="h-5 w-5 text-primary" />}
                      <div>
                        <p className="text-xs text-muted-foreground">Type</p>
                        <p className="text-sm font-semibold capitalize">{callType} Call</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h4 className="text-sm font-semibold mb-2">Your Information</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p><span className="font-medium text-foreground">Name:</span> {formData.name}</p>
                      <p><span className="font-medium text-foreground">Email:</span> {formData.email}</p>
                      {formData.phone && <p><span className="font-medium text-foreground">Phone:</span> {formData.phone}</p>}
                      {formData.message && <p><span className="font-medium text-foreground">Notes:</span> {formData.message}</p>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("details")} className="flex-1">Back</Button>
                <ShimmerButton onClick={handleConfirm} className="flex-1">
                  <CheckCircle className="h-4 w-4" /> Confirm Booking
                </ShimmerButton>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
