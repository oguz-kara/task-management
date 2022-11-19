import { useState, useContext } from 'react';
import { useLayoutEffect } from 'react';
import Modal from '../../components/Modal/Modal';
import { BoardContext } from './../../context/BoardContext';
import './board.scss';
import { useTask } from './../../api/task';

import TaskView from '../../components/TaskView/TaskView';
import SubMenu from './../../components/SubMenu/SubMenu';
import List from './../../components/List/List';

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

  function countDoneSubtasks(task) {
    let counter = 0;
    task?.subtasks?.forEach((item) => {
      if (item.done === true) counter++;
    });
    return counter;
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
        <TaskView currentTask={currentTask} />
      </Modal>
    </>
  );
}

export default Board;
