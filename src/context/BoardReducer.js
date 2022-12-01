import uniqid from 'uniqid';

export const BoardReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CURRENT_BOARD': {
      return {
        ...state,
        currentBoard: action.payload
      };
    }
    case 'BUILD_BOARD': {
      if (!state?.currentBoard || !state?.currentBoard.columnList) {
        return state;
      }
      let list = state.currentBoard.columnList.map((column) => {
        return {
          ...column,
          selected: column.selected ? true : false,
          taskList: []
        };
      });
      state.currentBoard?.taskList?.forEach((task) => {
        list = list.map((item) => {
          if (item.name === task.status) {
            return { ...item, id: uniqid(), taskList: [...item.taskList, task], selected: false };
          }
          return item;
        });
      });

      return {
        ...state,
        columnList: list
      };
    }

    case 'SET_COLUMN_SELECTED_BY_ID': {
      return {
        ...state,
        columnList: state.columnList.map((column) => {
          if (column.id === action.payload.id)
            return { ...column, selected: action.payload.checked ? true : false };
          return column;
        })
      };
    }

    case 'SET_ALL_COLUMN_SELECTED_BY_VALUE': {
      return {
        ...state,
        columnList: state.columnList.map((column) => {
          return { ...column, selected: action.payload.checked ? true : false };
        })
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

    default:
      return state;
  }
};
