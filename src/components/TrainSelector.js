import React, { useState } from 'react';
import NavBar from './NavBar'

function GameChoice({ src, alt, onSelect, isSelected }) {
  return (
    <img
      loading="lazy"
      src={src}
      alt={alt}
      className={`game-image-choice ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
      style={{
        aspectRatio: '1',
        objectFit: 'cover',
        width: '100px',
 height: '100px',
        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out',
        margin: '10px',
      }}
    />
  );
}

function TrainSelector() {
  const [selectedTrain, setSelectedTrain] = useState('');
  const gameChoices = [
    { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/d737771a839e9d3381cf8be0888aafeb9423dad94e31ce6e6b57702a2eb9bb23", alt: "Red Train" },
    { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/6f86f2b40e7a9d4e455f9a504dc5e366503ace6cf85fc3fb36aac70ac88a8fdf", alt: "Green Train" },
    { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/5ec4c3ceb8e14edecf8b637152c22aeb4571947ce4e06158fb90c3aa98a3f917", alt: "Purple Train" },
    { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/b113a030456c013a7e21d15ec68b8ef946e9a436bdd585825811f93c41853999", alt: "Blue Train" },
    { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/19af73f19f2af54ce737c599541168e9050396e728f163bd56c5c822021bf5ac", alt: "Pink Train" },
    { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/2e707c1c15ef3106cc95045c56346e6166b027d11a3d59268444fa4919181093", alt: "Orange Train" },
  ];

  return (
    <>
      <div className="full-page">
        <div className="background-image-container">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/8dbca933ffcd089f07077f037b47f9d35112fe8982e429140eb2217b3c26466f?apiKey=7293d20271ec4f72a58fe358903b4fd6&"
            alt="Background"
            className="background-image"
          />
        </div>
        <div className="top-left-content">
          <NavBar/>
        </div>
        <div className="centered-content">
          <h2 className="choose-your-train">Choose Your Train</h2>
          <div className="selection-container">
            <div className="game-choices-container">
              {gameChoices.map((choice) => (
                <GameChoice
                  key={choice.src}
                  src={choice.src}
                  alt={choice.alt}
                  onSelect={() => setSelectedTrain(choice.src)}
                  isSelected={selectedTrain === choice.src}
                />
              ))}
            </div>
            <div
              className="confirm-selection"
              onClick={() => alert(`You've selected: ${selectedTrain}`)}
            >
              Confirm Selection
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .full-page {
          display: flex;
          flex-direction: column;
          align-items: start;
          justify-content: center;
          min-height: 100vh;
          background-color: #1c794c;
          margin: 0;
          padding: 0;
          position: relative;
        }
        .top-left-content {
          position: absolute;
          top: 0;
          left: 0;
          padding: 10px 20px;
          color: white;
          z-index: 2;
        }
        .background-image-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .background-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .centered-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          text-align: center;
          color: white;
          width: 100%;
          position: relative;
          z-index: 1;
        }
        .game-title {
          font-size: 48px;
          color: white;
        }
        .choose-your-train {
          font-size: 24px;
          color: white;
          margin: 20px 0;
        }
        .selection-container {
          background-color: white;
          padding: 20px;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 20px;
        }
        .game-choices-container {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 15px;
          margin-bottom: 20px;
        }
        .game-image-choice {
          aspectRatio: '1',
          objectFit: 'cover',
          width: '100px',
          height: '100px',
          cursor: 'pointer',
          transition: 'transform 0.2s ease-in-out',
          margin: '10px',
          border: 3px solid transparent;
          border-radius: 15px;
        }
        .selected {
          border: 3px solid black;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
          transform: scale(1.1);
        }
        .confirm-selection {
          padding: 12px 24px;
          background-color: #23834a;
          color: white;
          cursor: pointer;
          text-align: center;
          width: auto;
          border-radius: 12px;
          transition: background-color 0.2s ease-in-out;
        }
        .confirm-selection:hover {
          background-color: #1c7240;
        }
      `}</style>
    </>
  );
}

export default TrainSelector;