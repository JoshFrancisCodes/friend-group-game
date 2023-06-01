import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

const LandingPage = () => {
    const navigate = useNavigate();
    const [playerName, setPlayerName] = useState('');
    
    const handleInputChange = (event) => {
        setPlayerName(event.target.value);
    };
    
    const isButtonDisabled = playerName === '';
    
    const handleCreateGroup = () => {
        // Handle create group logic here
        navigate('/group/create');
    };
    
    const handleJoinGroup = () => {
        // Handle join group logic here
        navigate('/group/join');
    };
    
    return (
        <div>
        <h1>How Strong is Your Friend Group?</h1>
        <input type="text" placeholder="Enter your name" value={playerName} onChange={handleInputChange} />
        {/* <Link to="/create"> */}
        <button disabled={isButtonDisabled} onClick={handleCreateGroup}>
        Create Group
        </button>
        {/* </Link> */}
        {/* <Link to="/join"> */}
        <button disabled={isButtonDisabled} onClick={handleJoinGroup}>
        Join Group
        </button>
        {/* </Link> */}
        
        </div>
        );
    };
    
    export default LandingPage;
    