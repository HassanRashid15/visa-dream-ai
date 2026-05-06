import { useState, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Send, Bot, User, Minimize2, Maximize2, MessageCircle, X, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { VisaDetailData } from "@/lib/ukVisaDetails";
import type { University } from "@/lib/countryData";
import { supabase } from "@/integrations/supabase/client";
import { ASK_AI_EVENT, type AskAIDetail } from "@/components/HighlightAskAI";
import { toast } from "sonner";
import { useAuth } from "@/lib/authContext";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface AISidebarProps {
  visa: VisaDetailData;
  universities?: University[];
  /** Active section key on the page (e.g. "fees", "documents") used to bias prompt capsules. */
  activeSection?: string;
}

const SECTION_CAPSULES: Record<string, string[]> = {
  overview: ["Summarise this visa in plain English", "Who is this visa best suited for?", "What's the catch?"],
  eligibility: ["Am I likely eligible?", "What if I don't meet one requirement?", "Explain the financial requirement"],
  steps: ["Walk me through applying step by step", "How long does each step take?", "Can I apply from inside the UK?"],
  documents: ["Which documents are hardest to get?", "Do I need certified translations?", "What if a document is missing?"],
  fees: ["Break down the total cost", "Can the IHS be reduced?", "Are any fees refundable?"],
  universities: ["Compare the top universities", "Best courses for international students", "Cheapest tuition options"],
  faqs: ["What's the most common rejection reason?", "Can I switch visas later?", "Tips for a strong application"],
  gallery: ["What does life look like on this visa?", "What should I prepare for arrival?"],
  videos: ["Summarise the key video takeaways", "Anything important not shown in the videos?"],
};

const DEFAULT_CAPSULES = [
  "What is the processing time?",
  "What documents do I need?",
  "How much does it cost in total?",
  "Walk me through the application",
];

const buildPromptCapsules = (
  visa: VisaDetailData,
  universities: University[],
  activeSection?: string,
): string[] => {
  const sectionPrompts = activeSection ? SECTION_CAPSULES[activeSection] ?? [] : [];
  const base = [...sectionPrompts, ...DEFAULT_CAPSULES];
  if (visa.id === "study" && universities.length > 0) {
    base.push("Show top universities");
  }
  // de-dupe, cap at 6
  return Array.from(new Set(base)).slice(0, 6);
};

export default function AISidebar({ visa, universities = [], activeSection }: AISidebarProps) {
  const GUEST_CHAT_LIMIT = 3;
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true); // Closed by default
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

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
  const promptCapsules = useMemo(
    () => buildPromptCapsules(visa, universities, activeSection),
    [visa, universities, activeSection],
  );
  const guestUsedCount = useMemo(
    () => messages.filter((m) => m.sender === "user").length,
    [messages],
  );
  const guestRemainingCount = Math.max(0, GUEST_CHAT_LIMIT - guestUsedCount);

  useEffect(() => {
    const welcomeMessage: Message = {
      id: `welcome-${visa.id}`,
      text: `Hello! I'm your AI visa assistant for ${visa.name}. Ask me about eligibility, costs, documents, processing time, or application steps — or highlight any text on the page and tap "Ask AI".${visa.id === "study" && universities.length ? " I can also help with top universities." : ""}`,
      sender: "ai",
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, [visa.id, visa.name, universities.length]);

  const sendToAI = async (currentInput: string, highlightedText?: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: highlightedText ? `“${highlightedText}” — ${currentInput}` : currentInput,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const history = messages
        .filter((m) => !m.id.startsWith("welcome-"))
        .map((m) => ({ role: m.sender === "user" ? "user" : "assistant", content: m.text }));

      const visaContext = {
        name: visa.name,
        id: visa.id,
        processingTime: visa.processingTime,
        totalEstimatedCost: visa.totalEstimatedCost,
        officialLink: visa.officialLink,
        overview: visa.overview,
        eligibility: visa.eligibility,
        applicationSteps: visa.applicationSteps,
        documents: visa.documents,
        fees: visa.fees,
        faqs: visa.faqs,
        universities: universities.slice(0, 8).map((u) => ({
          name: u.name, location: u.location, ranking: u.ranking,
          tuitionRange: u.tuitionRange, popularCourses: u.popularCourses,
        })),
      };

      const { data, error } = await supabase.functions.invoke("visa-chat", {
        body: { question: currentInput, highlightedText, visaContext, history },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data?.answer ?? "Sorry, I couldn't generate a response.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong.";
      toast.error(msg);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          text: `I hit an error: ${msg}`,
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const canSendGuestMessage = () => {
    if (isAuthenticated) return true;
    if (guestUsedCount < GUEST_CHAT_LIMIT) return true;
    setShowSignInPrompt(true);
    return false;
  };

  const handleSendMessage = (presetMessage?: string) => {
    const currentInput = (presetMessage ?? inputMessage).trim();
    if (!currentInput) return;
    if (!canSendGuestMessage()) return;
    void sendToAI(currentInput);
  };

  // Listen for "Ask AI" events from text-selection tooltip
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<AskAIDetail>).detail;
      if (!detail?.text) return;
      if (!canSendGuestMessage()) return;
      setIsMinimized(false);
      if (window.innerWidth < 768) setIsMobileDrawerOpen(true);
      void sendToAI(detail.question ?? `Explain this: "${detail.text}"`, detail.text);
    };
    window.addEventListener(ASK_AI_EVENT, handler);
    return () => window.removeEventListener(ASK_AI_EVENT, handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, visa.id]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {showSignInPrompt && (
        <div className="fixed inset-0 z-[120] bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-5 space-y-3">
            <h4 className="text-base font-semibold">Sign in to continue chat</h4>
            <p className="text-sm text-muted-foreground">
              Your first 3 AI questions are free. Please sign in to continue asking more questions.
            </p>
            <div className="flex items-center justify-end gap-2 pt-1">
              <Button variant="ghost" onClick={() => setShowSignInPrompt(false)}>
                Not now
              </Button>
              <Button
                onClick={() => {
                  const returnTo = `${location.pathname}${location.search}${location.hash}`;
                  const encodedReturnTo = encodeURIComponent(returnTo || "/");
                  setShowSignInPrompt(false);
                  navigate(`/auth?redirect=${encodedReturnTo}`);
                }}
              >
                Sign In
              </Button>
            </div>
          </Card>
        </div>
      )}

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
            {!isAuthenticated && (
              <div className="sticky top-0 z-10 pb-2">
                <div className="rounded-lg border border-border bg-background/95 backdrop-blur p-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-muted-foreground">Guest messages left</span>
                    <motion.span
                      key={guestRemainingCount}
                      initial={{ scale: 0.85, opacity: 0.6 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="font-semibold text-foreground"
                    >
                      {guestRemainingCount}/{GUEST_CHAT_LIMIT}
                    </motion.span>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: "100%" }}
                      animate={{ width: `${(guestRemainingCount / GUEST_CHAT_LIMIT) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              </div>
            )}
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

          {!isAuthenticated && guestRemainingCount === 0 && (
            <div className="absolute inset-0 z-20 bg-background/65 backdrop-blur-[1px] flex items-center justify-center p-4">
              <Card className="w-full max-w-xs p-4 text-center">
                <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 mx-auto mb-2 flex items-center justify-center">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm font-semibold mb-1">Chat Locked</p>
                <p className="text-xs text-muted-foreground mb-3">
                  You've used your 3 free messages. Sign in to continue.
                </p>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    const returnTo = `${location.pathname}${location.search}${location.hash}`;
                    const encodedReturnTo = encodeURIComponent(returnTo || "/");
                    navigate(`/auth?redirect=${encodedReturnTo}`);
                  }}
                >
                  Sign In to Continue
                </Button>
              </Card>
            </div>
          )}
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
