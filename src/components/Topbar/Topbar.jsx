import { useState, useContext, useEffect } from 'react';
import { UilEllipsisV } from '@iconscout/react-unicons';
import './topbar.scss';
import Modal from '../Modal/Modal';
import { UilBars } from '@iconscout/react-unicons';
import NewTask from '../NewTask/NewTask';
import { ThemeContext } from './../../context/ThemeContext';
import { BoardContext } from './../../context/BoardContext';

function Topbar({ openSidebar, hideMenuIcon = true }) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const { dark } = useContext(ThemeContext);
  const { boardState } = useContext(BoardContext);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <>
      <header
        className={`topbar text background-2 ${dark ? 'line-light' : 'line-dark'} ${
          hideMenuIcon ? 'full-width' : ''
        }`}>
        <h2>
          {hideMenuIcon && (
            <button onClick={openSidebar} className="text">
              <UilBars size={40} />
            </button>
          )}
          {boardState?.currentBoard?.name ? boardState.currentBoard.name : ''}
        </h2>
        <div className="actions">
          <button
            onClick={openModal}
            className="new-task-button primary-background"
            disabled={!(Object.keys(boardState?.currentBoard || {}).length > 0)}>
            + add new task
          </button>
          <button className="menu-icon text-static">
            <UilEllipsisV />
          </button>
        </div>
      </header>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <NewTask heading="add new task" closeModal={closeModal} />
      </Modal>
    </>
  );
}

export default Topbar;
