// import {options} from "./../options/MuseNetOptions"

const defaultState = {
  tracks: []
}

export const DAWReducer = function (state = defaultState, action) {
  switch (action.type) {
    case "SET_TRACKS":
      return {
        ...state,
        tracks: action.payload
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
    case "CHANGE_NOTE":
      const newNoteInTrack = state.tracks.map((track, trackId) => {
        if(trackId === action.payload.trackId){
          const newNotes = track.notes.map((note, noteId) => {
            if(noteId === action.payload.noteId){
              return action.payload.newNote
            } else {
              return note
            }
          })
          return {
            ...track,
            notes: newNotes
          }
        } else {
          return track
        }
      })
      return {
        ...state,
        tracks: newNoteInTrack,
      }
    default:
      return state;
  }
};