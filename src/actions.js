export const setPlayerName = (name) => {
    return {
      type: 'SET_PLAYER_NAME',
      payload: name,
    };
  };
  
  export const setRoomCode = (code) => {
    return {
      type: 'SET_ROOM_CODE',
      payload: code,
    };
  };
  
  export const setRating = (ratings) => {
    return {
      type: 'SET_RATING',
      payload: ratings,
    };
  };
  