import './confirm-action.scss';

import Modal from './../Modal/Modal';

function ConfirmAction({ isOpen, onRequestClose, onConfirm, message = 'Are you sure?' }) {
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <div className="confirm-action background">
        <p className="confirm-message text">{message}</p>
        <div className="confirm-actions">
          <button className="reject text" onClick={onRequestClose}>
            Reject
          </button>
          <button className="confirm text" onClick={onConfirm}>
            Approve
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmAction;
