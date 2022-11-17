import { useState, useContext } from 'react';
import { useLayoutEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Modal from '../../components/Modal/Modal';
import { UilEllipsisV } from '@iconscout/react-unicons';
import { BoardContext } from './../../context/BoardContext';
import './board.scss';
import { useSetDoc } from './../../hooks/useSetDoc';

function Board(props) {
  const [columnList, setColumnList] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const { currentBoard, dispatch } = useContext(BoardContext);
  const { user, dispatch: dispatchAuth } = useContext(AuthContext);
  const [currentTask, setCurrentTask] = useState({});
  const { result, refetch } = useSetDoc('users', user.uid);

  const buildColumnList = (board) => {
    if (!board || !board.columnList) {
      setColumnList([]);
      return;
    }
    let list = [...board.columnList];
    board.taskList &&
      board.taskList.forEach((task) => {
        list = list.map((item) => {
          if (item.name === task.status) {
            return item.taskList
              ? { ...item, taskList: [...item.taskList, task] }
              : { ...item, taskList: [task] };
          }
          return item;
        });
      });
    setColumnList(list);
  };

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function handleTaskClick(task) {
    openModal();
    setCurrentTask(task);
  }

  function countDoneSubtasks(task) {
    let counter = 0;
    task?.subtasks?.forEach((item) => {
      if (item.done === true) counter++;
    });
    return counter;
  }

  function getSubTaskCount(task) {
    return task?.subtasks?.length;
  }

  function updateBoardListData(updatedTask) {
    // make ready board object for update the state
    const updatedBoard = {
      ...currentBoard,
      taskList: currentBoard?.taskList.map((task) => {
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

    refetch(updatedBoardList)
      .then(() => {
        dispatch({ type: 'SET_CURRENT_BOARD', payload: updatedBoard });
        dispatchAuth({ type: 'SET_BOARD_LIST', payload: updatedBoardList.boardList });
        setCurrentTask(updatedTask);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleSubtaskChange(id, checked) {
    const updatedSubtasks = currentTask?.subtasks?.map((task) => {
      if (task.id === id) {
        return {
          ...task,
          done: checked
        };
      }
      return task;
    });

    // make ready current task object for update the state
    const updatedCurrentTask = {
      ...currentTask,
      subtasks: updatedSubtasks
    };

    updateBoardListData(updatedCurrentTask);
  }

  function handleStatusChange(value) {
    const updatedCurrentTask = {
      ...currentTask,
      status: value
    };

    updateBoardListData(updatedCurrentTask);
  }

  useLayoutEffect(() => {
    buildColumnList(currentBoard);
  }, [currentBoard]);

  return (
    <>
      <div className="board text-static" {...props}>
        {currentBoard &&
          columnList?.map((column, i) => (
            <div key={column.id} className="column">
              <div className="title">
                <div className="circle" style={{ backgroundColor: column.color }}></div>
                <h4>
                  {column.name}
                  {column.taskList && column.taskList.length > 0
                    ? `(${column.taskList.length})`
                    : ''}
                </h4>
              </div>
              <ul>
                {column?.taskList?.map((task, i) => (
                  <li
                    key={task.id}
                    onClick={() => handleTaskClick(task)}
                    className="text background-2">
                    <h4>{task.title}</h4>
                    <p className="text-static">
                      {countDoneSubtasks(task)} of {task.subtasks.length} subtasks
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        <button className="create-new-column text background-primary">+ new column</button>
      </div>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <div onClick={(e) => e.stopPropagation()} className="task-details text background-2">
          <div className="header">
            <h3>{currentTask?.title}</h3>
            <button className="elp-icon text-static">
              <UilEllipsisV />
            </button>
          </div>
          <p className="text-static">{currentTask?.description}</p>
          <div className="subtasks">
            <h4>
              Subtasks ({countDoneSubtasks(currentTask)} of {getSubTaskCount(currentTask)})
            </h4>
            <ul className="subtask-list">
              {currentTask?.subtasks?.map((task) => (
                <li key={task.id} className="background text">
                  <input
                    id={task.id}
                    name={task.id}
                    type="checkbox"
                    checked={task.done}
                    onChange={(e) => handleSubtaskChange(task.id, e.target.checked)}
                  />
                  <label htmlFor={task.id} className={`${task.done && 'subtask-done text-static'}`}>
                    {task.description}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className="status">
            <label htmlFor="status">Status</label>
            <select
              onChange={(e) => handleStatusChange(e.target.value)}
              className="text-static"
              name="status"
              id="status">
              {currentBoard?.columnList?.map((column) => (
                <option key={column.id} value={column.name}>
                  {column.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default Board;
