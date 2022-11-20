import { createContext, useReducer, useEffect } from 'react';
import { BoardReducer } from './BoardReducer';

const INITIAL_STATE = {
  currentBoard: JSON.parse(localStorage.getItem('currentBoard'))?.currentBoard || {},
  columnList: JSON.parse(localStorage.getItem('currentBoard'))?.columnList || [],
  currentTask: {}
};

export const BoardContext = createContext(INITIAL_STATE);

export const BoardContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(BoardReducer, INITIAL_STATE);

  useEffect(() => {
    localStorage.setItem('currentBoard', JSON.stringify(state));
  }, [state.currentBoard]);

  return (
    <BoardContext.Provider value={{ boardState: { ...state }, dispatch }}>
      {children}
    </BoardContext.Provider>
  );
};
