import { useContext } from 'react';
import { BoardContext } from '../context/BoardContext';
import { AuthContext } from '../context/AuthContext';
import { useSetDoc } from '../hooks/useSetDoc';

export function useColumn() {
  const { boardState, dispatch: dispatchBoard } = useContext(BoardContext);
  const { user, dispatch: dispatchAuth } = useContext(AuthContext);
  const {
    result: resultSet,
    error: errorSet,
    loading: loadingSet,
    refetch: refetchSet
  } = useSetDoc('users', user?.uid);

  async function addColumn(newColumn) {
    const updatedBoard = {
      ...boardState.currentBoard,
      columnList: [...boardState?.currentBoard?.columnList, newColumn]
    };

    const updatedBoardList = {
      boardList: [
        ...user?.userData?.boardList.map((board) => {
          if (board.id === updatedBoard.id) {
            return updatedBoard;
          }
          return board;
        })
      ]
    };

    return refetchSet(updatedBoardList)
      .then(() => {
        dispatchBoard({ type: 'SET_CURRENT_BOARD', payload: updatedBoard });
        dispatchAuth({ type: 'SET_BOARD_LIST', payload: updatedBoardList.boardList });
        dispatchBoard({ type: 'BUILD_BOARD' });
        return {
          column: newColumn
        };
      })
      .catch((err) => {
        console.log({ err });
      });
  }

  return {
    addColumn: {
      invoke: addColumn,
      loading: loadingSet,
      error: errorSet,
      result: resultSet
    }
  };
}
