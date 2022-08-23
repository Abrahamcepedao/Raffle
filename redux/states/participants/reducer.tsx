/* 
  Program that modifies the state of redux
*/

import * as t from "./types";

import type { AppState } from '../../../redux/store';

const initialState = {
    participants: 0,
    inDropZone: false
}

const reducer = (state = initialState, action:any) => {

  switch(action.type){
    case t.SET_PARTICIPANTS:
      return { 
        ...state,
        participants: action.payload
      };
    
      
    default:
      return {...state};
    }
}

export const selectParticipants = (state: AppState) => state.participantsState.participants

export default reducer;