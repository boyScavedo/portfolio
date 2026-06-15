function Pulse({ className }: { className: string }) {
  return <div className={`rounded-[2px] bg-[#1a1a1a] animate-pulse ${className}`} />;
}

export default function AboutLoading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 w-full space-y-12">
      {/* Header */}
      <div className="space-y-1">
        <Pulse className="h-3 w-16" />
        <Pulse className="h-9 w-28" />
      </div>

      {/* Bio + Meta grid */}
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Left — Bio panel */}
        <div className="border border-[#1a1a1a] rounded-[2px]">
          <div className="px-4 py-2 border-b border-[#1a1a1a]">
            <Pulse className="h-3 w-12" />
          </div>
          <div className="p-4 space-y-3">
            <Pulse className="h-3 w-full bg-[#111]" />
            <Pulse className="h-3 w-5/6 bg-[#111]" />
            <Pulse className="h-3 w-2/3 bg-[#111]" />
            <Pulse className="h-6 w-28" />
          </div>
        </div>

        {/* Right — Meta cards */}
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="border border-[#1a1a1a] rounded-[2px] p-3"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <Pulse className="h-2.5 w-12" />
              <Pulse className="h-3 w-16 mt-1" />
            </div>
          ))}
        </div>
      </div>

      {/* Social links panel */}
      <div className="border border-[#1a1a1a] rounded-[2px]">
        <div className="px-4 py-2 border-b border-[#1a1a1a]">
          <Pulse className="h-3 w-12" />
        </div>
        <div className="p-3 flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Pulse key={i} className="h-7 w-20 rounded-[2px] border border-[#2a2a2a] px-3 py-1.5" />
          ))}
        </div>
      </div>

      {/* Marquee placeholder */}
      <div className="border-y border-[#1a1a1a] py-4">
        <div className="flex gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Pulse key={i} className="h-4 w-24" />
          ))}
        </div>
      </div>

      {/* Skills section */}
      <section className="space-y-4">
        <div className="space-y-0.5">
          <Pulse className="h-3 w-32" />
          <Pulse className="h-7 w-52" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, ci) => (
            <div
              key={ci}
              className="border border-[#1a1a1a] rounded-[2px]"
              style={{ animationDelay: `${ci * 80}ms` }}
            >
              <div className="px-4 py-2 border-b border-[#1a1a1a] flex items-center justify-between">
                <Pulse className="h-3 w-24" />
                <Pulse className="h-3 w-6" />
              </div>
              <div className="p-3 flex flex-wrap gap-1.5">
                {Array.from({ length: 7 }).map((_, ti) => (
                  <Pulse
                    key={ti}
                    className="h-6 w-16 rounded-[2px] border border-[#2a2a2a] px-2.5 py-1 bg-[#111]"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA box */}
      <div className="border border-[#1a1a1a] rounded-[2px] p-8 md:p-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <Pulse className="h-3 w-24" />
            <Pulse className="h-6 w-64" />
            <Pulse className="h-3 w-52 bg-[#111]" />
          </div>
          <Pulse className="h-9 w-28 rounded-[2px]" />
        </div>
      </div>
    </div>
  );
}
