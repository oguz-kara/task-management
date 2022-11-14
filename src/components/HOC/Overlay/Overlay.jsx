import { useState } from 'react';
import './overlay.scss';

function WithOverlay({ component: Component }) {
  const [active, setActive] = useState(false);

  return (
    <>
      <div className="overlay" onClick={(e) => setActive(false)}></div>
      <Component
        className={active ? 'modal modal-active' : 'modal modal-passive'}
      />
    </>
  );
}

export default Overlay;
