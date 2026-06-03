"use client";

import { useRef, useEffect } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

type MarqueeProps = {
  items: string[];
  speed?: number;
  accent?: boolean;
  reverse?: boolean;
};

export default function Marquee({ items, speed = 18, accent = false, reverse = false }: MarqueeProps) {
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<ReturnType<typeof animate> | null>(null);
  const doubled = [...items, ...items];

  function startAnim() {
    if (!containerRef.current) return;
    animRef.current?.stop();

    const halfWidth = containerRef.current.scrollWidth / 2;
    const current = x.get();
    const target = reverse ? 0 : -halfWidth;
    const reset = reverse ? -halfWidth : 0;
    const totalDuration = items.length * speed;
    const remaining = Math.abs(target - current);
    const duration = (remaining / halfWidth) * totalDuration;

    animRef.current = animate(x, target, {
      duration,
      ease: "linear",
      onComplete: () => {
        x.set(reset);
        startAnim();
      },
    });
  }

  useEffect(() => {
    const t = setTimeout(() => {
      if (containerRef.current && reverse) {
        x.set(-containerRef.current.scrollWidth / 2);
      }
      startAnim();
    }, 50);
    return () => {
      clearTimeout(t);
      animRef.current?.stop();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="overflow-hidden border-y border-[#1a1a1a] py-4 select-none cursor-default"
      onMouseEnter={() => animRef.current?.stop()}
      onMouseLeave={() => startAnim()}
    >
      <motion.div
        ref={containerRef}
        className="flex gap-10 whitespace-nowrap w-max"
        style={{ x }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className={`text-sm font-medium uppercase tracking-widest flex items-center gap-10 ${accent ? "text-[#d4f600]" : "text-[#444]"}`}
          >
            {item}
            <span className={`w-1.5 h-1.5 rounded-full inline-block flex-shrink-0 ${accent ? "bg-[#d4f600]" : "bg-[#333]"}`} />
          </span>
        ))}
      </motion.div>
    </div>
  );
}
