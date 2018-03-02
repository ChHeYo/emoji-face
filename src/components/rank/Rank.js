import React from 'react';

const Rank = ({ name, entries, route }) => {
    if (route === 'demo') {
        return (
            <div>
                <div className='white f3'>
                    { "Demo Mode" }
                </div>
            </div>
        );
    } else {
        return (
            <div>
                <div className='white f3'>
                    { `${name}, you have uploaded ${entries} images so far.`}
                </div>
            </div>
        );
    }
}

export default Rank;