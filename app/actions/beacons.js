import * as types from './types';

export const addBeacon = function addBeacon(beacon) {
  return {
    type: types.ADD_BEACON,
    payload: beacon
  };
}
