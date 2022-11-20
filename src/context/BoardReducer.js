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
      let list = [...state.currentBoard.columnList];
      state.currentBoard?.taskList?.forEach((task) => {
        list = list.map((item) => {
          if (item.name === task.status) {
            return item.taskList
              ? { ...item, id: uniqid(), taskList: [...item.taskList, task] }
              : { ...item, id: uniqid(), taskList: [task] };
          }
          return item;
        });
      });

      return {
        ...state,
        columnList: list
      };
    }

    case 'SET_CURRENT_TASK': {
      return {
        ...state,
        currentTask: action.payload
      };
    }
    default:
      return state;
  }
};
