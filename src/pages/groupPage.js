import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const GroupPage = () => {
    const { type } = useParams();
    const [isCreateGroup, setIsCreateGroup] = useState(false);
    const [roomCode, setRoomCode] = useState('');

    useEffect(() => {
        // Perform any initialization or backend operations based on the "type" value
    
        // Example: Update the document title based on the group type
        document.title = type === 'create' ? 'Create Group' : 'Join Group';
        type === 'create' ? handleCreateGroup() : handleJoinGroup();
        setIsCreateGroup(type === 'create');
        console.log(type);
      }, [type]);
    
    const handleCreateGroup = () => {
        // Backend logic to create the group and obtain the room code
        // ...
        
        // Simulating room code retrieval (replace with actual logic)
        const generatedRoomCode = 'ABC123';
        
        setRoomCode(generatedRoomCode);
    };
    
    const handleJoinGroup = () => {
        // Backend logic to join the group using the entered room code
        // ...
        
        // Simulating room code verification (replace with actual logic)
        const isValidRoomCode = roomCode === 'ABC123';
        
        if (isValidRoomCode) {
            // Proceed to the group with the entered room code
        } else {
            // Handle invalid room code scenario
        }
    };
    
    return (
        <div>
        {isCreateGroup ? (
            <div>
                {/* <button onClick={handleCreateGroup}>Create a New Group</button> */}
                {roomCode && <p>Room Code: {roomCode}</p>}
            </div>
            ) : (
            <div>
                <input type="text" placeholder="Enter Room Code" value={roomCode} onChange={(e) => setRoomCode(e.target.value)} />
                <button onClick={handleJoinGroup}>Join Group</button>
            </div>
        )}
        </div>
    );
};
            
export default GroupPage;
            