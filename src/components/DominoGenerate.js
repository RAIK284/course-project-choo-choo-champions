import React from "react";
// import NavBar from "./NavBar";
// import Background from "./Background";
//  ^ depend on merging in train selector branch

function BuildDomino({ top, bottom }) {
  return (
    <>
      <div className="div">
        <div className="div-2" />
      </div>
      <style jsx>{`
        .div {
          border-radius: 16px;
          border: 2px solid #000;
          background-color: #fff;
          display: flex;
          max-width: 198px;
          flex-direction: column;
          justify-content: center;
          padding: 50px 0;
        }
        .div-2 {
          background-color: #000;
          min-height: 2px;
          margin-top: 128px;
          width: 100%;
        }
      `}</style>
    </>
  );
}
