import { cn } from "@ui/lib/utils";
import type { Components } from "react-markdown";
import { convertLink } from "../markdownUtils";
import styles from "../style.module.css";
import { Github } from "./Github";

export const A: Components["a"] = ({ children, href, className, ...props }) => {
  // YouTube 링크
  if (
    href?.includes("https://youtu.be/") ||
    href?.includes("youtube.com/watch")
  ) {
    return (
      <iframe
        className={cn(
          "border-none h-auto w-full aspect-video rounded-md",
          className
        )}
        height="auto"
        src={convertLink(href)}
        title={href}
        width="100%"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  // GitHub 링크
  if (href?.includes("https://github.com/")) {
    return (
      <Github href={href} target="_blank" className={className} {...props}>
        {children}
      </Github>
    );
  }

  // 일반 링크
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(styles["markdown-a"], className)}
      {...props}
    >
      {children}
    </a>
  );
};
