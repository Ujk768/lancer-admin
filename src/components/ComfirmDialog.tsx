import { useEffect, useState } from "react";

// Confirmation modal. For high-consequence deletions (removing a TLC activity
// that students log against) it requires typing the item's name before the
// destructive button unlocks.

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  danger = false,
  typeToConfirm = null, // string the user must type, or null
  onConfirm,
  onCancel,
}:{
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    danger?: boolean;
    typeToConfirm?: string | null;
    onConfirm: () => void;
    onCancel: () => void;
}) {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (open) setTyped("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  const locked = typeToConfirm && typed.trim() !== typeToConfirm;

  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title}>
        <h3>{title}</h3>
        <p>{message}</p>
        {typeToConfirm && (
          <>
            <p style={{ marginTop: 14, fontSize: 13 }}>
              Type <b style={{ color: "var(--navy-800)" }}>{typeToConfirm}</b> to confirm.
            </p>
            <input
              className="confirm-input"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder={typeToConfirm}
              autoFocus
            />
          </>
        )}
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button
            className={`btn ${danger ? "btn-danger" : "btn-navy"}`}
            disabled={locked || false}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
