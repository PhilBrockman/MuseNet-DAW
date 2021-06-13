import APIClient from "../api/apiClient"
import {statusKeys} from "../utilities/utilities"

const api = new APIClient("some token")


const defaultState = {
  status: "idle",
  generations: []
}

const changeFetchStatus = status => {
  return {
    type: "STATUS_CHANGE",
    payload: status
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const fetchGenerations = () => {
  return async function fetchGenerationsThunk(dispatch) {
    dispatch(changeFetchStatus(statusKeys.LOADING))
    // await delay(2000);
    const generations = await api.generations();
    console.log('generations', generations)
    dispatch({ type: 'LOAD_GENERATIONS', payload: {data: generations.data, status: generations.status} })
  }
}
  
export const generationsReducer = function (state = defaultState, action) {
  switch (action.type) {
    case "STATUS_CHANGE":
      return {
        ...state,
        status: action.payload
      }
    case "LOAD_GENERATIONS":
      return {
        ...state,
        status: statusKeys[action.payload.status],
        data: action.payload.data
      };
    default:
      return state;
  }
};