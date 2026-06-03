import type { ReactNode } from "react";

type NeoPageHeaderProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export function NeoPageHeader({
  title,
  description,
  eyebrow,
  icon,
  actions,
  className = "",
}: NeoPageHeaderProps) {
  return (
    <div
      className={`neo-card flex flex-col justify-between gap-4 bg-blue-100 p-5 dark:bg-slate-800 sm:flex-row sm:items-center ${className}`}
    >
      <div className="flex min-w-0 items-start gap-4">
        {icon ? (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border-2 border-slate-950 bg-emerald-200 text-2xl font-black text-slate-950 shadow-[3px_3px_0_0_#101828] dark:border-slate-100 dark:bg-blue-300 dark:shadow-[3px_3px_0_0_#f8fafc]">
            {icon}
          </div>
        ) : null}
        <div className="min-w-0">
          {eyebrow ? (
            <p className="mb-1 text-xs font-black uppercase tracking-[0.18em] text-slate-600 dark:text-slate-200">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-2xl font-black uppercase text-slate-950 dark:text-slate-100 sm:text-3xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-1 max-w-2xl text-sm font-semibold text-slate-600 dark:text-slate-200">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {actions ? <div className="flex flex-wrap gap-2 sm:justify-end">{actions}</div> : null}
    </div>
  );
}
