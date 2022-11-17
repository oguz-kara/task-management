import './new-task.scss';
import { UilMultiply } from '@iconscout/react-unicons';

function NewTask() {
  async function handleSubmit(e) {
    e.preventDefault();
  }
  return (
    <form
      className="add-new-task-form background text"
      onClick={(e) => e.stopPropagation()}
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
  );
}

export default NewTask;
