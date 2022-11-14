import React from 'react';
import './topbar.scss';
import { UilEllipsisV } from '@iconscout/react-unicons';

function Topbar() {
  return (
    <header className="topbar text background-2">
      <h3>Platform Launch</h3>
      <div className="actions">
        <button className="new-task-button background-primary text">
          + add new task
        </button>
        <button className="menu-icon text-static">
          <UilEllipsisV />
        </button>
      </div>
    </header>
  );
}

export default Topbar;
