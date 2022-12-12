import { motion } from 'framer-motion';
import './modal.scss';

function Modal({ isOpen, onRequestClose, children }) {
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

  const handleModalClick = () => {
    onRequestClose();
  };

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
