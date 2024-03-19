import React, { useState } from 'react';
import axios from 'axios';
import Background from './Background';
import './SignupPage.css';


function SignupPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  const handleSignup = async () => {
    if (!email || !username || !password || !confirmPassword) {
      alert('Please fill out all fields');
      return;
    }


    if (password !== confirmPassword) {
      alert('Password and Confirm Password must match');
      return;
    }

    try {
      const response = await axios.post('https://choochoochampionsapi.azurewebsites.net/user/register', null, {
        params: {
          username,
          password,
          email
        }
      });
      alert('Signup successful');
      console.log('Signup response:', response.data);
      window.location.href = `/profile?email=${encodeURIComponent(email)}&username=${encodeURIComponent(username)}`;
    } catch (error) {
      console.error('Error signing up:', error);
      alert('Error signing up. Username or email is already in use.');
    }
  };


  return (
    <div className="signup-page full-page">
      <Background />
      <div className="centered-content">
        <h2 className="signup-header">Mexican Train Dominoes</h2>
        <div className="white-box">
          <h3 className="registration-title">Registration</h3>
          <div className="container">
            <div className="input-row">
              <div className="input-wrapper">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="signup-input"
                />
              </div>
              <div className="input-wrapper">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="signup-input"
                />
              </div>
            </div>
            <div className="input-row">
              <div className="input-wrapper">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="signup-input"
                />
              </div>
              <div className="input-wrapper">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="signup-input"
                />
              </div>
            </div>
          </div>
          <button
            className="register-button"
            onClick={handleSignup}
          >
            Register
          </button>
          <p className="login-prompt">Already have an account? <strong><a href="/">Log in</a></strong></p>
        </div>
      </div>
    </div>
  );
}


export default SignupPage;
