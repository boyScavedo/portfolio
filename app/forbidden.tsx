import Link from "next/link";

export default function Forbidden() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20 w-full flex flex-col items-center justify-center min-h-[60vh]">
      <div className="border border-[#1a1a1a] rounded-[2px] w-full max-w-lg">
        <div className="px-4 py-2 border-b border-[#1a1a1a] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#333]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#333]" />
          <span className="w-1.5 h-1.5 rounded-full bg-red-500/40" />
          <span className="text-[10px] font-mono text-[#555] ml-1">error.sh</span>
        </div>
        <div className="p-8 space-y-4 font-mono">
          <p className="text-[10px] text-[#555] uppercase tracking-widest">~/403</p>
          <h1 className="font-black text-4xl text-[#e0e0e0]">
            forbidden<span className="text-red-400">_</span>
          </h1>
          <div className="space-y-1 text-sm text-[#666]">
            <p><span className="text-[#555]">$</span> you don&apos;t have permission to access this resource.</p>
          </div>
          <Link
            href="/"
            className="inline-block rounded-[2px] bg-[#d4f600] text-black px-5 py-2 text-xs font-mono font-bold hover:bg-white transition-colors"
          >
            cd ~/ →
          </Link>
        </div>
      </div>
    </div>
  );
}
