import React, { useState } from 'react';
import NavBar from './NavBar';
import Background from './Background';
import './HostGamePage.css';

function HostGamePage() {
    const [users] = useState([
        { username: 'User1', ready: true },
        { username: 'User2', ready: false },
        { username: 'User3', ready: true },
        { username: 'User4', ready: false }
    ]);

    const handleStartGame = () => {
    };

    return (
        <div className="full-page">
            <Background />
            <NavBar />
            <div className="centered-content">
                <h2 className="join-code">Join Code: </h2>
                <div className="container">
                    <div className="white-box">
                        {users.map((user, index) => (
                            <div key={index} className="user-row">
                                <span className="username">{user.username}</span>
                                <span className={`ready-state ${user.ready ? 'ready' : 'not-ready'}`}>
                                    {user.ready ? 'Ready' : 'Not Ready'}
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
