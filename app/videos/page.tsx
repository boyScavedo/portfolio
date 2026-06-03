import type { Metadata } from "next";
import { getLatestVideos } from "@/lib/youtube";
import { formatDate } from "@/lib/utils";
import ScrollReveal from "@/components/scroll-reveal";

export const metadata: Metadata = {
  title: "Videos",
  description: "Latest YouTube videos by Jeevan Shrestha.",
};

export default async function VideosPage() {
  const videos = await getLatestVideos(12);

  return (
    <div className="flex flex-col pt-24">
      <section className="relative px-6 py-20 noise overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4f600]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="mx-auto max-w-6xl relative z-10">
          <ScrollReveal>
            <p className="text-xs text-[#555] uppercase tracking-widest mb-2">YouTube</p>
            <h1 className="text-[clamp(2.5rem,7vw,6rem)] font-bold leading-[0.95] tracking-tight">
              Latest<br /><span className="text-[#d4f600]">Videos</span>
            </h1>
          </ScrollReveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24 w-full">
        {videos.length === 0 ? (
          <ScrollReveal>
            <div className="rounded-2xl border border-[#1a1a1a] bg-[#111] p-16 text-center space-y-3">
              <p className="text-[#555] text-sm">No videos yet — configure your YouTube API keys.</p>
              <p className="text-xs text-[#333]">
                Set <code className="bg-[#1a1a1a] px-1 py-0.5 rounded text-[#888]">YOUTUBE_API_KEY</code> and{" "}
                <code className="bg-[#1a1a1a] px-1 py-0.5 rounded text-[#888]">YOUTUBE_CHANNEL_ID</code> in your env.
              </p>
            </div>
          </ScrollReveal>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((v, i) => (
              <ScrollReveal key={v.id} delay={i * 50}>
                <a
                  href={v.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl border border-[#1a1a1a] bg-[#111] overflow-hidden hover:border-[#d4f600]/40 transition-all hover:-translate-y-1 block"
                >
                  <div className="relative">
                    <img src={v.thumbnail} alt={v.title} className="w-full aspect-video object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-14 h-14 rounded-full bg-[#d4f600] flex items-center justify-center">
                        <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-5 space-y-1">
                    <p className="text-xs text-[#555]">{formatDate(v.publishedAt)}</p>
                    <h2 className="text-sm font-bold leading-snug line-clamp-2 group-hover:text-[#d4f600] transition-colors">
                      {v.title}
                    </h2>
                  </div>
                </a>
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
