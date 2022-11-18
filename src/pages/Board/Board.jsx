import { useState, useContext } from 'react';
import { useLayoutEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Modal from '../../components/Modal/Modal';
import { UilEllipsisV } from '@iconscout/react-unicons';
import { BoardContext } from './../../context/BoardContext';
import './board.scss';
import { useSetDoc } from './../../hooks/useSetDoc';
import { useTask } from './../../api/task';

function Board(props) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const { boardState, dispatch } = useContext(BoardContext);
  const [currentTask, setCurrentTask] = useState({});
  const { updateTask } = useTask();

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

    updateTask(updatedCurrentTask)
      .then(({ task }) => {
        setCurrentTask(task);
      })
      .catch((err) => console.log(err));
  }

  function handleStatusChange(value) {
    const updatedCurrentTask = {
      ...currentTask,
      status: value
    };

    updateTask(updatedCurrentTask)
      .then(({ task }) => setCurrentTask(task))
      .catch((err) => console.log(err));
  }

  useLayoutEffect(() => {
    dispatch({ type: 'BUILD_BOARD' });
  }, [boardState.currentBoard]);

  return (
    <>
      <div className="board text-static" {...props}>
        {boardState.currentBoard &&
          boardState.columnList?.map((column, i) => (
            <div key={i} className="column">
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
              name="status"
              id="status"
              value={currentTask.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="text-static">
              {boardState.currentBoard?.columnList?.map((column) => (
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
