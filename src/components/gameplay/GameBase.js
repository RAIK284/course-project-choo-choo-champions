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
  // hard coded setup
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
  // a bunch of booleans that we will use within
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
  const [drawDisabled, setDrawDisabled] = useState(true);
  const [playDisabled, setPlayDisabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [inTurn, setInTurn] = useState(false);
  const [selectedDomino, setSelectedDomino] = useState(null);
  const [isAvailable] = useState([false, false, false, false, false]);
  const [isPlayable] = useState([false, false, false, false]);
  const [startingDomino, setStartingDomino] = useState([
    startingDominoList[currentRound],
  ]);
  const [displayRoundModal, setDisplayRoundModal] = useState(false);
  const [displayEndModal, setDisplayEndModal] = useState(false);
  const [roundsLeft, setRoundsLeft] = useState(
    sessionStorage.getItem("game") !== null
      ? JSON.parse(sessionStorage.getItem("game")).GamesLeft
      : 3
  );

  const [buttonName, setButtonName] = useState('Draw');

  // round setup function
  function SetUpRound() {
    setStartingDomino([startingDominoList[currentRound]]);
    GenerateDominoesForPlayers(players, startingDomino);
    GeneratePathsForGame(startingDomino, players);
    const scores =
      sessionStorage.getItem("game") !== null
        ? JSON.parse(sessionStorage.getItem("game")).Scores
        : null;
    // create the super crazy game
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

  // now the react functions
  useEffect(() => {
    const storedGame = sessionStorage.getItem("game");
    if (storedGame !== null) {
      setCurrentPlayerIndex(JSON.parse(storedGame).TurnIndex);
    }
  }, []);

  const finishTurn = () => {
    switchToNextPlayer();
    const event = new Event("TurnEnded");
    window.dispatchEvent(event);
  };

  const switchToNextPlayer = () => {
    let nextIndex = currentPlayerIndex+1;
    if(nextIndex>=playerCount){
      nextIndex = 0*1;
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

  const DrawDomino = () => {
    sessionStorage.setItem("DominoDrawn", JSON.stringify(true));
    const options = DeterminePlayablePaths(
      players[currentPlayerIndex],
      players
    );
    if(options.includes('Draw')){
      DrawADomino(players[currentPlayerIndex], players);
      window.location.reload();
    } else{
      const event = new Event("DominoDrawn");
      window.dispatchEvent(event);
      setDrawDisabled(true);
    }
  };

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

  const handleDominoSelection = (index) => {
    if (isAvailable[index]) {
      if (index === 0) {
        PlayDomino(
          players[currentPlayerIndex],
          players,
          selectedDomino,
          "Mexican Train"
        );
      } else {
        PlayDomino(
          players[currentPlayerIndex],
          players,
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

  const checkForGameOver = () => {
    if ((CheckWinner(players) !== "No One" || EnsurePlayability(players) !== false) && roundsLeft <= 0) {
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

  const closeRoundModal = () => {
    setDisplayRoundModal(false);
    FinishRound();
  };

  const closeEndModal = () => {
    setDisplayEndModal(false);
    // route them to home screen idk
    window.location.href = `/dashboard`;
  };

  function loadDominos() {
    const playerPaths = JSON.parse(sessionStorage.getItem("game"))[
      "Player Paths"
    ];
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
        // i want this to be a placeholder but that mess up the spacing for now
        // so we will keep this ftm
        lastDominos.push(ConvertToReact([[0, 13, 15]]));
      }
    }
    return lastDominos;
  }

  function CheckPlayable(){
    const paths = JSON.parse(sessionStorage.getItem("game"))['Player Paths'];
    for(let i=0; i<players.length;i++){
      if(paths[players[i]].Playable || paths.UnvalidatedDouble === players[i]){
        isPlayable[i] = true;
      } else{
        isPlayable[i] = false;
      }
    }
  }

  // turn and finish round functions
  async function Turn() {
    // timer goes here
    const options = DeterminePlayablePaths(
      players[currentPlayerIndex],
      players
    );
    CheckPlayable();
    if(JSON.parse(sessionStorage.getItem("game")).Boneyard.length===0){
      setButtonName('Pass');
    }
    if (
      (options.includes("Draw") || options.includes("Pass")) &&
      (sessionStorage.getItem("DominoDrawn") == null ||
        !JSON.parse(sessionStorage.getItem("DominoDrawn")))
    ) {
      setDrawDisabled(false);
      setPlayDisabled(true);
      await new Promise((resolve) => {
        window.addEventListener("DominoDrawn", function handler() {
          window.removeEventListener("DominoDrawn", handler);
          resolve();
        });
      });
      sessionStorage.setItem("DominoDrawn", JSON.parse(true))
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
    for (let i = 0; i < isAvailable.length; i++) {
      isAvailable[i] = false;
    }
    finishTurn();
    await sessionStorage.setItem("DominoDrawn", false);
    setInTurn(false);

    // this will trigger a reset
    checkForWinner();
    checkForGameOver();
  }

  // finishes the round
  function FinishRound() {
    // this would have more in the future
    const newRound = currentRound - 1;
    setCurrentRound(newRound);
    // console.log(currentRound);
    // sessionStorage.setItem("currentRound", newRound);
    // log scores here in the future
    SetUpRound();
    window.location.reload();
  }

  // load the round objects
  const playerDominoes = JSON.parse(sessionStorage.getItem("game"))[
    "Player Dominoes"
  ];
  const playerPaths = JSON.parse(sessionStorage.getItem("game"))[
    "Player Paths"
  ];
  const dominos = ConvertToReact(playerDominoes[players[currentPlayerIndex]]);
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
              <div className="bank">{dominos}</div>
              {/* end of bank group */}
              <div className="button-container">
                <div className="buttonTopRow">
                  <button
                    className="button"
                    onClick={DrawDomino}
                    disabled={drawDisabled}
                  >
                    {buttonName}
                  </button>
                  <button
                    className="button"
                    onClick={SelectADominoToPlay}
                    disabled={playDisabled}
                  >
                    Place Domino
                  </button>
                </div>
              </div>
            </div>
            {/* end of left content */}
            <div className="inner-content">
              <h3 className="players_turn">
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
                handleDominoSelection={handleDominoSelection}
                lastDominos={lastDominos}
                isAvailable={isAvailable}
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
