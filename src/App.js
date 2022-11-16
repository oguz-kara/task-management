import { useState, useContext, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Board from './pages/Board/Board';
import MainLayout from './components/MainLayout/MainLayout';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import Sidebar from './components/Sidebar/Sidebar';
import Topbar from './components/Topbar/Topbar';
import Main from './components/Main/Main';
import { ThemeContext } from './context/themeContext';
import { AuthContextProvider, AuthContext } from './context/AuthContext';

const RequireAuth = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

function App() {
  const [dark, setDark] = useState(true);
  const { user } = useContext(AuthContext);

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
              <Board board={user && user.userData.boardList[0]} />
            </RequireAuth>
          )
        }
      ]
    }
  ]);
  return (
    <ThemeContext.Provider value={{ dark: dark, setDark: setDark }}>
      <AuthContextProvider>
        <div className={dark ? 'App dark' : 'App light'}>
          <RouterProvider router={router} />
        </div>
      </AuthContextProvider>
    </ThemeContext.Provider>
  );
}

export default App;
