import * as types from './types';
import { api_url } from '../constants/config';

export const addHeater = async function addHeater() {
  const response = await fetch(`${api_url}/heater`, {
    method: "post",
  });
  return {
    type: types.ADD_HEATER,
    payload: await response.json()
  };
}

export const fetchHeaters = async function fetchHeaters() {
  const response = await fetch(`${api_url}/heater`);
  return {
    type: types.FETCH_HEATERS,
    payload: await response.json()
  };
}
