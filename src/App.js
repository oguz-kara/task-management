import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Board from './pages/Board/Board';
import MainLayout from './components/MainLayout/MainLayout';
import Register from './pages/Register';
import Login from './pages/Login';
import Sidebar from './components/Sidebar/Sidebar';
import Topbar from './components/Topbar/Topbar';
import Main from './components/Main/Main';
import { boardList } from './fakeData';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <MainLayout
        left={<Sidebar boardList={boardList} />}
        top={<Topbar />}
        main={Main}
      />
    ),
    children: [
      {
        path: '/',
        element: <Board board={boardList[0]} />,
      },
    ],
  },
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: 'register',
    element: <Register />,
  },
]);

function App() {
  return (
    <div className="App dark">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
