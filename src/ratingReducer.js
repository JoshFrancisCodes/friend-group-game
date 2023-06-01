const initialState = {
    ratings: [],
  };
  
  const ratingReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_RATING':
        return {
          ...state,
          ratings: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default ratingReducer;
  