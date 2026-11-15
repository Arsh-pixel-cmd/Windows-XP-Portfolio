// src/types/portfolio.ts

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  impact?: string;
  tech: string[];
  details: string[];
  status: string;
  github: string;
  link: string;
  sort_order?: number;
}

export interface ProfileData {
  name: string;
  title: string;
  headline: string;
  bio: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  quote?: string;
  core_focus: string[];
  philosophy: string;
  resume_content?: string;
}

export interface SkillCategory {
  id: string;
  category: string;
  items: string[];
}

export interface ExperimentItem {
  id: string;
  tag: string;
  title: string;
  problem: string;
  approach: string;
  result: string;
}

export interface PortfolioData {
  profile: ProfileData;
  projects: ProjectItem[];
  skills: SkillCategory[];
  experiments: ExperimentItem[];
  lastSyncedAt?: number;
}

export interface CloudflareConfig {
  apiUrl: string;
  apiToken?: string;
  autoSync: boolean;
  lastSyncStatus?: 'idle' | 'success' | 'error' | 'syncing';
  lastSyncMessage?: string;
}

export interface UserSession {
  username: string;
  role: 'guest' | 'admin';
  token?: string;
  loginTime: number;
}
