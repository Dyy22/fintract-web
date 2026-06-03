export function ConfirmDialog({
  open,
  title,
  message,
  buttonLabel = "Deactivate",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  buttonLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm border-2 border-black bg-white p-6 shadow-brutal dark:border-brutal-dark-border dark:bg-brutal-dark-surface">
        <h2 className="text-lg font-extrabold uppercase tracking-tight">
          {title}
        </h2>
        <p className="mt-2 text-sm font-medium text-black/70 dark:text-brutal-dark-muted">
          {message}
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            className="border-2 border-black px-4 py-2 text-sm font-bold uppercase tracking-tight shadow-brutal-sm hover:bg-slate-100 dark:border-brutal-dark-border"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="border-2 border-black bg-red-600 px-4 py-2 text-sm font-bold uppercase tracking-tight text-white shadow-brutal-sm hover:bg-red-700"
            onClick={onConfirm}
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
