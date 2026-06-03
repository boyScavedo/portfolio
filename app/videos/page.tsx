import type { Metadata } from "next";
import { getLatestVideos } from "@/lib/youtube";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Videos",
  description: "Latest YouTube videos by Jeevan Shrestha.",
};

export default async function VideosPage() {
  const videos = await getLatestVideos(12);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Videos</h1>
        <p className="text-neutral-500 dark:text-neutral-400">Latest from my YouTube channel.</p>
      </div>

      {videos.length === 0 ? (
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-12 text-center">
          <p className="text-neutral-500 dark:text-neutral-400">
            No videos yet — add your{" "}
            <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">YOUTUBE_API_KEY</code> and{" "}
            <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">YOUTUBE_CHANNEL_ID</code> env vars.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((v) => (
            <a
              key={v.id}
              href={v.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
            >
              <div className="relative">
                <img src={v.thumbnail} alt={v.title} className="w-full aspect-video object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <div className="p-4 space-y-1">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{formatDate(v.publishedAt)}</p>
                <h2 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {v.title}
                </h2>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
