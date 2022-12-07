import React, { useEffect } from 'react';
import './modal.scss';
import { motion } from 'framer-motion';

function Modal({ isOpen, onAfterOpen, onRequestClose, children }) {
  const opened = {
    opacity: 1,
    translateY: 0,
    pointerEvents: 'all'
  };

  const closed = {
    opacity: 0,
    translateY: 10,
    pointerEvents: 'none'
  };

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
      <motion.div
        transition={{ ease: 'easeIn', duration: 0.01 }}
        initial={closed}
        animate={isOpen ? opened : closed}
        exit={closed}
        onClick={(e) => e.stopPropagation()}
        className="modal">
        {children}
      </motion.div>
    </div>
  );
}

export default Modal;
