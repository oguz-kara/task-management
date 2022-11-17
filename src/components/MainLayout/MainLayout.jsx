import React from 'react';
import { Outlet } from 'react-router-dom';
import './main-layout.scss';

function MainLayout({ left: Left, top: Top, main: Main, leftOpen = true }) {
  return (
    <div className="layout-main">
      <div className={`left background-2 ${!leftOpen && 'left--close'}`}>{Left}</div>
      <div className="right background">
        {Top}
        <Main>
          <Outlet />
        </Main>
      </div>
    </div>
  );
}

export default MainLayout;
