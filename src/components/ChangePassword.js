import React, { useState } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import Background from './Background';
import './ChangePassword.css';

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      alert("New password and confirm password don't match.");
      return;
    }

    if (newPassword.length < 8) {
      alert('New password must be at least 8 characters long.');
      return;
    }

    if (!strongPassword(newPassword)) {
      alert('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@#$%^&+=!).');
      return;
    }

    try {
      const response = await axios.post(
        'https://choochoochampionsapi.azurewebsites.net/user/changePassword',
        null,
        {
          params: {
            username: sessionStorage.getItem('username'),
            oldPassword: currentPassword,
            newPassword
          }
        }
      );
      console.log('Password change response:', response.data);
      alert('Password changed successfully!');
      window.location.href = '/profile';
    } catch (error) {
      console.error('Error changing password:', error);
      if (error.response) {
        console.error('Error details:', error.response.data);
      }
      alert('Error changing password. Please try again.');
    }
  };

  const strongPassword = (password) => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$/;
    return regex.test(password);
  };

  return (
    <div className="full-page">
      <Background />
      <NavBar />
      <div className="centered-content">
        <h2 className="change-password-title">Change Password</h2>
        <form className="password-form" onSubmit={handleSubmit}>
          <div className="password-inputs">
            <div className="password-input">
              <label htmlFor="current-password">Current Password</label>
              <input
                type="password"
                id="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="password-input">
              <label htmlFor="new-password">New Password</label>
              <input
                type="password"
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="password-input">
              <label htmlFor="confirm-new-password">Confirm New Password</label>
              <input
                type="password"
                id="confirm-new-password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </div>
          </div>
          <button type="submit" className="save-button">Save Changes</button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
