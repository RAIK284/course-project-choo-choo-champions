import React from "react";
import NavBar from "./NavBar";
import Background from "./Background";
import "./DominoBank.css";
import Domino from "./Domino";

function DominoBank() {
  const dominos = [];

  for (let top = 0; top < 13; top++) {
    for (let top = 0; top <= 12; top++) {
      for (let bottom = 0; bottom <= 12; bottom++) {
        const key = `${top}-${bottom}`;
        dominos.push(<Domino key={key} top={top} bottom={bottom} />);
      }
    }
  }

  return (
    <div className="domino-page full-page">
      <Background />
      <NavBar />
      <div className="centered-content">
        <div className="container">
          <h2 className="domino-title">Bank</h2>

          <div className="bank">
            {dominos.map((domino, index) => (
              <div key={index} className="domino-item">
                {domino}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DominoBank;
