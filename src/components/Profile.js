import React, { useState } from 'react';
import NavBar from './NavBar';
import Background from './Background';
import { Link } from "react-router-dom";
import './Profile.css';

function ProfilePage() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [profileImage, setProfileImage] = useState('https://media.allure.com/photos/64504df592358acb5c543321/1:1/w_2667,h_2667,c_limit/Doja%20Cat.jpg'); // Default image URL

    // Function to handle profile image upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        // Here you can add logic to upload the image
        setProfileImage(URL.createObjectURL(file));
    };

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you can add logic to update user details
        console.log('Form submitted:', { email, username, password });
    };

    return (
        <div className="profile-page full-page">
            <Background />
            <NavBar />
            <div className="centered-content">
                <div className="container">
                    <div className="profile-section left">
                        <label htmlFor="profile-image-input" className="profile-image-edit">
                            <img src={profileImage} alt="Profile" className="profile-image" />
                            <input
                                type="file"
                                accept="image/*"
                                id="profile-image-input"
                                onChange={handleImageChange}
                            />
                            <span className="edit-icon">🖉</span>
                        </label>
                        <div className="navigation-buttons">
                            <Link to="/" className="button-link">Dashboard</Link>
                            <Link to="/profile" className="button-link">Account Details</Link>
                            <Link to="/changepassword" className="button-link">Change Password</Link>
                            <Link to="/" className="button-link">Log out</Link>
                        </div>
                    </div>
                    <div className="profile-section right">
                        <form className="account-details" onSubmit={handleSubmit}>
                            <div className="input-wrapper">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="input-wrapper">
                                <label htmlFor="username">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="save-button">Save Changes</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
