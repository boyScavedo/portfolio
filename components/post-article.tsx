import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { markdownComponents } from "@/lib/markdown";
import { formatDate, readingTime } from "@/lib/utils";

/**
 * The rendered body of a post: tags, title, byline, cover and markdown.
 *
 * Shared by /blog/[slug] and the admin draft preview so both render identically
 * — the preview is only trustworthy if it uses the same component. Likes and
 * comments deliberately stay in the blog page; a draft has neither.
 */

export type PostArticleData = {
  title: string;
  content: string;
  excerpt: string | null;
  tags: string[] | null;
  coverUrl: string | null;
  publishedAt: Date | null;
};

type Props = {
  post: PostArticleData;
  /** Rendered above the title in preview mode to make the state obvious. */
  banner?: string;
};

export default function PostArticle({ post, banner }: Props) {
  return (
    <article>
      {banner && (
        <div className="mb-8 rounded-lg border border-[#d4f600]/30 bg-[#d4f600]/5 px-4 py-3 font-mono text-xs text-[#d4f600]">
          {banner}
        </div>
      )}

      <header className="mb-12 space-y-5">
        <div className="flex flex-wrap gap-2">
          {(post.tags ?? []).map((tag) => (
            <span key={tag} className="rounded-full border border-[#2a2a2a] bg-[#111] px-3 py-1 text-xs text-[#888]">
              {tag}
            </span>
          ))}
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold leading-tight tracking-tight">{post.title}</h1>
        <div className="flex items-center gap-4 text-sm text-[#555]">
          {post.publishedAt && (
            <time dateTime={post.publishedAt.toISOString()}>{formatDate(post.publishedAt)}</time>
          )}
          <span className="w-1 h-1 rounded-full bg-[#333]" />
          <span>{readingTime(post.content)} min read</span>
        </div>
        {post.coverUrl && (
          <div className="relative w-full h-80">
            <Image
              src={post.coverUrl}
              alt={post.title}
              fill
              className="object-cover rounded-2xl border border-[#1a1a1a]"
            />
          </div>
        )}
      </header>

      <div className="prose prose-lg max-w-none">
        <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}