import NavBar from "./NavBar";
import Background from "./Background";
import "./GameBase.css";

function GameChoice({ src, alt, onSelect, isSelected }) {
  return (
    <>
      <div className="full-page">
        <NavBar />
        <div className="content">
          <div className="sidegroup">
            <div className="left-content">
              <div className="bank">
                <h1 className="banktitle">Bank</h1>
                <div> dominos here </div>
                <div> dominos here </div>
                <div> dominos here </div>
                <div> dominos here </div>
              </div>
              {/* end of bank group */}
              <button className="button"> Draw</button>{" "}
            </div>
            {/* end of left content */}
            <img
              className="trainstation"
              src="./trainstation.png"
              alt="domino train station"
            />
          </div>
          {/* end of horizontal group */}
        </div>

        {/* end of content */}
      </div>
      <Background />
    </>
  );
}
export default GameChoice;
