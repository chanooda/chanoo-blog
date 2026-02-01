import type { Components } from "react-markdown";
import {
  A,
  Blockquote,
  Code,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Img,
  P,
} from "./components";

export const markdownComponents: Components = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  p: P,
  code: Code,
  img: Img,
  a: A,
  blockquote: Blockquote,
};

// Re-export individual components for direct usage
export {
  A,
  Blockquote,
  Code,
  Github,
  GithubIcon,
  GithubSkeleton,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Img,
  P,
} from "./components";
