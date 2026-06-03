import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './css/header.css';

function Header() {
  const navigate = useNavigate();
  const { session } = useAuth();

  return (
    <header className="App-header">
      <h1 onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>LeetCode Tracker</h1>
      <div className="App-headerActions">
        {!session && (
          <>
            <button onClick={() => navigate('/login')} className="App-headerButton">Login</button>
            <button onClick={() => navigate('/signup')} className="App-headerButton">
              Sign Up
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
