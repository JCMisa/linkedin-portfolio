"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders a chatbot reply as Markdown. Loaded on demand (next/dynamic) so
 * react-markdown + remark-gfm stay out of every page's initial bundle.
 */
export default function BotMarkdown({ text }: { text: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <p className="mb-0 last:mb-0">{children}</p>,
        strong: ({ children }) => (
          <strong className="font-bold text-blue-500 dark:text-blue-400">
            {children}
          </strong>
        ),
        ul: ({ children }) => (
          <ul className="my-2 ml-4 list-disc">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="my-2 ml-4 list-decimal">{children}</ol>
        ),
        li: ({ children }) => <li className="mb-1">{children}</li>,
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {children}
          </a>
        ),
        code: ({ children }) => (
          <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-800">
            {children}
          </code>
        ),
      }}
    >
      {text}
    </ReactMarkdown>
  );
}
