import React from 'react';

function Background() {
    return (
        <div className="background-image-container">
            <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/8dbca933ffcd089f07077f037b47f9d35112fe8982e429140eb2217b3c26466f?apiKey=7293d20271ec4f72a58fe358903b4fd6&"
                alt="Background"
                className="background-image"
            />
            <style jsx>{`
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
            `}</style>
        </div>
    );
}

export default Background;
