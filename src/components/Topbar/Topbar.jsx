import { useState } from 'react';
import { UilEllipsisV } from '@iconscout/react-unicons';
import './topbar.scss';
import Modal from '../Modal/Modal';
import { UilBars } from '@iconscout/react-unicons';
import NewTask from '../NewTask/NewTask';

function Topbar({ openSidebar, hideMenuIcon = true }) {
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <>
      <header className="topbar text background-2">
        <h2>
          {hideMenuIcon && (
            <button onClick={openSidebar} className="text">
              <UilBars size={40} />
            </button>
          )}
          Platform Launch
        </h2>
        <div className="actions">
          <button onClick={openModal} className="new-task-button background-primary text">
            + add new task
          </button>
          <button className="menu-icon text-static">
            <UilEllipsisV />
          </button>
        </div>
      </header>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <NewTask />
      </Modal>
    </>
  );
}

export default Topbar;
