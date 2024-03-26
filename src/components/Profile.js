import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';
import Background from './Background';
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './Profile.css';

const fetchProfileImage = async (username, token) => {
    try {
        const response = await axios.get(`https://choochoochampionsapi.azurewebsites.net/user/ProfileImage/${username}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching image.', error);
        alert('Error fetching image. Username is not yet logged in.');
        return "";
    }
};

function ProfilePage() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [profileImage, setProfileImage] = useState(''); // Default image URL
    const location = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            const searchParams = new URLSearchParams(location.search);
            const emailParam = searchParams.get('email');
            const usernameParam = searchParams.get('username');
            if (emailParam) setEmail(emailParam);
            if (usernameParam) setUsername(usernameParam);
            
            const token = sessionStorage.getItem('token');
            if (token && usernameParam) {
                const imageUrl = await fetchProfileImage(usernameParam, token);
                if (imageUrl) {
                    setProfileImage(imageUrl);
                }
            }
        };

        fetchData();
    }, [location.search]);

    // Function to handle profile image upload
    const handleImageChange = async(e) => {
        const file = e.target.files[0];
        const imageLink = URL.createObjectURL(file);
        const token = sessionStorage.getItem('token');
        try {
            const response = await axios.post(
                'https://choochoochampionsapi.azurewebsites.net/user/UpdateProfileImage',
                null,
                {
                    params: {
                        username: username,
                        imageURL: imageLink
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            console.log(response);
            setProfileImage(response.data['imageLink']);
        } catch (error) {
            console.error('Error uploading image.', error);
            alert('Error uploading image.');
        }

    };

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you can add logic to update user details
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
