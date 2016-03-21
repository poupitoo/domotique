import * as types from './types';
import { api_url } from '../constants/config';

export const setField = function setField(key, value) {
  return {
    type: types.SET_FIELD,
    payload: {
      key,
      value
    }
  };
}
