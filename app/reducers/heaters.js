import { List, fromJS } from 'immutable';
import * as types from '../actions/types';

const initialState = List()

export default function heaters(state = initialState, action = {}) {
  switch (action.type) {
    case types.ADD_HEATER:
      return state.push(fromJS(action.payload));
    case types.FETCH_HEATERS:
      return fromJS(action.payload);
    default:
      return state;
  }
}
