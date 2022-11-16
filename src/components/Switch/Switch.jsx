import { useState } from 'react';
import classnames from 'classnames';
import './switch.scss';

function Switch({ onClick, ...props }) {
  const [left, setLeft] = useState(true);
  return (
    <div
      className={classnames(
        'switch-container',
        left ? 'justify-start' : 'justify-end'
      )}
      onClick={() => {
        onClick();
        setLeft(!left);
      }}
      {...props}
    >
      <div className="switch-ball"></div>
    </div>
  );
}

export default Switch;
