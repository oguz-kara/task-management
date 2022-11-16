import './board.scss';
import { useState } from 'react';
import { useLayoutEffect } from 'react';
import Modal from '../../components/Modal/Modal';
import { UilEllipsisV } from '@iconscout/react-unicons';

function Board({ board, ...props }) {
  const [columnList, setColumnList] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  // const [selectedTask, setSelectedTask] = useState({});

  const updateColumnList = () => {
    if (!board) return;
    console.log('passed');
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

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  useLayoutEffect(() => {
    updateColumnList();
  }, []);

  return (
    <>
      <div className="board text-static" {...props}>
        {board &&
          columnList &&
          columnList.map((column, i) => (
            <div key={i} className="column">
              <div className="title">
                <div className="circle" style={{ backgroundColor: column.color }}></div>
                <h4>
                  {column.name} ({column.taskList && column.taskList.length})
                </h4>
              </div>
              <ul>
                {column.taskList.map((task, i) => (
                  <li onClick={openModal} key={i} className="text background-2">
                    <h4>{task.title}</h4>
                    <p className="text-static">0 of {task.subtasks.length} subtasks</p>
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
            <h3>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur aperiam,
              consequatur Lorem ipsum dolor sit amet.
            </h3>
            <button className="elp-icon text-static">
              <UilEllipsisV />
            </button>
          </div>
          <p className="text-static">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem quisquam eligendi fuga
            eos soluta deleniti nesciunt beatae distinctio consectetur consequatur. Lorem ipsum
            dolor sit amet consectetur adipisicing elit. Laborum suscipit eum autem dignissimos
            recusandae dolores aliquid beatae consequuntur maiores veniam?
          </p>
          <div className="subtasks">
            <h4>Subtasks (2 of 3)</h4>
            <ul className="subtask-list">
              <li className="background text">
                <input type="checkbox" />
                <span className="subtask-description">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt, nostrum.
                </span>
              </li>
              <li className="background text">
                <input type="checkbox" />
                <span className="subtask-description">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt, nostrum.
                </span>
              </li>
              <li className="background text">
                <input type="checkbox" />
                <span className="subtask-description">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt, nostrum.
                </span>
              </li>
            </ul>
          </div>
          <div className="status">
            <label htmlFor="status">Status</label>
            <select className="text-static" name="status" id="status">
              <option value="todo">Todo</option>
              <option value="doing">Doing</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default Board;
