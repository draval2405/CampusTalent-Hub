
export enum ExperienceLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
  EXPERT = 'Expert'
}

export interface Project {
  title: string;
  description: string;
  link?: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  university: string;
  headline: string;
  skills: string[];
  experience_level: ExperienceLevel;
  projects: Project[];
  availability: 'Available' | 'Busy' | 'Looking for Teammates';
  avatar: string;
}

export interface AIRecommendation {
  name: string;
  headline: string;
  skills: string[];
  experience_level: string;
  projects: string[];
  availability: string;
  match_reason: string;
}
