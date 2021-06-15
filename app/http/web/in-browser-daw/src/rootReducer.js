import { combineReducers, createStore, applyMiddleware } from 'redux'

import {generationsReducer} from "./layout/generations/generationsReducer";
import {optionReducer} from "./layout/options/optionReducer";
import {parentReducer} from "./layout/generations/parentReducer";
import {DAWReducer} from "./DAW/DAWReducer";
import {playheadReducer} from "./DAW/Playhead/playheadReducer"

import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware))

const rootReducer =  combineReducers({
  generations: generationsReducer, 
  options: optionReducer,
  parent: parentReducer,
  DAW: DAWReducer,
  playhead: playheadReducer,
});

export const store = createStore(rootReducer, composedEnhancer)