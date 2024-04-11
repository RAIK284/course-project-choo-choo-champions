import React, { useState } from "react";
import "./Domino.css";

export function ConvertToReact(dominos) {
  const [selectedDomino, setSelectedDomino] = useState(null);

  const handleSelectDomino = (index) => {
    setSelectedDomino(index);
  };

  const reactDominos = dominos.map((domino, index) => (
    <Domino
      key={domino[0]}
      top={domino[1]}
      bottom={domino[2]}
      isSelected={index === selectedDomino}
      onSelect={() => handleSelectDomino(index)}
    />
  ));
  return reactDominos;
}
const getColor = (number) => {
  switch (number) {
    case 0:
      return "black";
    case 1:
      return "#61A7CF";
    case 2:
      return "#6DD477";
    case 3:
      return "#C10F0F";
    case 4:
      return "#542E26";
    case 5:
      return "#436BB9";
    case 6:
      return "#FFB82F";
    case 7:
      return "#CC357E";
    case 8:
      return "#28A9A8";
    case 9:
      return "#6D0A86";
    case 10:
      return "#4C1A0A";
    case 11:
      return "#FF7E21";
    case 12:
      return "#909090";
    default:
      return "FFFFFFF";
  }
};

function Domino({ top, bottom, isSelected, onSelect }) {
  const getDots = (number) => {
    return `./assets/dots${number}.png`;
  };

  // eslint-disable-next-line no-unused-vars
  const topNumberStyle = {
    color: getColor(top),
  };

  // eslint-disable-next-line no-unused-vars
  const bottomNumberStyle = {
    color: getColor(bottom),
  };

  const topNumberDots = {
    color: getDots(top),
  };

  const bottomNumberDots = {
    color: getDots(bottom),
  };

  return (
    <div
      className={`domino ${isSelected ? "selected" : ""}`}
      onClick={onSelect}
    >
      <img
        className="dominoImageTop"
        src={topNumberDots.color}
        alt="Top dots representing a number"
      />
      <div className="line" aria-hidden="true"></div>
      <img
        className="dominoImageBottom"
        src={bottomNumberDots.color}
        alt="Bottom dots representing a number"
      />
    </div>
  );

  // for text color instead of dots

  //   <div className="domino">
  //   <div className="topnumber" style={topNumberStyle}>
  //     {top}
  //   </div>
  //   <div className="line"></div>
  //   <div className="bottomnumber" style={bottomNumberStyle}>
  //     {bottom}
  //   </div>
  // </div>
  // );
}

export default Domino;
