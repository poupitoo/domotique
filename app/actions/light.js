import * as types from './types';
import { api_url } from '../constants/config';

export const addLight = async function addLight(gpio) {
  const form = new FormData();
  form.append('gpio_pin', gpio);
  const response = await fetch(`${api_url}/light`, {
    method: "post",
    body: form
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

export const toggleLight = async function toggleLight(light, state) {
  const form = new FormData();
  form.append('state', state ? 1 : 0);
  const response = await fetch(`${api_url}/light/${light}`, {
    method: "post",
    body: form
  });
  return {
    type: types.UPDATE_LIGHT,
    payload: await response.json()
  };
}
