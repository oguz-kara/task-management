import React, { useContext, useState } from 'react';
import { UilEllipsisV } from '@iconscout/react-unicons';
import SubMenu from './../SubMenu/SubMenu';
import List from './../List/List';
import { BoardContext } from './../../context/BoardContext';
import { useBoard } from '../../api/board';
import Loader from './../Loader/Loader';
import Checkbox from '../Checkbox/Checkbox';
import './task-view.scss';
import ConfirmAction from './../ConfirmAction/ConfirmAction';

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

function TaskView({ openTaskUpdateModal, closeTaskViewModal }) {
  const { boardState, dispatch } = useContext(BoardContext);
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const { updateTask, removeTask, changeTaskStatus } = useBoard();
  const [deleteTask, setDeleteTask] = useState(false);

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

    const updatedCurrentTask = {
      ...boardState.currentTask,
      subtasks: updatedSubtasks
    };

    updateTask
      .invoke(updatedCurrentTask)
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

    changeTaskStatus
      .invoke(updatedCurrentTask, boardState.currentTask.status, value)
      .then(({ task }) => {
        dispatch({ type: 'SET_CURRENT_TASK', payload: task });
        closeTaskViewModal();
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateTaskClick() {
    openTaskUpdateModal();
    closeTaskViewModal();
  }

  function handleRemoveTaskClick() {
    removeTask
      .invoke(boardState.currentTask)
      .then(() => {
        closeTaskViewModal();
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="task-details text background-2">
      <div className="title">
        <h3>{boardState?.currentTask?.title}</h3>
        <SubMenu
          onRequestClose={() => setSubMenuOpen(false)}
          onRequestOpen={() => setSubMenuOpen(true)}
          isOpen={subMenuOpen}>
          <SubMenu.Header>
            <button className="elp-icon text-static">
              <UilEllipsisV />
            </button>
          </SubMenu.Header>
          <SubMenu.Body>
            <List>
              <List.Item onClick={handleUpdateTaskClick}>Edit task</List.Item>
              <List.Item onClick={() => setDeleteTask(true)} className="text-danger">
                Delete task
              </List.Item>
            </List>
          </SubMenu.Body>
        </SubMenu>
      </div>
      <p className="text-static">{boardState.currentTask?.description}</p>
      <div className="subtasks">
        {getSubTaskCount() && (
          <h4>
            Subtasks ({countDoneSubtasks(boardState?.currentTask)} of{' '}
            {getSubTaskCount(boardState?.currentTask)})
          </h4>
        )}
        <ul className="subtask-list">
          {boardState?.currentTask?.subtasks?.map((task) => (
            <li key={task.id} className="background text">
              <Checkbox
                className="background-2"
                id={task.id}
                name={task.id}
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
      <div className="input-container">
        <label htmlFor="status">Status</label>
        <select
          name="status"
          id="status"
          value={boardState?.currentTask.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="text-static">
          {boardState.currentBoard?.columnList?.map((column) => (
            <option key={column.id} value={column.name}>
              {column.name}
            </option>
          ))}
        </select>
      </div>
      {updateTask.loading ? <Loader /> : ''}
      {removeTask.loading ? <Loader /> : ''}
    </div>
  );
}

export default TaskView;
