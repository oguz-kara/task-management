import PropTypes from 'prop-types';
import { useContext, useState, useEffect } from 'react';
import taskManagerLogoLight from '../../assets/images/task_manager_light.png';
import taskManagerLogoDark from '../../assets/images/task_manager_dark.png';
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
import { AuthContext } from './../../context/AuthContext';
import SubMenu from './../SubMenu/SubMenu';
import List from './../List/List';

function Sidebar({ boardList = [], closeSidebar }) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [boardActions, setBoardActions] = useState(false);
  const [clickedBoard, setClickedBoard] = useState({});
  const [updateBoard, setUpdateBoard] = useState('');
  const [updateBoardMode, setUpdateBoardMode] = useState(false);
  const { boardState, dispatch } = useContext(BoardContext);
  const { dark, dispatch: themeDispatch } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function handleBoardClick(board) {
    if (boardState.currentBoard.id !== board.id) {
      dispatch({ type: 'SET_CURRENT_BOARD', payload: board });
      dispatch({ type: 'SET_CURRENT_TASK', payload: {} });
    }
  }

  function handleListRightClick(board, e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'contextmenu') setClickedBoard(board);
  }

  function handleUpdateBoardClick() {
    setUpdateBoard(clickedBoard.name);
    setUpdateBoardMode(true);
  }

  function handleRemoveBoardClick() {}

  function onSubMenuClose() {
    setBoardActions(false);
    setUpdateBoardMode(false);
  }

  function onSubMenuOpen(board) {
    setClickedBoard(board);
    setBoardActions(true);
  }

  useEffect(() => {
    setBoardActions(true);
  }, [clickedBoard]);

  useEffect(() => {
    console.log({ updateBoard });
  }, [updateBoard]);

  return (
    <>
      <aside className="sidebar">
        <div className="top">
          <img
            className="logo"
            src={dark ? taskManagerLogoDark : taskManagerLogoLight}
            alt="task manager"
          />
          <div className="board-list">
            <h5 className="text">all boards ({user?.userData?.boardList.length})</h5>
            <ul>
              {boardList &&
                boardList.map((board) => (
                  <li key={board.id} onClick={(e) => handleBoardClick(board)}>
                    <SubMenu
                      onRequestClose={onSubMenuClose}
                      onRequestOpenRight={() => onSubMenuOpen(board)}
                      isOpen={boardActions && clickedBoard.id === board.id}>
                      <SubMenu.Header>
                        <button
                          className={boardState?.currentBoard?.id === board.id ? ' active' : ''}
                          onContextMenu={(e) => handleListRightClick(board, e)}>
                          <span className="icon">
                            <UilClipboardAlt className="list-icon text-static" />
                          </span>
                          {updateBoardMode && board.id === clickedBoard.id ? (
                            <input
                              defaultValue={board.name}
                              type="text"
                              value={updateBoard}
                              onChange={(e) => setUpdateBoard(e.target.value)}
                              style={{ backgroundColor: 'transparent' }}
                            />
                          ) : (
                            <span className="board-name text-static">{board.name}</span>
                          )}
                        </button>
                      </SubMenu.Header>
                      <SubMenu.Body>
                        <List>
                          <List.Item onClick={handleUpdateBoardClick}>update</List.Item>
                          <List.Item onClick={handleRemoveBoardClick} className="hover-danger">
                            delete
                          </List.Item>
                        </List>
                      </SubMenu.Body>
                    </SubMenu>
                  </li>
                ))}
            </ul>
            <button onClick={openModal}>
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
