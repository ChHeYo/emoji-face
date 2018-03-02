import React from 'react';

const Box = ({ box }) => {
    return (
        <div className="bounding-box" 
            style={{top: box.topRow, right: box.rightCol, bottom: box.bottom_row, left: box.leftCol}}>
        </div>
    );
}

export default Box;