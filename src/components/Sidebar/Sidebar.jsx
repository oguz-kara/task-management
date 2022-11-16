import { useContext } from 'react';
import taskManagerLogo from '../../assets/images/task_manager.png';
import './side-bar.scss';
import Switch from '../Switch/Switch';
import { UilClipboardAlt } from '@iconscout/react-unicons';
import { UilBrightnessHalf } from '@iconscout/react-unicons';
import { UilMoon } from '@iconscout/react-unicons';
import { UilEyeSlash } from '@iconscout/react-unicons';
import { ThemeContext } from './../../context/themeContext';

function Sidebar({ boardList = [] }) {
  const value = useContext(ThemeContext);
  return (
    <aside className="sidebar">
      <div className="top">
        <img className="logo" src={taskManagerLogo} alt="task manager" />
        <div className="board-list">
          <h5 className="text-static">all boards (5)</h5>
          <ul>
            {boardList &&
              boardList.map((board, index) => (
                <li key={index}>
                  <button className={index === 0 ? 'active' : ''}>
                    <span className="icon">
                      <UilClipboardAlt className="list-icon text-static" />
                    </span>
                    <span className="text-static">{board.name}</span>
                  </button>
                </li>
              ))}
          </ul>
          <button>
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
            <Switch onClick={() => value.setDark(!value.dark)} />
          </span>
          <span>
            <UilMoon />
          </span>
        </div>
        <button>
          <span className="icon">
            <UilEyeSlash />
          </span>
          <span className="text">hide sidebar</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
