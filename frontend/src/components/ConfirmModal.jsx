export default function ConfirmModal({ onConfirm, onCancel }) {
    return (
      <div className="modal-overlay">
        <div className="modal-box">
          <p>Are you sure you want to delete this race?</p>
          <p className="modal-warning">*This action cannot be undone*</p>
  
          <div className="modal-buttons">
            <button className="modal-delete" onClick={onConfirm}>
              Yes, delete
            </button>
            <button className="modal-cancel" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }