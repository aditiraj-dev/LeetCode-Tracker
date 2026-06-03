import './css/main.css';

function Main() {
  return (
    <main className="App-main">

      <section className="hero">
        <h1 className="hero-title">Track what you grind.<br />Revise regularly.<br />Ace that interview.</h1>
        <p className="hero-sub">A spaced repetition system built specifically for LeetCode — so you stop forgetting what you already solved.</p>
      </section>

      <section className="mockup-section">
        <span className="section-label">Your dashboard</span>
        <div className="mockup-placeholder">
          <span>Screenshot of Dashboard</span>
        </div>
      </section>

      <section className="mockup-section">
        <span className="section-label">Log a problem</span>
        <div className="mockup-placeholder">
          <span>GIF of logging a problem</span>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <div className="feature-title">Spaced repetition</div>
          <div className="feature-desc">Problems resurface based on how well you solved them — not on a fixed schedule.</div>
        </div>
        <div className="feature-card">
          <div className="feature-title">Weak topic detection</div>
          <div className="feature-desc">See which topics you keep struggling with so you can focus where it matters.</div>
        </div>
        <div className="feature-card">
          <div className="feature-title">Problem archiving</div>
          <div className="feature-desc">Mastered problems graduate out of your queue so your daily list stays lean.</div>
        </div>
        <div className="feature-card">
          <div className="feature-title">Daily review cap</div>
          <div className="feature-desc">Never overwhelmed — smart priority keeps your daily list to 10 problems.</div>
        </div>
      </section>

    </main>
  );
}

export default Main;