// import {options} from "./../options/MuseNetOptions"
import { createSelector } from 'reselect'

const defaultState = {
  bpm: 120,
  subDivisions: 4,
  unitCell: {
    height: 50,
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

const selectBPM = state => state.settings

export const BPM = createSelector(
  selectBPM,
  settings => settings.bpm
)