import * as types from './types';
import { api_url } from '../constants/config';

export const addLight = async function addLight() {
  const response = await fetch(`${api_url}/light`, {
    method: "post",
  });
  return {
    type: types.ADD_LIGHT,
    payload: await response.json()
  };
}

export const fetchLights = async function fetchLights() {
  const response = await fetch(`${api_url}/light`);
  return {
    type: types.FETCH_LIGHTS,
    payload: await response.json()
  };
}
