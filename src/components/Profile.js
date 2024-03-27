import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';
import Background from './Background';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

import './Profile.css';

function ProfilePage() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [profileImage, setProfileImage] = useState('https://upload.wikimedia.org/wikipedia/en/thumb/d/dc/Thomas_Tank_Engine_1.JPG/220px-Thomas_Tank_Engine_1.JPG');

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const storedUsername = sessionStorage.getItem('username');
        if (!token || !storedUsername) {
            window.location.href = '/';
        } else {
            setUsername(storedUsername);
            fetchUserDetails(token, storedUsername);
        }
    }, []);

    const fetchUserDetails = async (token, username) => {
        try {
            const response = await axios.get(`https://choochoochampionsapi.azurewebsites.net/user/Profile/${username}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const userData = response.data;
            setEmail(userData.email);
        } catch (error) {
            console.error('Error fetching user details:', error);
            alert('Error fetching user details. Please try again.');
            window.location.href = '/';
        }
    };


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setProfileImage(URL.createObjectURL(file));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', { email, username });
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
                            <span className="edit-icon">
                                <FontAwesomeIcon icon={faPencilAlt} />
                            </span>
                        </label>
                        <div className="navigation-buttons">
                            <Link to="/dashboard" className="button-link">Dashboard</Link>
                            <Link to="/profile" className="button-link">Account Details</Link>
                            <Link to="/changepassword" className="button-link">Change Password</Link>
                            <Link to="/" className="button-link">Log Out</Link>
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
