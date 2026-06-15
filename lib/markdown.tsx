import type { Components } from "react-markdown";

export const markdownComponents: Components = {
  a: ({ href, children, ...props }) => {
    const isExternal = typeof href === "string" && (href.startsWith("http") || href.startsWith("//"));
    return (
      <a href={href} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noopener noreferrer" : undefined} {...props}>
        {children}
      </a>
    );
  },
};
