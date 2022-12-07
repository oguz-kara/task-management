import { createContext, useReducer, useEffect } from 'react';
import { ConfirmReducer } from './ConfirmReducer';

const INITIAL_STATE = { isOpen: false };

export const ConfirmContext = createContext(INITIAL_STATE);

export const ConfirmContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ConfirmReducer, INITIAL_STATE);

  return (
    <ConfirmContext.Provider value={{ data: { ...state }, dispatch }}>
      {children}
    </ConfirmContext.Provider>
  );
};
