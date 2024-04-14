import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';
import Background from './Background';
import './HostGamePage.css';

function HostGamePage() {
    const [sessionId] = useState(generateSessionId());
    const [players, setPlayers] = useState([{ username: sessionStorage.getItem('username'), ready: true }]);
    const [ws, setWs] = useState(null);

    useEffect(() => {
        const newWs = new WebSocket('ws://localhost:8765');

        newWs.onopen = () => {
            console.log('WebSocket connection established');
            setWs(newWs);
        };

        newWs.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'playerJoined') {
                setPlayers([...players, message.player]);
            }
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

    function generateSessionId() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const length = 6;
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    const handleStartGame = () => {
    };

    return (
        <div className="host-game-page full-page">
            <Background />
            <NavBar />
            <div className="centered-content">
                <h2 className="join-code">Join Code: {sessionId}</h2>
                <div className="container">
                    <div className="white-box">
                        {players.map((player, index) => (
                            <div key={index} className="user-row">
                                <span className="username">{player.username}</span>
                                <span className={`ready-state ${player.ready ? 'ready' : 'not-ready'}`}>
                                    {player.ready ? 'Ready' : 'Not Ready'}
                                </span>
                            </div>
                        ))}
                    </div>
                    <button className="start-game" onClick={handleStartGame}>
                        Start Game
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HostGamePage;
