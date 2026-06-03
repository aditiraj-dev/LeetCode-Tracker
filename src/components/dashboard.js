import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { updateStreak, updateConsecutiveMasteries, calcNextReview } from '../utils';
import './css/dashboard.css';
import LogProblems from './logproblems';

function Dashboard() {
    const [problemsSolved, setProblemsSolved] = useState(0);
    const [revisionQueue, setRevisionQueue] = useState([]);
    const problemLink = (problem) => `https://leetcode.com/problems/${problem.problem_name.replace(/\s+/g, '-').toLowerCase()}`;
    const [outcomes, setOutcomes] = useState({});
    const [showPopup, setShowPopup] = useState(false);

    const sort = (lastReviewOutcome, difficulty, daysOverdue) => {
        //lastReviewOutcome has higher priority then difficulty, and difficulty has higher priority than days overdue
        const outcomePriority = {
            'Forgot': 1,
            'Solved With Hints': 2,
            'Solved Comfortably': 3,
            'Mastered': 4
        };
        const difficultyPriority = {
            'Easy': 3,
            'Medium': 2,
            'Hard': 1
        };  
        return (outcomePriority[lastReviewOutcome] || 5) * 100 + (difficultyPriority[difficulty] || 4) * 10 - daysOverdue;
    }   

    const fetchData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase.from('problems').select('*').eq('user_id', user.id);
        if (error) {
            alert('Error fetching data: ' + error.message);
        } else {
            setProblemsSolved(data.length);
            const today = new Date();
            const daysOverdue = (problem) => Math.floor((today - new Date(problem.next_review_date)) / (1000 * 60 * 60 * 24));
            const filtered = data.filter(p => new Date(p.next_review_date) <= today && !p.archived);
            const queue = filtered.sort((a, b) => sort(a.last_review_outcome, a.difficulty, daysOverdue(a)) - sort(b.last_review_outcome, b.difficulty, daysOverdue(b))).slice(0, 10);
            setRevisionQueue(queue);
        }
    };

    const handleOutcomeChange = (problemId, outcome) => {
        setOutcomes(prev => ({ ...prev, [problemId]: outcome }));
    }

    const handleReview = (problem) => {
        if(!outcomes[problem.id]) {alert('Please select an outcome before marking as reviewed'); return;}
        const outcome = outcomes[problem.id];
        const nextReviewDate = calcNextReview(problem.difficulty, problem.streak, outcome);
        const newStreak = updateStreak(problem.streak, outcome);
        const newConsecutiveMasteries = updateConsecutiveMasteries(problem.consecutive_masteries, outcome);
        const shouldArchive = (problem.difficulty === 'Hard' && newConsecutiveMasteries >= 4) || 
                      (problem.difficulty === 'Medium' && newConsecutiveMasteries >= 3) || 
                      (problem.difficulty === 'Easy' && newConsecutiveMasteries >= 2);

        supabase.from('problems').update({
            last_review_outcome: outcome,
            next_review_date: nextReviewDate,
            streak: newStreak,
            consecutive_masteries: newConsecutiveMasteries,
            archived: shouldArchive
        }).eq('id', problem.id).then(() => fetchData());
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="dashboard">
        <div className="dashboard-content">

            <div className="dashboard-header">
                <div className="dashboard-stat-card">
                    <div className="stat-num">{problemsSolved}</div>
                    <div className="stat-label">Problems Solved</div>
                </div>
                <div className="dashboard-stat-card">
                    <div className="stat-num">{revisionQueue.length}</div>
                    <div className="stat-label">Due for Revision</div>
                </div>
                <div className="actions">
                    <button className="log-problems-btn" onClick={() => setShowPopup(true)}>
                        Log Problem
                    </button>

                    {showPopup && (
                        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
                            <div
                                className="popup-content"
                                onClick={(e) => e.stopPropagation()}>
                                <LogProblems />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="revision-section">
                <h2 className="section-title">Problems Due for Revision</h2>
                {revisionQueue.length === 0 ? (
                    <div className="empty-state">
                        <p>You're all caught up. No problems due for revision today.</p>
                    </div>
                ) : (
                    <div className="revision-list">
                        {revisionQueue.map((problem) => (
                            <div className={`revision-card difficulty-${problem.difficulty.toLowerCase()}`} key={problem.id}>
                                <div className="revision-card-left">
                                    <a href={problemLink(problem)} target="_blank" rel="noopener noreferrer" className="revision-problem-name">
                                        {problem.problem_name}
                                    </a>
                                    <span className="revision-topic">{problem.topic}</span>
                                </div>
                                <div className="revision-card-right">
                                    <select className="outcome-select" onChange={(e) => handleOutcomeChange(problem.id, e.target.value)} value={outcomes[problem.id] || ''}>
                                        <option value="" disabled>How did it go?</option>
                                        <option value="Forgot">Forgot</option>
                                        <option value="Solved With Hints">Solved With Hints</option>
                                        <option value="Solved Comfortably">Solved Comfortably</option>
                                        <option value="Mastered">Mastered</option>
                                    </select>
                                    <button className="review-btn" onClick={() => handleReview(problem)}>Mark Reviewed</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    </div>
    );
}

export default Dashboard;