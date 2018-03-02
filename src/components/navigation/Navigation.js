import React from 'react';

const Navigation = ({ onRouteChange, isSignedIn, route, isDemo } ) => {
    if (isDemo && isSignedIn === false) {
        return (
            <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
                <p onClick={() => onRouteChange('signout')} 
                className='f3 link dim black underline pa3 pointer'>
                    Home
                </p>
            </nav>
        ); 
    } else if (isSignedIn){
        return (
            <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
                <p onClick={() => onRouteChange('signout')} className='f3 link dim black underline pa3 pointer'>
                    Sign Out
                </p>
            </nav>
        );
    } else {
        return (
            <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
                <p onClick={() => onRouteChange('demo')} 
                className='f3 link dim black underline pa3 pointer'>Demo</p>
                <p onClick={() => onRouteChange('signin')} 
                className='f3 link dim black underline pa3 pointer'>Sign In</p>
                <p onClick={() => onRouteChange('register')} 
                className='f3 link dim black underline pa3 pointer'>Register</p>
            </nav>
        );
    }
}

export default Navigation;