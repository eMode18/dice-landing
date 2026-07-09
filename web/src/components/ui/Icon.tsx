import React from "react";
import type { SVGProps } from "react";

const paths: Record<string, React.ReactElement> = {
  bolt: (
    <path
      d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  shield: (
    <path
      d="M12 3 4.5 6v5.2c0 4.6 3.2 8.9 7.5 10.3 4.3-1.4 7.5-5.7 7.5-10.3V6L12 3Zm-1.4 9.8 4.6-4.6 1.2 1.2-5.8 5.8-3-3 1.2-1.2 1.8 1.8Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  headset: (
    <path
      d="M4 13a8 8 0 0 1 16 0v4.5a2.5 2.5 0 0 1-2.5 2.5H16v-6h3v-1a7 7 0 0 0-14 0v1h3v6H6.5A2.5 2.5 0 0 1 4 17.5V13Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  spark: (
    <path
      d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  gauge: (
    <path
      d="M4 14a8 8 0 1 1 16 0M12 14l4-5M4 14h2M18 14h2M12 14h0"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  wave: (
    <path
      d="M3 12c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0 3.5 2 5 0M3 17c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0 3.5 2 5 0"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  check: <path d="m5 12 5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />,
  star: (
    <path
      d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.3l6.1-.7L12 3Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  chevron: <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />,
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />,
  wifi: (
    <path
      d="M5 9.5a11 11 0 0 1 14 0M7.8 12.7a7 7 0 0 1 8.4 0M10.6 15.9a3 3 0 0 1 2.8 0M12 19h.01"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  device: (
    <path
      d="M4 16V9a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v7M2 16h20M9 19h6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  lock: (
    <path
      d="M7 10V7a5 5 0 0 1 10 0v3m-12 0h14v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-9Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" strokeLinejoin="round" />,
  close: <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" strokeLinejoin="round" />,
  card: (
    <path
      d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Zm0 4h18M7 15h4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  refresh: (
    <path
      d="M4 4v5h5M20 20v-5h-5M4.5 9a8 8 0 0 1 13.9-3M19.5 15a8 8 0 0 1-13.9 3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  layers: (
    <path
      d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  user: (
    <path
      d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  sun: (
    <path
      d="M12 4V2m0 20v-2M4 12H2m20 0h-2M5.6 5.6 4.2 4.2m15.6 15.6-1.4-1.4M5.6 18.4l-1.4 1.4M18.4 5.6l1.4-1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  moon: (
    <path
      d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
};

export type IconName = keyof typeof paths;

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
}

export function Icon({ name, className = "h-5 w-5", ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
