// SignUpForm.js
import React from 'react';

function SignUpForm() {
  return (
    <form className="signup-form">
      <label htmlFor="emailInput">Email Address</label>
      <input type="email" id="emailInput" className="input-field" placeholder="Enter your email address" />

      <label htmlFor="firstNameInput">First Name</label>
      <input type="text" id="firstNameInput" className="input-field" placeholder="Enter your first name" />

      <label htmlFor="lastNameInput">Last Name</label>
      <input type="text" id="lastNameInput" className="input-field" placeholder="Enter your last name" />

      <label htmlFor="passwordInput">Password</label>
      <input type="password" id="passwordInput" className="input-field" placeholder="Enter your password" />

      <button type="submit" className="signup-button">Sign Up</button>
    </form>
  );
}

export default SignUpForm;
