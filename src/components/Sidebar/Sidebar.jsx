import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import taskManagerLogo from '../../assets/images/task_manager.png';
import './side-bar.scss';
import Switch from '../Switch/Switch';
import { UilClipboardAlt } from '@iconscout/react-unicons';
import { UilBrightnessHalf } from '@iconscout/react-unicons';
import { UilMoon } from '@iconscout/react-unicons';
import { UilEyeSlash } from '@iconscout/react-unicons';
import { ThemeContext } from './../../context/ThemeContext';
import { BoardContext } from './../../context/BoardContext';
import NewBoard from '../NewBoard/NewBoard';
import Modal from '../Modal/Modal';

function Sidebar({ boardList = [], closeSidebar }) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const { currentBoard, dispatch } = useContext(BoardContext);
  const { dark, dispatch: themeDispatch } = useContext(ThemeContext);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function handleBoardClick(board) {
    dispatch({ type: 'SET_CURRENT_BOARD', payload: board });
  }

  return (
    <>
      <aside className="sidebar">
        <div className="top">
          <img className="logo" src={taskManagerLogo} alt="task manager" />
          <div className="board-list">
            <h5 className="text-static">all boards (5)</h5>
            <ul>
              {boardList &&
                boardList.map((board, index) => (
                  <li key={index} onClick={() => handleBoardClick(board)}>
                    <button className={currentBoard.id === board.id ? 'active' : ''}>
                      <span className="icon">
                        <UilClipboardAlt className="list-icon text-static" />
                      </span>
                      <span className="text-static">{board.name}</span>
                    </button>
                  </li>
                ))}
            </ul>
            <button onClick={openModal}>
              <span className="icon">
                <UilClipboardAlt className="primary-color" />
              </span>
              <span className="primary-color">+ create new board</span>
            </button>
          </div>
        </div>
        <div className="bottom">
          <div className="theme">
            <span className="icon">
              <UilBrightnessHalf />
            </span>
            <span className="mode">
              <Switch onClick={() => themeDispatch({ type: 'SET_THEME', payload: !dark })} />
            </span>
            <span>
              <UilMoon />
            </span>
          </div>
          <button onClick={closeSidebar}>
            <span className="icon">
              <UilEyeSlash />
            </span>
            <span className="text">hide sidebar</span>
          </button>
        </div>
      </aside>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <NewBoard closeModal={closeModal} />
      </Modal>
    </>
  );
}

Sidebar.propTypes = {
  boardList: PropTypes.array
};

export default Sidebar;
