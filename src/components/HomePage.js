// HomePage.js

import React from 'react';
import Background from './Background'
import './HomePage.css';

function LoginForm() {
  return (
    <form className="login-form">
      <label htmlFor="usernameInput" className="visually-hidden">Username</label>
      <input type="text" id="usernameInput" className="input-field" placeholder="Username" aria-label="Username" />
      <label htmlFor="passwordInput" className="visually-hidden">Password</label>
      <input type="password" id="passwordInput" className="input-field" placeholder="Password" aria-label="Password" />
      <button type="submit" className="login-button">Log In</button>
    </form>
  );
}

function LoginSection() {
  return (
    <section className="login-section">
      <h2 className="section-title visually-hidden">Login Section</h2>
      <LoginForm />
      <div className="signup-prompt">
        <span className="text">Don’t have an account? </span>
        <a href="/signup" className="signup-link">Sign Up</a>
      </div>
    </section>
  );
}

function GameDescription() {
  return (
    <article className="game-description">
      <h1 className="game-title">Mexican Train Dominoes</h1>
      <p className="game-info">Online multiplayer game with friends, stats, etc.</p>
    </article>
  );
}

function HomePage() {
  return (
    <>
      <main className="login-page">
        <Background />
        <div className="centered-content">
          <GameDescription />
          <LoginSection />
        </div>
      </main>
    </>
  );
}

export default HomePage;
