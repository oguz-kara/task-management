import { useState, useContext } from 'react';
import { UilEllipsisV } from '@iconscout/react-unicons';
import Modal from '../Modal/Modal';
import { UilBars } from '@iconscout/react-unicons';
import NewTask from '../NewTask/NewTask';
import { ThemeContext } from './../../context/ThemeContext';
import { BoardContext } from './../../context/BoardContext';
import './topbar.scss';

function Topbar({ openSidebar, hideMenuIcon = true }) {
  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);
  const { dark } = useContext(ThemeContext);
  const { boardState } = useContext(BoardContext);

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
            onClick={() => setNewTaskModalOpen(true)}
            className="new-task-button bg-primary"
            disabled={!(Object.keys(boardState?.currentBoard || {}).length > 0)}>
            + add new task
          </button>
          <button className="menu-icon text-static">
            <UilEllipsisV />
          </button>
        </div>
      </header>
      <Modal isOpen={newTaskModalOpen} onRequestClose={() => setNewTaskModalOpen(false)}>
        <NewTask heading="add new task" closeModal={() => setNewTaskModalOpen(false)} />
      </Modal>
    </>
  );
}

export default Topbar;
