import { Map, List, fromJS } from 'immutable';
import * as types from '../actions/types';

const initialState = Map()

export default function lights(state = initialState, action = {}) {
  switch (action.type) {
    case types.ADD_LIGHT:
      return state.set(action.payload.id, fromJS(action.payload));
    case types.FETCH_LIGHTS:
      return fromJS(action.payload).reduce(function(acc, v) {
        return acc.set(v.get("id"), v);
      }, Map());
    case types.UPDATE_LIGHT:
      return state.set(action.payload.id, fromJS(action.payload));
    default:
      return state;
  }
}
