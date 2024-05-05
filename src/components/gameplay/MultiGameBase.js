import NavBar from "../universal/NavBar";
import Background from "../universal/Background";
import TrainStation from "./TrainStation";
import axios from 'axios';

import {
    GenerateDominoesForPlayers,
    GeneratePathsForGame,
    DrawADomino,
    CheckIfDominoIsPlayable,
    DeterminePlayablePaths,
    PlayDomino,
    CheckWinner,
    EnsurePlayability,
    CalculateScores
} from "./GameLogic";
import { ConvertToReact } from "./dominoes/Domino";
import "./GameBase.css";
// eslint-disable-next-line
import { useEffect, useState, useRef } from "react";
import RoundEndModal from "./modals/RoundEndModal";
import GameEndWinModal from "./modals/GameEndWinModal";

const startingDominoList = [[0, 0, 0], [13, 1, 1], [25, 2, 2], [36, 3, 3], [46, 4, 4], [55, 5, 5], [63, 6, 6], [70, 7, 7], [76, 8, 8], [81, 9, 9], [85, 10, 10], [88, 11, 11], [90, 12, 12]];


function GameChoice({ src, alt, onSelect, isSelected }) {
    // Assign players to the game.
    const searchParams = new URLSearchParams(window.location.search);
    const playersParam = searchParams.get('players');
    const players = playersParam ? JSON.parse(playersParam) : [];

    sessionStorage.setItem(
        "Players",
        JSON.stringify(["Mexican Train", ...players])
    );

    const [trains, setTrains] = useState([]);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const trainsParam = searchParams.get('trains');
        if (trainsParam) {
            // Decode and parse the JSON string
            try {
                const decodedTrains = decodeURIComponent(trainsParam);
                const parsedTrains = JSON.parse(decodedTrains);
                setTrains(parsedTrains);
            } catch (e) {
                console.error("Failed to parse trains data:", e);
            }
        }
    }, []);

    console.log(trains);

    // eslint-disable-next-line
    const [webSocket, setWebSocket] = useState(null);
    // eslint-disable-next-line
    const [gameState, setGameState] = useState(() => JSON.parse(sessionStorage.getItem("game")) || {});
    // eslint-disable-next-line
    const storedGame = JSON.parse(sessionStorage.getItem("game") || "{}");
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(() => {
        const initialGame = JSON.parse(sessionStorage.getItem("game") || "{}");
        return initialGame.TurnIndex || 0;
    });
    const [modalData, setModalData] = useState({
        winner: null,
        players: [],
        roundScores: [],
        cumulativeScores: []
    });

    // Connect to the WebSocket server.
    useEffect(() => {
        function connectWebSocket() {
            // const ws = new WebSocket('ws://localhost:8765');
            const ws = new WebSocket('ws://34.125.63.8:3389');
            ws.onopen = () => console.log("Connected to WebSocket server");
            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                switch (data.type) {
                    case 'gameState':
                        sessionStorage.setItem("game", JSON.stringify(data.gameState));
                        setGameState(data.gameState);
                        setCurrentPlayerIndex(data.gameState.TurnIndex);
                        window.location.reload();
                        break;
                    case 'displayRoundModal':
                        // Update modal data state when round ends
                        setModalData({
                            winner: data.winner,
                            players: data.players,
                            roundScores: data.roundScores,
                            cumulativeScores: data.cumulativeScores
                        });
                        setBroadcastDisplayRoundModal(true);
                        break;
                    case 'displayEndModal':
                        // Update modal data state when game ends
                        setModalData({
                            winner: data.winner,
                            players: data.players,
                            roundScores: data.roundScores,
                            cumulativeScores: data.cumulativeScores
                        });
                        setBroadcastDisplayEndModal(true);
                        break;
                    case 'gameOver':
                        window.location.href = "/dashboard";
                        break;
                    default:
                        break;
                }
            };
            ws.onclose = () => {
                console.log("WebSocket closed unexpectedly, attempting to reconnect...");
                setTimeout(connectWebSocket, 2000);
            };
            setWebSocket(ws);
            return () => {
                ws.close();
            };
        }
        connectWebSocket();
        //eslint-disable-next-line
    }, []);

    const [currentRound, setCurrentRound] = useState(
        sessionStorage.getItem("game") !== null
            ? JSON.parse(sessionStorage.getItem("game")).CurrentRound
            : 12
    );
    const [drawDisabled, setDrawDisabled] = useState(true);
    const [playDisabled, setPlayDisabled] = useState(true);
    const [finishDisabled, setFinishDisabled] = useState(true);
    const [loading, setLoading] = useState(true);
    const [inTurn, setInTurn] = useState(false);
    const [selectedDomino, setSelectedDomino] = useState(null);
    const [isAvailable] = useState([false, false, false, false, false]);
    const [startingDomino, setStartingDomino] = useState([startingDominoList[currentRound]]);
    const [displayRoundModal, setDisplayRoundModal] = useState(false);
    const [broadcastDisplayRoundModal, setBroadcastDisplayRoundModal] = useState(false);
    const [broadcastDisplayEndModal, setBroadcastDisplayEndModal] = useState(false);
    const [displayEndModal, setDisplayEndModal] = useState(false);
    const [roundsLeft, setRoundsLeft] = useState(sessionStorage.getItem("game") !== null
        ? JSON.parse(sessionStorage.getItem("game")).GamesLeft
        : 3);

    // Round setup function.
    function SetUpRound() {
        setStartingDomino([startingDominoList[currentRound]]);
        GenerateDominoesForPlayers(players, startingDomino);
        GeneratePathsForGame(startingDomino, players);
        const scores = sessionStorage.getItem("game") !== null
            ? JSON.parse(sessionStorage.getItem("game")).Scores
            : null;
        // Creates the game.
        setRoundsLeft(roundsLeft - 1)
        const game = {
            "Player Dominoes": JSON.parse(sessionStorage.getItem("Player Dominoes")),
            "Player Paths": JSON.parse(sessionStorage.getItem("Player Paths")),
            "Dominoes": JSON.parse(sessionStorage.getItem("Domino")),
            "Boneyard": JSON.parse(sessionStorage.getItem("Boneyard")),
            "TurnIndex": currentPlayerIndex,
            "CurrentRound": currentRound - 1,
            "GamesLeft": roundsLeft - 1,
            "Scores": scores,
            "Scored": false
        }
        sessionStorage.setItem("game", JSON.stringify(game));
        console.log(JSON.parse(sessionStorage.getItem("game")));
    }

    if (sessionStorage.getItem("Player Dominoes") == null) {
        SetUpRound();
    }

    // Logic to finish turn and send data over sockets.
    const finishTurn = () => {
        const game = JSON.parse(sessionStorage.getItem("game"));
        if (game["Player Dominoes"][players[currentPlayerIndex]].length === 0) {
            if (JSON.parse(sessionStorage.getItem("game")).CurrentRound === -1) {
                checkForGameOver();
            } else {
                checkForWinner();
            }
        } else {
            const nextIndex = (currentPlayerIndex + 1) % players.length;
            const updatedGameState = {
                ...game,
                TurnIndex: nextIndex,
            };
            // Update the sessionStorage immediately
            sessionStorage.setItem("game", JSON.stringify(updatedGameState));
            setCurrentPlayerIndex(nextIndex);  // Update the state to trigger re-render
            // Broadcast the new state to all clients
            webSocket.send(JSON.stringify({
                type: 'gameState',
                gameState: updatedGameState
            }));
            // This can be used to trigger any additional actions needed at turn end
            const event = new Event("TurnEnded");
            window.dispatchEvent(event);
        }
    };

    useEffect(() => {
        const storedGame = sessionStorage.getItem("game");
        if (storedGame !== null) {
            const game = JSON.parse(storedGame);
            setCurrentPlayerIndex(game.TurnIndex);
            setGameState(game);
        }
    }, []);

    const DrawDomino = () => {
        sessionStorage.setItem("DominoDrawn", JSON.stringify(true));
        DrawADomino(players[currentPlayerIndex], players);
        window.location.reload();
    };

    const SelectADominoToPlay = () => {
        const domino = JSON.parse(sessionStorage.getItem("SelectedDomino"));
        if (domino == null) {
            return false;
        }
        const options = CheckIfDominoIsPlayable(players[currentPlayerIndex], players, domino);
        if (options !== undefined) {
            setSelectedDomino(domino);
            const event = new Event("DominoPlayed");
            window.dispatchEvent(event);
            //highlight available dominos
            for (let i = 0; i < options.length; i++) {
                if (options[i] === "Mexican Train") {
                    isAvailable[0] = true;
                } else if (players.indexOf(options[i]) !== -1) {
                    isAvailable[players.indexOf(options[i]) + 1] = true;
                }
            }
        }
    };

    const handleDominoSelection = (index) => {
        if (isAvailable[index]) {
            if (index === 0) {
                PlayDomino(players[currentPlayerIndex], players, selectedDomino, 'Mexican Train');
            } else {
                PlayDomino(players[currentPlayerIndex], players, selectedDomino, players[index - 1]);
            }
            const event = new Event("DominoOnPath");
            sessionStorage.setItem("SelectedDomino", null);
            window.dispatchEvent(event);
        }
    };

    const updateStats = async (players, scores, wonGame, winner) => {
        console.log("Updating stats");
        const token = sessionStorage.getItem("token");
        if (!token) {
            console.error("No token available in sessionStorage.");
            return;
        }

        for (let i = 0; i < players.length; i++) {
            const username = players[i];
            if (!username) {
                console.error("Invalid username for player at index:", i);
                continue; // Skip to the next iteration for invalid usernames
            }

            // Construct query string parameters
            const params = new URLSearchParams({
                username: username,
                score: scores[i],
                wonRound: username === winner,
                wonGame: wonGame,
                endGame: wonGame
            }).toString();

            const url = `https://choochoochampionsapi.azurewebsites.net/user/updateStats?${params}`;

            try {
                await axios.post(url, {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                console.log("Stats updated successfully for:", username);
            } catch (error) {
                console.error("Failed to update stats for:", username, "Error:", error.response ? error.response.data : error.message);
            }
        }
    };


    const checkForWinner = () => {
        if ((CheckWinner(players) !== "No One" || EnsurePlayability(players) !== false) && roundsLeft !== 0) {
            const game = JSON.parse(sessionStorage.getItem("game"));
            if (!game.Scored) {
                game.Scored = true;
                sessionStorage.setItem("game", JSON.stringify(game));
                const scores = CalculateScores(players);
                if (game.Scores === null) {
                    game.Scores = scores;
                    sessionStorage.setItem("game", JSON.stringify(game));
                    setDisplayRoundModal(true);
                    webSocket.send(JSON.stringify({
                        type: 'displayRoundModal',
                        winner: CheckWinner(players),
                        players: players,
                        roundScores: scores,
                        cumulativeScores: game.Scores
                    }));
                    updateStats(players, scores, false, CheckWinner(players));
                    return;
                } else {
                    for (let i = 0; i < players.length; i++) {
                        const totals = game.Scores;
                        totals[i] += scores[i];
                        game.Scores = totals;
                        sessionStorage.setItem("game", JSON.stringify(game));
                    }
                }
            }
            setDisplayRoundModal(true);
        }
    }

    const checkForGameOver = () => {
        if ((CheckWinner(players) !== "No One" || EnsurePlayability(players) !== false) && roundsLeft !== 0) {
            console.log("Got here");
            const game = JSON.parse(sessionStorage.getItem("game"));
            if (!game.Scored) {
                game.Scored = true;
                sessionStorage.setItem("game", JSON.stringify(game));
                const scores = CalculateScores(players);
                if (game.Scores === null) {
                    game.Scores = scores;
                    sessionStorage.setItem("game", JSON.stringify(game));
                    setDisplayEndModal(true);
                    webSocket.send(JSON.stringify({
                        type: 'displayEndModal',
                        players: players,
                        roundScores: scores,
                        cumulativeScores: game.Scores
                    }));
                    updateStats(players, scores, true, CheckWinner(players));
                    return;
                } else {
                    for (let i = 0; i < players.length; i++) {
                        const totals = game.Scores;
                        totals[i] += scores[i];
                        game.Scores = totals;
                        sessionStorage.setItem("game", JSON.stringify(game));
                    }
                }
            }
            setDisplayEndModal(true);
            if (JSON.parse(sessionStorage.getItem("game")).CurrentRound === -1) {
                webSocket.send(JSON.stringify({
                    type: 'gameOver'
                }));
            }
        }
    }


    const closeRoundModal = () => {
        setDisplayRoundModal(false);
        FinishRound()
    };

    const closeEndModal = () => {
        setDisplayEndModal(false);
        // Routes players to the dashboard.
        window.location.href = `/dashboard`;
    };

    function loadDominos() {
        const playerPaths = JSON.parse(sessionStorage.getItem("game"))['Player Paths'];
        const lastDominos = [];
        if (playerPaths["Mexican Train"].Dominoes.length === 0) {
            lastDominos.push(ConvertToReact([[0, 13, 14]]));
        } else {
            lastDominos.push(
                ConvertToReact([
                    playerPaths["Mexican Train"].Dominoes[
                    playerPaths["Mexican Train"].Dominoes.length - 1
                    ],
                ])
            );
        }
        for (let i = 0; i < 5; i++) {
            if (i < players.length) {
                if (playerPaths[players[i]].Dominoes.length === 0) {
                    lastDominos.push(ConvertToReact([[0, 13, 14]]));
                } else {
                    lastDominos.push(
                        ConvertToReact([
                            playerPaths[players[i]].Dominoes[
                            playerPaths[players[i]].Dominoes.length - 1
                            ],
                        ])
                    );
                }
            } else {
                lastDominos.push(ConvertToReact([[0, 13, 14]]));
            }
        }
        return lastDominos;
    }

    // Turn and finish round functions.
    async function Turn() {
        const options = DeterminePlayablePaths(players[currentPlayerIndex], players);
        if (
            options.includes("Draw") &&
            (sessionStorage.getItem("DominoDrawn") == null ||
                !JSON.parse(sessionStorage.getItem("DominoDrawn")))
        ) {
            setDrawDisabled(false);
            await new Promise((resolve) => {
                window.addEventListener("DominoDrawn", function handler() {
                    window.removeEventListener("DominoDrawn", handler);
                    resolve();
                });
            });
        } else if (!options.includes("Draw") && !options.includes("Pass")) {
            setPlayDisabled(false);
            await new Promise((resolve) => {
                window.addEventListener("DominoPlayed", function handler() {
                    window.removeEventListener("DominoPlayed", handler);
                    resolve();
                });
            });
            setPlayDisabled(true);
            await new Promise((resolve) => {
                window.addEventListener("DominoOnPath", function handler() {
                    window.removeEventListener("DominoOnPath", handler);
                    resolve();
                });
            });
            if (JSON.parse(sessionStorage.getItem("game"))['Player Paths'].UnvalidatedDouble !== null) {
                await sessionStorage.setItem("DominoDrawn", false);
                await Turn(players[currentPlayerIndex]);
                return;
            }
        }
        setFinishDisabled(false);
        for (let i = 0; i < isAvailable.length; i++) {
            isAvailable[i] = false;
        }
        await new Promise((resolve) => {
            window.addEventListener("TurnEnded", function handler() {
                window.removeEventListener("TurnEnded", handler);
                resolve();
            });
        });
        await sessionStorage.setItem("DominoDrawn", false);
        setFinishDisabled(true);
        setInTurn(false);
    }

    // Finishes the round and reloads the page.
    function FinishRound() {
        const newRound = currentRound - 1;
        setCurrentRound(newRound);
        SetUpRound();
        window.location.reload();
    }

    const trainColors = {
        "Green Train": "rgb(30,214,86)", // green
        "Blue Train": "rgb(66,148,194)", // blue
        "Purple Train": "rgb(146,28,193)", // purple
        "Red Train": "rgb(179,47,38)", // red
        "Orange Train": "rgb(232,133,4)", // orange
        "White Train": "white", // default or white
    };

    const getPlayerColor = (index, trains) => {
        const trainName = trains[index]; // Get the train name assigned to the player at the given index
        return trainColors[trainName] || "white"; // Return the color associated with the train, or white if undefined
    };

    // Load the round objects.
    const playerDominoes = JSON.parse(sessionStorage.getItem("game"))["Player Dominoes"];
    const playerPaths = JSON.parse(sessionStorage.getItem("game"))["Player Paths"];
    const sDomino = ConvertToReact(playerPaths["Starting Domino"]);
    const lastDominos = loadDominos();

    if (!loading && !inTurn) {
        Turn(players[currentPlayerIndex]);
        setInTurn(true);
    } else if (loading && !inTurn) {
        setLoading(false);
    }
    return (
        <>
            <div className="full-page">
                <NavBar />
                <div className="centered-content">
                    <div className="sidegroup">
                        <div className="inner-content">
                            <h1 className="banktitle">Bank</h1>
                            <div className="bank">{ConvertToReact(playerDominoes[players[players.indexOf(sessionStorage.getItem("username"))]])}</div>
                            {/* end of bank group */}
                            {players[currentPlayerIndex] === sessionStorage.getItem("username") && (
                                <div className="button-container">
                                    <div className="buttonTopRow">
                                        <button
                                            className="button"
                                            onClick={DrawDomino}
                                            disabled={drawDisabled}
                                        >
                                            Draw
                                        </button>
                                        <button
                                            className="button"
                                            onClick={SelectADominoToPlay}
                                            disabled={playDisabled}
                                        >
                                            Place Domino
                                        </button>
                                    </div>
                                    <button
                                        className="finish-turn-button"
                                        onClick={finishTurn}
                                        disabled={finishDisabled}
                                    >
                                        Finish Turn
                                    </button>{" "}
                                </div>
                            )}
                        </div>
                        {/* end of left content */}
                        <div className="inner-content">
                            <h3 className="players_turn">
                                It is{" "}
                                <strong
                                    className="player-color"
                                    style={{ color: getPlayerColor(currentPlayerIndex, trains) }}
                                >
                                    {players[currentPlayerIndex]}
                                </strong>
                                's turn
                            </h3>{" "}
                            <TrainStation
                                sDomino={sDomino}
                                handleDominoSelection={handleDominoSelection}
                                lastDominos={lastDominos}
                                isAvailable={isAvailable}
                                trains={trains}
                            />
                        </div>
                    </div>
                </div>{" "}
            </div>{" "}
            {/* end of right content  */}
            {/* end of horizontal group */}
            {/* end of content */}
            {displayRoundModal && <RoundEndModal
                onClose={closeRoundModal}
                winner={CheckWinner(players)}
                players={players}
                roundScores={CalculateScores(players)}
                cumulativeScores={JSON.parse(sessionStorage.getItem("game")).Scores} />}
            {displayEndModal && <GameEndWinModal
                onClose={closeEndModal}
                winner={CheckWinner(players)}
                players={players}
                roundScores={CalculateScores(players)}
                cumulativeScores={JSON.parse(sessionStorage.getItem("game")).Scores} />}
            {broadcastDisplayRoundModal && (
                <RoundEndModal
                    onClose={() => setBroadcastDisplayRoundModal(false)}
                    winner={modalData.winner}
                    players={modalData.players}
                    roundScores={modalData.roundScores}
                    cumulativeScores={modalData.cumulativeScores}
                />
            )}
            {broadcastDisplayEndModal && (
                <GameEndWinModal
                    onClose={() => setBroadcastDisplayEndModal(false)}
                    winner={modalData.winner}
                    players={modalData.players}
                    roundScores={modalData.roundScores}
                    cumulativeScores={modalData.cumulativeScores}
                />
            )}
            <Background />
        </>
    );
}
export default GameChoice;