// types/index.ts

export interface Skill {
  id: string;
  label: string;
  category: SkillCategory;
  iconSrc: string;
  yearsOfExperience: number;
  proficiencyLevel: ProficiencyLevel;
  linkedProjectId?: string;
}

export type SkillCategory =
  | "frontend"
  | "design"
  | "security"
  | "ai"
  | "marketing";

export type ProficiencyLevel =
  | "learning"
  | "competent"
  | "proficient"
  | "expert";

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  problemStatement: string;
  solutionSummary: string;
  results: string[];
  techStack: string[];
  thumbnailSrc: string;
  liveDemoUrl?: string;
  githubUrl?: string;
  category: ProjectCategory;
  featured: boolean;
}

export type ProjectCategory =
  | "web"
  | "design"
  | "security"
  | "ai"
  | "marketing";

export interface Certification {
  id: string;
  label: string;
  issuingBody: string;
  status: CertStatus;
  badgeImageSrc?: string;
  verifyUrl?: string;
  targetDate?: string;
  notes?: string;
}

export type CertStatus =
  | "earned"
  | "in-progress"
  | "planned";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

export interface ContactFormPayload {
  senderName: string;
  senderEmail: string;
  messageBody: string;
  submittedAt: string;
}

export interface NavLink {
  label: string;
  href: string;
}
