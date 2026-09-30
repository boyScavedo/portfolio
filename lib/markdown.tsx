import type { Components } from "react-markdown";

// `node` is the hast element react-markdown hands every component. Spreading it
// onto a DOM node serialises as node="[object Object]", which reached the live
// site on every external link until both components below destructured it out.
export const markdownComponents: Components = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  a: ({ href, children, node, ...props }) => {
    const isExternal = typeof href === "string" && (href.startsWith("http") || href.startsWith("//"));
    return (
      <a href={href} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noopener noreferrer" : undefined} {...props}>
        {children}
      </a>
    );
  },
  // Story images are hotlinked from whichever publisher wrote the source, so
  // we never learn their intrinsic size and next/image has nothing to size
  // them with. Plain img is the honest call. Lazy matters: a digest carries
  // one of these per story and they all sit below the fold.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  img: ({ src, alt, node, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={typeof src === "string" ? src : ""}
      alt={alt ?? ""}
      loading="lazy"
      decoding="async"
      className="my-6 h-auto w-full rounded-[2px] border border-[#1a1a1a]"
      {...props}
    />
  ),
};
