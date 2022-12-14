import { useState } from 'react';
import { Link } from 'react-router-dom';
import './register.scss';
import { register } from '../../api/auth';
import Loader from './../../components/Loader/Loader';

function Register() {
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isPasswordValid = (password, confirmPassword) => {
    if (password !== '' && confirmPassword !== '') {
      if (password !== confirmPassword) {
        setError('Passwords do not match!');
        return false;
      }
    }
    return true;
  };

  const isEmailAlreadyInUse = (message) => {
    return message === 'Firebase: Error (auth/email-already-in-use).';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (error) setError('');
    if (message !== '') setMessage('');

    if (isPasswordValid(password, confirmPassword)) {
      setLoading(true);
      try {
        await register({ email, password });
        setMessage('Successfully registered, you can login to your acoount.');
      } catch (err) {
        if (isEmailAlreadyInUse(err.message)) {
          setError('Email already in use!');
        }
      } finally {
        setLoading(false);
      }
    } else {
      setError('Password do not match!');
    }
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="register background">
      <form className="background-2" onSubmit={handleSubmit}>
        <h2 className="text">Register</h2>
        <div className="input-container">
          <input
            className="background"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
            type="text"
            name="email"
            id="email"
          />
        </div>
        <div className="input-container">
          <input
            className="background"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            type="password"
            name="password"
            id="password"
          />
        </div>
        <div className="input-container">
          <input
            className="background"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="password again"
            type="password"
            name="password-again"
            id="password-again"
          />
        </div>
        <Link to="/login" className="link text">
          Do you have an account?
        </Link>
        <button type="submit">register</button>
        {loading ? <Loader /> : ''}
        {error && <p className="error-text">{error}</p>}
        {message !== '' && (
          <p className="success-text">
            {message}{' '}
            <Link className="text" to="/login">
              Login
            </Link>
          </p>
        )}
      </form>
    </div>
  );
}

export default Register;
