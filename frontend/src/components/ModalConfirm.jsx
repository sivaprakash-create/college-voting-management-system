import React from 'react';

const ModalConfirm = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Delete', confirmVariant = 'danger' }) => {
  if (!isOpen) return null;

  return (
    <div className="modal show d-block tab-index-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold text-dark">{title || 'Confirm Action'}</h5>
            <button type="button" className="btn-close" onClick={onCancel}></button>
          </div>
          <div className="modal-body py-3 text-secondary">
            <p className="mb-0">{message || 'Are you sure you want to proceed with this operation?'}</p>
          </div>
          <div className="modal-footer border-0 pt-0">
            <button type="button" className="btn btn-light rounded-pill px-4" onClick={onCancel}>
              Cancel
            </button>
            <button type="button" className={`btn btn-${confirmVariant} rounded-pill px-4`} onClick={onConfirm}>
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirm;
