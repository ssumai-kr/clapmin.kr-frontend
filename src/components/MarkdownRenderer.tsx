import ReactMarkdown, { defaultUrlTransform } from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components, UrlTransform } from "react-markdown";

/**
 * 기본 urlTransform은 http(s)·mailto 등만 통과시키고 `data:`는 빈 문자열로 지운다.
 * 에디터가 붙여넣은 이미지를 data URI로 인라인하므로 img의 src에 한해 허용한다.
 * (script가 실행되지 않는 <img> 컨텍스트라 svg data URI도 안전하다.)
 */
const urlTransform: UrlTransform = (value, key, node) => {
  if (key === "src" && node.tagName === "img" && /^data:image\//i.test(value)) {
    return value;
  }
  return defaultUrlTransform(value);
};

const mdComponents: Components = {
  h2: ({ children }) => (
    <h2 className="mb-5 mt-14 break-words border-b border-white/[0.07] pb-3 text-[18px] font-medium tracking-[-0.01em] text-white first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-3 mt-10 break-words text-[15.5px] font-medium text-white">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="mb-2 mt-6 break-words text-[14px] font-medium text-white/85">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="mb-5 break-words text-[14.5px] leading-[1.85] text-white/60 [text-wrap:pretty]">
      {children}
    </p>
  ),
  ul: ({ children }) => <ul className="my-5 space-y-2">{children}</ul>,
  ol: ({ children }) => <ol className="my-5 space-y-2">{children}</ol>,
  li: ({ children }) => (
    <li className="flex items-start gap-3 text-[14.5px] leading-[1.8] text-white/60">
      <span className="mt-[10px] h-1 w-1 flex-shrink-0 rounded-full bg-white/30" />
      <span className="min-w-0 break-words">{children}</span>
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
      <code className="break-words rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <div className="my-7 max-w-full overflow-hidden rounded-xl border border-border">
      <pre className="overflow-x-auto overscroll-x-contain bg-muted/60 p-4 text-[13px] leading-relaxed sm:p-5 sm:text-sm">
        {children}
      </pre>
    </div>
  ),
  img: ({ src, alt, title }) => (
    <img
      src={typeof src === "string" ? src : undefined}
      alt={alt ?? ""}
      title={title}
      loading="lazy"
      className="my-7 block h-auto w-full rounded-xl border border-white/[0.07]"
    />
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-6 break-words rounded-r-lg border-l-4 border-foreground/30 bg-muted/40 px-5 py-4 text-muted-foreground">
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
    <div className="my-8 max-w-full overflow-hidden rounded-xl border border-border">
      <div className="overflow-x-auto overscroll-x-contain">
        <table className="w-full text-sm">{children}</table>
      </div>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-[#2B2B2B] text-white/70">{children}</thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-white/[0.07]">{children}</tbody>
  ),
  tr: ({ children }) => (
    <tr className="transition-colors hover:bg-white/[0.03]">{children}</tr>
  ),
  th: ({ children }) => (
    <th className="whitespace-nowrap px-4 py-3 text-left font-mono text-[11px] font-normal uppercase tracking-[0.12em]">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 text-[13.5px] text-white/60">{children}</td>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="break-words text-foreground underline decoration-border underline-offset-2 transition-colors hover:decoration-foreground"
    >
      {children}
    </a>
  ),
};

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={mdComponents}
      urlTransform={urlTransform}
    >
      {content}
    </ReactMarkdown>
  );
}
