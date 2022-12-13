import { useNavigate } from 'react-router-dom';
import { UilUser } from '@iconscout/react-unicons';
import { UilSignout } from '@iconscout/react-unicons';
import { useState, useContext, useEffect } from 'react';
import SubMenu from './../SubMenu/SubMenu';
import { UilEllipsisV } from '@iconscout/react-unicons';
import Modal from '../Modal/Modal';
import { UilBars } from '@iconscout/react-unicons';
import NewTask from '../NewTask/NewTask';
import { ThemeContext } from './../../context/ThemeContext';
import { BoardContext } from './../../context/BoardContext';
import List from './../List/List';
import { logout } from './../../api/auth';
import { AuthContext } from './../../context/AuthContext';
import './topbar.scss';

function Topbar({ openSidebar, hideMenuIcon = true }) {
  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const { dark } = useContext(ThemeContext);
  const { boardState } = useContext(BoardContext);
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const logoutUser = () => {
    logout();
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

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
          <SubMenu
            bodyPosition="left-align-out"
            onRequestClose={() => setSubMenuOpen(false)}
            onRequestOpen={() => setSubMenuOpen(true)}
            isOpen={subMenuOpen}>
            <SubMenu.Header>
              <button className="menu-icon text-static">
                <UilEllipsisV />
              </button>
            </SubMenu.Header>
            <SubMenu.Body style={{ marginTop: 15 }}>
              <List>
                <List.Item onClick={() => {}}>
                  <button className="icon-link-container text">
                    <UilUser />
                    <span>Account</span>
                  </button>
                </List.Item>
                <List.Item onClick={() => {}}>
                  <button onClick={() => logoutUser()} className="icon-link-container text">
                    <UilSignout />
                    <span>Logout</span>
                  </button>
                </List.Item>
              </List>
            </SubMenu.Body>
          </SubMenu>
        </div>
      </header>
      <Modal isOpen={newTaskModalOpen} onRequestClose={() => setNewTaskModalOpen(false)}>
        <NewTask heading="add new task" closeModal={() => setNewTaskModalOpen(false)} />
      </Modal>
    </>
  );
}

export default Topbar;
