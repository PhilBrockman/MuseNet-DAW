import api from "../api/apiClient"
import {statusKeys} from "../utilities/utilities"

const defaultState = {
  status: "idle",
  generations: [],
}

const changeFetchStatus = status => {
  return {
    type: "STATUS_CHANGE",
    payload: status
  }
}

export const fetchGenerations = () => {
  return async function fetchGenerationsThunk(dispatch) {
    dispatch(changeFetchStatus(statusKeys.LOADING))
    const generations = await api.generations();
    dispatch({ type: 'LOAD_GENERATIONS', payload: {generations: generations.data, status: generations.status} })
  }
}

export const createGeneration = (preppedSelections) => {
  const loadMedio = async (ids) => {
    ids.data.forEach(id => {
      console.log('id', id)
      api.createMediaForGeneration(id["$oid"])
    })
  }

  return async function fetchGenerationsThunk(dispatch) {
    console.log("dispatching create generation")
    dispatch(changeFetchStatus(statusKeys.LOADING))
    const newIds = await api.createGeneration(preppedSelections);
    await loadMedio(newIds)
    dispatch(fetchGenerations());
  }
}

export const deleteGeneration = (id) => {
  return async (dispatch) => {
    await api.deleteGeneration(id)
    dispatch(fetchGenerations());
  }
}
  
export const generationsReducer = function (state = defaultState, action) {
  console.log("generations reducer", action.type)
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
        generations: action.payload.generations
      };
    default:
      return state;
  }
};