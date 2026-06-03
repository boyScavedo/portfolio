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
  techStack: ["React", "Next.js", "TypeScript", "Node.js", "Python", "PostgreSQL", "Tailwind CSS", "Docker"],
  marqueeItems: null,
  aboutParagraph2: "My focus is on building fast, accessible, and well-designed web applications. I believe in learning in public and sharing knowledge freely.",
  aboutParagraph3: "When I'm not coding, I'm exploring new technologies, writing blog posts, or filming videos about software development.",
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

export { STATUS_LABELS } from "@/lib/profile-constants";
