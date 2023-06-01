const initialState = {
    playerName: '',
  };
  
  const playerReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_PLAYER_NAME':
        return {
          ...state,
          playerName: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default playerReducer;
  