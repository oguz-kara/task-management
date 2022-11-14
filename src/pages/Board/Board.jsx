import './board.scss';
import { useState } from 'react';
import { useLayoutEffect } from 'react';

function Board({ board, ...props }) {
  const [columnList, setColumnList] = useState([]);

  const updateColumnList = () => {
    let list = [...board.columnList];
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

  useLayoutEffect(() => {
    updateColumnList();
  }, []);

  return (
    <div className="board text-static" {...props}>
      {columnList.map((column, i) => (
        <div key={i} className="column">
          <div className="title">
            <div
              className="circle"
              style={{ backgroundColor: column.color }}
            ></div>
            <h4>
              {column.name} ({column.taskList && column.taskList.length})
            </h4>
          </div>
          <ul>
            {column.taskList.map((task, i) => (
              <li key={i} className="text background-2">
                <h4>{task.title}</h4>
                <p className="text-static">
                  0 of {task.subtasks.length} subtasks
                </p>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <button className="create-new-column text background-primary">
        + new column
      </button>
    </div>
  );
}

export default Board;
