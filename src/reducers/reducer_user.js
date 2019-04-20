import { SET_USER } from '../actions/index';

export default function (state = { name: null, email: null }, action) {
  switch (action.type) {
    case SET_USER:
      return action.user;
    default:
      return state;
  }
}