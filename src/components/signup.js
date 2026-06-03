import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import './css/auth.css';

function SignUp () {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if(error) {
            alert('Error signing up: ' + error.message);
        } else {
            alert('Sign up successful!');
        }
    };
    
    return (
        <div className="auth-page">
        <div className="auth-card">
            <h1 className="auth-title">Create account</h1>
            <p className="auth-sub">Start tracking your LeetCode progress today.</p>
            <div className="auth-form">
                <input className="auth-input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className="auth-input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <input className="auth-input" type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                <button className="auth-btn" onClick={handleSignUp}>Sign Up</button>
            </div>
            <p className="auth-switch">Already have an account? <Link to="/login">Login</Link></p>
        </div>
    </div>
    );
}

export default SignUp;