export type Role = 'user' | 'admin';

export type ContentType =
  | 'article'
  | 'video'
  | 'pdf'
  | 'excel'
  | 'csv'
  | 'image'
  | 'case_study'
  | 'company_analysis'
  | 'market_analysis'
  | 'educational_note'
  | 'external_resource';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  bio?: string;
  bookmarks?: string[];
  createdAt: string;
}

export interface Plan {
  _id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  description: string;
  features: string[];
  badge?: string;
  popular?: boolean;
  active: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Order {
  _id: string;
  orderId: string;
  paymentId?: string;
  planId: Plan;
  planName: string;
  amount: number;
  currency: string;
  status: 'created' | 'paid' | 'failed';
  customerEmail?: string;
  customerName?: string;
  contentId?: Content;
  receiptToken?: string;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image?: string;
  contentCount?: number;
}

export interface StructuredDetails {
  companyName?: string;
  ticker?: string;
  sector?: string;
  industry?: string;
  businessModel?: string;
  revenueSources?: string[];
  competitiveAdvantages?: string[];
  risks?: string[];
  financialHighlights?: string;
  lessonsLearned?: string[];
  problems?: string;
  solutions?: string;
}

export interface Content {
  _id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  contentType: ContentType;
  category: Category;
  subcategory?: string;
  tags: string[];
  thumbnail: string;
  mediaUrl?: string;
  mediaDetails?: {
    originalName?: string;
    cloudinaryPublicId?: string;
    format?: string;
    size?: number;
    mimeType?: string;
  };
  externalUrl?: string;
  author?: {
    _id: string;
    name: string;
    avatar?: string;
    bio?: string;
  };
  authorName?: string;
  featured: boolean;
  published: boolean;
  publishedAt?: string;
  views: number;
  downloadsCount?: number;
  bookmarkCount: number;
  readTimeMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  isPaywalled?: boolean;
  price?: number;
  structuredDetails?: StructuredDetails;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MediaItem {
  _id: string;
  originalName: string;
  cloudinaryPublicId: string;
  secureUrl: string;
  resourceType: string;
  format: string;
  size: number;
  createdAt: string;
}

export interface BookmarkItem {
  bookmarkId: string;
  savedAt: string;
  content: Content;
}

export interface ProgressItem {
  _id: string;
  contentId: Content;
  progressPercent: number;
  completed: boolean;
  lastAccessed: string;
}

export interface AdminStats {
  totalUsers: number;
  totalContent: number;
  publishedContent: number;
  draftContent: number;
  totalViews: number;
  totalMedia: number;
  categoriesCount: number;
  contentTypeCounts: Record<string, number>;
  popularContent: Array<{
    _id: string;
    title: string;
    slug: string;
    contentType: ContentType;
    views: number;
    bookmarkCount: number;
  }>;
  recentContent: Array<{
    _id: string;
    title: string;
    slug: string;
    contentType: ContentType;
    published: boolean;
    views: number;
    createdAt: string;
    category?: { name: string };
  }>;
  recentUsers: Array<{
    _id: string;
    name: string;
    email: string;
    role: Role;
    createdAt: string;
  }>;
}
