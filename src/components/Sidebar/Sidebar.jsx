import { useContext, useState } from 'react';
import { UilEdit } from '@iconscout/react-unicons';
import { UilTimesCircle } from '@iconscout/react-unicons';
import taskManagerLogoLight from '../../assets/images/task_manager_light.png';
import taskManagerLogoDark from '../../assets/images/task_manager_dark.png';
import Switch from '../Switch/Switch';
import { UilClipboardAlt } from '@iconscout/react-unicons';
import { UilBrightnessHalf } from '@iconscout/react-unicons';
import { UilMoon } from '@iconscout/react-unicons';
import { UilEyeSlash } from '@iconscout/react-unicons';
import { ThemeContext } from './../../context/ThemeContext';
import { BoardContext } from './../../context/BoardContext';
import NewBoard from '../NewBoard/NewBoard';
import Modal from '../Modal/Modal';
import { AuthContext } from './../../context/AuthContext';
import { useBoard } from './../../api/board';
import Loader from '../Loader/Loader';
import { ConfirmContext } from './../../context/ConfirmContext';
import './side-bar.scss';

function Sidebar({ boardList = [], closeSidebar }) {
  const [newBoardModal, setNewBoardModal] = useState(false);
  const [updateBoardModal, setUpdateBoardModal] = useState(false);
  const { boardState, dispatch } = useContext(BoardContext);
  const { dark, dispatch: themeDispatch } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const { dispatch: confirmDispatch } = useContext(ConfirmContext);
  const { removeBoard } = useBoard();

  const handleBoardClick = (board) => {
    if (boardState.currentBoard.id !== board.id) {
      dispatch({ type: 'SET_CURRENT_BOARD', payload: board });
      dispatch({ type: 'SET_CURRENT_TASK', payload: {} });
    }
  };

  const handleRemoveBoardClick = async (board) => {
    try {
      await removeBoard.invoke(board.id);
    } catch (err) {
      console.log({ err });
    }
  };

  const handleDeleteBoardButtonClick = (board) => {
    const confirmData = {
      isOpen: true,
      title: {
        text: 'Delete this board?',
        color: '#ea5555'
      },
      message: `Are you sure you want to delete the '${board.name}' board? This action will remove all columns and tasks and cannot be reversed. `,
      onConfirm: () => handleRemoveBoardClick(board),
      onRequestClose: () => confirmDispatch({ type: 'RESET' }),
      buttons: {
        approve: {
          text: 'Delete',
          className: 'bg-danger text',
          style: { color: '#fff' }
        },
        reject: {
          text: 'Cancel',
          backgroundColor: null,
          className: 'primary-color'
        }
      }
    };
    confirmDispatch({ type: 'CONFIRM', payload: confirmData });
  };

  return (
    <>
      <Modal type="add-board" isOpen={newBoardModal} onRequestClose={() => setNewBoardModal(false)}>
        <NewBoard closeModal={() => setNewBoardModal(false)} />
      </Modal>
      <Modal isOpen={updateBoardModal} onRequestClose={() => setUpdateBoardModal(false)}>
        <NewBoard
          type="update-board"
          title="update board"
          closeModal={() => setUpdateBoardModal(false)}
        />
      </Modal>
      <aside className={`sidebar ${dark ? 'line-light' : 'line-dark'}`}>
        <div className="top">
          <img
            className={`logo ${dark ? 'line-light' : 'line-dark'}`}
            src={dark ? taskManagerLogoDark : taskManagerLogoLight}
            alt="task manager"
          />
          <div className="board-list">
            <h5 className="text">all boards ({user?.userData?.boardList.length})</h5>
            <ul>
              {boardList &&
                boardList.map((board) => (
                  <li key={board.id} onClick={(e) => handleBoardClick(board)}>
                    <button className={boardState?.currentBoard?.id === board.id ? ' active' : ''}>
                      <div className="board-list-left">
                        <span className="icon">
                          {removeBoard.loading && boardState.currentBoard.id === board.id ? (
                            <Loader type="inline" />
                          ) : (
                            <UilClipboardAlt className="list-icon text-static" />
                          )}
                        </span>
                        <span className="board-name text-static">{board.name}</span>
                      </div>
                      <div className="board-actions">
                        <button className="text" onClick={() => setUpdateBoardModal(true)}>
                          <UilEdit />
                        </button>
                        <button
                          className="text"
                          onClick={() => handleDeleteBoardButtonClick(board)}>
                          <UilTimesCircle />
                        </button>
                      </div>
                    </button>
                  </li>
                ))}
            </ul>
            <button onClick={() => setNewBoardModal(true)}>
              <span className="icon">
                <UilClipboardAlt className="text-static" />
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
              <Switch
                value={dark}
                onChange={() => themeDispatch({ type: 'SET_THEME', payload: !dark })}
              />
            </span>
            <span>
              <UilMoon />
            </span>
          </div>
          <button onClick={closeSidebar}>
            <span className="icon">
              <UilEyeSlash />
            </span>
            <span>hide sidebar</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
