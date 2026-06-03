"use client";

import { useRef, useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";

type MarqueeProps = {
  items: string[];
  speed?: number;
  accent?: boolean;
  reverse?: boolean;
};

export default function Marquee({ items, speed = 30, accent = false, reverse = false }: MarqueeProps) {
  const controls = useAnimationControls();
  const duration = items.length * speed;
  const doubled = [...items, ...items, ...items, ...items];

  const startAnim = () =>
    controls.start({
      x: reverse ? ["0%", "50%"] : ["0%", "-50%"],
      transition: { duration, ease: "linear", repeat: Infinity, repeatType: "loop" },
    });

  useEffect(() => {
    startAnim();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="overflow-hidden border-y border-[#1a1a1a] py-4 select-none cursor-default"
      onMouseEnter={() => controls.stop()}
      onMouseLeave={() => startAnim()}
    >
      <motion.div
        className="flex gap-10 whitespace-nowrap w-max"
        animate={controls}
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
