import { motion } from 'framer-motion';
import './switch.scss';

const spring = {
  type: 'spring',
  stiffness: 700,
  damping: 30
};

function Switch({ value = true, onChange, ...props }) {
  return (
    <div
      data-ison={value}
      className={`switch-container ${!value ? 'justify-start' : 'justify-end'}`}
      onClick={() => {
        onChange();
      }}
      {...props}>
      <motion.div className="switch-ball" layout transition={spring} />
    </div>
  );
}

export default Switch;
