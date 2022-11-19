import uniqid from 'uniqid';
import { useState, useEffect, useContext } from 'react';
import { UilMultiply } from '@iconscout/react-unicons';
import './new-task.scss';

import { useTask } from './../../api/task';
import { BoardContext } from './../../context/BoardContext';

function NewTask({ closeModal, heading = 'add new task', type = 'new-task' }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [subtaskList, setSubtaskList] = useState([]);
  const [status, setStatus] = useState('todo');
  const { addTask, updateTask } = useTask();
  const { boardState, dispatch } = useContext(BoardContext);

  function isNewSubtaskAddable() {
    let addable = true;

    subtaskList.forEach((subtask) => {
      if (subtask.description === '') addable = false;
    });

    return addable;
  }

  function handleAddSubtask() {
    const blr = {
      id: uniqid(),
      description: '',
      done: false
    };
    if (isNewSubtaskAddable()) {
      setSubtaskList([...subtaskList, blr]);
    }
  }

  function handleSubtaskChange(id, value) {
    setSubtaskList([
      ...subtaskList.map((subtask) => {
        if (subtask.id === id) return { ...subtask, description: value };
        return subtask;
      })
    ]);
  }

  function removeSubtask(id) {
    const newSubtaskList = [
      ...subtaskList.filter((subtask) => {
        if (subtask.id === id) return false;
        return true;
      })
    ];

    setSubtaskList(newSubtaskList);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (type === 'update-task') {
      const updatedTask = {
        ...boardState.currentTask,
        title,
        description: desc,
        subtasks: subtaskList,
        status
      };

      console.log({ updatedTask });

      updateTask(updatedTask)
        .then(({ task }) => {
          dispatch({ type: 'SET_CURRENT_TASK', payload: task });
          closeModal();
        })
        .catch((err) => console.log(err));
    } else {
      const newTask = {
        id: uniqid(),
        title,
        description: desc,
        subtasks: subtaskList,
        status
      };

      addTask(newTask).then(() => {
        setTitle('');
        setDesc('');
        setSubtaskList([]);
        setStatus('todo');
        closeModal();
      });
    }
  }

  useEffect(() => {
    setTitle(boardState.currentTask.title);
    setDesc(boardState.currentTask.description);
    setSubtaskList(boardState.currentTask.subtasks);
    setStatus(boardState.currentTask.status);
  }, [boardState.currentTask]);

  return (
    <form
      className="add-new-task-form background text"
      onClick={(e) => e.stopPropagation()}
      onSubmit={handleSubmit}>
      <h3>{heading}</h3>
      <div className="input-container">
        <label htmlFor="title">title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          name="title"
          id="title"
          placeholder="e.g. Take coffee break"
        />
      </div>
      <div className="input-container">
        <label htmlFor="description">description</label>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          type="text"
          name="description"
          id="description"
          placeholder="e.g. its always good to take a breakfeast..."
        />
      </div>
      <div className="input-container">
        {subtaskList.length > 0 && (
          <>
            <label>subtasks</label>
            {subtaskList.map((subtask) => (
              <div key={subtask.id} className="input-list">
                <div className="input-icon-container">
                  <input
                    value={subtask.description}
                    onChange={(e) => handleSubtaskChange(subtask.id, e.target.value)}
                    type="text"
                    placeholder="e.g very nice subtask"
                  />
                  <button type="button" onClick={() => removeSubtask(subtask.id)}>
                    <UilMultiply />
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
        <button type="button" onClick={handleAddSubtask}>
          + add new subtask
        </button>
      </div>
      <div className="input-container">
        <label htmlFor="status">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          name="status"
          id="status">
          <option value="todo">Todo</option>
          <option value="doing">Doing</option>
          <option value="done">Done</option>
        </select>
      </div>
      <button type="submit" className="submit-form-button">
        create task
      </button>
    </form>
  );
}

export default NewTask;
