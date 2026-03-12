export interface Post {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  slug: string;
}

export const posts: Post[] = [];
