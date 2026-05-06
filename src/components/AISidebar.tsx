import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, Minimize2, Maximize2, MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { VisaDetailData } from "@/lib/ukVisaDetails";
import type { University } from "@/lib/countryData";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface AISidebarProps {
  visa: VisaDetailData;
  universities?: University[];
}

const pickRandom = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

const isGreeting = (message: string): boolean => {
  const q = message.trim().toLowerCase();
  return /^(hi|hii|hello|hey|yo|good morning|good afternoon|good evening)\b/.test(q);
};

const UK_IMMIGRATION_KNOWLEDGE = {
  general: {
    "processing times": "Standard UK visa processing times vary: Student visas (3-6 weeks), Skilled Worker visas (3-8 weeks), ILR (up to 6 months), Visitor visas (3 weeks). Priority services are available for faster processing.",
    "fees": "UK visa fees include application fees and Immigration Health Surcharge. Student visa: £490 + £776/year IHS. Skilled Worker: £719 + £1,035/year IHS. ILR: £2,885. Visitor visa: £115 for 6 months.",
    "english requirements": "Most UK visas require B1 level English (IELTS 4.0 in speaking and listening). Student visas need B2 level (IELTS 5.5-6.5). Some exemptions apply for English-speaking nationals and degree holders.",
    "maintenance funds": "You need £1,270 in your bank account for 28 consecutive days, unless your employer certifies maintenance. Student visas require additional funds for tuition fees.",
  },
  study: {
    "graduate route": "The Graduate Route allows you to work in the UK for 2 years (3 years for PhD graduates) after completing your degree. No sponsor required. Apply before your Student visa expires.",
    "part-time work": "Students can work up to 20 hours per week during term time and full-time during vacations. PhD students have no work restrictions. Cannot be self-employed or fill permanent positions.",
    "cas": "Confirmation of Acceptance for Studies (CAS) is a unique 14-digit reference number from your licensed sponsor. Valid for 6 months. Contains course details, fees paid, and sponsor information.",
    "ielts requirements": "Student visas need IELTS 5.5-6.5 overall depending on course level. Must be UKVI-approved test. Some universities accept other English qualifications.",
  },
  work: {
    "points system": "Skilled Worker visa requires 70 points: 50 mandatory (job offer, sponsor, skill level) + 20 tradeable (salary, age, education, English). Salary must meet £38,700 threshold or occupation going rate.",
    "salary requirements": "General threshold: £38,700/year or occupation going rate (whichever is higher). New entrants under 26 or recent graduates: 70% of going rate. Health and education roles may have different thresholds.",
    "certificate of sponsorship": "CoS is a virtual document with unique reference number from licensed employer. Contains job details, salary, SOC code. Required for Skilled Worker visa application.",
    "job switching": "You can switch employers but need a new CoS and visa application. Cannot start new job until approved. Must maintain salary requirements.",
  },
  ilr: {
    "residency requirements": "ILR requires 5 continuous years on qualifying visa. Maximum 180 days absence per 12-month period allowed. Some absences may be permitted with exceptional circumstances.",
    "life in uk test": "24-question multiple-choice test about British history, culture, and politics. Need 75% (18/24) to pass. Costs £50. Can retake unlimited times.",
    "citizenship": "Can apply for British citizenship 12 months after ILR. Must meet residence requirements, pass Life in UK test (if not already), and have good character.",
    "document requirements": "Need 5 years of evidence: payslips, P60s, tax returns, BRPs, employer letters, absence records. All documents must be original or certified copies.",
  },
  tourist: {
    "work restrictions": "Cannot work (paid or unpaid) on Visitor visa. Can attend business meetings, conferences, and sign deals. Cannot study courses longer than 6 months.",
    "duration": "Standard Visitor visa allows up to 6 months per visit. Long-term visas (2, 5, 10 years) allow multiple entries but each visit limited to 6 months maximum.",
    "extensions": "Generally cannot extend Visitor visa. Must leave UK before expiry. Extensions only in exceptional circumstances (medical emergencies, etc.).",
    "activities": "Allowed: tourism, visiting family/friends, business meetings, conferences, short courses (up to 6 months), private medical treatment.",
  },
};

const buildPromptCapsules = (visa: VisaDetailData, universities: University[]): string[] => {
  const basePrompts = [
    "What is the processing time?",
    "What documents do I need?",
    "How much does it cost?",
    "What are the eligibility requirements?",
    "Can I work while studying?",
    "Can I bring my family?",
    "What is the success rate?",
    "How long can I stay?",
  ];

  const ukSpecificPrompts = [
    "What are the English language requirements?",
    "How much maintenance funds do I need?",
    "What is the Immigration Health Surcharge?",
    "Can I switch to a different visa type?",
    "What happens if my application is refused?",
    "How do I prove my qualifications?",
    "What are the visa conditions?",
    "Can I travel outside the UK?",
  ];

  const visaSpecificPrompts: Record<string, string[]> = {
    study: [
      "What is the Graduate Route visa?",
      "Can I work part-time during studies?",
      "How do I get a CAS number?",
      "What are the UKVI-approved English tests?",
      "Can I bring my dependants?",
      "What happens after my course ends?",
    ],
    work: [
      "How does the points system work?",
      "What are the salary thresholds?",
      "What is a Certificate of Sponsorship?",
      "Can I change employers?",
      "What occupations are in shortage?",
      "How do I check if my employer is licensed?",
    ],
    pr: [
      "What is Indefinite Leave to Remain?",
      "How long does ILR processing take?",
      "What are the residency requirements?",
      "How do I prepare for Life in UK test?",
      "When can I apply for citizenship?",
      "What documents do I need for ILR?",
    ],
    tourist: [
      "Can I work on a Visitor visa?",
      "How long can I stay in the UK?",
      "Can I extend my visitor visa?",
      "What activities are allowed?",
      "Do I need travel insurance?",
      "Can I study on a Visitor visa?",
    ],
  };

  return [...basePrompts, ...ukSpecificPrompts, ...(visaSpecificPrompts[visa.id] || [])];
};

const getBestFaqMatch = (userMessage: string, visa: VisaDetailData): string | null => {
  const words = userMessage
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .filter((word) => word.length > 3);

  if (words.length === 0) return null;

  let bestScore = 0;
  let bestAnswer: string | null = null;

  for (const faq of visa.faqs) {
    const text = `${faq.q} ${faq.a}`.toLowerCase();
    const score = words.reduce((acc, word) => acc + (text.includes(word) ? 1 : 0), 0);

    if (score > bestScore) {
      bestScore = score;
      bestAnswer = faq.a;
    }
  }

  return bestScore > 0 ? bestAnswer : null;
};

const generateVisaResponse = (userMessage: string, visa: VisaDetailData, universities: University[]): string => {
  const q = userMessage.toLowerCase();

  if (isGreeting(userMessage)) {
    return `Hi! I can help with ${visa.name} details like eligibility, documents, costs, timelines, and next steps.`;
  }

  if (/thank|thanks/.test(q)) {
    return "You're welcome. Ask me anything else and I will keep it specific to this visa.";
  }

  if (/official|gov|government|source|link/.test(q)) {
    return `The official guidance for ${visa.name} is here: ${visa.officialLink}`;
  }

  if (visa.id === "study" && universities.length > 0 && /universit|college|ranking|tuition|course/.test(q)) {
    const matchedUniversity = universities.find((uni) => {
      const uniName = uni.name.toLowerCase();
      return q.includes(uniName) || uniName.split(" ").some((word) => word.length > 4 && q.includes(word));
    });

    if (matchedUniversity) {
      return `${matchedUniversity.name} (${matchedUniversity.location}) is ranked ${matchedUniversity.ranking}. Typical tuition is ${matchedUniversity.tuitionRange}. Popular courses include ${matchedUniversity.popularCourses.slice(0, 3).join(", ")}.`;
    }

    const topUniversities = universities
      .slice(0, 3)
      .map((uni) => `${uni.name} (${uni.ranking})`)
      .join(", ");
    return `For ${visa.name}, top options include ${topUniversities}. I can compare any of these by tuition, location, or courses.`;
  }

  if (/how long|processing|time|decision|wait/.test(q)) {
    return `${visa.name} processing time is ${visa.processingTime}.`;
  }

  if (/cost|fee|money|price|charge|pay|expensive/.test(q)) {
    const topFees = visa.fees
      .slice(0, 3)
      .map((fee) => `${fee.item}: ${fee.amount}`)
      .join("; ");
    return `For ${visa.name}, common costs include ${topFees}. Estimated total is ${visa.totalEstimatedCost}.`;
  }

  if (/document|paper|paperwork|passport|bank|statement|submit|upload/.test(q)) {
    const docs = visa.documents
      .slice(0, 3)
      .map((doc) => doc.name)
      .join(", ");
    return `For ${visa.name}, key documents usually include ${docs}.`;
  }

  if (/eligible|eligibility|qualify|requirement|criteria|can i apply/.test(q)) {
    const requirements = visa.eligibility
      .filter((item) => item.mandatory)
      .slice(0, 3)
      .map((item) => item.label)
      .join(", ");
    return `To qualify for ${visa.name}, you should meet these core requirements: ${requirements}.`;
  }

  if (/step|process|apply|application|start|procedure|how to/.test(q)) {
    const steps = visa.applicationSteps
      .slice(0, 3)
      .map((step) => `${step.step}. ${step.title}`)
      .join(" ");
    return `The application flow for ${visa.name} is: ${steps}`;
  }

  const faqAnswer = getBestFaqMatch(userMessage, visa);
  if (faqAnswer) return faqAnswer;

  return pickRandom(visa.overview);
};

export default function AISidebar({ visa, universities = [] }: AISidebarProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true); // Closed by default
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileDrawerOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);
  const promptCapsules = useMemo(() => buildPromptCapsules(visa, universities), [visa, universities]);

  useEffect(() => {
    const welcomeMessage: Message = {
      id: `welcome-${visa.id}`,
      text: `Hello! I'm your AI visa assistant for ${visa.name}. Ask me about eligibility, costs, documents, processing time, or application steps.${visa.id === "study" && universities.length ? " I can also help with top universities." : ""}`,
      sender: "ai",
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, [visa.id, visa.name, universities.length]);

  const handleSendMessage = (presetMessage?: string) => {
    const currentInput = (presetMessage ?? inputMessage).trim();
    if (!currentInput) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: currentInput,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: generateVisaResponse(currentInput, visa, universities),
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Mobile Floating Button */}
      {isMobile && (
        <motion.button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg z-50 flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMobileDrawerOpen(true)}
          title="Want to chat?"
        >
          <MessageCircle className="h-6 w-6" />
        </motion.button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isMobileDrawerOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMobileDrawerOpen(false)}
        />
      )}

      {/* Sidebar/Drawer */}
      <motion.div
        className={`${
          isMobile 
            ? `fixed inset-y-0 right-0 w-80 bg-background border-l border-border shadow-2xl z-50 flex flex-col`
            : `flex-shrink-0 bg-background border-l border-border shadow-2xl z-40 flex flex-col sticky top-20 self-start h-[calc(100vh-5rem)]`
        }`}
        initial={{ 
          width: isMinimized ? 60 : 400,
          x: isMobile ? (isMobileDrawerOpen ? 0 : 400) : 0
        }}
        animate={{ 
          width: isMinimized ? 60 : 400,
          x: isMobile ? (isMobileDrawerOpen ? 0 : 400) : 0
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50 flex-shrink-0 sticky top-0 z-20">
        {!isMinimized && (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">AI Visa Assistant</h3>
              <p className="text-xs text-muted-foreground">Ask me anything about visas</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => isMobile ? setIsMobileDrawerOpen(false) : setIsMinimized(!isMinimized)}
          className="h-8 w-8 p-0"
        >
          {isMobile && <X className="h-4 w-4" />}
          {!isMobile && isMinimized && <Maximize2 className="h-4 w-4" />}
          {!isMobile && !isMinimized && <Minimize2 className="h-4 w-4" />}
        </Button>
      </div>

      {!isMinimized && (
        <>
          {/* Messages Area */}
          <div className="relative flex-1">
            <div ref={messagesContainerRef} className="absolute inset-0 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {message.sender === "ai" && (
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
                <Card className={`max-w-[80%] p-3 ${message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </Card>
                {message.sender === "user" && (
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                className="flex gap-3 justify-start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                <Card className="bg-muted p-3">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </Card>
              </motion.div>
            )}
            </div>
            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-background to-transparent pointer-events-none z-10"></div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border flex-shrink-0 sticky bottom-0 bg-background">
            <div className="relative">
              <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide w-full">
                {promptCapsules.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleSendMessage(prompt)}
                    disabled={isTyping}
                    className="text-xs px-3 py-1.5 rounded-full border border-border bg-muted/40 hover:bg-muted transition-colors disabled:opacity-50 flex-shrink-0"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask your question..."
                className="flex-1 px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isTyping}
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isTyping}
                size="sm"
                className="px-3"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      {isMinimized && (
        <div className="flex-1 flex items-center justify-center">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
        </div>
      )}
    </motion.div>
    </>
  );
}
