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
import { useBoard } from './../../api/board';
import ConfirmAction from './../ConfirmAction/ConfirmAction';
import Loader from '../Loader/Loader';

function Sidebar({ boardList = [], closeSidebar }) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [boardActions, setBoardActions] = useState(false);
  const [updateBoardModal, setUpdateBoardModal] = useState(false);
  const { boardState, dispatch } = useContext(BoardContext);
  const { dark, dispatch: themeDispatch } = useContext(ThemeContext);
  const [deleteBoard, setDeleteBoard] = useState(false);
  const { user } = useContext(AuthContext);
  const { removeBoard } = useBoard();

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function openUpdateBoardModal() {
    setUpdateBoardModal(true);
  }

  function closeUpdateBoardModal() {
    setUpdateBoardModal(false);
  }

  function openDeleteBoardModal() {
    setDeleteBoard(true);
  }

  function closeDeleteBoardModal() {
    setDeleteBoard(false);
  }

  function handleBoardClick(board) {
    if (boardState.currentBoard.id !== board.id) {
      dispatch({ type: 'SET_CURRENT_BOARD', payload: board });
      dispatch({ type: 'SET_CURRENT_TASK', payload: {} });
    }
  }

  function handleListRightClick(board, e) {
    e.preventDefault();
    if (e.type === 'contextmenu' && boardState.currentBoard.id !== board.id) {
      dispatch({ type: 'SET_CURRENT_BOARD', payload: board });
      setBoardActions(true);
    }
  }

  function handleUpdateBoardClick() {
    openUpdateBoardModal();
  }

  function handleRemoveBoardClick() {
    removeBoard
      .invoke(boardState.currentBoard.id)
      .then(() => {
        closeDeleteBoardModal();
      })
      .then((err) => console.log({ err }));
  }

  function onSubMenuClose() {
    setBoardActions(false);
  }

  function onSubMenuOpen(board) {
    setBoardActions(true);
  }

  return (
    <>
      <Modal type="add-board" isOpen={modalIsOpen} onRequestClose={closeModal}>
        <NewBoard closeModal={closeModal} />
      </Modal>
      <Modal isOpen={updateBoardModal} onRequestClose={closeUpdateBoardModal}>
        <NewBoard type="update-board" title="update board" closeModal={closeUpdateBoardModal} />
      </Modal>
      <ConfirmAction
        isOpen={deleteBoard}
        onRequestClose={closeDeleteBoardModal}
        onConfirm={handleRemoveBoardClick}
        message={
          <span>
            Are you sure to remove
            <b>
              {` `}
              <u>{boardState?.currentBoard?.name}</u>
            </b>
            {` `}
            board?
          </span>
        }
      />
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
                      isOpen={false}>
                      <SubMenu.Header>
                        <button
                          className={boardState?.currentBoard?.id === board.id ? ' active' : ''}
                          onContextMenu={(e) => handleListRightClick(board, e)}>
                          <span className="icon">
                            {removeBoard.loading && boardState.currentBoard.id === board.id ? (
                              <Loader type="inline" />
                            ) : (
                              <UilClipboardAlt className="list-icon text-static" />
                            )}
                          </span>
                          <span className="board-name text-static">{board.name}</span>
                        </button>
                      </SubMenu.Header>
                      <SubMenu.Body>
                        <List>
                          <List.Item background="background-2" onClick={handleUpdateBoardClick}>
                            update
                          </List.Item>
                          <List.Item background="background-2" onClick={openDeleteBoardModal}>
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
    </>
  );
}

Sidebar.propTypes = {
  boardList: PropTypes.array
};

export default Sidebar;
