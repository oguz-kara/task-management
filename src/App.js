import { useState, useContext, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Board from './pages/Board/Board';
import MainLayout from './components/MainLayout/MainLayout';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import Sidebar from './components/Sidebar/Sidebar';
import Topbar from './components/Topbar/Topbar';
import Main from './components/Main/Main';
import { ThemeContext } from './context/ThemeContext.jsx';
import { AuthContext } from './context/AuthContext';
import { BoardContext } from './context/BoardContext';

const RequireAuth = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

function App() {
  const { user } = useContext(AuthContext);
  const { dark } = useContext(ThemeContext);
  const { currentBoard, dispatch } = useContext(BoardContext);

  useEffect(() => {
    dispatch({ type: 'SET_CURRENT_BOARD', payload: user && user.userData.boardList[0] });
  }, []);

  const router = createBrowserRouter([
    {
      path: 'login',
      element: <Login />
    },
    {
      path: 'register',
      element: <Register />
    },
    {
      path: '/',
      element: (
        <MainLayout
          left={<Sidebar boardList={user && user.userData.boardList} />}
          top={<Topbar />}
          main={Main}
        />
      ),
      children: [
        {
          path: '/',
          element: (
            <RequireAuth>
              <Board board={currentBoard} />
            </RequireAuth>
          )
        }
      ]
    }
  ]);
  return (
    <div className={dark ? 'App dark' : 'App light'}>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
