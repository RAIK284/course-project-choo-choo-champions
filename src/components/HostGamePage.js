import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';
import Background from './Background';
import './HostGamePage.css';

function HostGamePage() {
    const [sessionId, setSessionId] = useState(null);
    const [players, setPlayers] = useState([{ username: sessionStorage.getItem('username'), ready: true }]);
    const [ws, setWs] = useState(null);
    const [gameStarted, setGameStarted] = useState(false);

    useEffect(() => {
        if (ws !== null) {
            return;
        }

        const newWs = new WebSocket('ws://localhost:8765');

        newWs.onopen = () => {
            console.log('WebSocket connection established');
            setWs(newWs);
        };

        newWs.onmessage = (event) => {
            console.log('Message received:', event.data);
            const message = JSON.parse(event.data);
            if (message.type === 'playerJoined') {
                const newPlayer = message.player;
                if (!players.some(player => player.username === newPlayer.username)) {
                    console.log('Adding new player:', newPlayer);
                    setPlayers(prevPlayers => [...prevPlayers, newPlayer]);
                }
            } else if (message.type === 'sessionId') {
                setSessionId(message.sessionId);
            }
        };

        newWs.onclose = () => {
            console.log('WebSocket connection closed');
        };

        newWs.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            if (newWs !== null) {
                newWs.close();
            }
        };
    }, []);

    const handleStartGame = () => {
        setGameStarted(true);
        window.location.href = "/trains";
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
                    <button
                        className="start-game"
                        onClick={handleStartGame}
                        disabled={gameStarted}
                    >
                        Start Game
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HostGamePage;
