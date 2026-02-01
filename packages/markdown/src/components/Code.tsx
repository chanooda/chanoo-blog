import type { Components } from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export const Code: Components["code"] = ({
  node,
  className,
  children,
  ...props
}) => {
  const match = /language-(\w+)/.exec(className || "");
  return match ? (
    <SyntaxHighlighter
      {...props}
      ref={undefined}
      PreTag="div"
      language={match[1]}
      customStyle={{ borderRadius: "4px" }}
      style={{ ...vscDarkPlus }}
    >
      {String(children).replace(/\n$/, "") || ""}
    </SyntaxHighlighter>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};
