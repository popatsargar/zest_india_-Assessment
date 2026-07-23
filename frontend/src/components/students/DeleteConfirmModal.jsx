import Button from "../common/Button";

function DeleteConfirmModal({ isOpen, student, isDeleting, onClose, onConfirm }) {
  if (!isOpen || !student) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-soft"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="delete-modal-title" className="font-heading text-xl font-bold text-ink">
          Delete Student
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Are you sure you want to delete <strong>{student.name}</strong>? This action cannot be
          undone.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={isDeleting}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
