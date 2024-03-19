import React from "react";
import NavBar from "./NavBar";
import Background from "./Background";
import "./DominoBank.css";

function DominoBank() {
  return (
    <div className="dashboard-page full-page">
      <Background />
      <NavBar />
      <div className="centered-content">
        <div className="container">
          <div className="dashboard-section left">
            <div className="navigation-buttons">
              <h2 className="dashboard-title">Bank</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DominoBank;
