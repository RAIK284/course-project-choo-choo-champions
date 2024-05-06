// This page has been tested and approved by Lighthouse for correct alt text and ease of readability
// This page has also been verified to comply with the Chrome screenreader extension

import NavBar from "../universal/NavBar";
import Background from "../universal/Background";
import TrainStation from "./TrainStation";

import {
  GenerateDominoesForPlayers,
  GeneratePathsForGame,
  DrawADomino,
  CheckIfDominoIsPlayable,
  DeterminePlayablePaths,
  PlayDomino,
  CheckWinner,
  CalculateScores,
  EnsurePlayability,
} from "./GameLogic";
import { ConvertToReact } from "./dominoes/Domino";
import "./GameBase.css";
import { useEffect, useState } from "react";
import RoundEndModal from "./modals/RoundEndModal";
import GameEndWinModal from "./modals/GameEndWinModal";

const startingDominoList = [
  [0, 0, 0],
  [13, 1, 1],
  [25, 2, 2],
  [36, 3, 3],
  [46, 4, 4],
  [55, 5, 5],
  [63, 6, 6],
  [70, 7, 7],
  [76, 8, 8],
  [81, 9, 9],
  [85, 10, 10],
  [88, 11, 11],
  [90, 12, 12],
];

function GameChoice({ src, alt, onSelect, isSelected }) {
  // setup
  const urlParams = new URLSearchParams(window.location.search);
  const playerCount = parseInt(urlParams.get("playerCount")); // Get player count from URL parameter

  const players = [];
  for (let i = 1; i <= playerCount; i++) {
    players.push(`Player ${i}`);
  }

  sessionStorage.setItem(
    "Players",
    JSON.stringify(["Mexican Train", ...players])
  );
  // a ton of booleans that represent different states in our game
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(
    sessionStorage.getItem("game") !== null
      ? parseInt(JSON.parse(sessionStorage.getItem("game")).TurnIndex)
      : 0
  );
  const [currentRound, setCurrentRound] = useState(
    sessionStorage.getItem("game") !== null
      ? JSON.parse(sessionStorage.getItem("game")).CurrentRound
      : 12
  );
  // indicators for whether buttons are usable
  const [drawDisabled, setDrawDisabled] = useState(true);
  const [playDisabled, setPlayDisabled] = useState(true);
  // indicators for whether the game is 'loading' or a player is in turn
  const [loading, setLoading] = useState(true);
  const [inTurn, setInTurn] = useState(false);
  // indicators that highlight whether dominos or paths are playable or selected
  const [selectedDomino, setSelectedDomino] = useState(null);
  const [isAvailable] = useState([false, false, false, false, false]);
  const [isPlayable] = useState([false, false, false, false]);
  // the starting domino for the game
  const [startingDomino, setStartingDomino] = useState([
    startingDominoList[currentRound],
  ]);
  // indicators for ending modals
  const [displayRoundModal, setDisplayRoundModal] = useState(false);
  const [displayEndModal, setDisplayEndModal] = useState(false);
  const [roundsLeft, setRoundsLeft] = useState(
    sessionStorage.getItem("game") !== null
      ? JSON.parse(sessionStorage.getItem("game")).GamesLeft
      : 3
  );

  const [buttonName, setButtonName] = useState("Draw");

  // round setup function
  function SetUpRound() {
    setStartingDomino([startingDominoList[currentRound]]);
    GenerateDominoesForPlayers(players, startingDomino);
    GeneratePathsForGame(startingDomino, players);
    const scores =
      sessionStorage.getItem("game") !== null
        ? JSON.parse(sessionStorage.getItem("game")).Scores
        : null;
    // create the game object, which stores all relevant game data in an object
    setRoundsLeft(roundsLeft - 1);
    const game = {
      "Player Dominoes": JSON.parse(sessionStorage.getItem("Player Dominoes")),
      "Player Paths": JSON.parse(sessionStorage.getItem("Player Paths")),
      Dominoes: JSON.parse(sessionStorage.getItem("Domino")),
      Boneyard: JSON.parse(sessionStorage.getItem("Boneyard")),
      TurnIndex: currentPlayerIndex,
      CurrentRound: currentRound - 1,
      GamesLeft: roundsLeft - 1,
      Scores: scores,
      Scored: false,
    };
    sessionStorage.setItem("game", JSON.stringify(game));
    console.log(JSON.parse(sessionStorage.getItem("game")));
  }

  if (sessionStorage.getItem("Player Dominoes") == null) {
    SetUpRound();
  }

  // these react functions handle the user facing side of our game
  useEffect(() => {
    const storedGame = sessionStorage.getItem("game");
    if (storedGame !== null) {
      setCurrentPlayerIndex(JSON.parse(storedGame).TurnIndex);
    }
  }, []);

  // handles the user finishing their turn, and switches play to the next player
  const finishTurn = () => {
    switchToNextPlayer();
    const event = new Event("TurnEnded");
    window.dispatchEvent(event);
  };

  const switchToNextPlayer = () => {
    let nextIndex = currentPlayerIndex + 1;
    if (nextIndex >= playerCount) {
      nextIndex = 0 * 1;
    }
    setCurrentPlayerIndex(nextIndex);
    const game = JSON.parse(sessionStorage.getItem("game"));
    game.TurnIndex = nextIndex.toString();
    sessionStorage.setItem("game", JSON.stringify(game));
  };

  const getPlayerColor = (index) => {
    switch (parseInt(index)) {
      case 0:
        //green
        return "rgb(30,214,86)";
      case 1:
        //blue
        return "rgb(66,148,194)";
      case 2:
        //purple
        return "rgb(146,28,193)";
      case 3:
        //orange
        return "rgb(232,133,4)";
      case 4:
        //red
        return "rgb(179,47,38)";
      default:
        return "white";
    }
  };

  // handles logic for drawing a domino
  const DrawDomino = () => {
    sessionStorage.setItem("DominoDrawn", JSON.stringify(true));
    const options = DeterminePlayablePaths(
      players[currentPlayerIndex],
      players
    );
    if (options.includes("Draw")) {
      DrawADomino(players[currentPlayerIndex], players);
      window.location.reload();
    } else {
      const event = new Event("DominoDrawn");
      window.dispatchEvent(event);
      setDrawDisabled(true);
    }
  };

  // handles logic for selecting a domino from the bank
  const SelectADominoToPlay = () => {
    const domino = JSON.parse(sessionStorage.getItem("SelectedDomino"));
    if (domino == null) {
      return false;
    }
    const options = CheckIfDominoIsPlayable(
      players[currentPlayerIndex],
      players,
      domino
    );
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

  // handles taking the selected domino, and actually playing it on the path
  const handleDominoSelection = (index) => {
    if (isAvailable[index]) {
      if (index === 0) {
        PlayDomino(
          players[currentPlayerIndex],
          selectedDomino,
          "Mexican Train"
        );
      } else {
        PlayDomino(
          players[currentPlayerIndex],
          selectedDomino,
          players[index - 1]
        );
      }
      const event = new Event("DominoOnPath");
      sessionStorage.setItem("SelectedDomino", null);
      setPlayDisabled(false);
      window.dispatchEvent(event);
    }
  };

  // checks to ensure round end condition has not been reached
  const checkForWinner = () => {
    if (
      (CheckWinner(players) !== "No One" ||
        EnsurePlayability(players) !== false) &&
      roundsLeft !== 0
    ) {
      const game = JSON.parse(sessionStorage.getItem("game"));
      if (!game.Scored) {
        game.Scored = true;
        sessionStorage.setItem("game", JSON.stringify(game));
        const scores = CalculateScores(players);
        if (game.Scores === null) {
          game.Scores = scores;
          sessionStorage.setItem("game", JSON.stringify(game));
          setDisplayRoundModal(true);
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
  };

  // checks to ensure game end condition has not been reached
  const checkForGameOver = () => {
    if (
      (CheckWinner(players) !== "No One" ||
        EnsurePlayability(players) !== false) &&
      roundsLeft <= 0
    ) {
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
    }
  };

  // deals with closing models
  const closeRoundModal = () => {
    setDisplayRoundModal(false);
    FinishRound();
  };

  const closeEndModal = () => {
    setDisplayEndModal(false);
    // route them to home screen
    window.location.href = `/dashboard`;
  };

  // responsible for loading the last played dominoes on player paths
  function loadDominos() {
    const playerPaths = JSON.parse(sessionStorage.getItem("game"))[
      "Player Paths"
    ];
    // gets the last domino of the mexican train, if there isn't a domino on path
    // it appends an 'empty train' domino
    const lastDominos = [];
    if (playerPaths["Mexican Train"].Dominoes.length === 0) {
      lastDominos.push(ConvertToReact([[0, 13, 14]])); // empty train domino
    } else {
      lastDominos.push(
        ConvertToReact([
          playerPaths["Mexican Train"].Dominoes[
          playerPaths["Mexican Train"].Dominoes.length - 1
          ],
        ])
      );
    }
    // gets the last domino of the players trains, if there isn't a domino on path
    // it appends an 'empty train' domino
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
        // if there is no player, appends an 'empty player' domino
        lastDominos.push(ConvertToReact([[0, 13, 15]]));
      }
    }
    return lastDominos;
  }

  // responsible for highlighting which players are playable to all players
  function CheckPlayable() {
    const paths = JSON.parse(sessionStorage.getItem("game"))["Player Paths"];
    for (let i = 0; i < players.length; i++) {
      if (
        paths[players[i]].Playable ||
        paths.UnvalidatedDouble === players[i]
      ) {
        isPlayable[i] = true;
      } else {
        isPlayable[i] = false;
      }
    }
  }

  // turn and finish round functions

  // this function handles all necessary logic to accomplish a players turn
  async function Turn() {
    // first we must check what the players options are 
    const options = DeterminePlayablePaths(
      players[currentPlayerIndex],
      players
    );
    
    // then we highlight the global ones 
    CheckPlayable();

    // if there are no dominos to draw, change the buttons name to pass
    if (JSON.parse(sessionStorage.getItem("game")).Boneyard.length === 0) {
      setButtonName("Pass");
    }
    
    // option 1: player can only draw or pass
    if (
      (options.includes("Draw") || options.includes("Pass")) &&
      (sessionStorage.getItem("DominoDrawn") == null ||
        !JSON.parse(sessionStorage.getItem("DominoDrawn")))
    ) {
      // only enable the draw button, and await the user to click it
      setDrawDisabled(false);
      setPlayDisabled(true);
      await new Promise((resolve) => {
        window.addEventListener("DominoDrawn", function handler() {
          window.removeEventListener("DominoDrawn", handler);
          resolve();
        });
      });
      // once the domino is drawn, set session storage so user can't infinitely draw
      sessionStorage.setItem("DominoDrawn", JSON.parse(true));
    } 
    // otherwise option 2: user can p[lay a domino
    else if (!options.includes("Draw") && !options.includes("Pass")) {
      // only enable the play button and wait for user to select a domino
      setPlayDisabled(false);
      await new Promise((resolve) => {
        window.addEventListener("DominoPlayed", function handler() {
          window.removeEventListener("DominoPlayed", handler);
          resolve();
        });
      });

      // once they select, disable play button and highlight paths, await them to play on path
      setPlayDisabled(true);
      await new Promise((resolve) => {
        window.addEventListener("DominoOnPath", function handler() {
          window.removeEventListener("DominoOnPath", handler);
          resolve();
        });
      });

      // check for the double condition, if its a double set all paths unavailable and 
      // call the turn function again
      if (
        JSON.parse(sessionStorage.getItem("game"))["Player Paths"]
          .UnvalidatedDouble !== null
      ) {
        for (let i = 0; i < isAvailable.length; i++) {
          isAvailable[i] = false;
        }
        await sessionStorage.setItem("DominoDrawn", false);
        await Turn(players[currentPlayerIndex]);
        return;
      }
    }

    // clean up all side effects, and end turn
    for (let i = 0; i < isAvailable.length; i++) {
      isAvailable[i] = false;
    }
    finishTurn();
    await sessionStorage.setItem("DominoDrawn", false);
    setInTurn(false);

    // check for our ending conditions
    checkForWinner();
    checkForGameOver();
  }

  // finishes the round
  function FinishRound() {
    const newRound = currentRound - 1;
    setCurrentRound(newRound);
    SetUpRound();
    window.location.reload();
  }

  // load the round objects that will be displayed
  const playerDominoes = JSON.parse(sessionStorage.getItem("game"))[
    "Player Dominoes"
  ];
  const playerPaths = JSON.parse(sessionStorage.getItem("game"))[
    "Player Paths"
  ];
  
  // get the player's dominos, and the starting domino
  const dominos = ConvertToReact(playerDominoes[players[currentPlayerIndex]]);
  const sDomino = ConvertToReact(playerPaths["Starting Domino"]);
  const lastDominos = loadDominos();

  // block to ensure mounting of components does not occur too fast (this caused many problems earlier)
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
              <div
                className="bank"
                alt="Domino bank containing dominos for players to select"
              >
                {dominos}
              </div>
              {/* end of bank group */}
              <div className="button-container">
                <div className="buttonTopRow">
                  <button
                    className="button"
                    onClick={DrawDomino}
                    disabled={drawDisabled}
                    alt="Button to draw a domino tile"
                  >
                    {buttonName}
                  </button>
                  <button
                    className="button"
                    onClick={SelectADominoToPlay}
                    disabled={playDisabled}
                    alt="Button to place a selected domino tile on the board"
                  >
                    Place Domino
                  </button>
                </div>
              </div>
            </div>
            {/* end of left content */}
            <div className="inner-content">
              <h3
                className="players_turn"
                alt={`It is ${players[currentPlayerIndex]}'s turn`}
              >
                It is{" "}
                <strong
                  className="player-color"
                  style={{ color: getPlayerColor(currentPlayerIndex) }}
                >
                  {players[currentPlayerIndex]}
                </strong>
                's turn
              </h3>{" "}
              <TrainStation
                sDomino={sDomino}
                alt="Train station for players to view and play eligible dominos"
                handleDominoSelection={handleDominoSelection}
                lastDominos={lastDominos}
                isAvailable={isAvailable}
                trains={["Green Train", "Blue Train", "Purple Train", "Red Train"]}
                isPlayable={isPlayable}
              />
            </div>
          </div>
        </div>{" "}
      </div>{" "}
      {/* end of right content  */}
      {/* end of horizontal group */}
      {/* end of content */}
      {displayRoundModal && (
        <RoundEndModal
          onClose={closeRoundModal}
          winner={CheckWinner(players)}
          players={players}
          roundScores={CalculateScores(players)}
          cumulativeScores={JSON.parse(sessionStorage.getItem("game")).Scores}
        />
      )}
      {displayEndModal && (
        <GameEndWinModal
          onClose={closeEndModal}
          winner={CheckWinner(players)}
          players={players}
          roundScores={CalculateScores(players)}
          cumulativeScores={JSON.parse(sessionStorage.getItem("game")).Scores}
        />
      )}
      <Background />
    </>
  );
}
export default GameChoice;
