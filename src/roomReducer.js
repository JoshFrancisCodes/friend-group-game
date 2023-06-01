const initialState = {
    roomCode: '',
  };
  
  const roomReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_ROOM_CODE':
        return {
          ...state,
          roomCode: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default roomReducer;
  