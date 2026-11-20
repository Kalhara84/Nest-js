interface Props {
  title: string;
  message: string;
  confirmText?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ title, message, confirmText = 'Delete', busy, onConfirm, onCancel }: Props) {
  return (
    <div className="modal-backdrop-lite" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="d-flex align-items-center gap-2 mb-2">
          <i className="bi bi-exclamation-triangle-fill text-danger fs-5" />
          <h5 className="m-0">{title}</h5>
        </div>
        <p className="text-muted">{message}</p>
        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-light" onClick={onCancel} disabled={busy}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={busy}>
            {busy ? 'Deleting...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
