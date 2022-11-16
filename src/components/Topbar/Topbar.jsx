import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { UilEllipsisV } from '@iconscout/react-unicons';
import { UilMultiply } from '@iconscout/react-unicons';
import './topbar.scss';
import Modal from '../Modal/Modal';
import { db } from '../../firebase';

function Topbar() {
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <>
      <header className="topbar text background-2">
        <h3>Platform Launch</h3>
        <div className="actions">
          <button onClick={openModal} className="new-task-button background-primary text">
            + add new task
          </button>
          <button className="menu-icon text-static">
            <UilEllipsisV />
          </button>
        </div>
      </header>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <form
          onClick={(e) => e.stopPropagation()}
          className="add-new-task-form background text"
          onSubmit={handleSubmit}>
          <h3>add new task</h3>
          <div className="input-container">
            <label htmlFor="title">title</label>
            <input type="text" name="title" id="title" placeholder="e.g. Take coffee break" />
          </div>
          <div className="input-container">
            <label htmlFor="description">description</label>
            <textarea
              type="text"
              name="description"
              id="description"
              placeholder="e.g. its always good to take a breakfeast..."
            />
          </div>
          <div className="input-container">
            <label>subtasks</label>
            <div className="input-list">
              <div className="input-icon-container">
                <input type="text" name="title" id="title" placeholder="e.g very nice subtask" />
                <UilMultiply />
              </div>
            </div>
            <button>+ add new subtask</button>
          </div>
          <div className="input-container">
            <label htmlFor="status">Status</label>
            <select name="status" id="status">
              <option value="todo">Todo</option>
              <option value="doing">Doing</option>
              <option value="done">Done</option>
            </select>
          </div>
          <button type="submit" className="submit-form-button">
            create task
          </button>
        </form>
      </Modal>
    </>
  );
}

export default Topbar;
