import NavBar from "./NavBar";
import Background from "./Background";
import {
  GenerateDominoesForPlayers,
  GeneratePathsForGame,
  DrawADomino,
  CheckIfDominoIsPlayable,
  DeterminePlayablePaths
} from "./GameLogic";
import { ConvertToReact } from "./Domino";
import "./GameBase.css";
import { useEffect, useState } from "react";

function GameChoice({ src, alt, onSelect, isSelected }) {
  // hard coded setup
  const players = ["max", "arjun", "carly"];
  const startingDomino = [[90, 12, 12]];
  const currentPlayer = 'max';

  if (sessionStorage.getItem("Player Dominoes") == null) {
    GenerateDominoesForPlayers(players, startingDomino);
  }

  // functions that we will use within 
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [drawDisabled, setDrawDisabled] = useState(true);
  const [playDisabled, setPlayDisabled] = useState(true);
  const [finishDisabled, sitFinishDisabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [inTurn, setInTurn] = useState(false);

  useEffect(() => {
    const storedIndex = sessionStorage.getItem("currentPlayerIndex");
    if (storedIndex !== null) {
      setCurrentPlayerIndex(parseInt(storedIndex));
    }
  }, []);

  const finishTurn = () => {
    switchToNextPlayer();
  };

  const switchToNextPlayer = () => {
    const nextIndex = (currentPlayerIndex + 1) % players.length;
    setCurrentPlayerIndex(nextIndex);
    sessionStorage.setItem("currentPlayerIndex", nextIndex.toString());
  };


const DrawDomino = () => {
  DrawADomino(currentPlayer, players);
  window.location.reload();
};

const SelectADominoToPlay = () => {
  const domino = JSON.parse(sessionStorage.getItem('SelectedDomino'));
  if(domino == null){
    alert("No domino selected");
    return;
  }
  const result = CheckIfDominoIsPlayable(currentPlayer, players, domino);
  if(result !== undefined){
    alert("Playable Paths: " + result.toString());
  }
};

async function Turn() {
  // timer goes here
  const initialDominoes = (JSON.parse(sessionStorage.getItem("Player Dominoes")))[currentPlayer];
  const initialDominoLength = initialDominoes.length;
  const options = DeterminePlayablePaths(currentPlayer, players);
  const drew = false;
  //while((JSON.parse(sessionStorage.getItem("Player Dominoes")))[currentPlayer].length === initialDominoLength){
    if(options.includes('Draw')){
      setDrawDisabled(false);
    } else if(options.includes(currentPlayer) || options.includes('Mexican Train')){
      setPlayDisabled(false)
    }
  //}
}
  // set up round
  const playerDominoes = JSON.parse(sessionStorage.getItem("Player Dominoes"));
  if (sessionStorage.getItem("Player Paths") == null) {
    GeneratePathsForGame(startingDomino, players);
  }
  const playerPaths = JSON.parse(sessionStorage.getItem("Player Paths"));
  const dominos = ConvertToReact(playerDominoes[currentPlayer]);
  const sDomino = ConvertToReact(playerPaths["Starting Domino"]);

  if(!loading && !inTurn){
    Turn(currentPlayer);
    setInTurn(true);
  } else if(loading && !inTurn){
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
                <button className="button" onClick={DrawDomino} disabled={drawDisabled}>
                  Draw
                </button>
                <button className="button" onClick={SelectADominoToPlay} disabled={playDisabled}>
                  AddToPath
                </button>
              </div>
            </div>
            {/* end of left content */}
            <div className="inner-content">
              <h3 className="players_turn">
                It is <strong>{players[currentPlayerIndex]}</strong>'s turn
              </h3>{" "}
              <div className="newTrainStation">
                {/* mexican train domino */}
                <div className="mexicanDomino">
                  {ConvertToReact([[0, 2, 12]])}
                </div>
                <div className="rotateDominos">
                  <div className="playerOneDomino">
                    {ConvertToReact([[0, 3, 12]])}
                  </div>
                  {/* fourth player domino */}
                  <div className="playerFourDomino">
                    {ConvertToReact([[0, 6, 12]])}
                  </div>
                </div>
                <div className="StartingDomino">{sDomino}</div>
                <div className="rotateDominos">
                  {/* second player domino */}
                  <div className="playerTwoDomino">
                    {ConvertToReact([[0, 9, 12]])}
                  </div>
                  {/* third player domino */}
                  <div className="playerThreeDomino">
                    {ConvertToReact([[0, 11, 12]])}
                  </div>
                </div>
              </div>
              {/* Theoretically this will all be moved to another component to not clutter gamebase, for now do not touch */}
              {/* <img
                className="first-train"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/d737771a839e9d3381cf8be0888aafeb9423dad94e31ce6e6b57702a2eb9bb23"
                alt="Red Train"
              />
              <img
                className="second-train"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/6f86f2b40e7a9d4e455f9a504dc5e366503ace6cf85fc3fb36aac70ac88a8fdf"
                alt="Green Train"
              />
              <img
                className="third-train"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/5ec4c3ceb8e14edecf8b637152c22aeb4571947ce4e06158fb90c3aa98a3f917"
                alt="Purple Train"
              />
              <img
                className="fourth-train"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/b113a030456c013a7e21d15ec68b8ef946e9a436bdd585825811f93c41853999"
                alt="Blue Train"
              />
              <img
                className="mexican-train"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/2e707c1c15ef3106cc95045c56346e6166b027d11a3d59268444fa4919181093"
                alt="Orange Train"
              />
              <button className="finish-turn-button" onClick={finishTurn} disabled={finishDisabled}>
                Finish Turn
              </button>{" "}
            </div>
          </div>
          {/* end of right content  */}
          {/* end of horizontal group */}
        </div>
        {/* end of content */}
      </div>
      <Background />
    </>
  );
}

export default GameChoice;
