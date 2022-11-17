import PropTypes from 'prop-types';
import uniqid from 'uniqid';
import { doc, setDoc } from 'firebase/firestore';
import { useState, useContext } from 'react';
import './new-board.scss';
import { AuthContext } from '../../context/AuthContext';
import { db } from '../../firebase';
import { useGetDoc } from './../../hooks/useGetDoc';
import { BoardContext } from './../../context/BoardContext';

function NewBoard({ closeModal }) {
  const [name, setName] = useState('');
  const { user, dispatch } = useContext(AuthContext);
  const { loading, refetch } = useGetDoc('users', user?.uid);
  const { dispatch: dispatchBoard } = useContext(BoardContext);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      // create new board on firebase store.
      await setDoc(doc(db, 'users', user.uid), {
        boardList: [
          ...user.userData.boardList,
          {
            id: uniqid(),
            name,
            columnList: [
              {
                id: 1,
                name: 'todo',
                color: '#48C0E2'
              },
              {
                id: 2,
                name: 'doing',
                color: 'rebeccapurple'
              },
              {
                id: 3,
                name: 'done',
                color: 'green'
              }
            ],
            taskList: []
          }
        ]
      });

      // refetch the user data which includes board list.
      const data = await refetch();

      // set updated user board list, in authcontext
      dispatch({ type: 'SET_BOARD_LIST', payload: data.boardList });

      // set current board with last item of the board list which means newly created board.
      dispatchBoard({
        type: 'SET_CURRENT_BOARD',
        payload: data.boardList[data.boardList.length - 1]
      });
      if (!loading) {
        closeModal();
        setName('');
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <form
      className="new-board background-2 text"
      onSubmit={handleSubmit}
      onClick={(e) => e.stopPropagation()}>
      <h3>New board</h3>
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
        <button type="submit">
          create new board
          {loading && <p>loading</p>}
        </button>
      </div>
    </form>
  );
}

NewBoard.propTypes = {
  closeModal: PropTypes.func
};

export default NewBoard;
