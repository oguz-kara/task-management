import { createContext, useReducer, useEffect } from 'react';
import { ThemeReducer } from './ThemeReducer';

const INITIAL_STATE = JSON.parse(localStorage.getItem('theme')) || {
  dark: true
};

export const ThemeContext = createContext(INITIAL_STATE);

export const ThemeContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ThemeReducer, INITIAL_STATE);

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(state));
  }, [state.dark]);

  return (
    <ThemeContext.Provider value={{ dark: state.dark, dispatch }}>{children}</ThemeContext.Provider>
  );
};
