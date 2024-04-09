import React, { useState } from "react";
import "./Domino.css";

export function ConvertToReact(dominos){
  const reactDominos = [];
  for (let i=0;i<dominos.length;i++){
    const domino = dominos[i];
    reactDominos.push(<Domino key={domino[0]} top={domino[1]} bottom={domino[2]} />);
  }
  return reactDominos
}

function Domino({ top, bottom }) {
  const [isSelected, setIsSelected] = useState(false);
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
        return "black";
    }
  };

  const topNumberStyle = {
    color: getColor(top),
  };

  const bottomNumberStyle = {
    color: getColor(bottom),
  };

  const handleClick = () => {
    const storedSelected = sessionStorage.getItem("OneSelected") ? JSON.parse(sessionStorage.getItem("OneSelected")) : false;
    if(isSelected && storedSelected){
      setIsSelected(false); 
      sessionStorage.setItem('OneSelected', false);
    } else if(!isSelected && !storedSelected){
      setIsSelected(true); 
      sessionStorage.setItem('OneSelected', true);
      sessionStorage.setItem('SelectedDomino', JSON.stringify([0, top, bottom]));
    }
};

  return (
    <div
      className={`domino ${isSelected ? "selected" : ""}`}
      onClick={handleClick}
    >
      <div className="topnumber" style={topNumberStyle}>
        {top}
      </div>
      <div className="line"></div>
      <div className="bottomnumber" style={bottomNumberStyle}>
        {bottom}
      </div>
    </div>
  );
}

export default Domino;
