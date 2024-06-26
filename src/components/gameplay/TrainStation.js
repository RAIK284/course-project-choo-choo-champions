// This page has been tested and approved by Lighthouse for correct alt text and ease of readability
// This page has also been verified to comply with the Chrome screenreader extension

import React from "react";
import orangeTrain from "../trains/OrangeTrain";
import greenTrain from "../trains/GreenTrain";
import { redTrain } from "../trains/RedTrain";
import blueTrain from "../trains/BlueTrain";
import purpleTrain from "../trains/PurpleTrain";

const TrainStation = ({
  sDomino,
  handleDominoSelection,
  lastDominos,
  isAvailable,
  isPlayable,
}) => {
  return (
    <div className="newTrainStation">
      <div
        className={`mexicanDomino ${isAvailable[0] ? "highlight" : ""}`}
        onClick={() => handleDominoSelection(0)}
      >
        {lastDominos[0]}
      </div>
      <div className="mexicanTrain">{orangeTrain()}</div>
      <div className="rotateDominoTop">
        <div className="train-domino-pairing-top">
          <div
            className={`playerOneDomino ${isAvailable[1] ? "highlight" : ""}`}
            onClick={() => handleDominoSelection(1)}
          >
            {lastDominos[1]}
          </div>
          <div className={`playerOneTrain ${isPlayable[0] ? "highlight" : ""}`}>
            {greenTrain()}
          </div>
        </div>
        <div className="train-domino-pairing-top">
          <div
            className={`playerFourTrain ${isPlayable[3] ? "highlight" : ""}`}
          >
            {redTrain()}
          </div>
          <div
            className={`playerFourDomino ${isAvailable[4] ? "highlight" : ""}`}
            onClick={() => handleDominoSelection(4)}
          >
            {lastDominos[4]}
          </div>
        </div>
      </div>
      <div className="StartingDomino">{sDomino}</div>
      <div className="rotateDominoBottom">
        <div className="train-domino-pairing-bottom">
          <div
            className={`playerTwoDomino ${isAvailable[2] ? "highlight" : ""}`}
            onClick={() => handleDominoSelection(2)}
          >
            {lastDominos[2]}
          </div>
          <div className={`playerTwoTrain ${isPlayable[1] ? "highlight" : ""}`}>
            {blueTrain()}
          </div>
        </div>
        <div className="train-domino-pairing-bottom">
          <div
            className={`playerThreeTrain ${isPlayable[2] ? "highlight" : ""}`}
          >
            {purpleTrain()}
          </div>
          <div
            className={`playerThreeDomino ${isAvailable[3] ? "highlight" : ""}`}
            onClick={() => handleDominoSelection(3)}
          >
            {lastDominos[3]}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainStation;