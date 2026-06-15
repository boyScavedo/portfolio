function Pulse({ className, style }: { className: string; style?: React.CSSProperties }) {
  return <div className={`rounded-[2px] bg-[#1a1a1a] animate-pulse ${className}`} style={style} />;
}

export default function BlogPostLoading() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-32 pb-20">
      {/* Tags row */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Pulse
            key={i}
            className="rounded-full border border-[#2a2a2a] bg-[#111] h-6 w-14"
            style={{ animationDelay: `${i * 80}ms` }}
          />
        ))}
      </div>

      {/* Title */}
      <div className="space-y-2 mb-4">
        <Pulse className="h-10 w-full" />
        <Pulse className="h-10 w-3/4" />
      </div>

      {/* Meta line */}
      <div className="flex items-center gap-4 text-sm mb-10">
        <Pulse className="h-3 w-24" />
        <div className="w-1 h-1 rounded-full bg-[#333]" />
        <Pulse className="h-3 w-20" />
      </div>

      {/* Cover image placeholder */}
      <Pulse className="rounded-2xl h-48 w-full border border-[#1a1a1a] mb-12" />

      {/* Content area */}
      <div className="prose prose-lg max-w-none space-y-6">
        {/* Heading 1 */}
        <div className="space-y-3">
          <Pulse className="h-6 w-1/2" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Pulse
              key={i}
              className={`h-3 bg-[#111] ${i === 2 ? "w-3/4" : "w-full"}`}
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>

        {/* Heading 2 */}
        <div className="space-y-3">
          <Pulse className="h-6 w-1/3" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Pulse
              key={i}
              className={`h-3 bg-[#111] ${i === 2 ? "w-5/6" : "w-full"}`}
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>

        {/* Blockquote */}
        <div className="border-l-4 border-[#1a1a1a] h-12 w-3/4 bg-[#111] pl-4 rounded-[2px]" />

        {/* Code block */}
        <Pulse className="bg-[#111] rounded h-20 w-full border border-[#1a1a1a]" />
      </div>

      {/* Like button area */}
      <div className="mt-10 pt-8 border-t border-[#1a1a1a]">
        <Pulse className="h-8 w-32" />
      </div>

      {/* Comments area */}
      <div className="mt-16 pt-8 border-t border-[#1a1a1a] space-y-6">
        <Pulse className="h-4 w-28" />

        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="border border-[#1a1a1a] rounded-[2px] p-4 space-y-3"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-center gap-3">
              <Pulse className="h-3 w-20" />
              <Pulse className="h-3 w-16" />
            </div>
            <Pulse className="h-3 w-full bg-[#111]" />
            <Pulse className="h-3 w-3/4 bg-[#111]" />
          </div>
        ))}
      </div>
    </div>
  );
}
