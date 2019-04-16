import { combineReducers } from 'redux';
import user from './reducer_user';

const rootReducer = combineReducers({
  user: user
});

export default rootReducer;
