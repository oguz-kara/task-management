import { Item } from '../../motion/Item';
import { motion } from 'framer-motion';
import { useState, useContext, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Modal from '../../components/Modal/Modal';
import { BoardContext } from './../../context/BoardContext';
import TaskView from '../../components/TaskView/TaskView';
import NewTask from './../../components/NewTask/NewTask';
import NewColumn from '../../components/NewColumn/NewColumn';
import Checkbox from './../../components/Checkbox/Checkbox';
import ConfirmAction from '../../components/ConfirmAction/ConfirmAction';
import { useBoard } from './../../hooks/useBoard';
import { UilPen } from '@iconscout/react-unicons';
import { UilTimesCircle } from '@iconscout/react-unicons';
import Task from '../../components/Task/Task';
import { ThemeContext } from './../../context/ThemeContext';
import { ConfirmContext } from './../../context/ConfirmContext';
import { openConfirmModal } from '../../helpers/confirmModal';
import './board.scss';

function Board({ sidebarOpen, ...props }) {
  const [taskViewModalOpen, setTaskViewModalOpen] = useState(false);
  const [taskUpdateModalOpen, setTaskUpdateModalOpen] = useState(false);
  const [addColumnModalOpen, setAddColumnModalOpen] = useState(false);
  const [updateColumnModalOpen, setUpdateColumnModalOpen] = useState(false);
  const [isAllColumnChecked, setAsAllColumnChecked] = useState(false);
  const [deleteColumn, setDeleteColumn] = useState(false);
  const { removeColumnList, updateColumns } = useBoard();
  const { boardState, dispatch } = useContext(BoardContext);
  const { dark } = useContext(ThemeContext);
  const { dispatch: confirmDispatch } = useContext(ConfirmContext);
  const boardRef = useRef(null);

  const getValueByColumnId = (columnList, id) => {
    const column = columnList?.find((column) => column.id === id);
    return column ? column.selected : false;
  };

  const isColumnSelected = (columnList) => {
    return columnList?.find((column) => column.selected) || false;
  };

  const countSelectedColumn = (columnList) => {
    return columnList?.filter(({ selected }) => selected).length || 0;
  };

  const handleTaskClick = (task) => {
    setTaskViewModalOpen(true);
    dispatch({ type: 'SET_CURRENT_TASK', payload: task });
  };

  const handleColumnSelectedChange = (id, checked) => {
    dispatch({ type: 'SET_COLUMN_SELECTED_BY_ID', payload: { id, checked } });
  };

  const handleAllColumnChecked = (e) => {
    setAsAllColumnChecked(e.target.checked);
    dispatch({
      type: 'SET_ALL_COLUMN_SELECTED_BY_VALUE',
      payload: { checked: e.target.checked }
    });
  };

  const handleColumnDelete = () => {
    removeColumnList
      .invoke()
      .then(() => {
        setDeleteColumn(false);
      })
      .catch((err) => console.log({ err }));
  };

  const onDragEnd = (result, columns, setColumns) => {
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
  };

  const onDragStart = (result) => {
    if (!(Object.keys(boardState?.currentTask).length > 0)) {
      const task = boardState?.currentBoard.columnList
        ?.map(({ taskList }) => taskList)
        .flat(1)
        .find((task) => task.id === result.draggableId);
      if (task) dispatch({ type: 'SET_CURRENT_TASK', payload: task });
    }
  };

  return (
    <>
      <Modal isOpen={taskUpdateModalOpen} onRequestClose={() => setTaskUpdateModalOpen(false)}>
        <NewTask
          type="update-task"
          heading="update task"
          closeModal={() => setTaskUpdateModalOpen(false)}
          data={boardState?.currentTask}
        />
      </Modal>
      <Modal isOpen={addColumnModalOpen} onRequestClose={() => setAddColumnModalOpen(false)}>
        <NewColumn closeModal={() => setAddColumnModalOpen(false)} />
      </Modal>
      <Modal isOpen={updateColumnModalOpen} onRequestClose={() => setUpdateColumnModalOpen(false)}>
        <NewColumn
          title="update column"
          type="update-column"
          data={boardState?.currentBoard?.columnList?.find(({ selected }) => selected)}
          closeModal={() => setUpdateColumnModalOpen(false)}
        />
      </Modal>
      <Modal isOpen={taskViewModalOpen} onRequestClose={() => setTaskViewModalOpen(false)}>
        <TaskView
          openTaskUpdateModal={() => setTaskUpdateModalOpen(true)}
          closeTaskViewModal={() => setTaskViewModalOpen(false)}
        />
      </Modal>
      <ConfirmAction
        isOpen={deleteColumn}
        onRequestClose={() => setDeleteColumn(false)}
        onConfirm={handleColumnDelete}
        message="Are you sure to remove column(s)?"
      />
      <div
        ref={boardRef}
        className={`${sidebarOpen ? 'board-side-open' : 'board-side-close'} board text-static`}
        {...props}>
        <motion.div
          animate={
            isColumnSelected(boardState?.currentBoard?.columnList)
              ? { display: 'flex', opacity: 1 }
              : { display: 'none', opacity: 0 }
          }
          transition={{ duration: 0.1 }}
          className={`board-column-actions-container background-2 ${
            isColumnSelected(boardState?.currentBoard?.columnList) ? 'active' : ''
          }`}>
          <Checkbox
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
            {countSelectedColumn(boardState?.currentBoard?.columnList) === 1 && (
              <button
                onClick={() => setUpdateColumnModalOpen(true)}
                className="update-column action-button">
                <span>
                  <UilPen />
                </span>
                <span>update</span>
              </button>
            )}
            <button
              onClick={() => openConfirmModal({ confirmDispatch, onConfirm: handleColumnDelete })}
              className="delete-column action-button">
              <span>
                <UilTimesCircle />
              </span>
              <span>delete</span>
            </button>
          </div>
        </motion.div>
        <div className="board-content">
          <DragDropContext
            onDragStart={(result) => onDragStart(result)}
            onDragEnd={(result) =>
              onDragEnd(result, boardState?.currentBoard?.columnList, dispatch)
            }>
            {boardState?.currentBoard &&
              boardState?.currentBoard?.columnList?.map(({ id, taskList, color, name }) => (
                <div className="column" key={id}>
                  <div className="title">
                    <Checkbox
                      className="background-2"
                      checked={getValueByColumnId(boardState?.currentBoard?.columnList, id)}
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
                                  paddingTop: '10px',
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
              onClick={() => setAddColumnModalOpen(true)}>
              + new column
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default Board;
