import './checkbox.scss';
import { useState } from 'react';

function Checkbox({ label, checked = undefined, onChange = undefined, name, id }) {
  const [innerState, setInnerState] = useState(false);

  const toggleCheckbox = () => {
    setInnerState((prev) => !prev);
  };

  const getChecked = () => {
    if (checked === undefined) return innerState;
    return checked;
  };

  const getOnChange = () => {
    if (onChange === undefined) return toggleCheckbox;
    return onChange;
  };

  return (
    <label class="container" name={name} htmlFor={name}>
      <span className="checkbox-label">{label}</span>
      <input onChange={getOnChange()} type="checkbox" checked={getChecked()} name={name} id={id} />
      <span class="checkmark"></span>
    </label>
  );
}

export default Checkbox;
