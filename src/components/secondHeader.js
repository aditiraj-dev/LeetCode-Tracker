import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import './css/second_header.css';

function SecondHeader() {
    const navigate = useNavigate();
    const location = useLocation();
    const { session } = useAuth();

    const handleSignOut = async () => {
        await supabase.auth.signOut(); // This clears the session
        navigate('/'); // This explicitly navigates to the home page after signing out
    };

    return (
        <div className="SecondHeader">
            <div className="second-header-nav">
                <button 
                    className={location.pathname === '/dashboard' ? 'active' : ''}
                    onClick={() => navigate('/dashboard')}>
                    Dashboard
                </button>
                <button
                    className={location.pathname === '/problemsList' ? 'active' : ''}
                    onClick={() => navigate('/problemsList')}>
                    Problems List
                </button>
            </div>
            {session && (
                <div className="second-header-actions"> {/* This div ensures the button is grouped and pushed to the right */}
                    <button className="App-headerButton App-headerButton-primary" onClick={handleSignOut}>
                        Sign Out
                    </button>
                </div>
            )}
        </div>
    );
}

export default SecondHeader;