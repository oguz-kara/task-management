import './confirm-action.scss';

import Modal from './../Modal/Modal';

function ConfirmAction({
  isOpen,
  onRequestClose,
  onConfirm,
  message = 'Are you sure?',
  title = 'Confirm title',
  style,
  buttons
}) {
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      {isOpen && (
        <div className="confirm-action background-2" style={style}>
          <h5 style={title.color ? { color: title.color } : {}}>{title.text}</h5>
          <p className="confirm-message text-static">{message}</p>
          <div className="confirm-actions">
            <button
              style={buttons?.approve?.style ? buttons?.approve?.style : {}}
              className={`confirm background text ${
                buttons?.approve?.className ? buttons.approve.className : ''
              }`}
              onClick={onConfirm}>
              {buttons?.approve?.text ? buttons.approve.text : 'Approve'}
            </button>
            <button
              style={buttons?.reject?.style ? buttons?.reject?.style : {}}
              className={`reject background text ${
                buttons?.reject?.className ? buttons.reject.className : ''
              }`}
              onClick={onRequestClose}>
              {buttons?.reject?.text ? buttons.reject.text : 'Reject'}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default ConfirmAction;
