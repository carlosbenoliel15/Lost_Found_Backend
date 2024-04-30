
import React, { useState } from 'react';
import './App.css';
import logo from './befind.png';

const App = () => {
    const [isToggled, setIsToggled] = useState(false);

    const handleToggle = () => {
        setIsToggled(!isToggled); 
    };

    return (
        <nav className="navbar">
            <img src={logo} alt="BIDFIND.er Logo" className="logo" />
            <div className="nav-items">
                <div className={`nav-switch ${isToggled ? 'on' : ''}`} onClick={handleToggle}>
                    <div className="toggle-ball"></div>
                    </div>   
                <button className="sign-in">SIGN IN →</button>    
                <button className="menu">MENU +</button>
            </div>
        </nav>
    );
};

export default App;
