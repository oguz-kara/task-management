import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { BoardContextProvider } from './context/BoardContext';
import { ThemeContextProvider } from './context/ThemeContext';
import './style/_main.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthContextProvider>
    <ThemeContextProvider>
      <BoardContextProvider>
        <App />
      </BoardContextProvider>
    </ThemeContextProvider>
  </AuthContextProvider>
);
