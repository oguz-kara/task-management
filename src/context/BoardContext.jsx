import { createContext, useReducer } from 'react';
import { BoardReducer } from './BoardReducer';

const INITIAL_STATE = {
  currentBoard: {}
};

export const BoardContext = createContext(INITIAL_STATE);

export const BoardContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(BoardReducer, INITIAL_STATE);

  return (
    <BoardContext.Provider value={{ currentBoard: state.currentBoard, dispatch }}>
      {children}
    </BoardContext.Provider>
  );
};
