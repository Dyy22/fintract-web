import type { PropsWithChildren } from "react";

type CardProps = PropsWithChildren<{
  className?: string;
}>;

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`border-2 border-black bg-white p-5 shadow-brutal dark:border-brutal-dark-border dark:bg-brutal-dark-surface dark:text-brutal-dark-text ${className}`}
    >
      {children}
    </div>
  );
}
