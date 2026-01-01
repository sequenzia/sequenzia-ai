// Social link for various platforms
export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

// Bio/About section
export interface BioContent {
  name: string;
  title: string;
  location: string;
  photoUrl: string;
  summary: string;
  highlights: string[];
  socialLinks: SocialLink[];
}

// Work experience item
export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string | "Present";
  description: string;
  achievements: string[];
  technologies: string[];
  logoUrl?: string;
}

// Project item
export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  imageUrl: string;
  technologies: string[];
  category: string;
  links: {
    live?: string;
    github?: string;
    caseStudy?: string;
  };
  featured: boolean;
  date: string;
}

// Education item
export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string[];
  logoUrl?: string;
}

// Individual skill
export interface Skill {
  name: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
  yearsOfExperience?: number;
  icon?: string;
}

// Skill category grouping
export interface SkillCategory {
  name: string;
  skills: Skill[];
}

// Contact information
export interface ContactInfo {
  email: string;
  phone?: string;
  calendlyUrl?: string;
  formEnabled: boolean;
  socialLinks: SocialLink[];
}

// Complete portfolio content
export interface PortfolioContent {
  bio: BioContent;
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  skills: SkillCategory[];
  contact: ContactInfo;
}

// Portfolio view types (for tool parameter)
export type PortfolioViewType =
  | "bio"
  | "experience"
  | "projects"
  | "education"
  | "skills"
  | "contact";
