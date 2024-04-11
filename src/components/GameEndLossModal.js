import React from 'react';
import './Modal.css';

const GameEndLossModal = ({ winner, players, roundScores, cumulativeScores, onClose }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>You Lost!</h2>
                <p>{winner} won the game!</p>
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

export default GameEndLossModal;
