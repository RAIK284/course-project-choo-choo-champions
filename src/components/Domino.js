import React from "react";
import "./Domino.css";

function Domino({ top, bottom }) {
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

  const getDots = (number) => {
      // return "./dots" + number + ".png";
      return "./assets/dots3.png";
  
  };

  const topNumberStyle = {
    color: getColor(top),
  };

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
    <div className="domino">
      <img  src= {topNumberDots}/>
      <div className="line"></div>
      <img src= {bottomNumberDots}/>
   
    </div>
  );

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
