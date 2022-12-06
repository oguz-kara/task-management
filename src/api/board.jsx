import { useContext } from 'react';
import { BoardContext } from '../context/BoardContext';
import { AuthContext } from '../context/AuthContext';
import { useSetDoc } from '../hooks/useSetDoc';
import { useGetDoc } from '../hooks/useGetDoc';
import { serverTimestamp } from 'firebase/firestore';

export function useBoard() {
  const { boardState, dispatch: dispatchBoard } = useContext(BoardContext);
  const { user, dispatch: dispatchAuth } = useContext(AuthContext);
  const {
    result: resultSet,
    error: errorSet,
    loading: loadingSet,
    refetch: refetchSet
  } = useSetDoc('users', user?.uid);
  const {
    result: resultGet,
    error: errorGet,
    loading: loadingGet,
    refetch: refetchGet
  } = useGetDoc('users', user?.uid);

  async function updateTask(updatedTask) {
    const isTaskTitleEmpty = updatedTask.title.trim().length < 1;
    const isTaskStatusEmpty = updatedTask.status.trim().length < 1;
    if (isTaskTitleEmpty) throw new Error('Task title cannot be empty!');
    if (isTaskStatusEmpty) throw new Error('Task status cannot be empty!');
    // make ready board object for update the state
    const updatedBoard = {
      ...boardState.currentBoard,
      taskList: boardState?.currentBoard?.taskList.map((task) => {
        if (task.id === updatedTask.id) return updatedTask;
        return task;
      })
    };

    // make ready board list object for update the state
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
        return {
          task: updatedTask,
          result: resultSet,
          error: errorSet,
          loading: loadingSet
        };
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function addTask(newTask) {
    const isTaskTitleEmpty = newTask.title.trim().length < 1;
    const isTaskStatusEmpty = newTask.status.trim().length < 1;
    if (isTaskTitleEmpty) throw new Error('Task title cannot be empty!');
    if (isTaskStatusEmpty) throw new Error('Task status cannot be empty!');
    const updatedBoard = {
      ...boardState.currentBoard,
      taskList:
        boardState?.currentBoard?.taskList.length > 0
          ? [...boardState.currentBoard.taskList, { ...newTask, createdAt: Date.now() }]
          : [{ ...newTask, createdAt: Date.now() }]
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
          task: newTask
        };
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function removeTask(taskId) {
    // make ready board object for update the state
    const taskToRemove = boardState.currentBoard.taskList.find((task) => {
      if (task.id === taskId) return true;
    });
    const updatedBoard = {
      ...boardState.currentBoard,
      taskList:
        boardState.currentBoard.taskList.filter((task) => {
          if (task.id === taskId) return false;
          return true;
        }) || [],
      columnList: boardState.currentBoard.columnList.map((column) => {
        if (column.name === taskToRemove.status) {
          return {
            ...column,
            updatedAt: Date.now()
          };
        }
        return column;
      })
    };

    // make ready board list object for update the state
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
          result: resultSet,
          error: errorSet,
          loading: loadingSet
        };
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function getTaskById(taskId) {
    return refetchGet().then((data) => {
      const selectedBoard = data.boardList.find((board) => board.id === boardState.currentBoard.id);
      return selectedBoard.taskList.find((task) => task.id === taskId);
    });
  }

  async function getAllTasks() {
    return refetchGet().then((data) => {
      const selectedBoard = data.boardList.find((board) => board.id === boardState.currentBoard.id);
      return selectedBoard.taskList;
    });
  }

  async function addColumn(newColumn) {
    const isColumnExists = boardState.columnList.find((column) => column.name === newColumn.name);
    if (isColumnExists) throw new Error('Column name is already exists!');
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

  async function updateColumn(updatedColumn, matter = true) {
    const isColumnExists = boardState.columnList.find(
      (column) => column.name === updatedColumn.name
    );
    if (isColumnExists && matter) throw new Error('Column name is already exists!');

    const updatedBoard = {
      ...boardState.currentBoard,
      columnList: boardState?.currentBoard?.columnList.map((column) => {
        if (column.id === updatedColumn.id) return updatedColumn;
        return column;
      })
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
        return updatedColumn;
      })
      .catch((err) => {
        console.log({ err });
      });
  }

  async function removeColumnList() {
    const deSelectedColumnList = boardState?.columnList?.filter(({ selected }) => !selected);
    const updatedBoard = {
      ...boardState.currentBoard,
      columnList: boardState.columnList
        .map(({ id, name, color, selected }) => {
          return {
            id,
            name,
            color,
            selected
          };
        })
        .filter(({ selected }) => {
          return !selected;
        }),
      taskList: deSelectedColumnList
        .map(({ taskList }) => (taskList.length > 0 ? taskList : []))
        .flat(1)
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

    console.log({ updatedBoardList });

    return refetchSet(updatedBoardList)
      .then(() => {
        dispatchBoard({ type: 'SET_CURRENT_BOARD', payload: updatedBoard });
        dispatchAuth({ type: 'SET_BOARD_LIST', payload: updatedBoardList.boardList });
        dispatchBoard({ type: 'BUILD_BOARD' });
        return {
          result: resultSet,
          error: errorSet,
          loading: loadingSet
        };
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function addBoard(newBoard) {
    const updatedBoardList = [...user?.userData?.boardList, newBoard];

    return refetchSet(updatedBoardList)
      .then(() => {
        dispatchBoard({ type: 'SET_CURRENT_BOARD', payload: newBoard });
        dispatchAuth({ type: 'SET_BOARD_LIST', payload: updatedBoardList });
        dispatchBoard({ type: 'BUILD_BOARD' });
        return {
          result: resultSet,
          error: errorSet,
          loading: loadingSet
        };
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function removeBoard(boardId) {
    const updatedBoardList = {
      boardList: [
        ...user?.userData?.boardList.filter((board) => {
          if (board.id === boardId) {
            return false;
          }
          return true;
        })
      ]
    };

    return refetchSet(updatedBoardList)
      .then(() => {
        dispatchBoard({ type: 'SET_CURRENT_BOARD', payload: {} });
        dispatchAuth({ type: 'SET_BOARD_LIST', payload: updatedBoardList.boardList });
        dispatchBoard({ type: 'BUILD_BOARD' });
        return {
          result: resultSet,
          error: errorSet,
          loading: loadingSet
        };
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function updateBoard(updatedBoard) {
    const updatedBoardList = user?.userData?.boardList.map((board) => {
      if (board.id === updatedBoard.id) {
        return updatedBoard;
      }
      return board;
    });

    return refetchSet(updatedBoardList)
      .then(() => {
        dispatchBoard({ type: 'SET_CURRENT_BOARD', payload: updatedBoard });
        dispatchAuth({ type: 'SET_BOARD_LIST', payload: updatedBoardList });
        dispatchBoard({ type: 'BUILD_BOARD' });
        return {
          result: resultSet,
          error: errorSet,
          loading: loadingSet
        };
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function updateTaskList(taskList) {
    const updatedBoard = {
      ...boardState.currentBoard,
      taskList: [...taskList]
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
          taskList: taskList
        };
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return {
    addTask: {
      invoke: addTask,
      loading: loadingSet
    },
    getTaskById,
    getAllTasks,
    updateTask: {
      invoke: updateTask,
      loading: loadingSet
    },
    removeTask: {
      invoke: removeTask,
      loading: loadingSet
    },
    addColumn: {
      invoke: addColumn,
      loading: loadingSet
    },
    updateColumn: {
      invoke: updateColumn,
      loading: loadingSet
    },
    removeColumnList: {
      invoke: removeColumnList,
      loading: loadingSet
    },
    addBoard: {
      invoke: addBoard,
      loading: loadingSet
    },
    updateBoard: {
      invoke: updateBoard,
      loading: loadingSet
    },
    removeBoard: {
      invoke: removeBoard,
      loading: loadingSet
    },
    updateTaskList: {
      invoke: updateTaskList,
      loading: loadingSet
    }
  };
}
