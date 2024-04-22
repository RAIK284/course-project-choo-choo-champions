import React, { useState } from 'react';
import axios from 'axios';
import NavBar from '../universal/NavBar';
import Background from '../universal/Background';
import './ChangePassword.css';

function ChangePassword() {
  // State variables to store current password, new password, and confirm new password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    // Check if new password matches confirm new password
    if (newPassword !== confirmNewPassword) {
      alert("New password and confirm password don't match.");
      return;
    }

    // Check if new password meets strength criteria
    if (newPassword.length < 8 || !checkPasswordStrength(newPassword)) {
      alert('New password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@#$%^&+=!).');
      return;
    }

    try {
      // Attempt to send POST request to change password endpoint
      const response = await axios.post(
        'https://choochoochampionsapi.azurewebsites.net/user/changePassword',
        null,
        {
          params: {
            username: sessionStorage.getItem('username'), // Retrieve username from session storage
            oldPassword: currentPassword, // Current password
            newPassword // New password
          }
        }
      );
      console.log('Password change response:', response.data);
      alert('Password changed successfully!');
      window.location.href = '/profile'; // Redirect to profile page after successful password change
    } catch (error) {
      console.error('Error changing password:', error);
      if (error.response) {
        console.error('Error details:', error.response.data);
      }
      alert('Error changing password. Please try again.'); // Alert user of error
    }
  };

  // Function to check if password meets strength criteria
  const checkPasswordStrength = (password) => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$/; // Regular expression for password strength
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
            {/* Input for current password */}
            <div className="password-input">
              <label htmlFor="current-password">Current Password</label>
              <input
                type="password"
                id="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            {/* Input for new password */}
            <div className="password-input">
              <label htmlFor="new-password">New Password</label>
              <input
                type="password"
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            {/* Input for confirming new password */}
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
