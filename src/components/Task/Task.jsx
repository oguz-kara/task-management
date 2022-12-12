import { countDoneSubtasks } from '../../helpers/task';
import { forwardRef } from 'react';
import { getDateOfCreation } from '../../helpers/formatDate';
import './task.scss';

const Task = forwardRef(
  ({ task, onClick = undefined, loading = false, dark = true, ...rest }, ref) => (
    <li
      ref={ref}
      key={task.id}
      onClick={() => onClick && onClick(task)}
      className={`task text background-2 ${dark ? 'light-shadow' : 'dark-shadow'}`}
      {...rest}>
      <div className="task-header">
        <h4>{task.title}</h4>
        <h6 className="text-static">{getDateOfCreation(task.createdAt)}</h6>
      </div>
      <p className="text-static">
        {countDoneSubtasks(task)} of {task.subtasks.length} subtasks
      </p>
    </li>
  )
);

export default Task;
