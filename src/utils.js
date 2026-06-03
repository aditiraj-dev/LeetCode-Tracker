export function calcInitialReview(solveQuality, difficulty, dateSolved) {
    //solve quality can be either 'used solution', 'solved with hints', 'solved independently'
    //difficulty can be either 'Easy', 'Medium', 'Hard'
    let days;
    if(solveQuality === 'Used Solution') {
        days = difficulty === 'Easy' ? 4 : difficulty === 'Medium' ? 3 : 2;
    } else if(solveQuality === 'Solved Using Hints') {
        days = difficulty === 'Easy' ? 7 : difficulty === 'Medium' ? 5 : 4;
    } else if(solveQuality === 'Solved Independently') {
        days = difficulty === 'Easy' ? 14 : difficulty === 'Medium' ? 10 : 7;
    }
    else days = 7; // default to 7 days if solve quality is not recognized

    const initialReviewDate = new Date(dateSolved);
    initialReviewDate.setDate(initialReviewDate.getDate() + days);
    return initialReviewDate.toISOString().split('T')[0];
}

export function calcNextReview(difficulty, streak, lastReviewOutcome) {
    const baseDays = difficulty === 'Easy' ? 14 : difficulty === 'Medium' ? 10 : 7;
    const addDays = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    if(lastReviewOutcome === 'Forgot') {
        return addDays(2);
    }
    else if(lastReviewOutcome === 'Solved With Hints') {
        return addDays(3);
    }
    else if(lastReviewOutcome === 'Solved Comfortably') {
        return addDays(baseDays * (1 + 0.5*streak));
    }
    else if(lastReviewOutcome === 'Mastered') {
        return addDays(baseDays * (1 + streak));
    }
    else return addDays(7); // default to base interval if outcome is not recognized
}

export function updateStreak(streak, lastReviewOutcome) {
    if(lastReviewOutcome === 'Forgot') {
        return 0;
    }
    else if(lastReviewOutcome === 'Solved With Hints') {
        return streak;
    }
    else if(lastReviewOutcome === 'Solved Comfortably') {
        return streak + 1;
    }
    else if(lastReviewOutcome === 'Mastered') {
        return streak + 1;
    }
    else return streak; // default to current streak if outcome is not recognized
}

export function updateConsecutiveMasteries(consecutiveMasteries, lastReviewOutcome) {
    if(lastReviewOutcome === 'Mastered') {
        return consecutiveMasteries + 1;
    }
    else if(lastReviewOutcome === 'Solved Comfortably') {
        return consecutiveMasteries;
    }
    else return 0; // reset if not mastered or solved comfortably
}
