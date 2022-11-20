import { useState, useContext } from 'react';
import { useLayoutEffect } from 'react';
import Modal from '../../components/Modal/Modal';
import { BoardContext } from './../../context/BoardContext';
import { useTask } from './../../api/task';
import TaskView from '../../components/TaskView/TaskView';
import NewTask from './../../components/NewTask/NewTask';
import NewColumn from '../../components/NewColumn/NewColumn';
import './board.scss';
import Fade from '../../animations/Fade';

function Board(props) {
  const [taskViewModalOpen, setTaskViewModalOpen] = useState(false);
  const [taskUpdateModalOpen, setTaskUpdateModalOpen] = useState(false);
  const [addColumnModalOpen, setAddColumnModalOpen] = useState(false);
  const { boardState, dispatch } = useContext(BoardContext);
  const { updateTask, removeTask } = useTask();

  function openAddColumnModal() {
    setAddColumnModalOpen(true);
  }

  function closeAddColumnModal() {
    setAddColumnModalOpen(false);
  }

  function openTaskViewModal() {
    setTaskViewModalOpen(true);
  }

  function closeTaskViewModal() {
    setTaskViewModalOpen(false);
  }

  function openTaskUpdateModal() {
    setTaskUpdateModalOpen(true);
  }

  function closeTaskUpdateModal() {
    setTaskUpdateModalOpen(false);
  }

  function handleUpdateTaskClick() {
    openTaskUpdateModal();
    closeTaskViewModal();
  }

  function handleRemoveTaskClick() {
    removeTask(boardState.currentTask.id)
      .then(() => {
        closeTaskViewModal();
      })
      .catch((err) => console.log(err));
  }

  function handleTaskClick(task) {
    openTaskViewModal();
    dispatch({ type: 'SET_CURRENT_TASK', payload: task });
  }

  function handleSubtaskChange(id, checked) {
    const updatedSubtasks = boardState.currentTask?.subtasks?.map((task) => {
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
      ...boardState.currentTask,
      subtasks: updatedSubtasks
    };

    updateTask(updatedCurrentTask)
      .then(({ task }) => {
        dispatch({ type: 'SET_CURRENT_TASK', payload: task });
      })
      .catch((err) => console.log(err));
  }

  function handleStatusChange(value) {
    const updatedCurrentTask = {
      ...boardState.currentTask,
      status: value
    };

    updateTask(updatedCurrentTask)
      .then(({ task }) => {
        dispatch({ type: 'SET_CURRENT_TASK', payload: task });
        closeTaskViewModal();
      })
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
      <Modal isOpen={taskUpdateModalOpen} onRequestClose={closeTaskUpdateModal}>
        <NewTask type="update-task" heading="update task" closeModal={closeTaskUpdateModal} />
      </Modal>
      <Modal isOpen={addColumnModalOpen} onRequestClose={closeAddColumnModal}>
        <NewColumn closeModal={closeAddColumnModal} />
      </Modal>
      <Modal isOpen={taskViewModalOpen} onRequestClose={closeTaskViewModal}>
        <TaskView
          currentTask={boardState.currentTask}
          handleStatusChange={handleStatusChange}
          handleSubtaskChange={handleSubtaskChange}
          handleRemoveTaskClick={handleRemoveTaskClick}
          handleUpdateTaskClick={handleUpdateTaskClick}
        />
      </Modal>
      <div className="board text-static" {...props}>
        {boardState.currentBoard &&
          boardState.columnList?.map((column) => (
            <div key={column.id} className="column">
              {column?.taskList?.length > 0 && (
                <div className="title">
                  <div className="circle" style={{ backgroundColor: column.color }}></div>
                  <h4>
                    {column.name}
                    {column.taskList && column.taskList.length > 0
                      ? `(${column.taskList.length})`
                      : ''}
                  </h4>
                </div>
              )}
              <ul>
                {column?.taskList?.map((task, index) => (
                  <Fade delayIndex={index} ms={100}>
                    <li
                      key={task.id}
                      onClick={() => handleTaskClick(task)}
                      className="text background-2">
                      <h4>{task.title}</h4>
                      <p className="text-static">
                        {countDoneSubtasks(task)} of {task.subtasks.length} subtasks
                      </p>
                    </li>
                  </Fade>
                ))}
              </ul>
            </div>
          ))}
        <button className="create-new-column text background" onClick={openAddColumnModal}>
          + new column
        </button>
      </div>
    </>
  );
}

export default Board;
