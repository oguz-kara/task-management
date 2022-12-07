import uniqid from 'uniqid';

export const BoardReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CURRENT_BOARD': {
      return {
        ...state,
        currentBoard: action.payload
      };
    }

    case 'SET_COLUMN_SELECTED_BY_ID': {
      return {
        ...state,
        currentBoard: {
          ...state.currentBoard,
          columnList: state.currentBoard.columnList.map((column) => {
            if (column.id === action.payload.id)
              return { ...column, selected: action.payload.checked ? true : false };
            return column;
          })
        }
      };
    }

    case 'SET_ALL_COLUMN_SELECTED_BY_VALUE': {
      return {
        ...state,
        currentBoard: {
          ...state.currentBoard,
          columnList: state.currentBoard.columnList.map((column) => {
            return { ...column, selected: action.payload.checked ? true : false };
          })
        }
      };
    }

    case 'SET_CURRENT_TASK': {
      return {
        ...state,
        currentTask: action.payload
      };
    }

    case 'DELETE_SELECTED_COLUMNS': {
      return {
        ...state,
        currentBoard: {
          ...state.currentBoard
        }
      };
    }

    case 'SET_COLUMNS': {
      return {
        ...state,
        currentBoard: {
          ...state.currentBoard,
          columnList: action.payload
        }
      };
    }

    case 'DESELECT_COLUMNS': {
      return {
        ...state,
        currentBoard: {
          ...state.currentBoard,
          columnList: state.currentBoard.columnList.map((column) => ({
            ...column,
            selected: false
          }))
        }
      };
    }

    default:
      return state;
  }
};
