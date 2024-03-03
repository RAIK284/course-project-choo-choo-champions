// HomePage.js

import React from 'react';
import Background from './Background'

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
      <p className="game-info">Online multiplayer game with friends, stats, and etc.</p>
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
      <style jsx>{`
        .login-page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: #1c794c;
          margin: 0;
          padding: 0;
          position: relative;
        }

        .centered-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: white; /* Change text color to white */
          position: relative;
          z-index: 1;
        }

        .game-description, .login-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 20px; /* Add margin to separate sections */
        }

        .game-title {
          font-size: 48px;
          margin-bottom: 10px;
        }

        .game-info {
          font-size: 24px;
          margin-bottom: 20px;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          align-items: center;
          background-color: #f2f9f6;
          padding: 40px;
          border-radius: 20px;
        }

        .input-field {
          width: 100%;
          margin-bottom: 20px;
          border-radius: 20px;
          border: 1px solid rgba(0, 0, 0, 0.2);
          padding: 15px;
        }

        .login-button {
          width: 100%;
          background-color: #23834a;
          color: white;
          padding: 15px;
          border-radius: 20px;
          border: none;
          cursor: pointer;
        }

        .signup-prompt {
          margin-top: 20px;
        }

        .text, .signup-link {
          color: white;
          text-align: center;
        }

        .signup-link {
          font-weight: 700;
          text-decoration: underline;
        }

        .visually-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          margin: -1px;
          padding: 0;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          border: 0;
        }
      `}</style>
    </>
  );
}

export default HomePage;
