import PropTypes from 'prop-types';
import uniqid from 'uniqid';
import { doc, setDoc } from 'firebase/firestore';
import { useState, useContext, useEffect } from 'react';
import './new-board.scss';
import { AuthContext } from '../../context/AuthContext';
import { db } from '../../firebase';
import { useGetDoc } from './../../hooks/useGetDoc';
import { BoardContext } from './../../context/BoardContext';
import { useBoard } from './../../api/board';
import Loader from './../Loader/Loader';

function NewBoard({ closeModal, type = 'add-board', title = 'add new board' }) {
  const [name, setName] = useState('');
  const { boardState } = useContext(BoardContext);
  const { addBoard, updateBoard } = useBoard();

  async function handleSubmit(e) {
    e.preventDefault();
    if (type === 'update-board') {
      const updatedBoard = {
        ...boardState.currentBoard,
        name: name
      };

      updateBoard
        .invoke(updatedBoard)
        .then(() => {
          closeModal();
        })
        .catch((err) => console.log({ err }));
    } else {
      const newBoard = {
        id: uniqid(),
        name,
        columnList: [
          {
            id: 1,
            name: 'todo',
            color: '#48C0E2',
            taskList: []
          },
          {
            id: 2,
            name: 'doing',
            color: 'rebeccapurple',

            taskList: []
          },
          {
            id: 3,
            name: 'done',
            color: 'green',

            taskList: []
          }
        ]
      };
      addBoard
        .invoke(newBoard)
        .then(() => {
          setName('');
          closeModal();
        })
        .catch((err) => console.log({ err }));
    }
  }

  useEffect(() => {
    if (
      type === 'update-board' &&
      boardState.currentBoard &&
      Object.keys(boardState.currentBoard).length > 0
    ) {
      setName(boardState?.currentBoard?.name);
    }
  }, [boardState.currentBoard]);

  return (
    <form
      className="new-board background-2 text"
      onSubmit={handleSubmit}
      onClick={(e) => e.stopPropagation()}>
      <h3>{title}</h3>
      <div className="input-container">
        <label htmlFor="title">name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          name="name"
          id="name"
          placeholder="e.g marketing plan"
        />
      </div>
      <div className="input-container">
        <button type="submit">create new board</button>
      </div>
      {updateBoard.loading || addBoard.loading ? <Loader /> : ''}
    </form>
  );
}

NewBoard.propTypes = {
  closeModal: PropTypes.func
};

export default NewBoard;
