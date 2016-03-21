import { Map, fromJS } from 'immutable';
import * as types from '../actions/types';

const initialState = Map()

export default function addForm(state = initialState, action = {}) {
  switch (action.type) {
    case types.SET_ELEM:
      return state.set(action.payload.key, action.payload.value);
    default:
      return state;
  }
}
