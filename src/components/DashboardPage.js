import React from 'react';
import NavBar from './NavBar';
import Background from './Background';
import { Link } from "react-router-dom";
import './DashboardPage.css';

function DashboardPage() {
    // Define variables for each stat value
    const averagePPG = 25.5;
    const averagePPR = 30.2;
    const totalGamesWon = 15;
    const totalRoundsWon = 30;
    const totalPoints = 500;
    const winRanking = 2;
    const pointsRanking = 3;
    // comment

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
                                <Link to="/host" className="button-link">Host</Link>
                            </div>
                            <div className="button-row">
                                <Link to="/how-to-play" className="button-link">How to Play</Link>
                            </div>
                        </div>
                    </div>
                    <div className="dashboard-section right">
                        <div className="navigation-buttons">
                            <h2 className="dashboard-title">Stats</h2>
                            <div className="stats-list">
                                <div className="stat-item">Average PPG: {averagePPG}</div>
                                <div className="stat-item">Average PPR: {averagePPR}</div>
                                <div className="stat-item">Total Games Won: {totalGamesWon}</div>
                                <div className="stat-item">Total Rounds Won: {totalRoundsWon}</div>
                                <div className="stat-item">Total Points: {totalPoints}</div>
                                <div className="stat-item">Win Ranking: #{winRanking}</div>
                                <div className="stat-item">Points Ranking: #{pointsRanking}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;
