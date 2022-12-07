import './confirm-action.scss';

import Modal from './../Modal/Modal';

function ConfirmAction({
  isOpen,
  onRequestClose,
  onConfirm,
  message = 'Are you sure?',
  title = 'Confirm title',
  style
}) {
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <div className="confirm-action background" style={style}>
        <h5>{title}</h5>
        <p className="confirm-message text">{message}</p>
        <div className="confirm-actions">
          <button className="reject" onClick={onRequestClose}>
            Reject
          </button>
          <button className="confirm" onClick={onConfirm}>
            Approve
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmAction;
