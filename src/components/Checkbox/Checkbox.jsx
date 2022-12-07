import './checkbox.scss';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { UilCheck } from '@iconscout/react-unicons';

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

      <div
        className="checkmark"
        style={{ backgroundColor: background ? background : '', ...styles.checkboxStyles }}>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
          exit={{ scale: 0, opacity: 1 }}
          className="checkmark-item">
          <UilCheck />
        </motion.div>
      </div>

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
