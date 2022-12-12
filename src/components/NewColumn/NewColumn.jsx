import uniqid from 'uniqid';
import React, { useState, useEffect, useContext } from 'react';
import { SketchPicker } from 'react-color';
import { useBoard } from './../../hooks/useBoard';
import { BoardContext } from './../../context/BoardContext';
import './new-column.scss';

function NewColumn({ closeModal, type = 'add-column', title = 'add new column' }) {
  const initialColor = '#00FF00';
  const [name, setName] = useState('');
  const [error, setError] = useState(false);
  const [color, setColor] = useState({ hex: initialColor });
  const { addColumn, updateColumn } = useBoard();
  const { boardState } = useContext(BoardContext);

  const resetInputs = () => {
    setName('');
    setColor({ hex: initialColor });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (type === 'update-column') {
      const selectedColumn = boardState?.currentBoard?.columnList?.find(
        (column) => column.selected
      );

      try {
        const updatedColumn = {
          ...selectedColumn,
          name: name,
          color: color.hex
        };
        await updateColumn.invoke(updatedColumn);
        if (error) setError(false);
        resetInputs();
        closeModal();
      } catch (err) {
        setError(err.message);
      }
    }

    if (type === 'add-column') {
      try {
        const newColumn = {
          id: uniqid(),
          name,
          color: color.hex,
          selected: false,
          taskList: []
        };
        await addColumn.invoke(newColumn);
        if (error) setError(false);
        resetInputs();
        closeModal();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    if (
      type === 'update-column' &&
      boardState.currentBoard &&
      Object.keys(boardState.currentBoard).length > 0
    ) {
      const selectedColumn = boardState?.currentBoard?.columnList?.find(
        (column) => column.selected
      );
      const getSelectedColumn = boardState.currentBoard.columnList.find(
        (column) => column.id === selectedColumn?.id
      );
      setName(getSelectedColumn?.name);
      setColor({ hex: getSelectedColumn?.color });
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
        {error && <div className="error-text">{error}</div>}
      </form>
    </div>
  );
}

export default NewColumn;
