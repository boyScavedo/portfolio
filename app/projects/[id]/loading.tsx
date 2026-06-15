function Pulse({ className, style }: { className: string; style?: React.CSSProperties }) {
  return <div className={`rounded-[2px] bg-[#1a1a1a] animate-pulse ${className}`} style={style} />;
}

export default function ProjectDetailLoading() {
  return (
    <div className="flex flex-col pt-24 min-h-screen">
      <div className="mx-auto max-w-4xl px-6 pb-24 w-full">
        {/* Back link */}
        <Pulse className="h-4 w-28 mb-10" />

        {/* Header section */}
        <div className="space-y-4 mb-10">
          {/* Badges row */}
          <div className="flex gap-2">
            <Pulse className="rounded-full h-5 w-20" />
            <Pulse className="rounded-full h-5 w-16" />
          </div>

          {/* Title */}
          <Pulse className="h-12 w-3/4" />

          {/* Description */}
          <div className="space-y-2">
            <Pulse className="h-4 w-full bg-[#111]" />
            <Pulse className="h-4 w-2/3 bg-[#111]" />
          </div>

          {/* Tags row */}
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Pulse
                key={i}
                className="rounded-full bg-[#1a1a1a] border border-[#2a2a2a] px-2.5 py-0.5 h-5"
                style={{ animationDelay: `${i * 80}ms` }}
              />
            ))}
          </div>

          {/* Links row */}
          <div className="flex gap-3">
            <Pulse className="rounded-full h-9 w-28" />
            <Pulse className="rounded-full border border-[#333] h-9 w-24" />
          </div>
        </div>

        {/* Cover image placeholder */}
        <Pulse className="rounded-2xl h-64 w-full border border-[#1a1a1a] mb-10" />

        {/* Content area */}
        <div className="space-y-8">
          {/* Section 1 */}
          <div className="space-y-3">
            <Pulse className="h-5 w-1/2" />
            {Array.from({ length: 4 }).map((_, i) => (
              <Pulse
                key={i}
                className={`h-3 bg-[#111] ${i === 3 ? "w-3/4" : "w-full"}`}
                style={{ animationDelay: `${i * 80}ms` }}
              />
            ))}
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <Pulse className="h-5 w-1/3" />
            {Array.from({ length: 4 }).map((_, i) => (
              <Pulse
                key={i}
                className={`h-3 bg-[#111] ${i === 3 ? "w-5/6" : "w-full"}`}
                style={{ animationDelay: `${i * 80}ms` }}
              />
            ))}
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <Pulse className="h-5 w-2/5" />
            {Array.from({ length: 5 }).map((_, i) => (
              <Pulse
                key={i}
                className={`h-3 bg-[#111] ${i === 4 ? "w-2/3" : "w-full"}`}
                style={{ animationDelay: `${i * 80}ms` }}
              />
            ))}
          </div>

          {/* Code block */}
          <Pulse className="bg-[#111] rounded h-24 w-full border border-[#1a1a1a]" />
        </div>
      </div>
    </div>
  );
}
