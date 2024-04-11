import NavBar from "./NavBar";
import Background from "./Background";
import {
  GenerateDominoesForPlayers,
  GeneratePathsForGame,
  DeterminePlayablePaths,
} from "./GameLogic";
import { ConvertToReact } from "./Domino";
import "./GameBase.css";
import { useEffect, useState } from "react";

function GameChoice({ src, alt, onSelect, isSelected }) {
  const players = ["max", "arjun", "carly"];

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  useEffect(() => {
    const storedIndex = sessionStorage.getItem("currentPlayerIndex");
    if (storedIndex !== null) {
      setCurrentPlayerIndex(parseInt(storedIndex));
    }
  }, []);

  const switchToNextPlayer = () => {
    const nextIndex = (currentPlayerIndex + 1) % players.length;
    setCurrentPlayerIndex(nextIndex);
    sessionStorage.setItem("currentPlayerIndex", nextIndex.toString());
  };

  const finishTurn = () => {
    switchToNextPlayer();
  };

  const startingDomino = [[90, 12, 12]];
  if (sessionStorage.getItem("Player Dominoes") == null) {
    GenerateDominoesForPlayers(players, startingDomino);
  }
  const playerDominoes = JSON.parse(sessionStorage.getItem("Player Dominoes"));
  if (sessionStorage.getItem("Player Paths") == null) {
    GeneratePathsForGame(startingDomino, players);
  }
  const playerPaths = JSON.parse(sessionStorage.getItem("Player Paths"));
  //const dominos = ConvertToReact(playerPaths["Starting Domino"]);
  const dominos = ConvertToReact(playerDominoes["carly"]);
  const sDomino = ConvertToReact(playerPaths["Starting Domino"]);
  console.log(DeterminePlayablePaths("carly", players));
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
              <button className="button">Draw</button>
            </div>
            {/* end of left content */}
            <div className="inner-content">
              <h3 className="players_turn">
                It is <strong>{players[currentPlayerIndex]}</strong>'s turn
              </h3>{" "}
              <img
                className="trainstation"
                src="./trainstation.png"
                alt="domino train station"
              />
              <div className="StartingDomino">{sDomino}</div>
              <img
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
              {/* <img
                className="game-image-choice"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/19af73f19f2af54ce737c599541168e9050396e728f163bd56c5c822021bf5ac"
                alt="Pink Train"
              /> */}
              <img
                className="mexican-train"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/2e707c1c15ef3106cc95045c56346e6166b027d11a3d59268444fa4919181093"
                alt="Orange Train"
              />
              <button className="button" onClick={finishTurn}>
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
