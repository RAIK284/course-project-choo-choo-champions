import NavBar from "../universal/NavBar";
import Background from "../universal/Background";
// import greenTrain from "./GreenTrain";
// import { redTrain } from "./RedTrain";
// import blueTrain from "./BlueTrain";
// import purpleTrain from "./PurpleTrain";
// import orangeTrain from "./OrangeTrain";
import TrainStation from "./TrainStation";

import {
  GenerateDominoesForPlayers,
  GeneratePathsForGame,
  DrawADomino,
  CheckIfDominoIsPlayable,
  DeterminePlayablePaths,
  PlayDomino,
} from "./GameLogic";
import { ConvertToReact } from "./dominoes/Domino";
import "./GameBase.css";
import { useEffect, useState } from "react";

function GameChoice({ src, alt, onSelect, isSelected }) {
  // hard coded setup
const players = ["max", "arjun", "carly"/*, "alison"*/];
  sessionStorage.setItem(
    "Players",
    JSON.stringify(["Mexican Train", "max", "arjun", "carly"/*, "alison"*/])
  );
  const startingDomino = [[90, 12, 12]];

  if (sessionStorage.getItem("Player Dominoes") == null) {
    GenerateDominoesForPlayers(players, startingDomino);
  }

  // a bunch of booleans that we will use within
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(
    sessionStorage.getItem("currentPlayerIndex") !== null
      ? parseInt(sessionStorage.getItem("currentPlayerIndex"))
      : 0
  );
  const [drawDisabled, setDrawDisabled] = useState(true);
  const [playDisabled, setPlayDisabled] = useState(true);
  const [finishDisabled, setFinishDisabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [inTurn, setInTurn] = useState(false);
  const [selectedDomino, setSelectedDomino] = useState(null);
  const [isAvailable] = useState([false, false, false, false, false]);

  // now the functions
  useEffect(() => {
    const storedIndex = sessionStorage.getItem("currentPlayerIndex");
    if (storedIndex !== null) {
      setCurrentPlayerIndex(parseInt(storedIndex));
    }
  }, []);

  const finishTurn = () => {
    switchToNextPlayer();
    const event = new Event("TurnEnded");
    window.dispatchEvent(event);
  };

  const switchToNextPlayer = () => {
    const nextIndex = (currentPlayerIndex + 1) % players.length;
    setCurrentPlayerIndex(nextIndex);
    sessionStorage.setItem("currentPlayerIndex", nextIndex.toString());
  };

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
      const event = new Event('DominoPlayed');
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

    if(isAvailable[index]){
      if(index===0){
        PlayDomino(players[currentPlayerIndex], players, selectedDomino, 'Mexican Train');
      } else{
        PlayDomino(players[currentPlayerIndex], players, selectedDomino, players[index-1]);
      }
      const event = new Event("DominoOnPath");
      sessionStorage.setItem("SelectedDomino", null);
      window.dispatchEvent(event);
      // finishTurn();
    }
  };

  function loadDominos() {
    const playerPaths = JSON.parse(sessionStorage.getItem("Player Paths"));
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
        // i want this to be a placeholder but that fucks up the spacing for now
        // so we will keep this ftm
        lastDominos.push(ConvertToReact([[0, 13, 14]]));
      }
    }
    return lastDominos;
  }

  async function Turn() {
    // timer goes here
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
      if(JSON.parse(sessionStorage.getItem("Player Paths")).UnvalidatedDouble !==null){
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
  // set up round
  const playerDominoes = JSON.parse(sessionStorage.getItem("Player Dominoes"));
  if (sessionStorage.getItem("Player Paths") == null) {
    GeneratePathsForGame(startingDomino, players);
  }
  const playerPaths = JSON.parse(sessionStorage.getItem("Player Paths"));
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
                    Draw
                  </button>
                  <button
                    className="button"
                    onClick={SelectADominoToPlay}
                    disabled={playDisabled}
                  >
                    AddToPath
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
            </div>
            {/* end of left content */}
            <div className="inner-content">
              <h3 className="players_turn">
                It is <strong>{players[currentPlayerIndex]}</strong>'s turn
              </h3>{" "}
              <TrainStation
                sDomino={sDomino}
                handleDominoSelection={handleDominoSelection}
                lastDominos={lastDominos}
                isAvailable={isAvailable}
              />
            </div>
          </div>
        </div>{" "}
      </div>{" "}
      {/* end of right content  */}
      {/* end of horizontal group */}
      {/* end of content */}
      <Background />
    </>
  );
}
export default GameChoice;
