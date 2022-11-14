import { useState } from 'react';
import classnames from 'classnames';
import './switch.scss';

function Switch() {
  const [left, setLeft] = useState(true);
  return (
    <div
      className={classnames(
        'switch-container',
        left ? 'justify-start' : 'justify-end'
      )}
      onClick={() => setLeft(!left)}
    >
      <div className="switch-ball"></div>
    </div>
  );
}

export default Switch;
