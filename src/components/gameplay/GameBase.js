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
  CheckWinner,
  CalculateScores
} from "./GameLogic";
import { ConvertToReact } from "./dominoes/Domino";
import "./GameBase.css";
import { useEffect, useState} from "react";
import RoundEndModal from "./RoundEndModal";

const startingDominoList = [[0,0,0],[13,1,1],[25,2,2],[36,3,3],[46,4,4],[55,5,5],[63,6,6],[70,7,7],[76,8,8],[81,9,9],[85,10,10],[88,11,11],[90,12,12]];

function GameChoice({ src, alt, onSelect, isSelected }) {
  // hard coded setup
const players = ["max", "arjun", "carly"/*, "alison"*/];
  sessionStorage.setItem(
    "Players",
    JSON.stringify(["Mexican Train", "max", "arjun", "carly"/*, "alison"*/])
  );

  // a bunch of booleans that we will use within
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(
    sessionStorage.getItem("currentPlayerIndex") !== null
      ? parseInt(sessionStorage.getItem("currentPlayerIndex"))
      : 0
  );
  const [currentRound, setCurrentRound] = useState(
    sessionStorage.getItem("currentRound") !== null
      ? parseInt(sessionStorage.getItem("currentRound"))
      : 12
  );
  const [drawDisabled, setDrawDisabled] = useState(true);
  const [playDisabled, setPlayDisabled] = useState(true);
  const [finishDisabled, setFinishDisabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [inTurn, setInTurn] = useState(false);
  const [selectedDomino, setSelectedDomino] = useState(null);
  const [isAvailable] = useState([false, false, false, false, false]);
  const [startingDomino,setStartingDomino] = useState([startingDominoList[currentRound]]);
  const [displayModal, setDisplayModal] = useState(false);

  // round setup function
  function SetUpRound(){
    sessionStorage.setItem("currentRound",currentRound-1);
    sessionStorage.setItem("Scored", JSON.stringify(false));
    setStartingDomino([startingDominoList[currentRound]]);
    GenerateDominoesForPlayers(players, startingDomino);
    GeneratePathsForGame(startingDomino, players);
  }
  
  if (sessionStorage.getItem("Player Dominoes") == null) {
    SetUpRound();
  }


  // now the react functions
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

  const checkForWinner = () => {
    if(CheckWinner(players) !== false){
      if(!JSON.parse(sessionStorage.getItem("Scored"))){
        sessionStorage.setItem("Scored", true);
        const scores = CalculateScores(players);
        if(sessionStorage.getItem("Scores")===null || sessionStorage.getItem("Scores")===undefined){
          sessionStorage.setItem("Scores", JSON.stringify(scores))
          setDisplayModal(true);
          return;
        } else{
          for(let i=0;i<players.length;i++){
            const totals = JSON.parse(sessionStorage.getItem("Scores"));
            totals[i] += scores[i];
            sessionStorage.setItem("Scores", JSON.stringify(totals));
          }
        }
      }
      setDisplayModal(true);
    }
  }

  const closeModal = () => {
    setDisplayModal(false);
    FinishRound()
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

  // turn and finish round functions
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

    // this will trigger a reset
    checkForWinner();
  }

  // finishes the round
  function FinishRound(){
    // this would have more in the future
    const newRound = currentRound-1;
    setCurrentRound(newRound);
    console.log(currentRound);
    sessionStorage.setItem("currentRound", newRound);
    // log scores here in the future
    SetUpRound();
    window.location.reload();
  }

  // load the round objects
  const playerDominoes = JSON.parse(sessionStorage.getItem("Player Dominoes"));
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
      {displayModal && <RoundEndModal
            onClose={closeModal}
            winner={CheckWinner(players)}
            players={players}
            roundScores={CalculateScores(players)}
            cumulativeScores={JSON.parse(sessionStorage.getItem("Scores"))} />}
      <Background />
    </>
  );
}
export default GameChoice;
