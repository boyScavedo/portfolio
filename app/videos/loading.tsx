function Pulse({ className }: { className: string }) {
  return <div className={`rounded-[2px] bg-[#1a1a1a] animate-pulse ${className}`} />;
}

export default function VideosLoading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 w-full">
      {/* Header */}
      <div className="mb-8 space-y-1">
        <Pulse className="h-3 w-16" />
        <Pulse className="h-9 w-28" />
        <Pulse className="h-3 w-44" />
      </div>

      {/* Search panel */}
      <div className="border border-[#1a1a1a] rounded-[2px] mb-6">
        <div className="px-3 py-1.5 border-b border-[#1a1a1a]">
          <Pulse className="h-3 w-28" />
        </div>
        <div className="p-3 flex items-center gap-2">
          <span className="text-[#555] font-mono text-xs">$</span>
          <Pulse className="h-5 flex-1" />
        </div>
      </div>

      {/* Count line */}
      <div className="mb-6">
        <Pulse className="h-3 w-28" />
      </div>

      {/* Video grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="border border-[#1a1a1a] rounded-[2px] overflow-hidden"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="w-full aspect-video bg-[#1a1a1a]" />
            <div className="px-3 py-2 border-t border-[#1a1a1a] space-y-1">
              <Pulse className="h-2.5 w-16 bg-[#111]" />
              <Pulse className="h-3 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
