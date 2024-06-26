import React from "react";

// This is a styled component for displaying an image
const ImageDisplay = ({ src, alt }) => (
  <>
    <img src={src} alt={alt} className="image-display" />
  </>
);

function SettingsButton() {
  return (
    <>
      <main>
        <ImageDisplay src="https://cdn.builder.io/api/v1/image/assets/TEMP/454567658b547d84431fbbdf8224a75d18594956415276dd425887318929e8c0?apiKey=7293d20271ec4f72a58fe358903b4fd6&" alt="Featured content" />
      </main>
    </>
  );
}

export default SettingsButton;