import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// Animated counter - React Bits inspired
export function AnimatedCounter({ value, duration = 1.5 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const startTime = performance.now();
    const dur = duration * 1000;

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / dur, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{display}</span>;
}

// Sparkle border effect
export function SparkleBorder({
  children,
  className = "",
  borderWidth = 2,
}: {
  children: React.ReactNode;
  className?: string;
  borderWidth?: number;
}) {
  return (
    <div className={`relative ${className}`}>
      <div
        className="absolute inset-0 rounded-2xl overflow-hidden"
        style={{ padding: borderWidth }}
      >
        <motion.div
          className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0%,hsl(var(--accent))_10%,transparent_20%)]"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <div className="relative bg-card rounded-2xl">{children}</div>
    </div>
  );
}

// Gradient text
export function GradientText({
  children,
  className = "",
  from = "hsl(var(--primary))",
  to = "hsl(var(--accent))",
}: {
  children: React.ReactNode;
  className?: string;
  from?: string;
  to?: string;
}) {
  return (
    <span
      className={`bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: `linear-gradient(135deg, ${from}, ${to})`,
      }}
    >
      {children}
    </span>
  );
}

// Pulse dot
export function PulseDot({ color = "bg-primary", size = "h-3 w-3" }: { color?: string; size?: string }) {
  return (
    <span className="relative inline-flex">
      <span className={`${size} rounded-full ${color}`} />
      <span className={`absolute inset-0 ${size} rounded-full ${color} animate-ping opacity-40`} />
    </span>
  );
}

// Tilt card on hover
export function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(0, { stiffness: 200, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    rotateX.set(((e.clientY - centerY) / (rect.height / 2)) * -5);
    rotateY.set(((e.clientX - centerX) / (rect.width / 2)) * 5);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}

// Stagger container
export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      {children}
    </motion.div>
  );
}

// Shimmer button
export function ShimmerButton({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl bg-primary text-primary-foreground px-6 py-3 font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent"
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
      />
    </button>
  );
}
