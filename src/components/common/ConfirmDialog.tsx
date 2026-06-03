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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="neo-card w-full max-w-sm bg-blue-100 p-6 dark:bg-slate-800">
        <h2 className="text-xl font-black uppercase text-slate-950 dark:text-slate-100">
          {title}
        </h2>
        <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          {message}
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            className="neo-button bg-[#fffdf7] dark:bg-slate-800 dark:text-slate-100"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="neo-button bg-red-300 dark:text-slate-950"
            onClick={onConfirm}
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
