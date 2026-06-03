import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement>
> & {
  variant?: "primary" | "secondary" | "danger";
};

const variants = {
  primary:
    "bg-blue-600 text-white border-black hover:bg-blue-700 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
  secondary:
    "bg-white text-black border-black hover:bg-slate-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
  danger:
    "bg-red-600 text-white border-black hover:bg-red-700 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
};

export function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center border-2 px-4 py-2 text-sm font-bold uppercase tracking-tight shadow-brutal-sm transition-all duration-75 focus:outline-none focus-visible:outline-3 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-60 disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:shadow-brutal-sm ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
