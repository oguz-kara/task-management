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

function NewBoard({ closeModal, type = 'add-board', title = 'add new board' }) {
  const [name, setName] = useState('');
  const { user, dispatch } = useContext(AuthContext);
  const { loading, refetch } = useGetDoc('users', user?.uid);
  const { boardState, dispatch: dispatchBoard } = useContext(BoardContext);
  const { updateBoard } = useBoard();

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
      console.log('else');
      try {
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
