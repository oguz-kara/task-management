import { useContext } from 'react';
import { BoardContext } from '../context/BoardContext';
import { AuthContext } from '../context/AuthContext';
import { useSetDoc } from './useSetDoc';
import { getUserData } from '../api/user';

export function useBoard() {
  const { boardState, dispatch: dispatchBoard } = useContext(BoardContext);
  const { user, dispatch: dispatchAuth } = useContext(AuthContext);
  const {
    result: result,
    error: error,
    loading: loading,
    refetch: refetch
  } = useSetDoc('users', user?.uid);

  async function updateTask(updatedTask) {
    try {
      const isTaskTitleEmpty = updatedTask.title.trim().length < 1;
      const isTaskStatusEmpty = updatedTask.status.trim().length < 1;
      if (isTaskTitleEmpty) throw new Error('Task title cannot be empty!');
      if (isTaskStatusEmpty) throw new Error('Task status cannot be empty!');

      const updatedBoard = {
        ...boardState.currentBoard,
        columnList: boardState?.currentBoard?.columnList?.map((column) => {
          if (column.name === updatedTask.status)
            return {
              ...column,
              taskList: column.taskList.map((task) => {
                if (task.id === updatedTask.id) return updatedTask;
                return task;
              })
            };
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

      await refetch(updatedBoardList);
      dispatchBoard({ type: 'SET_CURRENT_BOARD', payload: updatedBoard });
      dispatchAuth({ type: 'SET_BOARD_LIST', payload: updatedBoardList.boardList });
      return {
        task: updatedTask,
        result: result,
        error: error,
        loading: loading
      };
    } catch (err) {
      console.log({ err });
    }
  }

  async function changeTaskStatus(task, prevStatus, newStatus) {
    try {
      const updatedBoard = {
        ...boardState.currentBoard,
        columnList: boardState?.currentBoard?.columnList?.map((column) => {
          if (column.name === prevStatus)
            return {
              ...column,
              taskList: column?.taskList?.filter((item) => item.id !== task.id)
            };
          if (column.name === newStatus)
            return {
              ...column,
              taskList: [...column?.taskList, task]
            };
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

      await refetch(updatedBoardList);
      dispatchBoard({ type: 'SET_CURRENT_BOARD', payload: updatedBoard });
      dispatchAuth({ type: 'SET_BOARD_LIST', payload: updatedBoardList.boardList });
      return {
        task: task,
        result: result,
        error: error,
        loading: loading
      };
    } catch (err) {
      console.log({ err });
    }
  }

  async function addTask(newTask) {
    try {
      const isTaskTitleEmpty = newTask.title.trim().length < 1;
      const isTaskStatusEmpty = newTask.status.trim().length < 1;
      if (isTaskTitleEmpty) throw new Error('Task title cannot be empty!');
      if (isTaskStatusEmpty) throw new Error('Task status cannot be empty!');

      const updatedBoard = {
        ...boardState.currentBoard,
        columnList: boardState?.currentBoard?.columnList?.map((column) => {
          if (column.name === newTask.status)
            return {
              ...column,
              taskList: column.taskList
                ? [...column.taskList, { ...newTask, createdAt: Date.now() }]
                : [{ ...newTask, createdAt: Date.now() }]
            };
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

      await refetch(updatedBoardList);
      dispatchBoard({ type: 'SET_CURRENT_BOARD', payload: updatedBoard });
      dispatchAuth({ type: 'SET_BOARD_LIST', payload: updatedBoardList.boardList });
      return {
        task: newTask
      };
    } catch (err) {
      console.log({ err });
    }
  }

  async function removeTask(taskToRemove) {
    try {
      const updatedBoard = {
        ...boardState.currentBoard,
        columnList: boardState?.currentBoard?.columnList?.map((column) => {
          if (column.name === taskToRemove.status)
            return {
              ...column,
              taskList:
                column.taskList.filter((task) => {
                  if (task.id === taskToRemove.id) return false;
                  return true;
                }) || []
            };
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

      await refetch(updatedBoardList);
      dispatchBoard({ type: 'SET_CURRENT_BOARD', payload: updatedBoard });
      dispatchAuth({ type: 'SET_BOARD_LIST', payload: updatedBoardList.boardList });
      return {
        result: result,
        error: error,
        loading: loading
      };
    } catch (err) {
      console.log({ err });
    }
  }

  async function getTaskById(taskId) {
    try {
      const data = await getUserData(user?.uid);
      const selectedBoard = data.boardList.find((board) => board.id === boardState.currentBoard.id);
      return selectedBoard.columnList
        .map((column) => column?.taskList)
        .flat(1)
        .find((task) => task.id === taskId);
    } catch (err) {
      console.log({ err });
    }
  }

  async function getAllTasks() {
    try {
      const data = await getUserData(user?.uid);
      const selectedBoard = data.boardList.find((board) => board.id === boardState.currentBoard.id);
      return selectedBoard.columnList.map((column) => column?.taskList).flat(1);
    } catch (err) {
      console.log({ err });
    }
  }

  async function addColumn(newColumn) {
    try {
      const isColumnExists = boardState?.currentBoard?.columnList?.find(
        (column) => column.name === newColumn.name
      );
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
      await refetch(updatedBoardList);
      dispatchBoard({ type: 'SET_CURRENT_BOARD', payload: updatedBoard });
      dispatchAuth({ type: 'SET_BOARD_LIST', payload: updatedBoardList.boardList });
      return {
        column: newColumn
      };
    } catch (err) {
      console.log({ err });
    }
  }

  async function updateColumn(updatedColumn) {
    try {
      const updatedBoard = {
        ...boardState.currentBoard,
        columnList: boardState?.currentBoard?.columnList?.map((column) => {
          if (column.id === updatedColumn.id) return { ...updatedColumn, selected: false };
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

      await refetch(updatedBoardList);
      dispatchBoard({ type: 'SET_CURRENT_BOARD', payload: updatedBoard });
      dispatchAuth({ type: 'SET_BOARD_LIST', payload: updatedBoardList.boardList });
      return updatedColumn;
    } catch (err) {
      console.log({ err });
    }
  }

  async function updateColumns(columnList) {
    try {
      const updatedBoard = {
        ...boardState.currentBoard,
        columnList: columnList
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
      await refetch(updatedBoardList);
      dispatchBoard({ type: 'SET_CURRENT_BOARD', payload: updatedBoard });
      dispatchAuth({ type: 'SET_BOARD_LIST', payload: updatedBoardList.boardList });
    } catch (err) {
      console.log({ err });
    }
  }

  async function removeColumnList() {
    try {
      const updatedBoard = {
        ...boardState.currentBoard,
        columnList: boardState?.currentBoard?.columnList?.filter((column) => !column.selected)
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
      await refetch(updatedBoardList);
      dispatchBoard({ type: 'SET_CURRENT_BOARD', payload: updatedBoard });
      dispatchAuth({ type: 'SET_BOARD_LIST', payload: updatedBoardList.boardList });
      return {
        result: result,
        error: error,
        loading: loading
      };
    } catch (err) {
      console.log({ err });
    }
  }

  async function setColumnList(columnList) {
    try {
      const updatedBoard = {
        ...boardState.currentBoard,
        columnList: columnList
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
      await refetch(updatedBoardList);
      dispatchBoard({ type: 'SET_CURRENT_BOARD', payload: updatedBoard });
      dispatchAuth({ type: 'SET_BOARD_LIST', payload: updatedBoardList.boardList });
      return null;
    } catch (err) {
      console.log({ err });
    }
  }

  async function addBoard(newBoard) {
    try {
      const updatedBoardList = [...user?.userData?.boardList, newBoard];
      await refetch(updatedBoardList);
      dispatchBoard({ type: 'SET_CURRENT_BOARD', payload: newBoard });
      dispatchAuth({ type: 'SET_BOARD_LIST', payload: updatedBoardList });
      return {
        result: result,
        error: error,
        loading: loading
      };
    } catch (err) {
      console.log({ err });
    }
  }

  async function removeBoard(boardId) {
    try {
      const updatedBoardList = {
        boardList: [
          ...user?.userData?.boardList.filter(({ id }) => {
            if (id === boardId) {
              return false;
            }
            return true;
          })
        ]
      };
      await refetch(updatedBoardList);
      dispatchBoard({ type: 'SET_CURRENT_BOARD', payload: {} });
      dispatchAuth({ type: 'SET_BOARD_LIST', payload: updatedBoardList.boardList });
      return {
        result: result,
        error: error,
        loading: loading
      };
    } catch (err) {
      console.log({ err });
    }
  }

  async function updateBoard(updatedBoard) {
    try {
      const updatedBoardList = user?.userData?.boardList.map((board) => {
        if (board.id === updatedBoard.id) {
          return updatedBoard;
        }
        return board;
      });
      await refetch(updatedBoardList);
      dispatchBoard({ type: 'SET_CURRENT_BOARD', payload: updatedBoard });
      dispatchAuth({ type: 'SET_BOARD_LIST', payload: updatedBoardList });
      return {
        result: result,
        error: error,
        loading: loading
      };
    } catch (err) {
      console.log({ err });
    }
  }

  return {
    addTask: {
      invoke: addTask,
      loading: loading
    },
    getTaskById,
    getAllTasks,
    updateTask: {
      invoke: updateTask,
      loading: loading
    },
    removeTask: {
      invoke: removeTask,
      loading: loading
    },
    addColumn: {
      invoke: addColumn,
      loading: loading
    },
    updateColumn: {
      invoke: updateColumn,
      loading: loading
    },
    removeColumnList: {
      invoke: removeColumnList,
      loading: loading
    },
    addBoard: {
      invoke: addBoard,
      loading: loading
    },
    updateBoard: {
      invoke: updateBoard,
      loading: loading
    },
    removeBoard: {
      invoke: removeBoard,
      loading: loading
    },
    setColumnList: {
      invoke: setColumnList,
      loading: loading
    },
    updateColumns: {
      invoke: updateColumns,
      loading: loading
    },
    changeTaskStatus: {
      invoke: changeTaskStatus,
      loading: loading
    }
  };
}
