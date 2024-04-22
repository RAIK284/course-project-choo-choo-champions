import React, { useState, useEffect } from 'react';
import NavBar from '../universal/NavBar';
import Background from '../universal/Background';
import axios from 'axios';
import './EmailVerification.css';

function EmailVerificationPage() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [sentCode, setSentCode] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const usernameParam = params.get('username');
        const emailParam = params.get('email');
        setUsername(usernameParam);
        setEmail(emailParam);
    }, []);

    const handleSendVerificationCode = async () => {
        try {
            await axios.post('https://choochoochampionsapi.azurewebsites.net/user/sendEmailVerification', null, {
                params: {
                    username,
                    email
                }
            });
            setSentCode(true);
            alert('Verification code sent successfully!');
        } catch (error) {
            console.error('Error sending verification code:', error);
            alert('Error sending verification code. Please try again.');
        }
    };

    const handleVerifyEmail = async () => {
        try {
            await axios.post('https://choochoochampionsapi.azurewebsites.net/user/verifyEmailCode', null, {
                params: {
                    username,
                    code: verificationCode
                }
            });
            alert('Email verified successfully!');
            window.location.href = `/`;
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
                <div className="container email-verification-container">
                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="email-input"
                            readOnly
                        />
                        <button
                            className="send-verification-code"
                            onClick={handleSendVerificationCode}
                        >
                            Send Code
                        </button>
                    </div>
                    {sentCode && (
                        <div className="form-group">
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
