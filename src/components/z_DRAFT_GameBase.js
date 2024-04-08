import { useState } from 'react';
import NavBar from "./NavBar";
import Background from "./Background";
import "./z_DRAFT_GameBase.css";

function GameChoice() {
  const players = ["Carly", "Alison", "Max", "Arjun"];
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  const switchToNextPlayer = () => {
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
  };

  const finishTurn = () => {
    switchToNextPlayer();
  };

  return (
    <>
      <div className="full-page">
        <NavBar />
        <div className="content">
          <div className="sidegroup">
            <div className="inner-content">
              <div className="bank">
                <h1 className="banktitle">Bank</h1>
                {/* domino generation goes here!! */}
              </div>
              {/* end of bank group */}
              <button className="button">Draw</button>{" "}
            </div>
            {/* end of left content */}
            <div className="inner-content">
              <h3 className="players_turn">
                It is <strong>{players[currentPlayerIndex]}</strong>'s turn
              </h3>
              <img
                className="trainstation"
                src="./trainstation.png"
                alt="domino train station"
              />
              <button className="button" onClick={finishTurn}>Finish Turn</button>{" "}
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
