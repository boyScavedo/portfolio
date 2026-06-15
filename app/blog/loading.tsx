function Pulse({ className }: { className: string }) {
  return <div className={`rounded-[2px] bg-[#1a1a1a] animate-pulse ${className}`} />;
}

export default function BlogLoading() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12 w-full">
      {/* Header */}
      <div className="mb-8 space-y-1.5">
        <Pulse className="h-3 w-16" />
        <Pulse className="h-9 w-28" />
        <Pulse className="h-3 w-44" />
      </div>

      {/* Search panel */}
      <div className="border border-[#1a1a1a] rounded-[2px] mb-6">
        <div className="px-3 py-1.5 border-b border-[#1a1a1a]">
          <Pulse className="h-3 w-28" />
        </div>
        <div className="p-3">
          <Pulse className="h-5 w-full" />
        </div>
      </div>

      {/* Post cards */}
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="border border-[#1a1a1a] rounded-[2px] p-4 space-y-2"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-center gap-2">
              <Pulse className="h-2.5 w-16" />
              <Pulse className="h-2.5 w-2" />
              <Pulse className="h-2.5 w-12" />
            </div>
            <Pulse className="h-3.5 w-3/4" />
            <Pulse className="h-2.5 w-1/2 bg-[#111]" />
            <div className="flex gap-1">
              <Pulse className="h-4 w-12 bg-[#111]" />
              <Pulse className="h-4 w-14 bg-[#111]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
