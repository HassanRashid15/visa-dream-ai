import { useEffect, useState, type RefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

export interface AskAIDetail {
  text: string;
  question?: string;
}

export const ASK_AI_EVENT = "lovable:ask-ai";

export function emitAskAI(detail: AskAIDetail) {
  window.dispatchEvent(new CustomEvent<AskAIDetail>(ASK_AI_EVENT, { detail }));
}

interface Props {
  containerRef: RefObject<HTMLElement>;
}

export default function HighlightAskAI({ containerRef }: Props) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [text, setText] = useState("");

  useEffect(() => {
    const onUp = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) {
        setPos(null);
        return;
      }
      const selected = sel.toString().trim();
      if (selected.length < 3 || selected.length > 600) {
        setPos(null);
        return;
      }
      const node = sel.anchorNode;
      const container = containerRef.current;
      if (!container || !node || !container.contains(node.parentElement ?? (node as Node))) {
        setPos(null);
        return;
      }
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return;
      setText(selected);
      setPos({
        x: rect.left + rect.width / 2 + window.scrollX,
        y: rect.top + window.scrollY - 8,
      });
    };

    const onScroll = () => setPos(null);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("touchend", onUp);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchend", onUp);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [containerRef]);

  const handleAsk = () => {
    emitAskAI({ text, question: `Explain this: "${text}"` });
    setPos(null);
    window.getSelection()?.removeAllRanges();
  };

  return (
    <AnimatePresence>
      {pos && (
        <motion.button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleAsk}
          initial={{ opacity: 0, y: 6, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.15 }}
          className="fixed z-[80] -translate-x-1/2 -translate-y-full inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium px-3 py-1.5 shadow-lg hover:bg-primary/90"
          style={{ left: pos.x, top: pos.y, position: "absolute" }}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Ask AI
        </motion.button>
      )}
    </AnimatePresence>
  );
}