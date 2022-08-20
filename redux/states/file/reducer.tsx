/* 
  Program that modifies the state of redux
*/

import * as t from "./types";

import type { AppState } from '../../../redux/store';

const initialState = {
    dropDepth: 0,
    inDropZone: false
}

const reducer = (state = initialState, action:any) => {

  switch(action.type){
    case t.SET_DROP_DEPTH:
      return { 
        ...state,
        dropDepth: action.payload
      };
    
    case t.SET_IN_DROP_ZONE:
      return { 
        ...state,
        inDropZone: action.payload
      };
      
    default:
      return {...state};
    }
}

export const selectDropDepth = (state: AppState) => state.fileState.dropDepth

export default reducer;