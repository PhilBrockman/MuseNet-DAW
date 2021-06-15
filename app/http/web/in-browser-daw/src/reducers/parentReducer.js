import { createSelector } from 'reselect'

export const selectParent= createSelector(
  // First, pass one or more "input selector" functions:
  state => state.parent,
  // Then, an "output selector" that receives all the input results as arguments
  // and returns a final result value
  parent => parent.parent?._id["$oid"]
)


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