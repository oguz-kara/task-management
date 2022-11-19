import { UilEllipsisV } from '@iconscout/react-unicons';
import React, { useContext, useState } from 'react';
import SubMenu from './../SubMenu/SubMenu';
import List from './../List/List';
import { BoardContext } from './../../context/BoardContext';
import './task-view.scss';

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

function TaskView({ currentTask }) {
  const { boardState } = useContext(BoardContext);
  const [subMenuOpen, setSubMenuOpen] = useState(false);

  return (
    <div className="task-details text background-2">
      <div className="title">
        <h3>{currentTask?.title}</h3>
        <SubMenu
          headerComp={
            <button className="elp-icon text-static">
              <UilEllipsisV />
            </button>
          }
          bodyComp={
            <List>
              <List.Item>update</List.Item>
              <List.Item className="hover-danger">delete</List.Item>
            </List>
          }
          onRequestClose={() => setSubMenuOpen(false)}
          onRequestOpen={() => setSubMenuOpen(true)}
          isOpen={subMenuOpen}
        />
      </div>
      <p className="text-static">{currentTask?.description}</p>
      <div className="subtasks">
        {getSubTaskCount() && (
          <h4>
            Subtasks ({countDoneSubtasks(currentTask)} of {getSubTaskCount(currentTask)})
          </h4>
        )}
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
  );
}

export default TaskView;
