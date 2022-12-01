import React, { useEffect } from 'react';
import './modal.scss';

function Modal({ isOpen, onAfterOpen, onRequestClose, children }) {
  function handleModalClick(e) {
    onRequestClose();
  }

  function checkChildren(children) {
    if (React.Children.count(children) > 1 || React.Children.count(children) < 1) {
      throw new Error('Modal cannot take more then one children');
    }
  }

  useEffect(() => {
    checkChildren(children);
  }, [children]);

  return (
    <div
      className={`overlay${isOpen ? ' overlay--active' : ''} `}
      onClick={(e) => handleModalClick(e)}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`modal ${isOpen ? 'modal--active' : ''}`}>
        {children}
      </div>
    </div>
  );
}

export default Modal;
