import React from 'react';
import './Modal.css';

const RoundEndModal = ({ onClose, winner, players, roundScores, cumulativeScores }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Round Over</h2>
                <p>{winner} played all their dominoes!</p>
                <table>
                    <thead>
                        <tr>
                            <th>Player</th>
                            <th>Round Score</th>
                            <th>Cumulative Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {players.map((player, index) => (
                            <tr key={index}>
                                <td>{player}</td>
                                <td>{roundScores[index]}</td>
                                <td>{cumulativeScores[index]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RoundEndModal;
