import NavBar from "./NavBar";
import Background from "./Background";
import { GenerateDominoesForPlayers } from "./GameLogic";
import { ConvertToReact } from "./Domino";
import "./GameBase.css";

function GameChoice({ src, alt, onSelect, isSelected }) {
  const players = ["max", "arjun", "carly"];
  if(sessionStorage.getItem("Player Dominoes") == null){
    GenerateDominoesForPlayers(players);
  }
  const playerDominoes = JSON.parse(sessionStorage.getItem("Player Dominoes"));
  const dominos = ConvertToReact(playerDominoes["max"]);
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
