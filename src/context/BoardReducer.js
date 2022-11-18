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
        return;
      }
      let list = [...state.currentBoard.columnList];
      state.currentBoard?.taskList?.forEach((task) => {
        list = list.map((item) => {
          if (item.name === task.status) {
            return item.taskList
              ? { ...item, taskList: [...item.taskList, task] }
              : { ...item, taskList: [task] };
          }
          return item;
        });
      });

      return {
        ...state,
        columnList: list
      };
    }
    default:
      return state;
  }
};
