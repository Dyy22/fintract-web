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
      <div className="w-full max-w-sm border-2 border-border bg-secondary-background p-6 shadow-shadow">
        <h2 className="text-lg font-extrabold uppercase tracking-tight text-foreground">
          {title}
        </h2>
        <p className="mt-2 text-sm font-medium text-foreground/70">{message}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            className="border-2 border-border bg-secondary-background px-4 py-2 text-sm font-bold uppercase tracking-tight text-foreground shadow-shadow-sm hover:bg-blue-100"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="border-2 border-border bg-red-600 px-4 py-2 text-sm font-bold uppercase tracking-tight text-main-foreground shadow-shadow-sm hover:bg-red-700"
            onClick={onConfirm}
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
