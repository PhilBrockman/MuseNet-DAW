import { combineReducers, createStore, applyMiddleware } from 'redux'

import {generationsReducer} from "./generationsReducer";
import {optionReducer} from "./optionReducer";
import {parentReducer} from "./parentReducer"

import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware))

const rootReducer =  combineReducers({
  generations: generationsReducer, 
  options: optionReducer,
  parent: parentReducer
});

export const store = createStore(rootReducer, composedEnhancer)