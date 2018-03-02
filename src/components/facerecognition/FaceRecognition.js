import React from 'react';
import './FaceRecognition.css'

const FaceRecognition = ({ imageUrl, displayFace }) => {
    return (
        <div className='center ma'>
            <div className='absolute mt2'>
                <img id="inputimage" src={ imageUrl } width='500px' height='auto'/>
                <div className="bounding-box" 
                style={{top: displayFace.topRow, right: displayFace.rightCol, bottom: displayFace.bottom_row, left: displayFace.leftCol}}></div>
            </div>
        </div>
    );
}

export default FaceRecognition;