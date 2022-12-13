import { useContext } from 'react';
import { AuthContext } from './../../context/AuthContext';
import { Navigate } from 'react-router-dom';

export const RequireAuth = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};
