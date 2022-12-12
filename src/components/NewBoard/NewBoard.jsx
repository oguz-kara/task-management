import { useState, useContext, useEffect } from 'react';
import { BoardContext } from './../../context/BoardContext';
import { useBoard } from './../../hooks/useBoard';
import Loader from './../Loader/Loader';
import { newBoardSkeleton } from '../../data/newBoardSkeleton';
import './new-board.scss';

function NewBoard({ closeModal, type = 'add-board', title = 'add new board' }) {
  const [name, setName] = useState('');
  const { boardState } = useContext(BoardContext);
  const { addBoard, updateBoard } = useBoard();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (type === 'update-board') {
      const updatedBoard = {
        ...boardState.currentBoard,
        name: name
      };

      try {
        await updateBoard.invoke(updatedBoard);
        closeModal();
      } catch (err) {
        console.log({ err });
      }
    } else {
      try {
        const newBoard = newBoardSkeleton(name);
        await addBoard.invoke(newBoard);
        setName('');
        closeModal();
      } catch (err) {
        console.log({ err });
      }
    }
  };

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

export default NewBoard;
