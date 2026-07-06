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
    <Component className={`mx-auto w-full max-w-[1440px] px-6 sm:px-8 lg:px-12 xl:px-20 ${className}`}>
      {children}
    </Component>
  );
}
