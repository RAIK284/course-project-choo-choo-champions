import React, { useState } from 'react';
import NavBar from './NavBar';
import Background from './Background';
import axios from 'axios';
import './EmailVerification.css';

function EmailVerificationPage() {
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [sentCode, setSentCode] = useState(false);

    const handleSendVerificationCode = async () => {
        const username = sessionStorage.getItem('username');
        try {
            await axios.post('https://choochoochampionsapi.azurewebsites.net/user/sendEmailVerification', {
                username,
                email
            });
            setSentCode(true);
            alert('Verification code sent successfully!');
        } catch (error) {
            console.error('Error sending verification code:', error);
            alert('Error sending verification code. Please try again.');
        }
    };

    const handleVerifyEmail = async () => {
        const username = sessionStorage.getItem('username');
        try {
            await axios.post('https://choochoochampionsapi.azurewebsites.net/user/verifyEmailCode', {
                username,
                code: verificationCode
            });
            alert('Email verified successfully!');
            window.location.href = '/profile';
        } catch (error) {
            console.error('Error verifying email:', error);
            alert('Error verifying email. Please try again.');
        }
    };

    return (
        <div className="full-page">
            <Background />
            <NavBar />
            <div className="centered-content">
                <h2 className="enter-email">Enter Email for Verification</h2>
                <div className="container">
                    <div className="email-input-container">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="email-input"
                        />
                        <button
                            className="send-verification-code"
                            onClick={handleSendVerificationCode}
                        >
                            Send Code
                        </button>
                    </div>
                    {sentCode && (
                        <div className="verification-code-container">
                            <input
                                type="text"
                                placeholder="Enter verification code"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                className="verification-code-input"
                            />
                            <button
                                className="verify-email"
                                onClick={handleVerifyEmail}
                            >
                                Verify Email
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EmailVerificationPage;
