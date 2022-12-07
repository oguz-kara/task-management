import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { BoardContextProvider } from './context/BoardContext';
import { ThemeContextProvider } from './context/ThemeContext';
import { ConfirmContextProvider } from './context/ConfirmContext';
import './style/_main.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthContextProvider>
    <ThemeContextProvider>
      <BoardContextProvider>
        <ConfirmContextProvider>
          <App />
        </ConfirmContextProvider>
      </BoardContextProvider>
    </ThemeContextProvider>
  </AuthContextProvider>
);
