import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './css/problems_list.css';

function ProblemsList() {
    const [problems, setProblems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    
    const fetchProblems = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase.from('problems').select('*').eq('user_id', user.id).eq('archived', false);
        if (error) {
            alert('Error fetching problems: ' + error.message);
        } else {
            //not all data: problem name, topic, date solved, last review outcome, next review date,
            setProblems(
                data.map(p => ({
                    id: p.id,
                    name: p.problem_name,
                    topic: p.topic,
                    difficulty: p.difficulty,
                    dateSolved: p.date_solved,
                    lastReviewOutcome: p.last_review_outcome,
                    nextReviewDate: p.next_review_date
                }))
            );
        }
    }

    const handleDelete = async (problemId) => {
        if (window.confirm('Are you sure you want to delete this problem?')) {
            const { error } = await supabase.from('problems').delete().eq('id', problemId);
            if (error) {
                alert('Error deleting problem: ' + error.message);
            } else {
                setProblems(problems.filter(p => p.id !== problemId));
            }
        }
    };

    const handleSearch = async (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setCurrentPage(1);
    };

    let filteredProblems = problems;
    if (searchTerm.length > 1) {
        filteredProblems = problems.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    useEffect(() => {
        fetchProblems();
    }, []);

    const getProblemsPerPage = () => {
        if(window.innerWidth < 600) return 5;
        if(window.innerWidth < 900) return 8;
        return 10;
    };

    const [problemsPerPage, setProblemsPerPage] = useState(getProblemsPerPage());   
    useEffect(() => {
        const handleResize = () => setProblemsPerPage(getProblemsPerPage());
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const totalPages = Math.ceil(filteredProblems.length / problemsPerPage);
    const displayedProblems = filteredProblems.slice((currentPage - 1) * problemsPerPage, currentPage * problemsPerPage);
    
    return (
        <div className="problems-list">
            <div className="search-bar">
                <input
                    className="search-input"
                    type="text"
                    placeholder="Search problems..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            <table className="problems-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Topic</th>
                        <th>Date Solved</th>
                        <th>The Last Review</th>
                        <th>Next Review On</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedProblems.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="no-results">No problems found.</td>
                        </tr>
                    ) : (
                        displayedProblems.map(problem => (
                            <tr key={problem.id} className={`difficulty-row-${(problem.difficulty).toLowerCase()}`}>
                                <td>{problem.name}</td>
                                <td><span className="topic-pill">{problem.topic}</span></td>
                                <td><span className="date-text">{problem.dateSolved}</span></td>
                                <td>
                                    {problem.lastReviewOutcome ? (
                                        <span className={`outcome-pill outcome-${problem.lastReviewOutcome.toLowerCase().replace(/\s+/g, '-') === 'forgot' ? 'forgot' : problem.lastReviewOutcome.toLowerCase().replace(/\s+/g, '-') === 'solved-with-hints' ? 'hints' : problem.lastReviewOutcome.toLowerCase().replace(/\s+/g, '-') === 'solved-comfortably' ? 'comfortable' : 'mastered'}`}>
                                            {problem.lastReviewOutcome}
                                        </span>
                                    ) : (
                                        <span className="outcome-none">—</span>
                                    )}
                                </td>
                                <td><span className="date-text">{problem.nextReviewDate}</span></td>
                                <td><button className="delete-btn" onClick={() => handleDelete(problem.id)}>Delete</button></td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            {totalPages > 1 && (
                <div className="pagination">
                    <button 
                        className="page-btn" 
                        onClick={() => setCurrentPage(p => p - 1)} 
                        disabled={currentPage === 1}>
                        ←
                    </button>
                    <span className="page-info">{currentPage} / {totalPages}</span>
                    <button 
                        className="page-btn" 
                        onClick={() => setCurrentPage(p => p + 1)} 
                        disabled={currentPage === totalPages}>
                        →
                    </button>
                </div>
            )}
        </div>
    );
 }

export default ProblemsList;