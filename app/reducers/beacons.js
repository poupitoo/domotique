import { Map, fromJS } from 'immutable';
import * as types from '../actions/types';

const initialState = Map()

export default function beacons(state = initialState, action = {}) {
  switch (action.type) {
    case types.ADD_BEACON:
      return state.set(action.payload.address, fromJS(action.payload));
    default:
      return state;
  }
}
