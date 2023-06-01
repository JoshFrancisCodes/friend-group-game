import React, { useState } from 'react';

const RatingPage = () => {
  const [players, setPlayers] = useState([
    { id: 1, name: 'Player 1', rating: 0 },
    { id: 2, name: 'Player 2', rating: 0 },
    { id: 3, name: 'Player 3', rating: 0 },
    // Add more players as needed
  ]);

  const handleRatingChange = (id, rating) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) => (player.id === id ? { ...player, rating } : player))
    );
  };

  const handleSubmit = () => {
    // Handle submit logic here
  };

  return (
    <div>
      <h2>How Close Are You With Each Person</h2>
      <form>
        {players.map((player) => (
          <div key={player.id}>
            <label htmlFor={`rating-${player.id}`}>{player.name}</label>
            <input
              type="range"
              id={`rating-${player.id}`}
              min={0}
              max={10}
              value={player.rating}
              onChange={(e) => handleRatingChange(player.id, parseInt(e.target.value))}
            />
            <span>{player.rating}</span>
          </div>
        ))}
        <button type="button" onClick={handleSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default RatingPage;
