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

const buildPromptCapsules = (visa: VisaDetailData, universities: University[]): string[] => {
  const prompts = [
    "What is the processing time?",
    "What documents are required?",
    "How much does this visa cost?",
    "Show me the key eligibility requirements",
    "Explain the application steps",
  ];

  if (visa.id === "study" && universities.length > 0) {
    prompts.push("Show top universities");
    prompts.push("Best universities for Computer Science?");
  }

  return prompts;
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
