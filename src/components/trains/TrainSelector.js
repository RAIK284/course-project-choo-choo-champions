import React, { useState, useEffect, useRef } from 'react';
import NavBar from '../universal/NavBar';
import Background from '../universal/Background';
import './TrainSelector.css';

// Represents an individual train choice
function GameChoice({ src, alt, onSelect, isSelected, isDisabled }) {
  return (
    <img
      loading="lazy"
      src={src}
      alt={alt}
      className={`game-image-choice ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
      onClick={() => {
        if (!isDisabled) {
          onSelect();
        }
      }}
    />
  );
}

// Main component for train selection interface
function TrainSelector() {
  const [playerSelectedTrain, setPlayerSelectedTrain] = useState('');
  const [confirmedTrains, setConfirmedTrains] = useState({});
  const newWsRef = useRef(null);
  const [disabledTrains, setDisabledTrains] = useState([]);

  useEffect(() => {
    // Create WebSocket connection
    newWsRef.current = new WebSocket('ws://localhost:8765');

    // WebSocket event handlers
    newWsRef.current.onopen = () => {
      console.log('WebSocket connection established');
    };

    newWsRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'trainConfirmed') {
        // Update confirmed trains and disable the selected train
        const { username, train } = message;
        setConfirmedTrains(prev => ({ ...prev, [username]: train }));
        setDisabledTrains(prev => [...prev, train]);
      } else if (message.type === 'redirect' && message.url === '/gamebase') {
        window.location.href = message.url;
      }
    };

    newWsRef.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    newWsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Close WebSocket connection when component unmounts
    return () => {
      newWsRef.current.close();
    };
  }, []);

  // Function to handle train selection
  const selectTrain = (train) => {
    const username = sessionStorage.getItem('username');
    // Allow selection if not confirmed or already selected by the user
    if (!confirmedTrains[username] || confirmedTrains[username] === train) {
      setPlayerSelectedTrain(train);
    }
  };

  // Function to handle confirmation of train selection
  const handleConfirmSelection = () => {
    const username = sessionStorage.getItem('username');
    if (playerSelectedTrain && username) {
      // Alert user about selected train and send confirmation message via WebSocket
      alert(`You've selected: ${playerSelectedTrain}`);
      const message = JSON.stringify({ type: 'confirmTrain', username: username, train: playerSelectedTrain });
      newWsRef.current.send(message);
    } else {
      alert("Please select a train and ensure you're logged in.");
    }
  };

  // Array of train choices with image URLs and alternate text
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
        <Background />
        <NavBar />
        <div className="centered-content">
          <h2 className="choose-your-train">Choose Your Train</h2>
          <div className="selection-container">
            <div className="game-choices-container">
              {gameChoices.map((choice) => (
                // Render each train choice using GameChoice component
                <GameChoice
                  key={choice.src}
                  src={choice.src}
                  alt={choice.alt}
                  onSelect={() => selectTrain(choice.alt)}
                  isSelected={playerSelectedTrain === choice.alt}
                  // Determine if choice is disabled based on selected and confirmed trains
                  isDisabled={
                    (disabledTrains.includes(choice.alt) &&
                      confirmedTrains[sessionStorage.getItem('username')] !== choice.alt &&
                      choice.alt !== playerSelectedTrain) ||
                    (confirmedTrains[sessionStorage.getItem('username')] &&
                      choice.alt !== confirmedTrains[sessionStorage.getItem('username')] &&
                      choice.alt !== playerSelectedTrain)
                  }
                />
              ))}
            </div>
            {/* Button to confirm train selection */}
            <div
              className="confirm-selection"
              onClick={handleConfirmSelection}
            >
              Confirm Selection
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TrainSelector;
