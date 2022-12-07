import './checkbox.scss';
import { useState } from 'react';

function Checkbox({
  label,
  checked = undefined,
  onChange = undefined,
  name,
  id,
  className = '',
  labelPosition = 'left',
  background = null,
  styles = {
    labelStyles: {},
    containerStyles: {},
    checkboxStyles: {}
  }
}) {
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
    <label style={styles.containerStyles || {}} className="container" name={name} htmlFor={name}>
      {labelPosition === 'left' && (
        <span style={styles.labelStyles || {}} className="checkbox-label">
          {label}
        </span>
      )}
      <input onChange={getOnChange()} type="checkbox" checked={getChecked()} name={name} id={id} />
      <span
        className={`${className} checkmark`}
        style={
          background
            ? { backgroundColor: background, ...styles.checkboxStyles }
            : styles.checkboxStyles
        }></span>
      {labelPosition === 'right' && (
        <span
          style={styles.labelStyles ? styles.labelStyles : {}}
          className="checkbox-label label-right">
          {label}
        </span>
      )}
    </label>
  );
}

export default Checkbox;
