import { combineReducers } from 'redux';
import playerReducer from './playerReducer';
import roomReducer from './roomReducer';
import ratingReducer from './ratingReducer';

const rootReducer = combineReducers({
  player: playerReducer,
  room: roomReducer,
  ratings: ratingReducer,
});

export default rootReducer;
