import { db } from "@/db";
import { profile } from "@/db/schema";

export type Profile = typeof profile.$inferSelect;

const DEFAULT_PROFILE: Omit<Profile, "id" | "updatedAt"> = {
  name: "Jeevan Adhikari",
  role: "Full Stack Engineer",
  tagline: "Building things for the web & beyond.",
  bio: "Developer, blogger & creator. I build full-stack web applications, share what I learn, and create content about software development. Always learning, always building.",
  availabilityStatus: "available",
  currentCompany: null,
  currentCompanyUrl: null,
  workType: "fulltime",
  openToWork: true,
  location: "Nepal",
  githubUrl: "https://github.com/boyScavedo",
  youtubeUrl: null,
  twitterUrl: null,
  linkedinUrl: null,
  resumeUrl: null,
};

export async function getProfile(): Promise<Profile> {
  try {
    const rows = await db.select().from(profile).limit(1);
    if (rows.length > 0) return rows[0];
  } catch {
    // DB not yet set up — return defaults
  }
  return { id: 1, updatedAt: new Date(), ...DEFAULT_PROFILE };
}

export const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  available: { label: "Available for work", color: "#22c55e" },
  employed: { label: "Currently employed", color: "#888" },
  freelancing: { label: "Freelancing", color: "#d4f600" },
  busy: { label: "Not available", color: "#ef4444" },
  open_to_offers: { label: "Open to offers", color: "#f59e0b" },
};
