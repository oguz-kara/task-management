import uniqid from 'uniqid';
import { useState, useEffect, useContext } from 'react';
import { UilMultiply } from '@iconscout/react-unicons';
import { useBoard } from './../../hooks/useBoard';
import { BoardContext } from './../../context/BoardContext';
import Loader from './../Loader/Loader';
import './new-task.scss';

function NewTask({ closeModal, heading = 'add new task', type = 'new-task' }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [subtaskList, setSubtaskList] = useState([]);
  const [status, setStatus] = useState('');
  const [error, setError] = useState(false);
  const { addTask, updateTask } = useBoard();
  const { boardState, dispatch } = useContext(BoardContext);

  const isNewSubtaskAddable = () => {
    let addable = true;
    subtaskList.forEach((subtask) => {
      if (subtask.description === '') addable = false;
    });
    return addable;
  };

  const handleAddSubtask = () => {
    const blr = {
      id: uniqid(),
      description: '',
      done: false
    };
    if (isNewSubtaskAddable()) {
      setSubtaskList([...subtaskList, blr]);
    }
  };

  const handleSubtaskChange = (id, value) => {
    setSubtaskList((prev) => [
      ...prev.map((subtask) => {
        if (subtask.id === id) return { ...subtask, description: value };
        return subtask;
      })
    ]);
  };

  const removeSubtask = (id) => {
    setSubtaskList((prev) => [
      ...prev.filter((subtask) => {
        if (subtask.id === id) return false;
        return true;
      })
    ]);
  };

  const removeEmptySubtasks = (subtaskList) => {
    return subtaskList.filter((subtask) => {
      if (subtask.description === '') return false;
      return true;
    });
  };

  const resetState = () => {
    setTitle('');
    setDesc('');
    setSubtaskList([]);
    setStatus('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log({ title, desc, subtaskList, status });

    if (type === 'update-task') {
      try {
        const updatedTask = {
          ...boardState.currentTask,
          title,
          description: desc,
          subtasks: removeEmptySubtasks(subtaskList),
          status
        };
        const { task } = await updateTask.invoke(updatedTask);
        if (error) setError(false);
        dispatch({ type: 'SET_CURRENT_TASK', payload: task });
        closeModal();
        resetState();
      } catch (err) {
        console.log({ err });
        setError(err);
      }
    } else {
      try {
        const newTask = {
          id: uniqid(),
          title,
          description: desc,
          subtasks: removeEmptySubtasks(subtaskList),
          status
        };
        const { task } = await addTask.invoke(newTask);
        if (error) setError(false);
        closeModal();
        resetState();
        dispatch({ type: 'SET_CURRENT_TASK', payload: task });
      } catch (err) {
        console.log({ err });
        setError(err);
      }
    }
  };

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
    console.log({ status });
    if (status === '' && type === 'new-task') {
      setStatus(boardState?.currentBoard?.columnList[0].name || '-');
    }
  }, [boardState?.currentBoard]);

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
          id="status"
          name="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}>
          {boardState?.currentBoard?.columnList?.map((item) => (
            <option value={item.name}>{item.name}</option>
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
