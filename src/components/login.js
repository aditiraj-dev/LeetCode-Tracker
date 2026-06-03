import { supabase } from '../supabaseClient';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './css/auth.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if(error) {
            alert('Error logging in: ' + error.message);
        } else {
            navigate('/dashboard'); 
        }
    };

    return (
        <div className="auth-page">
        <div className="auth-card">
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-sub">Log in to your LeetCode Tracker account.</p>
            <div className="auth-form">
                <input className="auth-input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className="auth-input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="auth-btn" onClick={handleLogin}>Login</button>
            </div>
            <p className="auth-switch">Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </div>
    </div>
    );
}

export default Login;