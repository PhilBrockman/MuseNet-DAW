export const parentReducer = function (state = {parent: null}, action) {
  switch (action.type) {
    case "SET_PARENT":
      return {
        ...state,
        parent: action.payload
      }
    default:
      return state;
  }
};