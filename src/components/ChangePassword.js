import React, { useState } from 'react';
import NavBar from './NavBar';
import Background from './Background';
import './ChangePassword.css';

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      alert("New password and confirm password don't match.");
      return;
    }
    // Here you can add logic to handle password change
    console.log('Form submitted:', { currentPassword, newPassword, confirmNewPassword });
  };

  return (
    <>
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
    </>
  );
}

export default ChangePassword;
