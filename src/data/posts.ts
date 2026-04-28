import npmVsPnpmVsYarnContent from "../content/posts/npm-vs-pnpm-vs-yarn.md?raw";

export interface Post {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  slug: string;
  content: string;
}

export const posts: Post[] = [
  {
    id: "1",
    title: "npm vs pnpm vs yarn — A Deep Dive into JavaScript Package Managers",
    date: "2026-04-28",
    excerpt:
      "A thorough technical comparison of npm, Yarn, and pnpm: how each tool works under the hood, why phantom dependencies exist, how pnpm's content-addressable store eliminates disk waste, and when to choose each tool.",
    tags: ["npm", "pnpm", "yarn", "node.js", "package-manager"],
    slug: "npm-vs-pnpm-vs-yarn",
    content: npmVsPnpmVsYarnContent,
  },
];
