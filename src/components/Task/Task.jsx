import { forwardRef } from 'react';
import { getDateOfCreation } from '../../helpers/format-date';
import './task.scss';

const Task = forwardRef(({ task, onClick = undefined, loading = false, ...rest }, ref) => (
  <li
    ref={ref}
    key={task.id}
    onClick={() => onClick && onClick(task)}
    className="task text background-2"
    {...rest}>
    <div className="task-header">
      <h4>{task.title}</h4>
      <h6 className="text-static">{getDateOfCreation(task.createdAt)}</h6>
    </div>
    <p className="text-static">
      {countDoneSubtasks(task)} of {task.subtasks.length} subtasks
    </p>
  </li>
));

function countDoneSubtasks(task) {
  let counter = 0;
  task?.subtasks?.forEach((item) => {
    if (item.done === true) counter++;
  });
  return counter;
}

export default Task;
