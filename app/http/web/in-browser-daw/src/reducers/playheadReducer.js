const defaultState = {
  playing: false,
  position: 0,
}

export const playheadReducer = function (state = defaultState, action) {
  switch (action.type) {
    case "SET_PLAYHEAD":
      return {
        ...state,
        position: action.payload
      }
    case "PLAY":
      return {
        ...state,
        playing: true
      }
    case "PAUSE":
      return {
        ...state,
        playing: true
      }
    default:
      return state;
  }
};