import { useState, useContext, useEffect } from 'react';
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

  function handleTaskClick(task) {
    openTaskViewModal();
    dispatch({ type: 'SET_CURRENT_TASK', payload: task });
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
          openTaskUpdateModal={openTaskUpdateModal}
          closeTaskViewModal={closeTaskViewModal}
        />
      </Modal>
      <div className="board text-static" {...props}>
        {boardState.currentBoard &&
          boardState.columnList?.map((column) => (
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
              {column?.taskList ? (
                <ul>
                  {column?.taskList?.map((task, index) => (
                    <Fade
                      key={task.id}
                      delayIndex={index}
                      ms={task.id === boardState?.currentTask.id ? 0 : 100}
                      active={
                        !Object.keys(boardState?.currentTask).length > 0 ||
                        task.id === boardState?.currentTask.id
                      }>
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
              ) : (
                <h5>No task yet</h5>
              )}
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
