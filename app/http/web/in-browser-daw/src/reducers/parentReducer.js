export const parentReducer = function (state = {parent: null}, action) {
  console.log("parentReduce")
  switch (action.type) {
    case "SET_PARENT":
      console.log("setting parent")
      return {
        ...state,
        parent: action.payload
      }
    default:
      return state;
  }
};