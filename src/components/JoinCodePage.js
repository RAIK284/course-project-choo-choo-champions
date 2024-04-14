import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';
import Background from './Background';
import './JoinCodePage.css';

function JoinCodePage() {
    const [joinCode, setJoinCode] = useState('');
    const [ws, setWs] = useState(null);

    useEffect(() => {
        const newWs = new WebSocket('ws://localhost:8765');

        newWs.onopen = () => {
            console.log('WebSocket connection established');
            setWs(newWs);
        };

        newWs.onclose = () => {
            console.log('WebSocket connection closed');
        };

        newWs.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, []);

    const handleJoinGame = () => {
        if (ws && joinCode) {
            const username = sessionStorage.getItem('username');

            ws.send(JSON.stringify({ type: 'joinGame', sessionId: joinCode, username }));
            setJoinCode('');
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
