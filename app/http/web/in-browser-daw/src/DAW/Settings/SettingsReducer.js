// import {options} from "./../options/MuseNetOptions"
import { createSelector } from 'reselect'

const defaultState = {
  bpm: 120,
  unitCell: {
    height: 20,
    oneBeatWidth: 144,
    subdivisions: 4,
    snapToArray: true,
    headers: {
      pianoKeyWidth: 150,
      beatCounterHeight: 100,
    }
  },
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

const selectSettings = state => state.settings

export const BPM = createSelector(
  selectSettings,
  settings => settings.bpm
)


export const getUnitCell = createSelector(
  selectSettings,
  settings => settings.unitCell
)