import NavBar from "./NavBar";
import Background from "./Background";
import "./GameBase.css";

function GameChoice({ src, alt, onSelect, isSelected }) {
  return (
    <>
      <div className="full-page">
        <Background />
        <NavBar />
        <div className="bank">
          <h1 className="h1">Bank</h1>
          <div> dominos here </div>
        </div>
      </div>
    </>
  );
}
export default GameChoice;
