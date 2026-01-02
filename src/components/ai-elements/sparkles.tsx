import { cn } from "@/lib/utils";
import type { SVGProps } from "react";

export type SparklesProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export function Sparkles({ size = 24, className, ...props }: SparklesProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("text-accent", className)}
      {...props}
    >
      {/* Main large sparkle */}
      <path
        d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
        fill="url(#sparkle-gradient)"
      />
      {/* Small sparkle top-right */}
      <path
        d="M19 3L19.75 5.25L22 6L19.75 6.75L19 9L18.25 6.75L16 6L18.25 5.25L19 3Z"
        fill="url(#sparkle-gradient)"
      />
      {/* Small sparkle bottom-left */}
      <path
        d="M6 15L6.5 16.5L8 17L6.5 17.5L6 19L5.5 17.5L4 17L5.5 16.5L6 15Z"
        fill="url(#sparkle-gradient)"
      />
      <defs>
        <linearGradient id="sparkle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--gradient-from)" />
          <stop offset="100%" stopColor="var(--gradient-to)" />
        </linearGradient>
      </defs>
    </svg>
  );
}
