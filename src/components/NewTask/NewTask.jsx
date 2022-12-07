import uniqid from 'uniqid';
import { useState, useEffect, useContext } from 'react';
import { UilMultiply } from '@iconscout/react-unicons';
import './new-task.scss';

import { useBoard } from '../../api/board';
import { BoardContext } from './../../context/BoardContext';
import Loader from './../Loader/Loader';

function NewTask({ closeModal, heading = 'add new task', type = 'new-task' }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [subtaskList, setSubtaskList] = useState([]);
  const [status, setStatus] = useState('');
  const [error, setError] = useState(false);
  const { addTask, updateTask } = useBoard();
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

  function removeEmptySubtasks(subtaskList) {
    return subtaskList.filter((subtask) => {
      if (subtask.description === '') return false;
      return true;
    });
  }

  function resetState() {
    setTitle('');
    setDesc('');
    setSubtaskList([]);
    setStatus('');
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (type === 'update-task') {
      const updatedTask = {
        ...boardState.currentTask,
        title,
        description: desc,
        subtasks: removeEmptySubtasks(subtaskList),
        status
      };

      updateTask
        .invoke(updatedTask)
        .then(({ task }) => {
          if (error) setError(false);
          dispatch({ type: 'SET_CURRENT_TASK', payload: task });
          closeModal();
          resetState();
        })
        .catch((err) => setError(err));
    } else {
      const newTask = {
        id: uniqid(),
        title,
        description: desc,
        subtasks: removeEmptySubtasks(subtaskList),
        status
      };

      addTask
        .invoke(newTask)
        .then(({ task }) => {
          if (error) setError(false);
          closeModal();
          resetState();
          dispatch({ type: 'SET_CURRENT_TASK', payload: task });
        })
        .catch((err) => {
          console.log({ err });
          setError(err);
        });
    }
  }

  useEffect(() => {
    if (
      type === 'update-task' &&
      boardState.currentTask &&
      Object.keys(boardState.currentTask).length > 0
    ) {
      setTitle(boardState.currentTask.title);
      setDesc(boardState.currentTask.description);
      setSubtaskList(boardState.currentTask.subtasks);
      setStatus(boardState.currentTask.status);
    }
  }, [boardState.currentTask]);

  useEffect(() => {
    setStatus(boardState?.currentBoard?.columnList[0]?.name);
  }, [title]);

  return (
    <form
      className={`${error ? 'flash-error' : ''} add-new-task-form background text `}
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
        {subtaskList?.length > 0 && (
          <>
            <label>subtasks</label>
            {subtaskList?.map((subtask) => (
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
        <button className="background-1" type="button" onClick={handleAddSubtask}>
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
          {boardState?.currentBoard?.columnList?.map((column) => (
            <option key={column.id} value={column.name}>
              {column.name}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="submit-form-button">
        add task
      </button>
      {error && <div className="error-text">{error.message}</div>}
      {addTask.loading ? <Loader /> : ''}
      {updateTask.loading ? <Loader /> : ''}
    </form>
  );
}

export default NewTask;
