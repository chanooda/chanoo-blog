import type { Components } from "react-markdown";

export const Blockquote: Components["blockquote"] = (props) => {
  return <blockquote {...props} />;
};

export const H1: Components["h1"] = (props) => {
  return <h1 {...props} />;
};

export const H2: Components["h2"] = (props) => {
  return <h2 {...props} />;
};

export const H3: Components["h3"] = (props) => {
  return <h3 {...props} />;
};

export const H4: Components["h4"] = (props) => {
  return <h4 {...props} />;
};

export const H5: Components["h5"] = (props) => {
  return <h5 {...props} />;
};

export const H6: Components["h6"] = (props) => {
  return <h6 {...props} />;
};

export const P: Components["p"] = (props) => {
  return <p {...props} />;
};
