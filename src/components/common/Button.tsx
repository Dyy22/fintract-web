import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement>
> & {
  variant?: "primary" | "secondary" | "danger";
};

const variants = {
  primary:
    "bg-blue-600 text-main-foreground border-border hover:bg-blue-700 active:translate-x-boxShadowX active:translate-y-boxShadowY active:shadow-none",
  secondary:
    "bg-secondary-background text-foreground border-border hover:bg-blue-100 active:translate-x-boxShadowX active:translate-y-boxShadowY active:shadow-none",
  danger:
    "bg-red-600 text-main-foreground border-border hover:bg-red-700 active:translate-x-boxShadowX active:translate-y-boxShadowY active:shadow-none",
};

export function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center border-2 px-4 py-2 text-sm font-bold uppercase tracking-tight shadow-shadow-sm transition-all duration-75 focus-visible:outline-2 focus-visible:outline-border disabled:cursor-not-allowed disabled:opacity-60 disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:shadow-shadow-sm ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
