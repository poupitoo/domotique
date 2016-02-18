import { List, fromJS } from 'immutable';
import * as types from '../actions/types';

const initialState = List()

export default function lights(state = initialState, action = {}) {
  switch (action.type) {
    case types.ADD_LIGHT:
      return state.push(fromJS(action.payload));
    case types.FETCH_LIGHTS:
      return fromJS(action.payload);
    default:
      return state;
  }
}
