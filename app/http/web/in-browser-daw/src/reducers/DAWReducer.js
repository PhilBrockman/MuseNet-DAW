// import {options} from "./../options/MuseNetOptions"

const defaultState = {
  tracks: [],
  visibleTracks: [],
  bpm: 0,
  subDivisions: 0,
}

export const DAWReducer = function (state = defaultState, action) {
  switch (action.type) {
    case "SET_TRACKS":
      return {
        ...state,
        tracks: action.payload
      }
    case "SET_BPM":
      return {
        ...state,
        bpm: action.payload
      }
    case "TOGGLE_TRACK_VISIBILITY":
      const newTracks = state.tracks.map((track, pos) => {
        if(pos === action.payload){
          return {
            ...track,
            visible: !track.visible
          }
         } else {
            return track
        }});
      return {
        ...state,
        tracks: newTracks
      }
    default:
      return state;
  }
};