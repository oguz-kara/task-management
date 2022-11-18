import React from 'react';
import './modal.scss';

function Modal({ isOpen, onAfterOpen, onRequestClose, children }) {
  function modalClasses() {
    return isOpen ? 'modal modal--active' : 'modal modal--deactive';
  }

  function handleModalClick(e) {
    onRequestClose();
  }

  function checkChildren(children) {
    if (React.Children.count(children) > 1 || React.Children.count(children) < 1) {
      throw new Error('Modal cannot take more then one children');
    }
  }

  return (
    <div className={modalClasses()} onClick={(e) => handleModalClick(e)}>
      {checkChildren(children)}
      {children}
    </div>
  );
}

export default Modal;
