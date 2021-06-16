// import {options} from "./../options/MuseNetOptions"

const defaultState = {
  bpm: 120,
  subDivisions: 4,
  unitCell: {
    style: {
      width: "45px",
      height:"30px",
    },
    oneBeatWidth: 145,
  }
}

export const SettingsReducer = function (state = defaultState, action) {
  switch (action.type) {
    case "SET_BPM":
      return {
        ...state,
        bpm: action.payload
      }
    default:
      return state;
  }
};