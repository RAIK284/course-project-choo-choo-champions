import React from 'react';
import './Modal.css';

const GameEndWinModal = ({ onClose, players, roundScores, cumulativeScores }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>You Won!</h2>
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

export default GameEndWinModal;
