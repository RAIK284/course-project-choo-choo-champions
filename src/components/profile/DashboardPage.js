import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../universal/NavBar';
import { Link } from "react-router-dom";
import Background from '../universal/Background';
import './DashboardPage.css';

function DashboardPage() {
    const [stats, setStats] = useState({
        averagePPG: 0,
        averagePPR: 0,
        totalGamesWon: 0,
        totalRoundsWon: 0,
        totalPoints: 0,
        winRanking: 0,
        pointsRanking: 0
    });
    const [localGamePlayerCount, setLocalGamePlayerCount] = useState(null);

    useEffect(() => {
        fetchUserStats();
    }, []);

    const fetchUserStats = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const storedUsername = sessionStorage.getItem('username');
            const response = await axios.get(`https://choochoochampionsapi.azurewebsites.net/user/Profile/${storedUsername}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const userData = response.data;
            setStats({
                averagePPG: userData.averagePointsPerGame,
                averagePPR: userData.averagePointsPerRound,
                totalGamesWon: userData.totalGameWins,
                totalRoundsWon: userData.totalRoundWins,
                totalPoints: userData.totalPoints,
                winRanking: userData.winRanking,
                pointsRanking: userData.pointRanking
            });
        } catch (error) {
            console.error('Error fetching user stats:', error);
        }
    };

    const renderStatValue = (value) => {
        return value !== 0 ? value : '-';
    };

    const handleLocalGameStart = () => {
        // Open modal for inputting player count
        const playerCount = window.prompt('How many total players would you like in your local game? (2-4)');
        const parsedCount = parseInt(playerCount);
        if (!isNaN(parsedCount) && parsedCount >= 2 && parsedCount <= 4) {
            setLocalGamePlayerCount(parsedCount);
            // Redirect to game base with player count parameter
            window.location.href = `/gamebase?playerCount=${parsedCount}`;
        } else {
            alert('Please enter a valid number between 2 and 4.');
        }
    };

    return (
        <div className="dashboard-page full-page">
            <Background />
            <NavBar />
            <div className="centered-content">
                <div className="container">
                    <div className="dashboard-section left">
                        <div className="navigation-buttons">
                            <h2 className="dashboard-title">Play a Game</h2>
                            <div className="button-row">
                                <Link to="/join" className="button-link">Join</Link>
                                <Link
                                    to={`/host?username=${sessionStorage.getItem('username')}&ready=true`}
                                    className="button-link"
                                >
                                    Host
                                </Link>

                            </div>
                            <div className="button-row">
                                <Link className="button-link" onClick={handleLocalGameStart}>Play Locally</Link>
                            </div>
                            <div className="button-row">
                                <Link to="https://docs.google.com/document/d/1AGaAbECzBxydmu3vCk0By3uPImKF7AH5BWFk7AajLGE/edit?usp=sharing" target="_blank" rel="noopener noreferrer" className="button-link">How to Play</Link>
                            </div>
                        </div>
                    </div>
                    <div className="dashboard-section right">
                        <div className="navigation-buttons">
                            <h2 className="dashboard-title">{sessionStorage.getItem('username')}'s Stats</h2>
                            <div className="stats-list">
                                <div className="stat-item">Average PPG: {renderStatValue(stats.averagePPG)}</div>
                                <div className="stat-item">Average PPR: {renderStatValue(stats.averagePPR)}</div>
                                <div className="stat-item">Total Games Won: {renderStatValue(stats.totalGamesWon)}</div>
                                <div className="stat-item">Total Rounds Won: {renderStatValue(stats.totalRoundsWon)}</div>
                                <div className="stat-item">Total Points: {renderStatValue(stats.totalPoints)}</div>
                                <div className="stat-item">Win Ranking: #{renderStatValue(stats.winRanking)}</div>
                                <div className="stat-item">Points Ranking: #{renderStatValue(stats.pointsRanking)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;
