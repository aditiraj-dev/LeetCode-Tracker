import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { calcInitialReview } from '../utils';
import problems from '../problems';
import './css/logproblems.css';


function LogProblems() {
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState(null);
    const [difficulty, setDifficulty] = useState('Easy');
    const [dateSolved, setDateSolved] = useState('');
    const [solvedQuality, setSolvedQuality] = useState('Used Solution');
    const [suggestions, setSuggestions] = useState([]);

    const navigate = useNavigate();

    const handleSearch = async (e) => {
        const value = e.target.value;
        setSearch(value);
        if(value.length < 2) {setSuggestions([]); return;}
        const filtered = problems.filter(p => p.name.toLowerCase().includes(value.toLowerCase())).slice(0, 5);
        setSuggestions(filtered);
    };

    const handleSelect = (problem) => {
        setSelected(problem);
        setSearch(problem.name);
        setSuggestions([]);
        setDifficulty(problem.difficulty);  
        setSolvedQuality('Used Solution');
    };

    const handleSubmit = async () => {
        if(!selected) {alert('Please select a problem from the suggestions'); return;}
        if(!dateSolved) {alert('Please enter the date you solved the problem'); return;}
        const {data : {user}} = await supabase.auth.getUser();
        const { error } = await supabase.from('problems').insert({
            user_id: user.id,
            problem_id: selected.id,
            problem_name: selected.name,
            topic: selected.topic,
            difficulty: difficulty,
            date_solved: dateSolved,
            solve_quality: solvedQuality,
            next_review_date: calcInitialReview(solvedQuality, difficulty, dateSolved)
        });
        if(error) {
            alert('Error logging problem: ' + error.message);
        } else { 
            alert('Problem logged successfully!');
            navigate('/dashboard');
        }
    };


    return (
        <div className="log-page">
        <div className="log-card">
            <h1 className="log-title">Log a Problem</h1>
            <p className="log-sub">Record a problem you've solved to add to your revision schedule.</p>

            <div className="log-form">
                <div className="log-field">
                    <label className="log-label">Problem Name</label>
                    <input
                        className={`log-input ${selected ? `input-${selected.difficulty.toLowerCase()}` : ''}`}
                        type="text"
                        placeholder="Search problem name..."
                        value={search}
                        onChange={handleSearch}
                    />
                    {suggestions.length > 0 && (
                        <ul className="suggestions">
                            {suggestions.map(p => (
                                <li key={p.leetcode_number} className="suggestion-item" onClick={() => handleSelect(p)}>
                                    <span className="suggestion-num">{p.leetcode_number}.</span>
                                    <span className="suggestion-name">{p.name}</span>
                                    <span className="suggestion-topic">{p.topic}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {selected && (
                    <div className="selected-info">
                        <span className={`difficulty-badge badge-${selected.difficulty.toLowerCase()}`}>{selected.difficulty}</span>
                        <span className="selected-topic">{selected.topic}</span>
                    </div>
                )}

                <div className="log-field">
                    <label className="log-label">How hard was it to solve?</label>
                    <select className="log-select" value={solvedQuality} onChange={(e) => setSolvedQuality(e.target.value)}>
                        <option value="Used Solution">Used Solution</option>
                        <option value="Solved With Hints">Solved With Hints</option>
                        <option value="Solved Independently">Solved Independently</option>
                    </select>
                </div>

                <div className="log-field">
                    <label className="log-label">Date Solved</label>
                    <input className="log-input" type="date" value={dateSolved} onChange={(e) => setDateSolved(e.target.value)} />
                </div>

                <button className="log-btn" onClick={handleSubmit}>Log Problem</button>
            </div>
        </div>
    </div>
    );
}

export default LogProblems;