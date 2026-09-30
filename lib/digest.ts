/**
 * Turn a raw Tech Radar digest file into the fields the posts table needs.
 *
 * Scope is deliberately narrow: this only understands the frontmatter shape
 * config/AGENTS.md tells the radar to emit, so it needs no YAML dependency.
 * If that frontmatter ever grows real YAML, swap this for a parser rather than
 * growing this.
 */

export type Digest = {
  title: string;
  /** ISO date (YYYY-MM-DD) taken from the filename, falling back to frontmatter. */
  date: string;
  /** Body markdown with the frontmatter block and the duplicate H1 removed. */
  content: string;
  excerpt: string;
  tags: string[];
};

const FM_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

function unquote(v: string): string {
  const t = v.trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    return t.slice(1, -1);
  }
  return t;
}

/** Minimal frontmatter reader: scalars plus `- item` lists, nothing else. */
function parseFrontmatter(block: string): Record<string, string | string[]> {
  const out: Record<string, string | string[]> = {};
  let key: string | null = null;
  let list: string[] | null = null;

  for (const raw of block.split(/\r?\n/)) {
    const line = raw.replace(/\s+$/, "");
    if (!line.trim()) continue;

    const item = /^\s+-\s+(.*)$/.exec(line);
    if (item && key) {
      (list ??= []).push(unquote(item[1]));
      out[key] = list;
      continue;
    }

    const pair = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line);
    if (!pair) continue;
    key = pair[1];
    list = null;
    const value = pair[2].trim();
    out[key] = value === "" ? [] : unquote(value);
  }
  return out;
}

/**
 * Drop a leading H1 when it just repeats the post title. The blog page already
 * renders the title as the h1, so leaving it in produces two h1s.
 */
function stripLeadingH1(body: string, title: string): string {
  const lines = body.split("\n");
  let i = 0;
  while (i < lines.length && lines[i].trim() === "") i++;
  if (i >= lines.length || !lines[i].startsWith("# ")) return body;

  const heading = lines[i].slice(2).trim();
  // Same title, or the heading is a strict prefix of it ("Tech Radar - 2026-09-30"
  // vs "Tech Radar - 2026-09-30 10:29"), so it adds nothing the header lacks.
  const norm = (s: string) => s.replace(/\s+/g, " ").toLowerCase();
  if (norm(heading) === norm(title) || norm(title).startsWith(norm(heading))) {
    return lines.slice(i + 1).join("\n").replace(/^\n+/, "");
  }
  return body;
}

/** First real paragraph, with markdown syntax removed, for the SEO excerpt. */
function buildExcerpt(content: string, limit = 200): string {
  let inFence = false;
  const paragraphs: string[] = [];
  // Digests that open with a bullet list have no prose paragraph. Keep the first
  // such line as a fallback so the excerpt is never blank.
  let fallback = "";

  for (const line of content.split(/\r?\n/)) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const t = line.trim();
    if (!t) {
      if (paragraphs.length) break;
      continue;
    }
    // Skip headings, list bullets, blockquotes and table rows.
    if (/^(#{1,6}\s|[-*+]\s|>|\|)/.test(t)) {
      if (!fallback && /^(?:[-*+]\s)/.test(t)) fallback = t.replace(/^[-*+]\s*(?:\*\*)?/, "").replace(/\*\*$/, "");
      continue;
    }
    paragraphs.push(t);
  }

  if (!paragraphs.length && !fallback) return "";
  const collected = paragraphs.length ? paragraphs : [fallback];

  const text = collected
    .join(" ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1") // images -> alt text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // links -> label
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > limit * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

export function parseDigest(raw: string, filename?: string): Digest {
  const text = raw.replace(/^﻿/, "").replace(/\r\n/g, "\n");
  const match = FM_RE.exec(text);

  const fm = match ? parseFrontmatter(match[1]) : {};
  const body = match ? text.slice(match[0].length) : text;

  // The filename is authoritative for the date: it is stamped in local time by
  // the radar, so this keeps the post aligned with the day it was generated
  // rather than whatever timezone the server happens to be in.
  const fromName = filename?.match(/(\d{4}-\d{2}-\d{2})/)?.[1];
  const fmDate = typeof fm.date === "string" ? fm.date.slice(0, 10) : "";
  const date = (fromName && /^\d{4}-\d{2}-\d{2}$/.test(fromName) ? fromName : "") || fmDate;

  const rawTitle = typeof fm.title === "string" ? fm.title : "";
  // Fall back to the first H1 so a body-only post still gets a sensible title.
  const heading = /^#\s+(.+)$/m.exec(body)?.[1]?.trim() ?? "";
  const title = rawTitle || heading || "Tech Radar";

  const fmTags = Array.isArray(fm.tags) ? fm.tags : typeof fm.tags === "string" && fm.tags ? [fm.tags] : [];

  return {
    title,
    date,
    content: stripLeadingH1(body, title),
    excerpt: buildExcerpt(stripLeadingH1(body, title)),
    tags: fmTags.length ? fmTags : ["tech-radar"],
  };
}