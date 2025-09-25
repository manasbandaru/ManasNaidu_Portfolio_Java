// Core portfolio data types
export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone?: string;
  location: string;
  summary: string;
  profileImage?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface Skill {
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'tools' | 'testing' | 'monitoring' | 'ai' | 'other';
  proficiency: 1 | 2 | 3 | 4 | 5; // 1-5 scale
  yearsOfExperience?: number;
}

export interface SkillCategory {
  name: string;
  skills: Skill[];
  icon?: string;
  description?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured: boolean;
  startDate: string;
  endDate?: string;
  status: 'completed' | 'in-progress' | 'planned';
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  location?: string;
  gpa?: number;
  achievements?: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Main portfolio data structure
export interface PortfolioData {
  personalInfo: PersonalInfo;
  socialLinks: SocialLink[];
  skills: Skill[];
  projects: Project[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
}

// UI and component types
export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
}

export interface AnimationConfig {
  duration: number;
  delay: number;
  easing: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
}