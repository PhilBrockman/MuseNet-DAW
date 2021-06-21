// import {options} from "./../options/MuseNetOptions"
import { createSelector } from 'reselect'


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
              console.log(action.payload.newNote)
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

const getDAW = state => state.DAW

export const fetchTracks = createSelector(
  getDAW,
  DAW => DAW.tracks
)

export const DAWvisibleTracks = createSelector(
  getDAW,
  DAW => DAW.tracks.filter(track => track.visible)
)