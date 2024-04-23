import React, { useState } from "react";
import axios from "axios";
import Background from "../universal/Background";
import "./HomePage.css";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username || !password) {
      alert("Please fill out all fields");
      return;
    }

    try {
      const response = await axios.post(
        "https://choochoochampionsapi.azurewebsites.net/user/login",
        null,
        {
          params: {
            username,
            password,
          },
        }
      );
      console.log("Log in response:", response.data);
      const token = response.data["id"];
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("username", username);
      window.location.href = `/dashboard`;
      sessionStorage.setItem("email", response.data["email"]);
    } catch (error) {
      console.error("Error during login:", error);
      alert("Error logging in. Username or password may be incorrect.");
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <label htmlFor="usernameInput" className="visually-hidden">
        Username
      </label>
      <input
        type="text"
        id="usernameInput"
        className="input-field"
        placeholder="Username"
        aria-label="Username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />
      <label htmlFor="passwordInput" className="visually-hidden">
        Password
      </label>
      <input
        type="password"
        id="passwordInput"
        className="input-field"
        placeholder="Password"
        aria-label="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <button type="submit" className="login-button">
        Log In
      </button>
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
        <a href="/signup" className="signup-link">
          Sign Up
        </a>
      </div>
    </section>
  );
}

function GameDescription() {
  return (
    <article className="game-description">
      <h1 className="game-title">Mexican Train Dominoes</h1>
      <p className="game-info">
        Online multiplayer game with friends, stats, etc.
      </p>
    </article>
  );
}

function HomePage() {
  return (
    <main className="login-page">
      <Background />
      <div className="centered-content">
        <GameDescription />
        <LoginSection />
      </div>
    </main>
  );
}

export default HomePage;
