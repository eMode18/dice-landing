import type { ElementType, ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

/** Centers content with the site's responsive max-width and side gutters. */
export function Container({ children, className = "", as: Tag = "div" }: ContainerProps) {
  const Component = Tag as ElementType;
  return (
    <Component className={`mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-10 ${className}`}>
      {children}
    </Component>
  );
}
