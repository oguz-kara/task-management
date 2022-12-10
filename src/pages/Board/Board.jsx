import { motion } from 'framer-motion';
import { useState, useContext, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Modal from '../../components/Modal/Modal';
import { BoardContext } from './../../context/BoardContext';
import TaskView from '../../components/TaskView/TaskView';
import NewTask from './../../components/NewTask/NewTask';
import NewColumn from '../../components/NewColumn/NewColumn';
import Checkbox from './../../components/Checkbox/Checkbox';
import ConfirmAction from '../../components/ConfirmAction/ConfirmAction';
import { useBoard } from './../../api/board';
import { UilPen } from '@iconscout/react-unicons';
import { UilTimesCircle } from '@iconscout/react-unicons';
import Task from '../../components/Task/Task';
import { ThemeContext } from './../../context/ThemeContext';
import { ConfirmContext } from './../../context/ConfirmContext';
import './board.scss';

function Board(props) {
  const [taskViewModalOpen, setTaskViewModalOpen] = useState(false);
  const [taskUpdateModalOpen, setTaskUpdateModalOpen] = useState(false);
  const [addColumnModalOpen, setAddColumnModalOpen] = useState(false);
  const [updateColumnModalOpen, setUpdateColumnModalOpen] = useState(false);
  const [isAllColumnChecked, setAsAllColumnChecked] = useState(false);
  const [deleteColumn, setDeleteColumn] = useState(false);
  const { boardState, dispatch } = useContext(BoardContext);
  const { dark } = useContext(ThemeContext);
  const { dispatch: confirmDispatch } = useContext(ConfirmContext);
  const { removeColumnList, updateColumns } = useBoard();
  const hasRenderedTaskListRef = useRef(false);

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

  function getColumnNames(columnList) {
    let result = '';
    columnList.forEach((item, i) => {
      if (item.selected) result = `${result} ${item.name}`;
    });
    return result.trim().split(' ').join(', ');
  }

  function openDeleteColumnModal() {
    const confirmData = {
      isOpen: true,
      title: {
        text: 'Delete this task?',
        color: '#ea5555'
      },
      message: `Are you sure you want to delete the '${getColumnNames(
        boardState?.currentBoard?.columnList
      )}' column(s)? This action will remove these columns and tasks and cannot be reversed. `,
      onRequestClose: () => confirmDispatch({ type: 'RESET' }),
      onConfirm: handleColumnDelete,
      buttons: {
        approve: {
          text: 'Delete',
          className: 'bg-danger text',
          style: { color: '#fff' }
        },
        reject: {
          text: 'Cancel',
          backgroundColor: null,
          className: 'primary-color'
        }
      }
    };
    confirmDispatch({ type: 'CONFIRM', payload: confirmData });
  }

  function closeDeleteColumnModal() {
    setDeleteColumn(false);
  }

  function openUpdateColumnModal() {
    setUpdateColumnModalOpen(true);
  }

  function closeUpdateColumnModal() {
    setUpdateColumnModalOpen(false);
  }

  // column functions
  function getValueByColumnId(id) {
    const column = boardState?.currentBoard?.columnList.find((column) => column.id === id);
    if (column) return column.selected;
    return false;
  }

  function isColumnSelected() {
    return boardState?.currentBoard?.columnList?.find((column) => column.selected) || false;
  }

  function countSelectedColumn() {
    let counter = 0;
    boardState?.currentBoard?.columnList?.forEach((column) => {
      if (column.selected) counter++;
    });
    return counter;
  }

  function handleTaskClick(task) {
    openTaskViewModal();
    dispatch({ type: 'SET_CURRENT_TASK', payload: task });
  }

  function handleColumnSelectedChange(id, checked) {
    dispatch({ type: 'SET_COLUMN_SELECTED_BY_ID', payload: { id, checked } });
  }

  function handleAllColumnChecked(e) {
    setAsAllColumnChecked(e.target.checked);
    dispatch({
      type: 'SET_ALL_COLUMN_SELECTED_BY_VALUE',
      payload: { checked: e.target.checked }
    });
  }

  function handleColumnDelete() {
    removeColumnList
      .invoke()
      .then(() => {
        closeDeleteColumnModal();
      })
      .catch((err) => console.log({ err }));
  }

  function onDragEnd(result, columns, setColumns) {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId != destination.droppableId) {
      const sourceColumn = columns.find((item) => item.id == source.droppableId);
      const destColumn = columns.find((item) => item.id == destination.droppableId);
      const sourceItems = [...sourceColumn.taskList];
      const destItems = [...destColumn.taskList];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, { ...removed, status: destColumn.name });

      const updatedColumns = columns.map((item) => {
        if (item.id == destination.droppableId) {
          return {
            ...item,
            taskList: destItems
          };
        }
        if (item.id == source.droppableId)
          return {
            ...item,
            taskList: sourceItems
          };
        return item;
      });

      setColumns({ type: 'SET_COLUMNS', payload: updatedColumns });
      updateColumns.invoke(updatedColumns).catch((err) => console.log({ err }));
    } else {
      const column = columns.find((item) => item.id == source.droppableId);
      const copiedItems = [...column?.taskList];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      const updatedColumns = columns.map((item) => {
        if (item.id == source.droppableId)
          return {
            ...item,
            taskList: copiedItems
          };
        return item;
      });

      setColumns({ type: 'SET_COLUMNS', payload: updatedColumns });
      updateColumns.invoke(updatedColumns).catch((err) => console.log({ err }));
    }
  }

  function onDragStart(result) {
    if (!(Object.keys(boardState?.currentTask).length > 0)) {
      const task = boardState?.currentBoard.columnList
        ?.map(({ taskList }) => taskList)
        .flat(1)
        .find((task) => task.id === result.draggableId);
      console.log({ task });

      if (task) dispatch({ type: 'SET_CURRENT_TASK', payload: task });
    }
  }

  useEffect(() => {
    console.log({ currentTask: boardState.currentTask });
  }, [boardState.currentTask, boardState.currentBoard]);

  return (
    <>
      <Modal isOpen={taskUpdateModalOpen} onRequestClose={closeTaskUpdateModal}>
        <NewTask type="update-task" heading="update task" closeModal={closeTaskUpdateModal} />
      </Modal>
      <Modal isOpen={addColumnModalOpen} onRequestClose={closeAddColumnModal}>
        <NewColumn closeModal={closeAddColumnModal} />
      </Modal>
      <Modal isOpen={updateColumnModalOpen} onRequestClose={closeUpdateColumnModal}>
        <NewColumn title="update column" type="update-column" closeModal={closeUpdateColumnModal} />
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
        <motion.div
          animate={
            isColumnSelected() ? { display: 'flex', opacity: 1 } : { display: 'none', opacity: 0 }
          }
          transition={{ duration: 0.1 }}
          className={`board-column-actions-container background-2 ${
            isColumnSelected() ? 'active' : ''
          }`}>
          <Checkbox
            className="background"
            styles={{
              labelStyles: {
                fontSize: '12px',
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
                <span>
                  <UilPen />
                </span>
                <span>update</span>
              </button>
            )}
            <button onClick={openDeleteColumnModal} className="delete-column action-button">
              <span>
                <UilTimesCircle />
              </span>
              <span>delete</span>
            </button>
          </div>
        </motion.div>
        <div className="board-content">
          <DragDropContext
            onDragStart={onDragStart}
            onDragEnd={(result) =>
              onDragEnd(result, boardState?.currentBoard?.columnList, dispatch)
            }>
            {boardState?.currentBoard &&
              boardState.currentBoard?.columnList?.map(({ id, taskList, color, name }) => (
                <div className="column">
                  <div className="title">
                    <Checkbox
                      className="background-2"
                      checked={getValueByColumnId(id)}
                      onChange={(e) => handleColumnSelectedChange(id, e.target.checked)}
                      background={color}
                      labelPosition="right"
                      label={
                        <>
                          {name}
                          {taskList?.length > 0 ? `(${taskList?.length})` : ''}
                        </>
                      }
                      styles={{ labelStyles: { fontWeight: 600, fontSize: 14 } }}
                    />
                  </div>
                  <Droppable droppableId={id.toString()} key={id}>
                    {(provided) => (
                      <ul
                        className={`${taskList?.length < 1 ? 'empty' : ''}`}
                        {...provided.droppableProps}
                        ref={provided.innerRef}>
                        {taskList?.map((task, index) => (
                          <Draggable
                            bounds="parent"
                            key={task.id}
                            draggableId={task.id}
                            index={index}>
                            {(provided, snapshot) => (
                              <div
                                className="task-container"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  userSelect: 'none',
                                  paddingTop: '5px',
                                  ...provided.draggableProps.style
                                }}>
                                <Item
                                  index={index}
                                  condition={Object.keys(boardState?.currentTask).length > 0}>
                                  <Task
                                    dark={dark}
                                    style={{
                                      transform:
                                        snapshot.isDragging && !snapshot.dropAnimation
                                          ? 'rotate(3deg)'
                                          : 'rotate(0)'
                                    }}
                                    task={task}
                                    onClick={handleTaskClick}
                                  />
                                </Item>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </ul>
                    )}
                  </Droppable>
                </div>
              ))}
          </DragDropContext>
          {boardState?.currentBoard?.columnList && (
            <button
              className={`create-new-column text background ${dark ? 'dark' : 'light'}`}
              onClick={openAddColumnModal}>
              + new column
            </button>
          )}
        </div>
      </div>
    </>
  );
}

function Item({ children, index, condition }) {
  const variants = {
    hidden: (i) => ({
      opacity: 0,
      y: -50 + i
    }),
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05
      }
    }),
    removed: {
      opacity: 0
    }
  };
  return (
    <motion.div
      variants={variants}
      initial={condition ? '' : 'hidden'}
      animate={condition ? '' : 'visible'}
      custom={index}
      exit="removed">
      {children}
    </motion.div>
  );
}

export default Board;
