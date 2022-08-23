/* 
  Program that creates that functions that will be used to dispatch actions to the reducer.
*/

import * as t from "./types";

import { Participant } from "./interfaces";

//Function that sets the participants
export const setReduxParticipants = (participants: Array<Participant>) => {
  return { 
    type: t.SET_PARTICIPANTS, 
    payload: participants
  };
}
