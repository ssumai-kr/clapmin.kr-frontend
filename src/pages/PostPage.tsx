import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { posts } from "../data/posts";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const mdComponents: Components = {
  h2: ({ children }) => (
    <h2 className="mb-5 mt-14 border-b border-border pb-3 text-2xl font-bold tracking-tight text-foreground first:mt-0">
      {children}
    </h2>
  ),

  h3: ({ children }) => (
    <h3 className="mb-3 mt-10 flex items-center gap-2.5 text-lg font-bold text-foreground">
      <span className="h-5 w-1 flex-shrink-0 rounded-full bg-foreground" />
      {children}
    </h3>
  ),

  h4: ({ children }) => (
    <h4 className="mb-2 mt-6 text-base font-semibold text-foreground">
      {children}
    </h4>
  ),

  p: ({ children }) => (
    <p className="mb-5 text-base leading-[1.9] text-foreground/75">
      {children}
    </p>
  ),

  ul: ({ children }) => <ul className="my-5 space-y-2">{children}</ul>,

  ol: ({ children }) => <ol className="my-5 space-y-2">{children}</ol>,

  li: ({ children }) => (
    <li className="flex items-start gap-3 text-base leading-relaxed text-foreground/75">
      <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-muted-foreground" />
      <span>{children}</span>
    </li>
  ),

  code: ({ children }) => {
    const isBlock = String(children).includes("\n");
    if (isBlock) {
      return (
        <code className="font-mono text-sm leading-relaxed text-foreground">
          {children}
        </code>
      );
    }
    return (
      <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground">
        {children}
      </code>
    );
  },

  pre: ({ children }) => (
    <div className="my-7 overflow-hidden rounded-xl border border-border">
      <pre className="overflow-x-auto bg-muted/60 p-5 text-sm leading-relaxed">
        {children}
      </pre>
    </div>
  ),

  blockquote: ({ children }) => (
    <blockquote className="my-6 rounded-r-lg border-l-4 border-foreground/30 bg-muted/40 px-5 py-4 text-muted-foreground">
      {children}
    </blockquote>
  ),

  hr: () => (
    <div className="my-12 flex items-center gap-4">
      <div className="h-px flex-1 bg-border" />
      <span className="text-xs text-muted-foreground/50">• • •</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  ),

  table: ({ children }) => (
    <div className="my-8 overflow-hidden rounded-xl border border-border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">{children}</table>
      </div>
    </div>
  ),

  thead: ({ children }) => (
    <thead className="bg-foreground text-background">{children}</thead>
  ),

  tbody: ({ children }) => (
    <tbody className="divide-y divide-border">{children}</tbody>
  ),

  tr: ({ children }) => (
    <tr className="transition-colors hover:bg-muted/40">{children}</tr>
  ),

  th: ({ children }) => (
    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">
      {children}
    </th>
  ),

  td: ({ children }) => (
    <td className="px-5 py-3.5 text-foreground/75">{children}</td>
  ),

  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),

  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-foreground underline decoration-border underline-offset-2 transition-colors hover:decoration-foreground"
    >
      {children}
    </a>
  ),
};

export default function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = posts.find((p) => p.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="mx-auto max-w-3xl px-4 pb-16 pt-28 sm:px-6">
          <p className="text-muted-foreground">Post not found.</p>
          <Link
            to="/"
            className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </main>
      </div>
    );
  }

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 pb-24 pt-28 sm:px-6">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <header className="mb-12">
          <div className="mb-4 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
          <h1 className="mb-5 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
            {post.title}
          </h1>
          <p className="mb-4 text-base leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <time>{formattedDate}</time>
          </div>
        </header>

        <article>
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
            {post.content}
          </ReactMarkdown>
        </article>
      </main>
      <Footer />
    </div>
  );
}
