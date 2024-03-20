import React, { useState } from 'react';
import NavBar from './NavBar';
import Background from './Background';
import './JoinCodePage.css';

function JoinCodePage() {
    const [joinCode, setJoinCode] = useState('');

    const handleJoinGame = () => {
        if (joinCode.trim().toUpperCase() === 'DEMO') {
            // Redirect to "/trains" if the join code is "DEMO"
            window.location.href = '/trains';
        } else {
            // Alert for invalid join code
            alert("Invalid join code.");
        }
    };

    const handleJoinRandomGame = () => {
        alert("Joining random game...");
        // Logic for joining random game
    };

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
                            onClick={handleJoinGame}
                        >
                            Join Game
                        </button>
                    </div>
                    <button
                        className="join-random-game"
                        onClick={handleJoinRandomGame}
                    >
                        Join Random Game
                    </button>
                </div>
            </div>
        </div>
    );
}

export default JoinCodePage;
