import { motion } from 'framer-motion';
import { useState, useContext, useLayoutEffect, useEffect } from 'react';
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
import './board.scss';
import { ThemeContext } from './../../context/ThemeContext';

function Board(props) {
  const [taskViewModalOpen, setTaskViewModalOpen] = useState(false);
  const [taskUpdateModalOpen, setTaskUpdateModalOpen] = useState(false);
  const [addColumnModalOpen, setAddColumnModalOpen] = useState(false);
  const [updateColumnModalOpen, setUpdateColumnModalOpen] = useState(false);
  const [isAllColumnChecked, setAsAllColumnChecked] = useState(false);
  const [deleteColumn, setDeleteColumn] = useState(false);
  const { boardState, dispatch } = useContext(BoardContext);
  const { removeColumnList, updateColumns } = useBoard();
  const { dark } = useContext(ThemeContext);

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

  useEffect(() => {
    console.log({ boardState });
  }, [boardState]);

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
          animate={isColumnSelected() ? { scaleY: 1 } : { scaleY: 0 }}
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
            onDragEnd={(result) =>
              onDragEnd(result, boardState?.currentBoard.columnList, dispatch)
            }>
            {boardState.currentBoard &&
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
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                className="task-container"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  userSelect: 'none',
                                  padding: '6px 3px',
                                  ...provided.draggableProps.style
                                }}>
                                <Item index={index}>
                                  <Task
                                    style={{
                                      backgroundColor: snapshot.isDragging ? 'rgba(0,0,0,0.1)' : ''
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
          <button
            className={`create-new-column text background ${dark ? 'dark' : 'light'}`}
            onClick={openAddColumnModal}>
            + new column
          </button>
        </div>
      </div>
    </>
  );
}

function Item({ children, index }) {
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
      initial="hidden"
      animate="visible"
      custom={index}
      exit="removed">
      {children}
    </motion.div>
  );
}

export default Board;
