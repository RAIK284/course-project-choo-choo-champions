import React from 'react';
import './Background.css'; // Import the CSS file

function Background() {
    return (
        <div className="background-image-container">
            <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/8dbca933ffcd089f07077f037b47f9d35112fe8982e429140eb2217b3c26466f?apiKey=7293d20271ec4f72a58fe358903b4fd6&"
                alt="Background"
                className="background-image"
            />
        </div>
    );
}

export default Background;
