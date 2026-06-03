type MarqueeProps = {
  items: string[];
  speed?: "slow" | "normal" | "fast";
  accent?: boolean;
};

const speeds = { slow: "40s", normal: "25s", fast: "15s" };

export default function Marquee({ items, speed = "normal", accent = false }: MarqueeProps) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-[#222] py-4 select-none">
      <div
        className="flex gap-10 whitespace-nowrap marquee-track"
        style={{ animationDuration: speeds[speed] }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className={`text-sm font-medium uppercase tracking-widest flex items-center gap-10 ${accent ? "text-[#d4f600]" : "text-[#888]"}`}
          >
            {item}
            <span className={`w-1.5 h-1.5 rounded-full inline-block ${accent ? "bg-[#d4f600]" : "bg-[#444]"}`} />
          </span>
        ))}
      </div>
    </div>
  );
}
