import './sub-menu.scss';
import React, { useEffect } from 'react';
import { useRef } from 'react';

function SubMenu({
  onRequestOpen,
  onRequestClose,
  onRequestOpenRight,
  isOpen = true,
  bodyPosition = 'right-align-out',
  children
}) {
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (!ref?.current?.contains(e.target)) {
        onRequestClose();
      }
    };

    if (ref) window.addEventListener('click', handleClick, true);

    return () => window.removeEventListener('click', handleClick, true);
  }, [ref]);
  return (
    <div ref={ref} className="sub-menu">
      <div className="header" onClick={onRequestOpen} onContextMenu={onRequestOpenRight}>
        {children.find(({ type }) => type === Header)}
      </div>
      <div className={`body ${bodyPosition}${isOpen ? ' body--active' : ''}`}>
        {children.find(({ type }) => type === Body)}
      </div>
    </div>
  );
}

function Header({ children }) {
  return <>{children}</>;
}

function Body({ children }) {
  return <>{children}</>;
}

SubMenu.Header = Header;
SubMenu.Body = Body;

export default SubMenu;
