const defaultState = {
  playing: false,
  position: 0,
}

export const playheadReducer = function (state = defaultState, action) {
  switch (action.type) {
    case "SET_PLAYHEAD":
      let newPosition = action.payload
      if(action.payload < 0 ){
        newPosition = 0
      }
      return {
        ...state,
        position: newPosition
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