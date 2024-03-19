import React from "react";
import "./Domino.css";

function Domino({ top, bottom }) {
  return (
    <div className="domino">
      <div className="topnumber">{top}</div>
      <div className="line"></div>
      <div className="bottomnumber">{bottom}</div>
    </div>
  );
}

export default Domino;
