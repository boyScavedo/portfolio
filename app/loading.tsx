function Pulse({ className }: { className: string }) {
  return <div className={`rounded-[2px] bg-[#1a1a1a] animate-pulse ${className}`} />;
}

export default function HomeLoading() {
  return (
    <div className="flex flex-col">
      {/* Hero section */}
      <section className="min-h-[calc(100vh-60px)] flex flex-col justify-center px-6 py-16 overflow-hidden">
        <div className="mx-auto max-w-6xl w-full space-y-8">
          {/* Terminal prompt */}
          <div className="flex items-center gap-2">
            <Pulse className="h-3 w-24" />
          </div>

          {/* Status indicator */}
          <Pulse className="h-3 w-40 bg-[#111]" />

          {/* Name placeholder - two lines */}
          <div className="space-y-2">
            <Pulse className="h-[clamp(3rem,10vw,8rem)] w-3/5" />
            <Pulse className="h-[clamp(3rem,10vw,8rem)] w-2/5" />
          </div>

          {/* Info panel */}
          <div className="border border-[#1a1a1a] rounded-[2px] max-w-2xl">
            <div className="px-3 py-1.5 border-b border-[#1a1a1a] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#333]" />
              <span className="w-2 h-2 rounded-full bg-[#333]" />
              <span className="w-2 h-2 rounded-full bg-[#333]" />
              <Pulse className="h-2.5 w-[72px] ml-1 bg-[#111]" />
            </div>
            <div className="p-4 space-y-3">
              <div className="flex gap-3 items-center">
                <Pulse className="h-3 w-[60px] bg-[#111]" />
                <Pulse className="h-3 w-32" />
              </div>
              <div className="flex gap-3 items-center">
                <Pulse className="h-3 w-[60px] bg-[#111]" />
                <Pulse className="h-3 w-48" />
              </div>
              <div className="flex gap-3 items-center">
                <Pulse className="h-3 w-[60px] bg-[#111]" />
                <Pulse className="h-3 w-24" />
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3">
            <Pulse className="h-[38px] w-[132px] rounded-[2px]" />
            <Pulse className="h-[38px] w-[124px] rounded-[2px] bg-[#111]" />
            <Pulse className="h-[38px] w-[104px] rounded-[2px] bg-[#111]" />
          </div>
        </div>
      </section>

      {/* First marquee */}
      <div className="border-y border-[#1a1a1a] py-4">
        <Pulse className="h-3 w-full" />
      </div>

      {/* Status panel */}
      <div className="mx-auto max-w-6xl px-6 py-10 w-full">
        <div className="border border-[#1a1a1a] rounded-[2px]">
          <div className="px-4 py-2 border-b border-[#1a1a1a] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#333]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#333]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#333]" />
            <Pulse className="h-2.5 w-[68px] ml-1 bg-[#111]" />
          </div>
          <div className="p-4 flex flex-wrap gap-6">
            <div className="space-y-1.5">
              <Pulse className="h-2.5 w-16 bg-[#111]" />
              <Pulse className="h-3 w-28" />
            </div>
            <div className="space-y-1.5">
              <Pulse className="h-2.5 w-14 bg-[#111]" />
              <Pulse className="h-3 w-24" />
            </div>
            <div className="space-y-1.5">
              <Pulse className="h-2.5 w-14 bg-[#111]" />
              <Pulse className="h-3 w-16" />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Projects section */}
      <section className="mx-auto max-w-6xl px-6 pb-16 w-full space-y-6">
        {/* Section header */}
        <div className="space-y-1">
          <Pulse className="h-2.5 w-20 bg-[#111]" />
          <Pulse className="h-7 w-48" />
        </div>

        {/* 3-column grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="border border-[#1a1a1a] rounded-[2px] overflow-hidden"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Image area */}
              <Pulse className="w-full h-16 rounded-none" />
              <div className="p-4 space-y-3">
                <Pulse className="h-3.5 w-3/4" />
                <Pulse className="h-2.5 w-full bg-[#111]" />
                <Pulse className="h-2.5 w-5/6 bg-[#111]" />
                {/* Tags */}
                <div className="flex gap-1">
                  <Pulse className="h-4 w-14 bg-[#111]" />
                  <Pulse className="h-4 w-16 bg-[#111]" />
                  <Pulse className="h-4 w-12 bg-[#111]" />
                </div>
                {/* Footer links */}
                <div className="flex gap-3 pt-2 border-t border-[#1a1a1a]">
                  <Pulse className="h-2.5 w-10 bg-[#111]" />
                  <Pulse className="h-2.5 w-14 bg-[#111]" />
                  <Pulse className="h-2.5 w-12 bg-[#111] ml-auto" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Second marquee */}
      <div className="border-y border-[#1a1a1a] py-4">
        <Pulse className="h-3 w-full" />
      </div>

      {/* Latest Posts section */}
      <section className="mx-auto max-w-6xl px-6 py-16 w-full space-y-6">
        {/* Section header */}
        <div className="space-y-1">
          <Pulse className="h-2.5 w-14 bg-[#111]" />
          <Pulse className="h-7 w-40" />
        </div>

        {/* Post list */}
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="border border-[#1a1a1a] rounded-[2px] p-4"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Pulse className="h-2.5 w-16 bg-[#111]" />
                <Pulse className="h-2.5 w-2 bg-[#111]" />
                <Pulse className="h-2.5 w-14 bg-[#111]" />
              </div>
              <Pulse className="h-3.5 w-3/4 mb-1.5" />
              <Pulse className="h-2.5 w-1/2 bg-[#111]" />
            </div>
          ))}
        </div>
      </section>

      {/* CTA section */}
      <div className="mx-auto max-w-6xl px-6 pb-20 w-full">
        <div className="border border-[#d4f600]/30 rounded-[2px] bg-[#d4f600]/5 p-10 md:p-14">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-2">
              <Pulse className="h-2.5 w-16 bg-[#111]" />
              <Pulse className="h-9 w-48" />
              <Pulse className="h-9 w-36" />
              <Pulse className="h-2.5 w-56 bg-[#111]" />
            </div>
            <Pulse className="h-[38px] w-[172px] rounded-[2px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
