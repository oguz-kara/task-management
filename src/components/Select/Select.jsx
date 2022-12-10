import ReactSelect from 'react-select';
import './select.scss';

const getTheme = (dark) => {
  return dark
    ? {
        option: (baseStyles, state) => ({
          ...baseStyles
        })
      }
    : {};
};

function Select(props) {
  return <ReactSelect className="react-select" {...props} style={getTheme(true)} />;
}

export default Select;
