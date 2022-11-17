import { useState } from 'react';
import { Link } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../../firebase';
import './register.scss';

function Register() {
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');

  function isPasswordValid() {
    let isValid = true;
    if (password !== '' && passwordAgain !== '') {
      if (password !== passwordAgain) {
        isValid = false;
        setError('Passwords do not match!');
      }
    }
    return isValid;
  }

  function isEmailAlreadyInUse(message) {
    return message === 'Firebase: Error (auth/email-already-in-use).';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    error && setError('');

    if (isPasswordValid()) {
      try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', res.user.uid), {
          boardList: [
            {
              id: 1,
              name: 'Starter',
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
      } catch (err) {
        if (isEmailAlreadyInUse(err.message)) {
          setError('Email already in use!');
        }
      }
    }

    setEmail('');
    setPassword('');
    setPasswordAgain('');
  }

  return (
    <div className="register">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <input
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            type="text"
            name="password"
            id="password"
          />
        </div>
        <div className="input-container">
          <input
            value={passwordAgain}
            onChange={(e) => setPasswordAgain(e.target.value)}
            placeholder="password again"
            type="text"
            name="password-again"
            id="password-again"
          />
        </div>
        <Link to="/login" className="link">
          Do you have an account?
        </Link>
        <button type="submit">register</button>
      </form>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}

export default Register;
