import type { PropsWithChildren } from "react";

type CardProps = PropsWithChildren<{
  className?: string;
}>;

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`border-2 border-border bg-secondary-background p-5 shadow-shadow ${className}`}
    >
      {children}
    </div>
  );
}
