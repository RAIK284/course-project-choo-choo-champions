import React, { useState, useEffect } from 'react';
import NavBar from '../../universal/NavBar';
import Background from '../../universal/Background';
import './HostGamePage.css';

function HostGamePage() {
    const [sessionId, setSessionId] = useState(null); // Holds the session ID
    const [players, setPlayers] = useState([{ username: sessionStorage.getItem('username'), ready: true }]); // Holds the list of players
    const [ws, setWs] = useState(null); // WebSocket connection
    const [gameStarted, setGameStarted] = useState(false); // Tracks whether the game has started

    // Establish WebSocket connection and handle messages
    useEffect(() => {
        if (ws !== null) {
            return;
        }

        // Create a new WebSocket connection
        const newWs = new WebSocket('ws://localhost:8765');

        // Event listeners for WebSocket events
        newWs.onopen = () => {
            console.log('WebSocket connection established');
            setWs(newWs);
        };

        newWs.onmessage = (event) => {
            console.log('Message received:', event.data);
            // Parse incoming message
            const message = JSON.parse(event.data);
            if (message.type === 'playerJoined') {
                // Add new player to the list
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

        // Cleanup function to close WebSocket connection
        return () => {
            if (newWs !== null) {
                newWs.close();
            }
        };
        // eslint-disable-next-line
    }, []);

    // Function to handle starting the game
    const handleStartGame = () => {
        if (ws !== null) {
            // Send a message to start the game
            ws.send(JSON.stringify({ type: 'startGame' }));
        }
        // Update gameStarted state and redirect to "/trains"
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
                        {/* Map over players array to display each player */}
                        {players.map((player, index) => (
                            <div key={index} className="user-row">
                                <span className="username">{player.username}</span>
                                <span className={`ready-state ${player.ready ? 'ready' : 'not-ready'}`}>
                                    {player.ready ? 'Ready' : 'Not Ready'}
                                </span>
                            </div>
                        ))}
                    </div>
                    {/* Button to start the game */}
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
