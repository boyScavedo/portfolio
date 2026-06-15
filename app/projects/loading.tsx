function Pulse({ className }: { className: string }) {
  return <div className={`rounded-[2px] bg-[#1a1a1a] animate-pulse ${className}`} />;
}

export default function ProjectsLoading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 w-full">
      {/* Header */}
      <div className="mb-8 space-y-1">
        <Pulse className="h-3 w-20" />
        <Pulse className="h-9 w-36" />
        <Pulse className="h-3 w-56" />
      </div>

      {/* Filter panel */}
      <div className="border border-[#1a1a1a] rounded-[2px] mb-6">
        <div className="px-3 py-1.5 border-b border-[#1a1a1a]">
          <Pulse className="h-3 w-28" />
        </div>
        <div className="p-3 space-y-3">
          <div className="flex items-center gap-2">
            <Pulse className="h-3 w-3" />
            <Pulse className="h-5 flex-1" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Pulse className="h-5 w-14" />
            <Pulse className="h-5 w-16" />
            <Pulse className="h-5 w-18" />
            <Pulse className="h-5 w-12" />
          </div>
          <Pulse className="h-8 w-full" />
        </div>
      </div>

      {/* Count line */}
      <Pulse className="h-3 w-28 mb-6" />

      {/* Project cards grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="border border-[#1a1a1a] rounded-[2px] overflow-hidden flex flex-col"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {/* Status bar */}
            <div className="px-3 py-2 border-b border-[#1a1a1a] flex items-center justify-between bg-[#0d0d0d]">
              <Pulse className="h-2.5 w-12" />
              <Pulse className="h-2.5 w-16" />
            </div>

            {/* Image placeholder */}
            <Pulse className="w-full h-16" />

            {/* Content area */}
            <div className="p-4 flex flex-col flex-1 gap-2">
              <Pulse className="h-4 w-3/4" />
              <Pulse className="h-3 w-full bg-[#111]" />
              <Pulse className="h-3 w-5/6 bg-[#111]" />
              <div className="flex flex-wrap gap-1">
                <Pulse className="h-4 w-12 bg-[#111]" />
                <Pulse className="h-4 w-14 bg-[#111]" />
                <Pulse className="h-4 w-10 bg-[#111]" />
              </div>
              <div className="flex gap-3 pt-2 border-t border-[#1a1a1a] items-center">
                <Pulse className="h-3 w-10" />
                <Pulse className="h-3 w-14" />
                <Pulse className="h-3 w-14 ml-auto" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
