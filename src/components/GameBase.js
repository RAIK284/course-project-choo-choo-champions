import React, { useState } from "react";
import NavBar from "./NavBar";
import Background from "./Background";
import "./TrainSelector.css";

function GameChoice({ src, alt, onSelect, isSelected }) {
  return (
    <>
      <div className="full-page">
        <Background />
        <NavBar />
        <div className="centered-content">
          <h2 className="choose-your-train">Choose Your Train</h2>
          <div className="selection-container"></div>
        </div>
      </div>
    </>
  );
}
export default GameChoice;
