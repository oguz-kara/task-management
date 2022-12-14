import { useState, useContext, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
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
import { motion } from 'framer-motion';
import ConfirmAction from './components/ConfirmAction/ConfirmAction';
import { ConfirmContext } from './context/ConfirmContext';
import { RequireAuth } from './components/RequiredAuth/RequiredAuth';

function App() {
  const { user } = useContext(AuthContext);
  const { dark } = useContext(ThemeContext);
  const { boardState, dispatch } = useContext(BoardContext);
  const { data, dispatch: confirmDispatch } = useContext(ConfirmContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!(boardState.currentBoard && Object.keys(boardState.currentBoard).length > 0))
      dispatch({
        type: 'SET_CURRENT_BOARD',
        payload: user?.userData?.boardList ? user.userData.boardList : []
      });
  }, []);

  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <MainLayout leftOpen={sidebarOpen}>
          <MainLayout.Top>
            <Topbar openSidebar={() => setSidebarOpen(true)} hideMenuIcon={!sidebarOpen} />
          </MainLayout.Top>
          <MainLayout.Left>
            <Sidebar
              closeSidebar={() => setSidebarOpen(false)}
              boardList={user?.userData?.boardList || []}
            />
          </MainLayout.Left>
          <MainLayout.Main closeSidebar={() => setSidebarOpen(false)} sidebarOpen={sidebarOpen}>
            <Main>
              <Outlet />
            </Main>
          </MainLayout.Main>
        </MainLayout>
      ),
      children: [
        {
          path: '/',
          element: (
            <RequireAuth>
              <Board sidebarOpen={sidebarOpen} board={boardState?.currentBoard} />
            </RequireAuth>
          )
        }
      ]
    },
    {
      path: 'login',
      element: <Login />
    },
    {
      path: 'register',
      element: <Register />
    }
  ]);

  return (
    <div className={`${dark ? 'App dark' : 'App light'} background`}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        {Object.keys(data).length > 0 && (
          <ConfirmAction
            isOpen={data.isOpen}
            title={data.title}
            message={data.message}
            onRequestClose={() => confirmDispatch({ type: 'RESET' })}
            onConfirm={() => {
              data.onConfirm();
              confirmDispatch({ type: 'RESET' });
            }}
            buttons={data.buttons}
          />
        )}
      </motion.div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
