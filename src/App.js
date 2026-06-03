import Header from './components/header';
import SecondHeader from './components/secondHeader';
import Main from './components/main';
import Footer from './components/footer';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login';
import SignUp from './components/signup';
import Dashboard from './components/dashboard';
import LogProblems from './components/logproblems';
import ProblemsList from './components/problemsList';
import { useLocation } from 'react-router-dom'; // Keep useLocation for header/footer logic
import AuthProvider from './contexts/AuthProvider'; // Import the new AuthProvider
import ProtectedRoute from './contexts/ProtectedRoute';

function App() {
  const location = useLocation();
  const noHeaderFooterPaths = ['/login', '/signup', '/dashboard', '/logproblems', '/problemsList'];
  const noSecondHeaderPaths = ['/login', '/signup', '/'];
  const showHeaderFooter = !noHeaderFooterPaths.includes(location.pathname);
  const showSecondHeader = !noSecondHeaderPaths.includes(location.pathname);
  return (
    <div className="App">
      <AuthProvider>
        {showHeaderFooter && <Header />}
        {showSecondHeader && <SecondHeader />}
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/logproblems" element={<ProtectedRoute><LogProblems /></ProtectedRoute>} />
          <Route path="/problemsList" element={<ProtectedRoute><ProblemsList /></ProtectedRoute>} />
        </Routes>
        {showHeaderFooter && <Footer />}
      </AuthProvider>
    </div>
  );
}

export default App;