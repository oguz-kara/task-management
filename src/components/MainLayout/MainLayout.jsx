import React from 'react';
import { Outlet } from 'react-router-dom';
import './main-layout.scss';

function MainLayout({ left: Left, top: Top, main: Main }) {
  return (
    <div className="layout-main">
      <div className="left background-2">{Left}</div>
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
