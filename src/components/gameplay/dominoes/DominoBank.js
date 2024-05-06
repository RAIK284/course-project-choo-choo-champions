import React from "react";
import NavBar from "../../universal/NavBar";
import Background from "../../universal/Background";
import "./DominoBank.css";
import { ConvertToReact } from "./Domino";

function GenerateDominoBank() {
  const dominoJSON = [];
  let index = 0;
  // Loop through unique combinations of numbers for both top and bottom
  for (let top = 0; top <= 12; top++) {
    for (let bottom = top; bottom <= 12; bottom++) {
      // Start bottom from top to ensure uniqueness
      const key = index;
      index++;
      dominoJSON.push([key, top, bottom]);
    }
  }
  sessionStorage.setItem("Domino", JSON.stringify(dominoJSON));
}

export function GenerateDominoBankForGame() {
  return GenerateDominoBank();
}

function DominoBank() {
  GenerateDominoBank();
  const dominos = ConvertToReact(JSON.parse(sessionStorage.getItem("Domino")));
  return (
    <div className="domino-page full-page">
      <Background />
      <NavBar />
      <div className="centered-content">
        <div className="container">
          <h2 alt="Title: Bank" className="domino-title">
            Bank
          </h2>
        </div>
        <div
          alt="Domino bank: includes all dominos the user may play"
          className="bank"
        >
          {dominos}
        </div>
      </div>
    </div>
  );
}

export default DominoBank;
