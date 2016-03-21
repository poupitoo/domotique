import * as types from './types';
import { api_url } from '../constants/config';

export const addDoor = async function addDoor() {
  const response = await fetch(`${api_url}/door`, {
    method: "POST",
  });
  return {
    type: types.ADD_DOOR,
    payload: await response.json()
  };
}

export const fetchDoors = async function fetchDoors() {
  const response = await fetch(`${api_url}/door`);
  return {
    type: types.FETCH_DOORS,
    payload: await response.json()
  };
}
