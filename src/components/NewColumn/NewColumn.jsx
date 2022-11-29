import uniqid from 'uniqid';
import './new-column.scss';
import React, { useState, useEffect, useContext } from 'react';
import { SketchPicker } from 'react-color';
import { useBoard } from './../../api/board';
import { BoardContext } from './../../context/BoardContext';

function NewColumn({ closeModal, type = 'add-colum', title = 'add new column' }) {
  const [name, setName] = useState('');
  const [error, setError] = useState(false);
  const [color, setColor] = useState({ background: '#fff' });
  const { addColumn, updateColumn } = useBoard();
  const { boardState } = useContext(BoardContext);

  function resetInputs() {
    setName('');
    setColor('');
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (type === 'update-column') {
      const selectedColumn = boardState.columnList.find((column) => column.selected);
      const getSelectedColumn = boardState.currentBoard.columnList.find(
        (column) => column.id === selectedColumn?.id
      );
      const updatedColumn = {
        ...getSelectedColumn,
        name: name,
        color: color.hex
      };
      updateColumn
        .invoke(updatedColumn)
        .then(() => {
          error && setError(false);
          resetInputs();
          closeModal();
        })
        .catch((err) => setError(err.message));
    }

    if ('add-column') {
      const newColumn = {
        id: uniqid(),
        name,
        color: color.hex,
        selected: false
      };
      addColumn
        .invoke(newColumn)
        .then(() => {
          error && setError(false);
          resetInputs();
          closeModal();
        })
        .catch((err) => setError(err.message));
    }
  }

  useEffect(() => {
    if (
      type === 'update-column' &&
      boardState.currentBoard &&
      Object.keys(boardState.currentBoard).length > 0
    ) {
      const selectedColumn = boardState.columnList.find((column) => column.selected);
      const getSelectedColumn = boardState.currentBoard.columnList.find(
        (column) => column.id === selectedColumn?.id
      );
      setName(getSelectedColumn?.name);
      setColor(getSelectedColumn?.color);
    }
  }, [boardState]);

  return (
    <div className={`new-column background-2 text ${error ? 'flash-error' : ''}`}>
      <h3>{title}</h3>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label htmlFor="name">name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            name="name"
            id="name"
          />
        </div>
        <div className="input-container">
          <label>pick color</label>
          <SketchPicker color={color} onChangeComplete={(color) => setColor(color)} />
        </div>
        <button type="submit" className="submit-form-button">
          create column
        </button>
        <div className="error-text">{error && error}</div>
      </form>
    </div>
  );
}

export default NewColumn;
