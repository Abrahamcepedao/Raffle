/* 
  Program that modifies the state of redux
*/

import * as t from "./types";

import type { AppState } from '../../../redux/store';

const initialState = {
    participants: 0,
    isFinal: false,
}

const reducer = (state = initialState, action:any) => {

  switch(action.type){
    case t.SET_PARTICIPANTS:
      return { 
        ...state,
        participants: action.payload
      };
    case t.SET_IS_FINAL:
      return {
        ...state,
        isFinal: action.payload
      };
      
    default:
      return {...state};
    }
}

export const selectParticipants = (state: AppState) => state.participantsState.participants
export const selectIsFinal = (state: AppState) => state.participantsState.isFinal

export default reducer;