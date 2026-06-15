function Pulse({ className }: { className: string }) {
  return <div className={`rounded-[2px] bg-[#1a1a1a] animate-pulse ${className}`} />;
}

export default function ContactLoading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 w-full">
      {/* Header */}
      <div className="space-y-2">
        <Pulse className="h-2.5 w-20 bg-[#111]" />
        <div className="flex items-center gap-1">
          <Pulse className="h-9 w-32" />
          <Pulse className="h-9 w-3 bg-[#d4f600]/40" />
        </div>
        <Pulse className="h-3 w-56 bg-[#111]" />
      </div>

      {/* Two-column grid */}
      <div className="mt-10 grid md:grid-cols-2 gap-8 items-start">
        {/* Left column: Contact info */}
        <div className="space-y-4">
          {/* Reach me panel */}
          <div className="border border-[#1a1a1a] rounded-[2px]">
            <div className="px-4 py-2 border-b border-[#1a1a1a]">
              <Pulse className="h-2.5 w-20 bg-[#111]" />
            </div>
            <div className="p-4 space-y-3">
              {/* Email row */}
              <div className="flex items-center gap-3">
                <Pulse className="w-8 h-8 rounded-[2px] bg-[#111]" />
                <Pulse className="h-3 w-48" />
              </div>
              {/* GitHub row */}
              <div className="flex items-center gap-3">
                <Pulse className="w-8 h-8 rounded-[2px] bg-[#111]" />
                <Pulse className="h-3 w-40" />
              </div>
            </div>
          </div>

          {/* Response time panel */}
          <div className="border border-[#1a1a1a] rounded-[2px] p-4 space-y-1.5">
            <Pulse className="h-2.5 w-24 bg-[#111]" />
            <Pulse className="h-3 w-36" />
          </div>
        </div>

        {/* Right column: Contact form */}
        <div className="border border-[#1a1a1a] rounded-[2px]">
          {/* Header with dots */}
          <div className="px-4 py-2 border-b border-[#1a1a1a] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#333]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#333]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#333]" />
            <Pulse className="h-2.5 w-[72px] ml-1 bg-[#111]" />
          </div>

          {/* Form fields */}
          <div className="p-6 space-y-4">
            {/* Name + Email row */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Pulse className="h-2.5 w-14 bg-[#111]" />
                <Pulse className="h-[38px] w-full rounded-[2px] bg-[#111]" />
              </div>
              <div className="space-y-1.5">
                <Pulse className="h-2.5 w-14 bg-[#111]" />
                <Pulse className="h-[38px] w-full rounded-[2px] bg-[#111]" />
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <Pulse className="h-2.5 w-16 bg-[#111]" />
              <Pulse className="h-[38px] w-full rounded-[2px] bg-[#111]" />
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <Pulse className="h-2.5 w-16 bg-[#111]" />
              <Pulse className="h-[100px] w-full rounded-[2px] bg-[#111]" />
            </div>

            {/* Submit button */}
            <Pulse className="h-[38px] w-full rounded-[2px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
