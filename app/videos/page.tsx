import type { Metadata } from "next";
import { getLatestVideos } from "@/lib/youtube";
import VideoList from "./video-list";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Videos",
  description: "Latest YouTube videos by Jeevan Adhikari.",
};

export default async function VideosPage() {
  const videos = await getLatestVideos(12);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 w-full">
      <div className="mb-8 space-y-1">
        <p className="text-[10px] font-mono text-[#555] uppercase tracking-widest">~/videos</p>
        <h1 className="font-mono font-black text-4xl text-[#e0e0e0]">
          videos<span className="text-[#d4f600]">_</span>
        </h1>
        <p className="text-xs font-mono text-[#555]">
          {videos.length} video{videos.length !== 1 ? "s" : ""} · latest from youtube
        </p>
      </div>

      <VideoList videos={videos} />
    </div>
  );
}
