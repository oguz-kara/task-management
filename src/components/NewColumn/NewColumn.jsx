import uniqid from 'uniqid';
import './new-column.scss';
import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import { useColumn } from '../../api/column';

function NewColumn({ closeModal }) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#ffffff');
  const { addColumn } = useColumn();

  function handleSubmit(e) {
    e.preventDefault();
    const newColumn = {
      id: uniqid(),
      name,
      color: color.hex
    };

    addColumn(newColumn)
      .then(() => {
        closeModal();
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="new-column background-2 text">
      <h3>add new column</h3>
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
      </form>
    </div>
  );
}

export default NewColumn;
