export interface YTVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  url: string;
}

export async function getLatestVideos(maxResults = 8): Promise<YTVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  if (!apiKey || !channelId) return [];

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet&order=date&maxResults=${maxResults}&type=video`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return (data.items ?? []).map((item: Record<string, unknown>) => {
    const snippet = item.snippet as Record<string, unknown>;
    const id = (item.id as Record<string, string>).videoId;
    const thumbnails = snippet.thumbnails as Record<string, { url: string }>;
    return {
      id,
      title: snippet.title as string,
      description: snippet.description as string,
      thumbnail: thumbnails.high?.url ?? thumbnails.default?.url ?? "",
      publishedAt: snippet.publishedAt as string,
      url: `https://www.youtube.com/watch?v=${id}`,
    };
  });
}
