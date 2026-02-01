import { cn } from "@ui/lib/utils";
import type { Components } from "react-markdown";
import styles from "../style.module.css";

export const Img: Components["img"] = ({ src, alt, className, ...props }) => {
  return (
    <span className="flex w-full justify-center">
      <img
        alt={alt}
        className={cn(styles["markdown-img"], className)}
        src={src}
        {...props}
      />
    </span>
  );
};
