import NavBar from "./NavBar";
import Background from "./Background";
import "./TrainSelector.css";

function GameChoice({ src, alt, onSelect, isSelected }) {
  return (
    <>
      <div className="basegame">
        <Background />
        <NavBar />
      </div>
    </>
  );
}
export default GameChoice;
