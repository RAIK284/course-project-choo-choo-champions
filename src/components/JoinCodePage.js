import React, { useState } from 'react';
import NavBar from './NavBar';
import Background from './Background';
import './JoinCodePage.css';

function JoinCodePage() {
    const [joinCode, setJoinCode] = useState('');

    return (
        <div className="full-page">
            <Background />
            <NavBar />
            <div className="centered-content">
                <h2 className="enter-join-code">Enter Join Code</h2>
                <div className="container">
                    <div className="join-input-container">
                        <input
                            type="text"
                            placeholder="Enter join code"
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value)}
                            className="join-code-input"
                        />
                        <button
                            className="confirm-join-code"
                            onClick={() => {
                                if (joinCode.trim() !== '') {
                                    alert(`Join code entered: ${joinCode}`);
                                    // Here you can add logic to handle joining the game with the provided code
                                } else {
                                    alert("Please enter a valid join code.");
                                }
                            }}
                        >
                            Join Game
                        </button>
                    </div>
                    <button
                        className="join-random-game"
                        onClick={() => {
                            alert("Joining random game...");
                            // Logic for joining random game
                        }}
                    >
                        Join Random Game
                    </button>
                </div>
            </div>
        </div>
    );
}

export default JoinCodePage;
