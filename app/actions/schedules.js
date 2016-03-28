import * as types from './types';
import { api_url } from '../constants/config';

export const addSchedule = async function addSchedule(at, to, lights) {
  const form = new FormData();
  form.append('at', at);
  form.append('to', to);
  lights.forEach(v => form.append('lights[]', v));
  const response = await fetch(`${api_url}/schedule`, {
    method: "post",
    body: form
  });
  return {
    type: types.ADD_SCHEDULE,
    payload: await response.json()
  };
}

export const fetchSchedule = async function fetchSchedule() {
  const response = await fetch(`${api_url}/schedule`);
  return {
    type: types.FETCH_SCHEDULE,
    payload: await response.json()
  };
}
