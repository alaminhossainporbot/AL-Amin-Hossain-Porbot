// Data types for the portfolio website
export interface PersonalInfo {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  profileImageUrl: string;
  cvFileUrl: string;
}

export interface Skill {
  name: string;
  level: number; // 1-100
  category: string;
  icon?: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  imageUrl?: string;
  credentialUrl?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  demoUrl?: string;
  githubUrl?: string;
  tags: string[];
  category: string;
  date: string;
  status: 'Completed' | 'Ongoing' | 'Planned';
  featured: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  imageUrl?: string;
  publishDate: string;
  readingTime: number;
  tags: string[];
  externalUrl?: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    facebook?: string;
  };
}

export interface GoogleSheetsData {
  personalInfo: PersonalInfo;
  skills: Skill[];
  certificates: Certificate[];
  projects: Project[];
  blogPosts: BlogPost[];
  contactInfo: ContactInfo;
}