import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../api/auth';
import { AuthContext } from './../../context/AuthContext';
import Loader from './../../components/Loader/Loader';
import './login.scss';
import { getLoginErrorMessage } from '../../error/firebaseError';

function Login() {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthContext);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login({ email, password });
      if (user instanceof Error) throw user;
      dispatch({ type: 'LOGIN', payload: user });
    } catch (err) {
      console.log({ err });
      setLoading(false);
      setError(getLoginErrorMessage(err) || 'an error occured!');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user]);

  return (
    <div className="login background text">
      <form onSubmit={handleLogin} className="background-2">
        <h2 className="text">Login</h2>
        <div className="input-container">
          <input
            className="background"
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
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            type="password"
            name="password"
            id="password"
          />
        </div>
        <Link to="/register" className="text link">
          Don't you have an account?
        </Link>
        <button>login</button>
        {loading ? <Loader /> : ''}
        {error.length > 0 && <p className="error-text">{error}</p>}
      </form>
    </div>
  );
}

export default Login;
