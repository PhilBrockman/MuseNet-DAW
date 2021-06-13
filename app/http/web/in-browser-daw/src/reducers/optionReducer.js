// import {options} from "./../options/MuseNetOptions"

const defaultState = {
  temp: .7,
  num_tokens: 100,
}

export const optionReducer = function (state = defaultState, action) {
  switch (action.type) {
    case "TOGGLE":
      return {
        ...state,
        [action.payload.toParam]: action.payload.value
      }
    default:
      return state;
  }
};