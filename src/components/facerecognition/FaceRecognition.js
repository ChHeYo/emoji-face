import React from 'react';
import Box from './Box';
import './FaceRecognition.css'

const FaceRecognition = ({ imageUrl, displayFace }) => {
    return (
        <div className='center ma'>
            <div className='absolute mt2'>
                <img id="inputimage" src={ imageUrl } width='500px' height='auto'/>
                {
                    displayFace.map((face, index) => {
                        return (
                            <Box key={index} box={face}/>
                        )
                    })
                }
            </div>
        </div>
    );
}

export default FaceRecognition;