import React from "react";
import NavBar from "./NavBar";
import Background from "./Background";
import "./DominoBank.css";
import Domino from "./Domino";

function GenerateDominoBank(){
  const dominos = [];

  // Loop through unique combinations of numbers for both top and bottom
  for (let top = 0; top <= 12; top++) {
    for (let bottom = top; bottom <= 12; bottom++) {
      // Start bottom from top to ensure uniqueness
      const key = `${top}-${bottom}`;
      dominos.push(<Domino key={key} top={top} bottom={bottom} />);
    }
  }
  return dominos;
}

function DominoBank() {
  const dominos = GenerateDominoBank();

  return (
    <div className="domino-page full-page">
      <Background />
      <NavBar />
      <div className="centered-content">
        <div className="container">
          <h2 className="domino-title">Bank</h2>
        </div>
        <div className="bank">{dominos}</div>
      </div>
    </div>
  );
}

export default DominoBank;
