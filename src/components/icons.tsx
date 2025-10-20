import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 5v14" />
      <path d="M18 5v14" />
      <path d="M6 12H2" />
      <path d="M12 12h-2" />
      <path d="M18 12h-2" />
      <path d="M22 12h-2" />
      <path d="M4 5v14" />
    </svg>
  );
}
