import { useState, useContext } from 'react';
import { useLayoutEffect } from 'react';
import Modal from '../../components/Modal/Modal';
import { BoardContext } from './../../context/BoardContext';
import TaskView from '../../components/TaskView/TaskView';
import NewTask from './../../components/NewTask/NewTask';
import NewColumn from '../../components/NewColumn/NewColumn';
import Fade from '../../animations/Fade';
import './board.scss';
import Checkbox from './../../components/Checkbox/Checkbox';
import ConfirmAction from '../../components/ConfirmAction/ConfirmAction';
import { useBoard } from './../../api/board';

function Board(props) {
  const [taskViewModalOpen, setTaskViewModalOpen] = useState(false);
  const [taskUpdateModalOpen, setTaskUpdateModalOpen] = useState(false);
  const [addColumnModalOpen, setAddColumnModalOpen] = useState(false);
  const [updateColumnModalOpen, setUpdateColumnModalOpen] = useState(false);
  const [isAllColumnChecked, setAsAllColumnChecked] = useState(false);
  const [deleteColumn, setDeleteColumn] = useState(false);
  const { boardState, dispatch } = useContext(BoardContext);
  const { removeColumnList } = useBoard();

  // Modal state functions
  function openAddColumnModal() {
    setAddColumnModalOpen(true);
  }

  function closeAddColumnModal() {
    setAddColumnModalOpen(false);
  }

  function openTaskViewModal() {
    setTaskViewModalOpen(true);
  }

  function closeTaskViewModal() {
    setTaskViewModalOpen(false);
  }

  function openTaskUpdateModal() {
    setTaskUpdateModalOpen(true);
  }

  function closeTaskUpdateModal() {
    setTaskUpdateModalOpen(false);
  }

  function openDeleteColumnModal() {
    setDeleteColumn(true);
  }

  function closeDeleteColumnModal() {
    setDeleteColumn(false);
  }

  function countDoneSubtasks(task) {
    let counter = 0;
    task?.subtasks?.forEach((item) => {
      if (item.done === true) counter++;
    });
    return counter;
  }

  function openUpdateColumnModal() {
    setUpdateColumnModalOpen(true);
  }

  function closeUpdateColumnModal() {
    setUpdateColumnModalOpen(false);
  }

  // column functions
  function getValueByColumnId(id) {
    const column = boardState.columnList.find((column) => column.id === id);
    if (column) return column.selected;
    return false;
  }

  function isColumnSelected() {
    return boardState.columnList.find((column) => column.selected) || false;
  }

  function getSelectedColumnIdList() {
    const selectedColumnList = boardState.columnList.filter((column) => column.selected);
    return selectedColumnList.map((column) => column.id);
  }

  function countSelectedColumn() {
    let counter = 0;
    boardState.columnList.forEach((column) => {
      if (column.selected) counter++;
    });
    return counter;
  }

  // handle events
  function handleTaskClick(task) {
    openTaskViewModal();
    dispatch({ type: 'SET_CURRENT_TASK', payload: task });
  }

  function handleColumnSelectedChange(id, checked) {
    dispatch({ type: 'SET_COLUMN_SELECTED_BY_ID', payload: { id, checked } });
  }

  function handleAllColumnChecked(e) {
    setAsAllColumnChecked(e.target.checked);
    dispatch({ type: 'SET_ALL_COLUMN_CHECKED', payload: e.target.checked });
  }

  function handleColumnDelete() {
    removeColumnList
      .invoke(getSelectedColumnIdList())
      .then(() => {
        closeDeleteColumnModal();
      })
      .catch((err) => console.log({ err }));
  }

  useLayoutEffect(() => {
    dispatch({ type: 'BUILD_BOARD' });
  }, [boardState.currentBoard]);

  return (
    <>
      <Modal isOpen={taskUpdateModalOpen} onRequestClose={closeTaskUpdateModal}>
        <NewTask type="update-task" heading="update task" closeModal={closeTaskUpdateModal} />
      </Modal>
      <Modal isOpen={addColumnModalOpen} onRequestClose={closeAddColumnModal}>
        <NewColumn closeModal={closeAddColumnModal} />
      </Modal>
      <Modal isOpen={updateColumnModalOpen} onRequestClose={closeUpdateColumnModal}>
        <NewColumn type="update-column" closeModal={closeUpdateColumnModal} />
      </Modal>
      <Modal isOpen={taskViewModalOpen} onRequestClose={closeTaskViewModal}>
        <TaskView
          openTaskUpdateModal={openTaskUpdateModal}
          closeTaskViewModal={closeTaskViewModal}
        />
      </Modal>
      <ConfirmAction
        isOpen={deleteColumn}
        onRequestClose={closeDeleteColumnModal}
        onConfirm={handleColumnDelete}
        message="Are you sure to remove column(s)?"
      />
      <div className="board text-static" {...props}>
        <div
          className={`board-column-actions-container background-2 ${
            isColumnSelected() ? 'active' : ''
          }`}>
          <Checkbox
            styles={{
              labelStyles: {
                fontSize: '16px',
                color: 'white',
                fontWeight: 300
              }
            }}
            label="All"
            labelPosition="right"
            name="all"
            id="all"
            checked={isAllColumnChecked}
            onChange={handleAllColumnChecked}
          />
          <div className="column-actions">
            {countSelectedColumn() === 1 && (
              <button onClick={openUpdateColumnModal} className="update-column action-button">
                update
              </button>
            )}
            <button onClick={openDeleteColumnModal} className="delete-column action-button">
              delete
            </button>
          </div>
        </div>
        <div className="board-content">
          {boardState.currentBoard &&
            boardState.columnList?.map((column) => (
              <div key={column.id} className="column">
                <div className="title">
                  <Checkbox
                    checked={getValueByColumnId(column.id)}
                    onChange={(e) => handleColumnSelectedChange(column.id, e.target.checked)}
                    background={column.color}
                    labelPosition="right"
                    label={
                      <>
                        {column.name}
                        {column.taskList && column.taskList.length > 0
                          ? `(${column.taskList.length})`
                          : ''}
                      </>
                    }
                  />
                </div>
                {column?.taskList ? (
                  <ul>
                    {column?.taskList?.map((task, index) => (
                      <Fade
                        key={task.id}
                        delayIndex={index}
                        ms={task.id === boardState?.currentTask.id ? 0 : 100}
                        active={
                          !Object.keys(boardState?.currentTask).length > 0 ||
                          task.id === boardState?.currentTask.id
                        }>
                        <li
                          key={task.id}
                          onClick={() => handleTaskClick(task)}
                          className="text background-2">
                          <h4>{task.title}</h4>
                          <p className="text-static">
                            {countDoneSubtasks(task)} of {task.subtasks.length} subtasks
                          </p>
                        </li>
                      </Fade>
                    ))}
                  </ul>
                ) : (
                  <h5 className="text">No task</h5>
                )}
              </div>
            ))}
          <button className="create-new-column text background" onClick={openAddColumnModal}>
            + new column
          </button>
        </div>
      </div>
    </>
  );
}

export default Board;
