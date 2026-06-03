import type { PropsWithChildren } from "react";

type CardProps = PropsWithChildren<{
  className?: string;
}>;

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-base flex flex-col shadow-shadow border-2 gap-6 py-6 border-border bg-secondary-background text-foreground font-base ${className}`}
    >
      {children}
    </div>
  );
}
