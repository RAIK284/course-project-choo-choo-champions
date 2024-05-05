import React, { useState } from "react";
import "./Domino.css";


function DetermineIfDominoIsSelectable(domino) {
  if (JSON.parse(sessionStorage.getItem('game'))['Player Paths'] != null && domino !== undefined) {
    const paths = JSON.parse(sessionStorage.getItem('game'))['Player Paths']
    const players = JSON.parse(sessionStorage.getItem('Players'));
    for (let i = 0; i < players.length; i++) {
      const path = paths[players[i]].Dominoes;
      for (let j = 0; j < path.length; j++) {
        if (
          (path[j][1] === domino[1] && path[j][2] === domino[2]) ||
          (path[j][1] === domino[2] && path[j][2] === domino[1])
        ) {
          return false;
        }
      }
    }
  }
  if (domino !== undefined && (domino[1] === 13 || domino[2] === 14)) {
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
  if (
    selectedDomino !== null &&
    DetermineIfDominoIsSelectable(dominos[selectedDomino])
  ) {
    sessionStorage.setItem(
      "Selected Domino",
      JSON.stringify(dominos[selectedDomino])
    );
  }
  return reactDominos;
}
export const getColor = (number) => {
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

  const topNumberImage = {
    src: getDots(top),
    alt: `Top dots representing ${top}`,
  };

  const bottomNumberImage = {
    src: getDots(bottom),
    alt: `Bottom dots representing ${bottom}`,
  };

  const topNumberText = {
    color: getColor(top),
    text: top,
  };

  const bottomNumberText = {
    color: getColor(bottom),
    text: bottom,
  };

  const isColorblind = sessionStorage.getItem('colorblind') === "true";

  // Determine if the current domino should be represented using text or images
  const useImages = (isColorblind && [13, 14, 15].includes(top) && [13, 14, 15].includes(bottom)) || !isColorblind;

  if (isSelected && DetermineIfDominoIsSelectable([0, bottom, top])) {
    sessionStorage.setItem("SelectedDomino", JSON.stringify([0, bottom, top]));
  }

  return (
    <div
      className={`domino ${isSelected ? "selected" : ""}`}
      onClick={onSelect}
      data-testid="domino"
    >
      {useImages ? (
        <>
          <img
            className="dominoImageTop"
            src={topNumberImage.src}
            alt={topNumberImage.alt}
          />
          <div className="line" aria-hidden="true"></div>
          <img
            className="dominoImageBottom"
            src={bottomNumberImage.src}
            alt={bottomNumberImage.alt}
          />
        </>
      ) : (
        <>
          <div className="topnumber" style={{ color: topNumberText.color }}>
            {topNumberText.text}
          </div>
          <div className="line"></div>
          <div className="bottomnumber" style={{ color: bottomNumberText.color }}>
            {bottomNumberText.text}
          </div>
        </>
      )}
    </div>
  );
}

export default Domino;
