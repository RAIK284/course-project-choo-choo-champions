import React from "react";
import orangeTrain from "./OrangeTrain";
import greenTrain from "./GreenTrain";
import { redTrain } from "./RedTrain";
import blueTrain from "./BlueTrain";
import purpleTrain from "./PurpleTrain";

const TrainStation = ({
  sDomino,
  handleDominoSelection,
  lastDominos,
  isAvailable,
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
          <div className="playerOneTrain">{greenTrain()}</div>
        </div>
        <div className="train-domino-pairing-top">
          <div className="playerFourTrain">{redTrain()}</div>
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
          <div className="playerTwoTrain">{blueTrain()}</div>
        </div>
        <div className="train-domino-pairing-bottom">
          <div className="playerThreeTrain">{purpleTrain()}</div>
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
