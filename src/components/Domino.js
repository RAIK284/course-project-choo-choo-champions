import React from "react";
import "./Domino.css";

//<Domino top={3} bottom={2} />
function Domino({ top, bottom }) {
  return (
    // <div className="domino">
    //   <div className="number">{top}</div>
    //   <div className="line"></div>
    //   <div className="number">{bottom}</div>
    // </div>
    <div className="domino">
      <div className="topnumber">{top}</div>
      <div className="line"></div>
      <div className="bottomnumber">{bottom}</div>
    </div>
  );
}

export default Domino;
