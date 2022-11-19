import { createContext, useReducer, useEffect } from 'react';
import { BoardReducer } from './BoardReducer';

const INITIAL_STATE = {
  currentBoard: {},
  columnList: [],
  currentTask: {}
};

export const BoardContext = createContext(INITIAL_STATE);

export const BoardContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(BoardReducer, INITIAL_STATE);

  return (
    <BoardContext.Provider value={{ boardState: { ...state }, dispatch }}>
      {children}
    </BoardContext.Provider>
  );
};
