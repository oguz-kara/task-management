import './switch.scss';

function Switch({ value = true, onChange, ...props }) {
  return (
    <div
      className={`switch-container ${!value ? 'justify-start' : 'justify-end'}`}
      onClick={() => {
        onChange();
      }}
      {...props}>
      <div className="switch-ball"></div>
    </div>
  );
}

export default Switch;
