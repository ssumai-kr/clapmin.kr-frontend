export interface PostSummary {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  tags: string[];
  view_count: number;
  created_at: string;
  updated_at: string | null;
}

export interface PostDetail extends PostSummary {
  content: string;
  like_count: number;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  github_url: string | null;
  live_url: string | null;
  image_url: string | null;
  image_contain: boolean;
  order: number;
  created_at: string;
  updated_at: string | null;
}
