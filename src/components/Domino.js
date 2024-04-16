import React, { useState } from "react";
import "./Domino.css";


function DetermineIfDominoIsSelectable(domino){
  if(JSON.parse(sessionStorage.getItem('Player Paths')!=null) && domino !== undefined){
    const paths = JSON.parse(sessionStorage.getItem('Player Paths'))
    const players = JSON.parse(sessionStorage.getItem('Players'));
    for(let i=0;i<players.length;i++){
      const path = paths[players[i]].Dominoes;
      for(let j=0;j<path.length;j++){
        if((path[j][1]===domino[1]&&path[j][2]===domino[2])||(path[j][1]===domino[2]&&path[j][2]===domino[1])){
          return false;
        }
      }
    }
  }
  if(domino!==undefined && (domino[1]===13||domino[2]===14)){
    return false;
  }
  return true;
}

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
  if(selectedDomino!==null && DetermineIfDominoIsSelectable(dominos[selectedDomino])){
    sessionStorage.setItem('Selected Domino', dominos[selectedDomino]);
  }
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
  if(isSelected && DetermineIfDominoIsSelectable([0, bottom, top])){
    sessionStorage.setItem("SelectedDomino", JSON.stringify([0, bottom, top]));
  }

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
