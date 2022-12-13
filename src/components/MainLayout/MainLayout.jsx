import React from 'react';
import { Outlet } from 'react-router-dom';
import './main-layout.scss';

function MainLayout({ leftOpen = true, children }) {
  return (
    <div className="layout-main">
      <div className={`left background-2 ${!leftOpen && 'left--close'}`}>
        {children.find(({ type }) => type === Left)}
      </div>
      <div className="right background">
        {children.find(({ type }) => type === Top)}
        {children.find(({ type }) => type === Main)}
      </div>
    </div>
  );
}

function Left({ children }) {
  return <div className="main-layout-left">{children}</div>;
}

function Top({ children }) {
  return <div className="main-layout-top">{children}</div>;
}

function Main({ children }) {
  return <div className="main-layout-main">{children}</div>;
}

MainLayout.Left = Left;
MainLayout.Top = Top;
MainLayout.Main = Main;

export default MainLayout;
