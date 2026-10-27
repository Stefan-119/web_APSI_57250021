export type UserRole = 'student' | 'tutor' | 'admin';

export interface UserProfile {
  uid: string;
  fullName: string;
  nim?: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  categoryBadgeClass?: string;
  moduleCode: string;
  updatedDate: string;
  readTimeMinutes: number;
  summary: string;
  reference: string;
  doi?: string;
  author?: string;
  authorId?: string;
  infobox?: {
    standard: string;
    domain: string;
    firstPublished: string;
    keyDeliverables: string[];
    coreMethod: string;
    governingBody: string;
  };
  sections: {
    id: string;
    title: string;
    content: string[];
    diagramType?: 'sequence' | 'usecase' | 'erd' | 'class';
    subsections?: {
      id: string;
      title: string;
      content: string[];
    }[];
  }[];
  citations: {
    id: number;
    text: string;
    link?: string;
  }[];
  notes?: {
    id: number;
    text: string;
  }[];
}

export interface LearningPhase {
  phase: string;
  number: string;
  title: string;
  description: string;
  subtopicCount: number;
  slug: string;
  icon: string;
}

export interface LearningCategory {
  id: string;
  code: string;
  title: string;
  description: string;
  tags: string[];
  articleCount: number;
  icon: string;
  colorClass: string;
}

export interface GlossaryTerm {
  term: string;
  category: string;
  definition: string;
  example?: string;
}

export type ViewScreen = 
  | 'beranda' 
  | 'ensiklopedia' 
  | 'google-search' 
  | 'newsletter' 
  | 'diagram-studio'
  | 'glosarium'
  | 'dashboard';
