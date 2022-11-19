import './sub-menu.scss';
import { useEffect } from 'react';
import { useRef } from 'react';

function SubMenu({
  headerComp,
  bodyComp,
  onRequestOpen,
  onRequestClose,
  isOpen = true,
  bodyPosition = 'right-align-out'
}) {
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      console.log('out clicked');
      if (ref?.current?.contains(e.target)) {
        // ... clicked in sub menu
      } else {
        onRequestClose();
      }
    };

    if (ref) window.addEventListener('click', handleClick, true);

    return () => window.removeEventListener('click', handleClick, true);
  }, [ref]);
  return (
    <div ref={ref} className="sub-menu">
      <div className="header" onClick={onRequestOpen}>
        {headerComp}
      </div>
      <div className={`body ${bodyPosition}${isOpen ? ' body--active' : ''}`}>{bodyComp}</div>
    </div>
  );
}

export default SubMenu;
