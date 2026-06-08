import raw from "./projects.json";

export interface ProjectRequirements {
  stakeholders?: string[];
  endUsers?: string[];
  operational?: string[];
  regulatory?: string[];
}

export interface ProjectImpact {
  social?: string;
  economic?: string;
  environmental?: string;
  technological?: string;
}

export interface Project {
  id: string;
  name: string;
  shortDescription: string;
  features: string[];
  requirements: ProjectRequirements;
  impact: ProjectImpact;
  primaryCategory: string;
  secondaryCategories: string[];
  track: "business" | "enterprise" | "engineering" | string;
}

const dataset = raw as unknown as {
  schemaVersion: string;
  generated: string;
  targetCount: number;
  projects: Project[];
};

// Auto-populate the date with today's system date for every project.
const TODAY = new Date().toISOString().slice(0, 10);

export const PROJECTS: (Project & { dateAdded: string })[] = dataset.projects.map((p) => ({
  ...p,
  dateAdded: TODAY,
}));

export const META = {
  schemaVersion: dataset.schemaVersion,
  generated: dataset.generated,
};

export const PRIMARY_CATEGORIES = Array.from(
  new Set(PROJECTS.map((p) => p.primaryCategory)),
).sort();

export const SECONDARY_CATEGORIES = Array.from(
  new Set(PROJECTS.flatMap((p) => p.secondaryCategories ?? [])),
).sort();

export const ALL_CATEGORIES = Array.from(
  new Set([...PRIMARY_CATEGORIES, ...SECONDARY_CATEGORIES]),
).sort();

export const TRACKS = ["business", "enterprise", "engineering"] as const;

// Course categories the hub supports
export const COURSE_CATEGORIES: { id: string; label: string; match: string[] }[] = [
  { id: "oop", label: "Object Oriented Programming", match: ["enterprise", "fintech", "legaltech"] },
  { id: "web", label: "Web Development", match: ["e-commerce", "edtech", "proptech"] },
  { id: "requirements", label: "Software Requirements", match: ["enterprise", "healthcare", "legaltech"] },
  { id: "testing", label: "Software Testing", match: ["fintech", "cybersecurity", "healthcare"] },
  { id: "spm", label: "Software Project Management", match: ["enterprise", "supply chain", "proptech"] },
  { id: "mobile", label: "Mobile Development", match: ["agriculture", "healthcare", "edtech"] },
  { id: "cep", label: "Complex Engineering Problems", match: ["energy", "climate tech", "transportation", "smart cities"] },
  { id: "maintenance", label: "Software Maintenance", match: ["enterprise", "supply chain"] },
  { id: "infosec", label: "Information Security", match: ["cybersecurity", "fintech"] },
  { id: "dbms", label: "Database Management System", match: ["supply chain", "healthcare", "e-commerce"] },
  { id: "networks", label: "Computer Networking", match: ["smart cities", "cybersecurity", "transportation"] },
  { id: "ai", label: "Artificial Intelligence", match: ["artificial intelligence", "biotech", "medicine"] },
  { id: "metrics", label: "Software Metrics", match: ["enterprise", "fintech"] },
];

export function projectsForCourse(courseId: string) {
  const course = COURSE_CATEGORIES.find((c) => c.id === courseId);
  if (!course) return [];
  return PROJECTS.filter(
    (p) =>
      course.match.includes(p.primaryCategory) ||
      (p.secondaryCategories ?? []).some((s) => course.match.includes(s)),
  );
}
