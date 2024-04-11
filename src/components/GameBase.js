import React, { useState } from "react";
import NavBar from "./NavBar";
import Background from "./Background";
import { GenerateDominoesForPlayers, GeneratePathsForGame, DeterminePlayablePaths } from "./GameLogic";
import { ConvertToReact } from "./Domino";
import RoundEndModal from "./RoundEndModal";
import GameEndLossModal from "./GameEndLossModal";
import GameEndWinModal from "./GameEndWinModal";
import "./GameBase.css";

function GameChoice({ src, alt, onSelect, isSelected }) {
  const [isRoundOver, setIsRoundOver] = useState(false);
  const [isGameEnd, setIsGameEnd] = useState(false);
  const [isGameWin, setIsGameWin] = useState(false);
  const players = ["max", "arjun", "carly"];

  if (sessionStorage.getItem("Player Dominoes") == null) {
    GenerateDominoesForPlayers(players);
  }
  const playerDominoes = JSON.parse(sessionStorage.getItem("Player Dominoes"));
  const startingDomino = [[91, 12, 12]];

  if (sessionStorage.getItem("Player Paths") == null) {
    GeneratePathsForGame(startingDomino, players);
  }

  //const playerPaths = JSON.parse(sessionStorage.getItem("Player Paths"));
  //const dominos = ConvertToReact(playerPaths["Starting Domino"]);

  const dominos = ConvertToReact(playerDominoes['carly']);
  console.log(DeterminePlayablePaths('carly', players));

  const handleRoundEnd = () => {
    console.log("Round ended");
    setIsRoundOver(true);
  };

  const handleGameEnd = () => {
    console.log("Game ended");
    setIsGameEnd(true);
  };

  const handleGameWin = () => {
    console.log("Game won");
    setIsGameWin(true);
  };

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
                <button className="button" onClick={handleRoundEnd}>Finish Round</button>
                <button className="button" onClick={handleGameEnd}>End Game (Loss)</button>
                <button className="button" onClick={handleGameWin}>End Game (Win)</button>
              </div>
              <button className="button">Draw</button>
            </div>
            {/* end of left content */}
          </div>
          {/* end of right content  */}
          {/* end of horizontal group */}
        </div>
        {/* end of content */}
      </div>
      {isRoundOver && <RoundEndModal winner="Player 1" players={players} roundScores={[15, 20, 10, 25]} cumulativeScores={[50, 70, 40, 90]} onClose={() => setIsRoundOver(false)} />}
      {isGameEnd && <GameEndLossModal winner="Player 1" players={players} roundScores={[15, 20, 10, 25]} cumulativeScores={[50, 70, 40, 90]} onClose={() => setIsGameEnd(false)} />}
      {isGameWin && <GameEndWinModal winner="Player 1" players={players} roundScores={[15, 20, 10, 25]} cumulativeScores={[50, 70, 40, 90]} onClose={() => setIsGameWin(false)} />}
      <Background />
    </>
  );
}

export default GameChoice;
